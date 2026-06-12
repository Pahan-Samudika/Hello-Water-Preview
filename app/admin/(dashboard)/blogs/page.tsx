import { requireSession } from "@/lib/admin-auth";
import { getBlogs } from "@/lib/db-queries";
import { BlogsClient } from "./blogs-client";

export const revalidate = 0;

export default async function AdminBlogsPage() {
  // Guard: Requires "Blogs Management" permission
  await requireSession("Blogs Management");

  // Fetch all blogs
  const blogs = await getBlogs();

  return <BlogsClient initialBlogs={blogs} />;
}
