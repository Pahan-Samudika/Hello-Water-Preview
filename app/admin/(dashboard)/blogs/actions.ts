"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { createBlog, updateBlog, deleteBlog, getBlogBySlug, type DBBlogPost } from "@/lib/db-queries";

// Security guard: Ensure caller has "Blogs Management"
async function checkAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "Blogs Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export async function createBlogAction(prevState: any, formData: FormData) {
  try {
    await checkAuth();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const subtitle = formData.get("subtitle") as string;
    const excerpt = formData.get("excerpt") as string;
    const coverImage = formData.get("coverImage") as string;
    const publishedAt = formData.get("publishedAt") as string;
    const readTime = formData.get("readTime") as string;
    
    const authorName = formData.get("authorName") as string;
    const authorRole = formData.get("authorRole") as string;
    const authorAvatar = formData.get("authorAvatar") as string || "/images/logo-icon.png";

    const contentJson = formData.get("contentJson") as string || "[]";
    const sourcesJson = formData.get("sourcesJson") as string || "[]";

    const content = JSON.parse(contentJson);
    const sources = JSON.parse(sourcesJson);

    if (
      !title ||
      !slug ||
      !excerpt ||
      !coverImage ||
      !publishedAt ||
      !readTime ||
      !authorName ||
      !authorRole
    ) {
      return { success: false, error: "All required text fields are missing." };
    }

    const existingBlog = await getBlogBySlug(slug);
    if (existingBlog) {
      return { success: false, error: "A blog post with this slug already exists." };
    }

    const newBlog: DBBlogPost = {
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : undefined,
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim(),
      publishedAt: publishedAt.trim(),
      readTime: readTime.trim(),
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
        avatar: authorAvatar.trim(),
      },
      content,
      sources: sources.length > 0 ? sources : undefined,
    };

    await createBlog(newBlog);
    
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (error: any) {
    console.error("Create blog error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function updateBlogAction(oldSlug: string, prevState: any, formData: FormData) {
  try {
    await checkAuth();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const subtitle = formData.get("subtitle") as string;
    const excerpt = formData.get("excerpt") as string;
    const coverImage = formData.get("coverImage") as string;
    const publishedAt = formData.get("publishedAt") as string;
    const readTime = formData.get("readTime") as string;
    
    const authorName = formData.get("authorName") as string;
    const authorRole = formData.get("authorRole") as string;
    const authorAvatar = formData.get("authorAvatar") as string || "/images/logo-icon.png";

    const contentJson = formData.get("contentJson") as string || "[]";
    const sourcesJson = formData.get("sourcesJson") as string || "[]";

    const content = JSON.parse(contentJson);
    const sources = JSON.parse(sourcesJson);

    if (
      !title ||
      !slug ||
      !excerpt ||
      !coverImage ||
      !publishedAt ||
      !readTime ||
      !authorName ||
      !authorRole
    ) {
      return { success: false, error: "All required text fields are missing." };
    }

    if (slug !== oldSlug) {
      const existingBlog = await getBlogBySlug(slug);
      if (existingBlog) {
        return { success: false, error: "A blog post with this new slug already exists." };
      }
    }

    const blogUpdates: DBBlogPost = {
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : undefined,
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim(),
      publishedAt: publishedAt.trim(),
      readTime: readTime.trim(),
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
        avatar: authorAvatar.trim(),
      },
      content,
      sources: sources.length > 0 ? sources : undefined,
    };

    await updateBlog(oldSlug, blogUpdates);
    
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${oldSlug}`);
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/admin/blogs");
    
    return { success: true };
  } catch (error: any) {
    console.error("Update blog error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteBlogAction(slug: string) {
  try {
    await checkAuth();
    await deleteBlog(slug);
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/admin/blogs");
    return { success: true };
  } catch (error: any) {
    console.error("Delete blog error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
