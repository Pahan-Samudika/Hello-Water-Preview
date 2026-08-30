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
    const variantsText = formData.get("variants") as string;

    const cartridgeSize = formData.get("cartridgeSize") as string;
    const sizeKey = formData.get("sizeKey") as string;
    const stagesText = formData.get("stages") as string;

    const description = descriptionText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    let variants: any[] = [];
    if (variantsText) {
      try {
        const parsed = JSON.parse(variantsText);
        if (Array.isArray(parsed)) {
          variants = parsed;
        }
      } catch (e) {
        console.error("Failed to parse variants JSON:", e);
      }
    }

    let stages: any[] = [];
    if (stagesText) {
      try {
        const parsed = JSON.parse(stagesText);
        if (Array.isArray(parsed)) {
          stages = parsed;
        }
      } catch (e) {
        console.error("Failed to parse stages JSON:", e);
      }
    }

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
      variants,
      stages,
      cartridgeSize: cartridgeSize ? cartridgeSize.trim() : "",
      sizeKey: sizeKey ? sizeKey.trim() : "",
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
    const variantsText = formData.get("variants") as string;

    const cartridgeSize = formData.get("cartridgeSize") as string;
    const sizeKey = formData.get("sizeKey") as string;
    const stagesText = formData.get("stages") as string;

    const description = descriptionText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    let variants: any[] = [];
    if (variantsText) {
      try {
        const parsed = JSON.parse(variantsText);
        if (Array.isArray(parsed)) {
          variants = parsed;
        }
      } catch (e) {
        console.error("Failed to parse variants JSON:", e);
      }
    }

    let stages: any[] = [];
    if (stagesText) {
      try {
        const parsed = JSON.parse(stagesText);
        if (Array.isArray(parsed)) {
          stages = parsed;
        }
      } catch (e) {
        console.error("Failed to parse stages JSON:", e);
      }
    }

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
      variants,
      stages,
      cartridgeSize: cartridgeSize ? cartridgeSize.trim() : "",
      sizeKey: sizeKey ? sizeKey.trim() : "",
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
