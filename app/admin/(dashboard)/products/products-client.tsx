"use client";

import React, { useState } from "react";
import { type Product } from "@/constants/products";
import { createProductAction, updateProductAction, deleteProductAction } from "./actions";
import { Pagination } from "@/components/ui/pagination";
import {
  Droplets,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [recentChecked, setRecentChecked] = useState(false);
  const [manualSlug, setManualSlug] = useState(false);

  // Filter products by name or category
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (editingProduct || manualSlug) return;
    const slugInput = document.getElementById("form-slug") as HTMLInputElement;
    if (slugInput) {
      slugInput.value = slugify(e.target.value);
    }
  }

  function openCreateForm() {
    setEditingProduct(null);
    setFormError(null);
    setFormSuccess(null);
    setRecentChecked(false);
    setManualSlug(false);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormError(null);
    setFormSuccess(null);
    setRecentChecked(!!product.recent);
    setManualSlug(true);
    setIsFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData(event.currentTarget);
    formData.append("recent", recentChecked ? "true" : "false");

    try {
      let result;
      if (editingProduct) {
        result = await updateProductAction(editingProduct.slug, null, formData);
      } else {
        result = await createProductAction(null, formData);
      }

      if (result.success) {
        setFormSuccess(
          editingProduct
            ? "Product updated successfully!"
            : "New product created successfully!"
        );

        // Fetch values to update local state
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const category = formData.get("category") as string;
        const price = formData.get("price") as string;
        const image = formData.get("image") as string;
        const imageAlt = formData.get("imageAlt") as string;
        const cardDescription = formData.get("cardDescription") as string;
        const shortDescription = formData.get("shortDescription") as string;
        const idInput = parseInt(formData.get("id") as string || "0");
        const descriptionText = formData.get("description") as string || "";
        const featuresText = formData.get("features") as string || "";

        const description = descriptionText.split("\n").map((p) => p.trim()).filter(Boolean);
        const features = featuresText.split("\n").map((f) => f.trim()).filter(Boolean);

        const updatedProduct: Product = {
          id: idInput,
          slug,
          name,
          category,
          price,
          recent: recentChecked,
          image,
          imageAlt,
          cardDescription,
          shortDescription,
          description,
          features,
        };

        if (editingProduct) {
          // If slug changed, replace, otherwise update
          setProducts(
            products
              .map((p) => (p.slug === editingProduct.slug ? updatedProduct : p))
              .sort((a, b) => a.id - b.id)
          );
        } else {
          setProducts([...products, updatedProduct].sort((a, b) => a.id - b.id));
        }

        setTimeout(() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }, 1000);
      } else {
        setFormError(result.error || "An error occurred");
      }
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    setLoading(true);
    try {
      const result = await deleteProductAction(slug);
      if (result.success) {
        setProducts(products.filter((p) => p.slug !== slug));
        setDeletingProduct(null);
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Droplets className="size-6 text-primary" />
            Product Management
          </h1>
          <p className="text-xs text-slate-500">
            Create and edit filtration systems and cartridge replacements
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="h-10 inline-flex items-center gap-2 px-4 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/15 transition-all"
        >
          <Plus className="size-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="size-4" />
        </span>
        <input
          type="text"
          placeholder="Filter products by name or category..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full h-10 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-all"
        />
      </div>

      {/* Products list table */}
      <div className="overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Product Details</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Status / Badges</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No products registered in the database.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.slug} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative size-12 rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.imageAlt}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                            <ImageIcon className="size-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{product.name}</span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          ID: {product.id} • Slug: {product.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-300">{product.price}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {product.recent && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase">
                          Recent Product
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 text-[9px] font-bold text-slate-400">
                        {product.features.length} Features
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                        title="View public page"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                      <button
                        onClick={() => openEditForm(product)}
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="Edit product"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="size-8 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all"
                        title="Delete product"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          totalItems={filteredProducts.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Drawer overlay form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 animate-fadeIn">
          <div className="absolute inset-0 -z-10" onClick={() => setIsFormOpen(false)} />

          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl p-6 md:p-8 animate-slideLeft">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Droplets className="size-5 text-primary" />
                  {editingProduct ? "Edit Product Details" : "Create New Product"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {editingProduct ? `Updating product: ${editingProduct.name}` : "Define product parameters and lists"}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="size-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 space-y-6">
              {formError && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive-foreground flex gap-2">
                  <AlertTriangle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                  <span className="font-semibold text-rose-300">{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300 flex gap-2">
                  <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="font-semibold">{formSuccess}</span>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-name">
                    Product Name
                  </label>
                  <input
                    id="form-name"
                    name="name"
                    type="text"
                    required
                    defaultValue={editingProduct?.name || ""}
                    onChange={handleNameChange}
                    placeholder="Whole Home Filtration System"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-slug">
                    URL Slug
                  </label>
                  <input
                    id="form-slug"
                    name="slug"
                    type="text"
                    required
                    defaultValue={editingProduct?.slug || ""}
                    onChange={() => setManualSlug(true)}
                    placeholder="whole-home-filtration-system"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-category">
                    Product Category
                  </label>
                  <select
                    id="form-category"
                    name="category"
                    required
                    defaultValue={editingProduct?.category || "Filtration Systems"}
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="Filtration Systems">Filtration Systems</option>
                    <option value="Cartridges">Cartridges</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-price">
                    Pricing Text
                  </label>
                  <input
                    id="form-price"
                    name="price"
                    type="text"
                    required
                    defaultValue={editingProduct?.price || "Call for Price"}
                    placeholder="$156.00 + GST or Call for Price"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Sorting ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-id">
                    Sort Index / ID
                  </label>
                  <input
                    id="form-id"
                    name="id"
                    type="number"
                    required
                    defaultValue={editingProduct?.id ?? (products.length + 1)}
                    placeholder="e.g. 1"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-image">
                    Cloudinary / Image URL
                  </label>
                  <input
                    id="form-image"
                    name="image"
                    type="text"
                    required
                    defaultValue={editingProduct?.image || ""}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Image Alt */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-image-alt">
                    Image Alt Description
                  </label>
                  <input
                    id="form-image-alt"
                    name="imageAlt"
                    type="text"
                    required
                    defaultValue={editingProduct?.imageAlt || ""}
                    placeholder="Description of the product image for accessibility"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Badge settings */}
                <div className="sm:col-span-2 p-4 rounded-xl border border-slate-800 bg-slate-950/40 select-none">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recentChecked}
                      onChange={(e) => setRecentChecked(e.target.checked)}
                      className="size-4.5 rounded border-slate-800 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-slate-950"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Highlight as Recent Product</span>
                      <span className="text-[10px] text-slate-500">Adds an absolute ribbon badge and pushes item to prominent blocks</span>
                    </div>
                  </label>
                </div>

                {/* Card Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-card-desc">
                    Short Card Subtitle
                  </label>
                  <input
                    id="form-card-desc"
                    name="cardDescription"
                    type="text"
                    required
                    defaultValue={editingProduct?.cardDescription || ""}
                    placeholder="e.g. Whole Home Micron Water Filtration System"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-short-desc">
                    Summary/Excerpt (SEO)
                  </label>
                  <textarea
                    id="form-short-desc"
                    name="shortDescription"
                    required
                    defaultValue={editingProduct?.shortDescription || ""}
                    placeholder="Short paragraph summary..."
                    rows={2}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>

                {/* Detailed Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-desc">
                    Detailed Paragraphs (One paragraph per line)
                  </label>
                  <textarea
                    id="form-desc"
                    name="description"
                    required
                    defaultValue={editingProduct?.description.join("\n") || ""}
                    placeholder="First paragraph text&#10;Second paragraph text&#10;Third paragraph text"
                    rows={6}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>

                {/* Features */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-features">
                    Key Features List (One feature per line)
                  </label>
                  <textarea
                    id="form-features"
                    name="features"
                    required
                    defaultValue={editingProduct?.features.join("\n") || ""}
                    placeholder="Advanced multi-stage whole home filtration&#10;Dual-gradient sediment filtration (0.5 micron)&#10;Proprietary ACF technology"
                    rows={5}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>
              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-11 px-6 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center min-w-28"
                >
                  {loading ? (
                    <div className="size-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="size-8 shrink-0 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-white">Delete Product?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-white">{deletingProduct.name}</span>? The product page and related collections will no longer be public.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="h-10 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingProduct.slug)}
                className="h-10 px-4 rounded-xl bg-rose-500 text-xs font-bold text-white hover:bg-rose-600 transition-all flex items-center justify-center min-w-20"
              >
                {loading ? (
                  <div className="size-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
