import type { Metadata } from "next";
import { getShippingSettings, getProductBySlug } from "@/lib/db-queries";
import { getResolvedActivePackage } from "@/lib/packages";
import { CheckoutClient, type CheckoutPackage } from "@/app/(public)/checkout/checkout-client";
import { createMetadata } from "@/lib/seo";

export const revalidate = 0;

export const metadata: Metadata = createMetadata({
  title: "Checkout | Hello Water Filtration",
  description: "Complete your replacement water cartridge order safely through our secure payment system.",
  path: "/checkout",
});

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { package: packageParam } = await searchParams;
  const packageId = typeof packageParam === "string" ? packageParam : undefined;

  // Package checkout: priced entirely from the stored package, cart is ignored.
  if (packageId) {
    const pkg = await getResolvedActivePackage(packageId);
    if (!pkg) {
      return <CheckoutClient standardDeliveryFee={0} packageUnavailable />;
    }
    const system = await getProductBySlug(pkg.systemSlug);
    const checkoutPackage: CheckoutPackage = {
      ...pkg,
      systemName: system?.name ?? "",
    };
    return <CheckoutClient standardDeliveryFee={pkg.delivery} checkoutPackage={checkoutPackage} />;
  }

  const { standardDeliveryFee } = await getShippingSettings();

  return <CheckoutClient standardDeliveryFee={standardDeliveryFee} />;
}
