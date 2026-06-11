import { requireSession } from "@/lib/admin-auth";
import { getUsers } from "@/lib/db-queries";
import { UsersClient } from "./users-client";

export const revalidate = 0;

export default async function AdminUsersPage() {
  // Guard: Requires "User Management" permission
  const session = await requireSession("User Management");

  // Fetch all registered dashboard users
  const users = await getUsers();

  return <UsersClient initialUsers={users} currentUserEmail={session.email} />;
}
