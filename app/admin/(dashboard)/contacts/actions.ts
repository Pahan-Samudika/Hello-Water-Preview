"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { updateContactStatus, deleteContact, type ContactSubmission } from "@/lib/db-queries";

// Security guard: Ensure caller has "Contact Management"
async function checkManageAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "Contact Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

// Security guard: Ensure caller has "Contact View" or "Contact Management"
async function checkViewOrManageAuth() {
  const session = await getAdminSession();
  if (
    !session ||
    (!hasPermission(session, "Contact View") && !hasPermission(session, "Contact Management"))
  ) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export async function updateContactStatusAction(id: string, status: ContactSubmission["status"]) {
  try {
    await checkViewOrManageAuth();
    await updateContactStatus(id, status);
    revalidatePath("/admin/contacts");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Update contact status error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteContactAction(id: string) {
  try {
    await checkManageAuth();
    await deleteContact(id);
    revalidatePath("/admin/contacts");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Delete contact error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
