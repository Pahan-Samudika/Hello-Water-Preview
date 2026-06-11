"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/db-queries";
import { SESSION_COOKIE_NAME } from "@/lib/admin-auth";

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (sessionId) {
    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error("Logout action error:", error);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
