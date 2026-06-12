"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { createFAQ, updateFAQ, deleteFAQ } from "@/lib/db-queries";

// Security guard: Ensure caller has "FAQs Management"
async function checkAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "FAQs Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export async function createFAQAction(prevState: any, formData: FormData) {
  try {
    await checkAuth();

    const category = formData.get("category") as string;
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    if (!category || !question || !answer) {
      return { success: false, error: "Category, question, and answer are required." };
    }

    await createFAQ({
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
    });

    revalidatePath("/faq");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error: any) {
    console.error("Create FAQ error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function updateFAQAction(id: string, prevState: any, formData: FormData) {
  try {
    await checkAuth();

    const category = formData.get("category") as string;
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    if (!category || !question || !answer) {
      return { success: false, error: "Category, question, and answer are required." };
    }

    await updateFAQ(id, {
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
    });

    revalidatePath("/faq");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error: any) {
    console.error("Update FAQ error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteFAQAction(id: string) {
  try {
    await checkAuth();
    await deleteFAQ(id);
    revalidatePath("/faq");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error: any) {
    console.error("Delete FAQ error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
