import type { Metadata } from "next";
import { getShippingSettings } from "@/lib/db-queries";
import { CheckoutClient } from "@/app/(public)/checkout/checkout-client";
import { createMetadata } from "@/lib/seo";

export const revalidate = 0;

export const metadata: Metadata = createMetadata({
  title: "Checkout | Hello Water Filtration",
  description: "Complete your replacement water cartridge order safely through our secure payment system.",
  path: "/checkout",
});

export default async function CheckoutPage() {
  const { standardDeliveryFee } = await getShippingSettings();

  return <CheckoutClient standardDeliveryFee={standardDeliveryFee} />;
}
