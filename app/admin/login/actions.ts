"use server";

import { cookies } from "next/headers";
import { type DashboardUser, createDashboardUser, getUserByEmail, getUsers, createSession } from "@/lib/db-queries";
import { hashPassword, verifyPassword, SESSION_COOKIE_NAME } from "@/lib/admin-auth";
import crypto from "crypto";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Please enter email and password" };
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create a session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await createSession({
      id: sessionId,
      userId: user.email,
      name: user.name,
      email: user.email,
      permissions: user.permissions,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expiresAt),
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function registerInitialAdminAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  try {
    const existingUsers = await getUsers();
    if (existingUsers.length > 0) {
      return { success: false, error: "Admin users already exist. Registration disabled." };
    }

    const { hash, salt } = hashPassword(password);

    // Initial super admin gets all 8 permissions
    const allPermissions = [
      "User Management",
      "Product Management",
      "Enquiry Management",
      "Enquiry View",
      "Contact Management",
      "Contact View",
      "Blogs Management",
      "FAQs Management",
    ];

    const newUser: DashboardUser = {
      id: email.toLowerCase(),
      email: email.toLowerCase(),
      name,
      passwordHash: hash,
      salt,
      permissions: allPermissions,
      createdAt: new Date().toISOString(),
    };

    await createDashboardUser(newUser);

    // Automatically log them in
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await createSession({
      id: sessionId,
      userId: newUser.email,
      name: newUser.name,
      email: newUser.email,
      permissions: newUser.permissions,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expiresAt),
      path: "/",
    });

    // Also trigger initial data seeding so the website immediately starts with products/blogs populated!
    const { ensureDataSeeded } = await import("@/lib/db-seed");
    await ensureDataSeeded();

    return { success: true };
  } catch (error) {
    console.error("Register initial admin error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
