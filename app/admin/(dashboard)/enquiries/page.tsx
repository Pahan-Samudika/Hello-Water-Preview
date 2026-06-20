import { redirect } from "next/navigation";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { getEnquiries } from "@/lib/db-queries";
import { EnquiriesClient } from "./enquiries-client";

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const session = await getAdminSession();

  // Guard: Requires either Enquiry View or Enquiry Management
  if (
    !session ||
    (!hasPermission(session, "Enquiry View") && !hasPermission(session, "Enquiry Management"))
  ) {
    redirect("/admin?error=Unauthorized");
  }

  const canManage = hasPermission(session, "Enquiry Management");
  const canUpdateStatus =
    hasPermission(session, "Enquiry View") || hasPermission(session, "Enquiry Management");
  const enquiries = await getEnquiries();

  return (
    <EnquiriesClient
      initialEnquiries={enquiries}
      canManage={canManage}
      canUpdateStatus={canUpdateStatus}
    />
  );
}
