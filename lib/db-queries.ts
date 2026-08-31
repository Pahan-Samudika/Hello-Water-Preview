import { db } from "./firebase";
import { type Product, type Certification } from "@/constants/products";
import { type BlogPost } from "@/constants/blogs";

// ==========================================
// FAQ Types & Queries
// ==========================================
export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order?: number;
}

export async function getFAQs(): Promise<FAQ[]> {
  const snapshot = await db.collection("faqs").orderBy("order", "asc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FAQ[];
}

export async function createFAQ(faq: Omit<FAQ, "id">): Promise<string> {
  const docRef = await db.collection("faqs").add({
    ...faq,
    order: faq.order ?? Date.now(),
  });
  return docRef.id;
}

export async function updateFAQ(id: string, faq: Partial<Omit<FAQ, "id">>): Promise<void> {
  await db.collection("faqs").doc(id).update(faq);
}

export async function deleteFAQ(id: string): Promise<void> {
  await db.collection("faqs").doc(id).delete();
}

// ==========================================
// Product Queries
// ==========================================
export async function getProducts(): Promise<Product[]> {
  const snapshot = await db.collection("products").orderBy("id", "asc").get();
  return snapshot.docs.map((doc) => doc.data()) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const doc = await db.collection("products").doc(slug).get();
  if (!doc.exists) return null;
  return doc.data() as Product;
}

export async function createProduct(product: Product): Promise<void> {
  // Use slug as the document ID for quick lookups
  await db.collection("products").doc(product.slug).set(product);
}

export async function updateProduct(slug: string, product: Partial<Product>): Promise<void> {
  // If the slug changed, we need to handle renaming/moving document
  if (product.slug && product.slug !== slug) {
    const oldDoc = await db.collection("products").doc(slug).get();
    if (oldDoc.exists) {
      const mergedData = { ...oldDoc.data(), ...product } as Product;
      await db.collection("products").doc(product.slug).set(mergedData);
      await db.collection("products").doc(slug).delete();
    }
  } else {
    await db.collection("products").doc(slug).update(product);
  }
}

export async function deleteProduct(slug: string): Promise<void> {
  await db.collection("products").doc(slug).delete();
}

// ==========================================
// Certification Queries
// ==========================================
export async function getCertifications(): Promise<Certification[]> {
  const snapshot = await db.collection("certifications").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Certification[];
}

// ==========================================
// Blog Queries
// ==========================================
// Note: We redefine author.avatar type to string for DB storage compatibility (URL path)
export interface DBBlogPost extends Omit<BlogPost, "author"> {
  author: {
    name: string;
    role: string;
    avatar: string; // string path instead of StaticImageData
  };
}

export async function getBlogs(): Promise<DBBlogPost[]> {
  const snapshot = await db.collection("blogs").orderBy("publishedAt", "desc").get();
  const blogs = snapshot.docs.map((doc) => doc.data()) as DBBlogPost[];
  return blogs.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime() || 0;
    const timeB = new Date(b.publishedAt).getTime() || 0;
    return timeB - timeA;
  });
}

export async function getBlogBySlug(slug: string): Promise<DBBlogPost | null> {
  const doc = await db.collection("blogs").doc(slug).get();
  if (!doc.exists) return null;
  return doc.data() as DBBlogPost;
}

export async function createBlog(blog: DBBlogPost): Promise<void> {
  // Use slug as the document ID
  await db.collection("blogs").doc(blog.slug).set(blog);
}

export async function updateBlog(slug: string, blog: Partial<DBBlogPost>): Promise<void> {
  if (blog.slug && blog.slug !== slug) {
    const oldDoc = await db.collection("blogs").doc(slug).get();
    if (oldDoc.exists) {
      const mergedData = { ...oldDoc.data(), ...blog } as DBBlogPost;
      await db.collection("blogs").doc(blog.slug).set(mergedData);
      await db.collection("blogs").doc(slug).delete();
    }
  } else {
    await db.collection("blogs").doc(slug).update(blog);
  }
}

export async function deleteBlog(slug: string): Promise<void> {
  await db.collection("blogs").doc(slug).delete();
}

// ==========================================
// Enquiry Queries
// ==========================================
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  installedAddress: string;
  createdAt: string;
  status?: "New" | "In Progress" | "Resolved";
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const snapshot = await db.collection("enquiries").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Enquiry[];
}

export async function updateEnquiryStatus(id: string, status: Enquiry["status"]): Promise<void> {
  await db.collection("enquiries").doc(id).update({ status });
}

export async function deleteEnquiry(id: string): Promise<void> {
  await db.collection("enquiries").doc(id).delete();
}

// ==========================================
// Contact Submission Queries
// ==========================================
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  suburb?: string;
  message: string;
  createdAt: string;
  status?: "New" | "In Progress" | "Resolved";
}

export async function getContacts(): Promise<ContactSubmission[]> {
  const snapshot = await db.collection("contact_submissions").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ContactSubmission[];
}

export async function updateContactStatus(id: string, status: ContactSubmission["status"]): Promise<void> {
  await db.collection("contact_submissions").doc(id).update({ status });
}

export async function deleteContact(id: string): Promise<void> {
  await db.collection("contact_submissions").doc(id).delete();
}

// ==========================================
// Dashboard User Management Queries
// ==========================================
export interface DashboardUser {
  id: string; // email as ID
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  permissions: string[];
  createdAt: string;
}

export async function getUsers(): Promise<DashboardUser[]> {
  const snapshot = await db.collection("dashboard_users").orderBy("createdAt", "asc").get();
  return snapshot.docs.map((doc) => doc.data()) as DashboardUser[];
}

export async function getUserByEmail(email: string): Promise<DashboardUser | null> {
  const doc = await db.collection("dashboard_users").doc(email.toLowerCase()).get();
  if (!doc.exists) return null;
  return doc.data() as DashboardUser;
}

export async function createDashboardUser(user: DashboardUser): Promise<void> {
  await db.collection("dashboard_users").doc(user.email.toLowerCase()).set(user);
}

export async function updateDashboardUser(
  email: string,
  updates: Partial<Omit<DashboardUser, "id" | "email" | "createdAt">>
): Promise<void> {
  await db.collection("dashboard_users").doc(email.toLowerCase()).update(updates);
}

export async function deleteDashboardUser(email: string): Promise<void> {
  await db.collection("dashboard_users").doc(email.toLowerCase()).delete();
}

// ==========================================
// Session Queries
// ==========================================
export interface UserSession {
  id: string; // Session ID (UUID)
  userId: string; // User email
  name: string;
  email: string;
  permissions: string[];
  expiresAt: string; // ISO date string
}

export async function createSession(session: UserSession): Promise<void> {
  await db.collection("dashboard_sessions").doc(session.id).set(session);
}

export async function getSession(sessionId: string): Promise<UserSession | null> {
  const doc = await db.collection("dashboard_sessions").doc(sessionId).get();
  if (!doc.exists) return null;
  const session = doc.data() as UserSession;
  
  // Check if session has expired
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await deleteSession(sessionId);
    return null;
  }
  
  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.collection("dashboard_sessions").doc(sessionId).delete();
}
