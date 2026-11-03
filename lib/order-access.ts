import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Order access tokens bind an order's confirmation page to the browser that
 * placed it. The raw token lives only in an HttpOnly cookie; Firestore stores
 * its SHA-256 hash, so a database read never yields a usable token.
 */
const ORDER_ACCESS_COOKIE_PREFIX = "hw_order_access_";
const ORDER_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const ORDER_ID_PATTERN = /^HW-[A-Z0-9]{6}$/;

// One cookie per order, so starting a new checkout never revokes access to an
// earlier one. Order IDs are restricted to cookie-name-safe characters.
function cookieNameFor(orderId: string): string | null {
  return ORDER_ID_PATTERN.test(orderId) ? `${ORDER_ACCESS_COOKIE_PREFIX}${orderId}` : null;
}

export function hashOrderAccessToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createOrderAccessToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, hash: hashOrderAccessToken(token) };
}

/** Must be called from a Server Action or Route Handler. */
export async function setOrderAccessCookie(orderId: string, token: string): Promise<void> {
  const name = cookieNameFor(orderId);
  if (!name) throw new Error(`Unexpected order ID format: ${orderId}`);

  const cookieStore = await cookies();
  cookieStore.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // sent on the top-level redirect back from PayPal
    path: "/checkout",
    maxAge: ORDER_ACCESS_MAX_AGE_SECONDS,
  });
}

/** True only if this request carries the access cookie for the given order. */
export async function hasOrderAccess(orderId: string, storedHash: string | undefined): Promise<boolean> {
  const name = cookieNameFor(orderId);
  if (!storedHash || !name) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;
  if (!token) return false;

  const presented = Buffer.from(hashOrderAccessToken(token), "hex");
  const expected = Buffer.from(storedHash, "hex");
  return presented.length === expected.length && crypto.timingSafeEqual(presented, expected);
}
