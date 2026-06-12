import fs from "fs";
import path from "path";
import { db } from "./firebase";
import { products } from "@/constants/products";
import { blogs } from "@/constants/blogs";
import { initialFAQs } from "@/constants/faqs";

// Helper to copy assets to the public folder programmatically
export function copyAssets() {
  try {
    const src = path.join(process.cwd(), "assets", "logos", "icon.png");
    const destDir = path.join(process.cwd(), "public", "images");
    const dest = path.join(destDir, "logo-icon.png");

    if (fs.existsSync(src)) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        console.log("Seeding: Successfully copied author avatar icon to public directory");
      }
    }
  } catch (error) {
    console.error("Seeding: Error copying assets:", error);
  }
}

export async function ensureDataSeeded() {
  try {
    copyAssets();

    // 1. Seed Products
    const productsSnap = await db.collection("products").limit(1).get();
    if (productsSnap.empty) {
      console.log("Seeding products to Firestore...");
      for (const product of products) {
        await db.collection("products").doc(product.slug).set(product);
      }
      console.log("Successfully seeded products!");
    }

    // 2. Seed Blogs
    const blogsSnap = await db.collection("blogs").limit(1).get();
    if (blogsSnap.empty) {
      console.log("Seeding blogs to Firestore...");
      for (const blog of blogs) {
        // Convert author avatar from import to public static string path
        const dbBlog = {
          ...blog,
          author: {
            name: blog.author.name,
            role: blog.author.role,
            avatar: "/images/logo-icon.png",
          },
        };
        await db.collection("blogs").doc(blog.slug).set(dbBlog);
      }
      console.log("Successfully seeded blogs!");
    }

    // 3. Seed FAQs
    const faqsSnap = await db.collection("faqs").limit(1).get();
    if (faqsSnap.empty) {
      console.log("Seeding FAQs to Firestore...");
      let order = 0;
      for (const category of initialFAQs) {
        for (const item of category.items) {
          await db.collection("faqs").add({
            category: category.title,
            question: item.question,
            answer: item.answer,
            order: order++,
          });
        }
      }
      console.log("Successfully seeded FAQs!");
    }
  } catch (error) {
    console.error("Error seeding Firestore data:", error);
  }
}
