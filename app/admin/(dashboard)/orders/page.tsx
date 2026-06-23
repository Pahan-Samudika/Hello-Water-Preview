import { requireSession } from "@/lib/admin-auth";
import { getOrders, getShippingSettings } from "@/lib/db-queries";
import { OrdersClient } from "@/app/admin/(dashboard)/orders/orders-client";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  // Guard the page to make sure only users with "Order Management" can access
  await requireSession("Order Management");

  const orders = await getOrders();
  const shippingSettings = await getShippingSettings();

  return (
    <OrdersClient
      initialOrders={orders}
      shippingSettings={shippingSettings}
    />
  );
}
