"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { updateEnquiryStatus, deleteEnquiry, type Enquiry } from "@/lib/db-queries";

// Security guard: Ensure caller has "Enquiry Management"
async function checkAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "Enquiry Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export async function updateEnquiryStatusAction(id: string, status: Enquiry["status"]) {
  try {
    await checkAuth();
    await updateEnquiryStatus(id, status);
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Update enquiry status error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteEnquiryAction(id: string) {
  try {
    await checkAuth();
    await deleteEnquiry(id);
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Delete enquiry error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
