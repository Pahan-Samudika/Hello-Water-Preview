"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { updateOrderStatus, deleteOrder, updateShippingSettings, type Order } from "@/lib/db-queries";

// Security guard: Ensure caller has "Order Management"
async function checkManageAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "Order Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export async function updateOrderStatusAction(id: string, status: Order["status"]) {
  try {
    await checkManageAuth();
    await updateOrderStatus(id, status);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Update order status error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteOrderAction(id: string) {
  try {
    await checkManageAuth();
    await deleteOrder(id);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Delete order error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function updateShippingFeeAction(fee: number) {
  try {
    await checkManageAuth();
    if (isNaN(fee) || fee < 0) {
      throw new Error("Invalid delivery fee amount.");
    }
    await updateShippingSettings(fee);
    revalidatePath("/admin/orders");
    // Also revalidate checkout if necessary
    revalidatePath("/checkout");
    return { success: true };
  } catch (error: any) {
    console.error("Update shipping fee error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
