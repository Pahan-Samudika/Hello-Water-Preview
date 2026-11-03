const PAYPAL_BASE_URLS = {
  live: "https://api-m.paypal.com",
  sandbox: "https://api-m.sandbox.paypal.com",
} as const;

type PaypalEnv = keyof typeof PAYPAL_BASE_URLS;

/**
 * Resolve PayPal configuration from the environment. The live/sandbox choice
 * is explicit (PAYPAL_ENV) rather than inferred from NODE_ENV, because Vercel
 * preview deployments also run with NODE_ENV=production. Validated on use, not
 * at import, so `next build` works without PayPal credentials.
 */
function getPaypalConfig(): { clientId: string; clientSecret: string; baseUrl: string } {
  const env = process.env.PAYPAL_ENV as PaypalEnv | undefined;
  if (env !== "live" && env !== "sandbox") {
    throw new Error('PayPal is not configured: PAYPAL_ENV must be "live" or "sandbox".');
  }

  // Live payments are only allowed on the production deployment, so a preview
  // deployment can never charge real money even if live keys leak into it.
  const vercelEnv = process.env.VERCEL_ENV;
  if (env === "live" && vercelEnv && vercelEnv !== "production") {
    throw new Error(`PayPal live mode is not allowed on the "${vercelEnv}" deployment. Use PAYPAL_ENV=sandbox.`);
  }

  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured: PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are required.");
  }

  return { clientId, clientSecret, baseUrl: PAYPAL_BASE_URLS[env] };
}

/**
 * Generate OAuth2 Access Token from PayPal REST API
 */
async function getAccessToken(): Promise<string> {
  const { clientId: PAYPAL_CLIENT_ID, clientSecret: PAYPAL_CLIENT_SECRET, baseUrl: BASE_URL } = getPaypalConfig();

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal OAuth token generation failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

interface CreateOrderResponse {
  id: string;
  status: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

/**
 * Create a PayPal Order with intent CAPTURE
 */
export async function createPaypalOrder(
  amount: number,
  returnUrl: string,
  cancelUrl: string,
  description: string = "Hello Water Cartridges Purchase"
): Promise<CreateOrderResponse> {
  const accessToken = await getAccessToken();
  const BASE_URL = getPaypalConfig().baseUrl;

  const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "AUD",
            value: amount.toFixed(2),
          },
          description,
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING", // We already collect shipping address on our form
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Create Order failed: ${response.status} - ${errorText}`);
  }

  return (await response.json()) as CreateOrderResponse;
}

interface CaptureOrderResponse {
  id: string; // PayPal Order ID
  status: string; // e.g. COMPLETED
  purchase_units: {
    payments: {
      captures: {
        id: string; // Transaction Capture ID
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }[];
    };
  }[];
  payer: {
    email_address: string;
    payer_id: string;
  };
}

export interface PaypalOrderDetails {
  id: string;
  status: string;
  purchase_units: {
    amount: {
      value: string;
      currency_code: string;
    };
    payments?: {
      captures?: {
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }[];
    };
  }[];
  payer?: {
    email_address: string;
    payer_id: string;
  };
}

/**
 * Fetch a PayPal Order's details
 */
export async function getPaypalOrder(paypalOrderId: string): Promise<PaypalOrderDetails> {
  const accessToken = await getAccessToken();
  const BASE_URL = getPaypalConfig().baseUrl;

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Get Order failed: ${response.status} - ${errorText}`);
  }

  return (await response.json()) as PaypalOrderDetails;
}

/**
 * Capture a PayPal Order payment after authorization
 */
export async function capturePaypalOrder(paypalOrderId: string): Promise<CaptureOrderResponse> {
  const accessToken = await getAccessToken();
  const BASE_URL = getPaypalConfig().baseUrl;

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Idempotency key: PayPal returns the original result for retries
      // instead of attempting a second capture.
      "PayPal-Request-Id": `capture-${paypalOrderId}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Capture Order failed: ${response.status} - ${errorText}`);
  }

  return (await response.json()) as CaptureOrderResponse;
}

export interface PaypalWebhookHeaders {
  authAlgo: string | null;
  certUrl: string | null;
  transmissionId: string | null;
  transmissionSig: string | null;
  transmissionTime: string | null;
}

/**
 * Verify a webhook delivery with PayPal's verify-webhook-signature API.
 * `rawBody` must be the exact request body; `webhookId` is the ID of the
 * webhook registered in the PayPal dashboard for this environment.
 */
export async function verifyPaypalWebhookSignature(
  headers: PaypalWebhookHeaders,
  rawBody: string,
  webhookId: string
): Promise<boolean> {
  const { authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime } = headers;
  if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
    return false;
  }

  let webhookEvent: unknown;
  try {
    webhookEvent = JSON.parse(rawBody);
  } catch {
    return false;
  }

  const accessToken = await getAccessToken();
  const BASE_URL = getPaypalConfig().baseUrl;
  const response = await fetch(`${BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal webhook verification failed: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as { verification_status?: string };
  return data.verification_status === "SUCCESS";
}
