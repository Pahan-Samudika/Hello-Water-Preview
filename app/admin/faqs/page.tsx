import { requireSession } from "@/lib/admin-auth";
import { getFAQs } from "@/lib/db-queries";
import { FAQsClient } from "./faqs-client";

export const revalidate = 0;

export default async function AdminFAQsPage() {
  // Guard: Requires "FAQs Management" permission
  await requireSession("FAQs Management");

  // Fetch all FAQs from Firestore
  const faqs = await getFAQs();

  return <FAQsClient initialFAQs={faqs} />;
}
