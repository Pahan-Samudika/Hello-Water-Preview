"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import { createProduct, updateProduct, deleteProduct, getProductBySlug } from "@/lib/db-queries";
import { type Product } from "@/constants/products";

// Security guard: Ensure caller has "Product Management"
async function checkAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "Product Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export async function createProductAction(prevState: any, formData: FormData) {
  try {
    await checkAuth();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const recent = formData.get("recent") === "true";
    const showFinancing = formData.get("showFinancing") === "true";
    const image = formData.get("image") as string;
    const imageAlt = formData.get("imageAlt") as string;
    const cardDescription = formData.get("cardDescription") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const idInput = parseInt(formData.get("id") as string || "0");

    const descriptionText = formData.get("description") as string || "";
    const featuresText = formData.get("features") as string || "";

    const description = descriptionText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (
      !name ||
      !slug ||
      !category ||
      !price ||
      !image ||
      !imageAlt ||
      !cardDescription ||
      !shortDescription
    ) {
      return { success: false, error: "All text fields are required." };
    }

    const existingProduct = await getProductBySlug(slug);
    if (existingProduct) {
      return { success: false, error: "A product with this slug already exists." };
    }

    const newProduct: Product = {
      id: idInput,
      slug: slug.trim(),
      name: name.trim(),
      category: category.trim(),
      price: price.trim(),
      recent,
      showFinancing,
      image: image.trim(),
      imageAlt: imageAlt.trim(),
      cardDescription: cardDescription.trim(),
      shortDescription: shortDescription.trim(),
      description,
      features,
    };

    await createProduct(newProduct);
    
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Create product error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function updateProductAction(oldSlug: string, prevState: any, formData: FormData) {
  try {
    await checkAuth();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const recent = formData.get("recent") === "true";
    const showFinancing = formData.get("showFinancing") === "true";
    const image = formData.get("image") as string;
    const imageAlt = formData.get("imageAlt") as string;
    const cardDescription = formData.get("cardDescription") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const idInput = parseInt(formData.get("id") as string || "0");

    const descriptionText = formData.get("description") as string || "";
    const featuresText = formData.get("features") as string || "";

    const description = descriptionText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (
      !name ||
      !slug ||
      !category ||
      !price ||
      !image ||
      !imageAlt ||
      !cardDescription ||
      !shortDescription
    ) {
      return { success: false, error: "All text fields are required." };
    }

    if (slug !== oldSlug) {
      const existingProduct = await getProductBySlug(slug);
      if (existingProduct) {
        return { success: false, error: "A product with this new slug already exists." };
      }
    }

    const productUpdates: Product = {
      id: idInput,
      slug: slug.trim(),
      name: name.trim(),
      category: category.trim(),
      price: price.trim(),
      recent,
      showFinancing,
      image: image.trim(),
      imageAlt: imageAlt.trim(),
      cardDescription: cardDescription.trim(),
      shortDescription: shortDescription.trim(),
      description,
      features,
    };

    await updateProduct(oldSlug, productUpdates);
    
    revalidatePath("/products");
    revalidatePath(`/products/${oldSlug}`);
    revalidatePath(`/products/${slug}`);
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteProductAction(slug: string) {
  try {
    await checkAuth();
    await deleteProduct(slug);
    revalidatePath("/products");
    revalidatePath(`/products/${slug}`);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
