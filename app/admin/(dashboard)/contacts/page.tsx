import { redirect } from "next/navigation";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { getContacts } from "@/lib/db-queries";
import { ContactsClient } from "./contacts-client";

export const revalidate = 0;

export default async function AdminContactsPage() {
  const session = await getAdminSession();

  // Guard: Requires either Contact View or Contact Management
  if (
    !session ||
    (!hasPermission(session, "Contact View") && !hasPermission(session, "Contact Management"))
  ) {
    redirect("/admin?error=Unauthorized");
  }

  const canManage = hasPermission(session, "Contact Management");
  const canUpdateStatus =
    hasPermission(session, "Contact View") || hasPermission(session, "Contact Management");
  const contacts = await getContacts();

  return (
    <ContactsClient
      initialContacts={contacts}
      canManage={canManage}
      canUpdateStatus={canUpdateStatus}
    />
  );
}
