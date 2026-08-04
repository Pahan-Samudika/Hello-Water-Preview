const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const isProd = process.env.NODE_ENV === "production";
const BASE_URL = isProd
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

/**
 * Generate OAuth2 Access Token from PayPal REST API
 */
async function getAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_SECRET || PAYPAL_CLIENT_SECRET.startsWith("placeholder")) {
    console.warn("PayPal Client Secret is missing or is placeholder. Defaulting to sandbox 'sb' credentials which may fail REST calls.");
  }

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

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}`, {
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

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Capture Order failed: ${response.status} - ${errorText}`);
  }

  return (await response.json()) as CaptureOrderResponse;
}
