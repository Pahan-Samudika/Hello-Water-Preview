import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { getSession, type UserSession } from "./db-queries";

export const SESSION_COOKIE_NAME = "hw_admin_session";

/**
 * Hashes a plaintext password using Node's native PBKDF2 (SHA-512).
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { hash, salt };
}

/**
 * Verifies a plaintext password against a stored hash and salt.
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return checkHash === hash;
}

/**
 * Gets the active session from the HttpOnly session cookie, checking Firestore validity.
 */
export async function getAdminSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) return null;
  return getSession(sessionId);
}

/**
 * Checks if a session contains a specific permission.
 */
export function hasPermission(session: UserSession | null, permission: string): boolean {
  if (!session) return false;
  return session.permissions.includes(permission);
}

/**
 * Server Component Route Guard:
 * Redirects to the login page if not authenticated, or to the dashboard home if lacking permissions.
 */
export async function requireSession(permission?: string): Promise<UserSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  if (permission && !hasPermission(session, permission)) {
    redirect("/admin?error=Unauthorized");
  }

  return session;
}
