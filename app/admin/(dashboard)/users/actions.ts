"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { createDashboardUser, deleteDashboardUser, updateDashboardUser, getUserByEmail, type DashboardUser } from "@/lib/db-queries";
import { hashPassword } from "@/lib/admin-auth";

// Security guard: Ensure caller is authenticated and has "User Management" permission
async function checkAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "User Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export async function createUserAction(prevState: any, formData: FormData) {
  try {
    await checkAuth();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const permissions = formData.getAll("permissions") as string[];

    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: "A user with this email address already exists." };
    }

    const { hash, salt } = hashPassword(password);

    const newUser: DashboardUser = {
      id: email.toLowerCase(),
      email: email.toLowerCase(),
      name,
      passwordHash: hash,
      salt,
      permissions,
      createdAt: new Date().toISOString(),
    };

    await createDashboardUser(newUser);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Create user error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function updateUserAction(email: string, prevState: any, formData: FormData) {
  try {
    const session = await checkAuth();

    // Prevent self-lockout or changing own permissions
    if (session.email.toLowerCase() === email.toLowerCase()) {
      return { success: false, error: "You cannot edit your own permissions from this interface." };
    }

    const name = formData.get("name") as string;
    const permissions = formData.getAll("permissions") as string[];
    const password = formData.get("password") as string;

    if (!name) {
      return { success: false, error: "Name is required." };
    }

    const updates: Partial<DashboardUser> = { name, permissions };

    // Update password only if provided
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }
      const { hash, salt } = hashPassword(password);
      updates.passwordHash = hash;
      updates.salt = salt;
    }

    await updateDashboardUser(email, updates);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Update user error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteUserAction(email: string) {
  try {
    const session = await checkAuth();

    // Prevent self-deletion
    if (session.email.toLowerCase() === email.toLowerCase()) {
      return { success: false, error: "You cannot delete your own administrator account." };
    }

    await deleteDashboardUser(email);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
