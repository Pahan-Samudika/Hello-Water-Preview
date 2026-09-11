"use client";

import React, { useState, useMemo } from "react";
import { type Product, type ProductVariant, type SystemStage, type Certification } from "@/constants/products";
import { createProductAction, updateProductAction, deleteProductAction } from "./actions";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  certifications: Certification[];
}

export function ProductsClient({ initialProducts, certifications = [] }: ProductsClientProps) {
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
  const [showFinancingChecked, setShowFinancingChecked] = useState(false);
  const [manualSlug, setManualSlug] = useState(false);

  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);
  const [formCategory, setFormCategory] = useState("Filtration Systems");
  const [formStages, setFormStages] = useState<SystemStage[]>([]);
  const [cartridgeSize, setCartridgeSize] = useState("");
  const [sizeKey, setSizeKey] = useState("");
  const [formCertifications, setFormCertifications] = useState<string[]>([]);

  const cartridgeOptions = useMemo(() => {
    const options: { label: string; slug: string; variantId: string }[] = [];
    initialProducts
      .filter((p) => p.category === "Cartridges")
      .forEach((p) => {
        if (p.variants && p.variants.length > 0) {
          p.variants.forEach((v) => {
            options.push({
              label: `${p.name} (${v.label})`,
              slug: p.slug,
              variantId: v.id,
            });
          });
        } else {
          options.push({
            label: p.name,
            slug: p.slug,
            variantId: "",
          });
        }
      });
    return options;
  }, [initialProducts]);

  // Reverse map: cartridge slug → list of systems that use it (with stage info)
  const cartridgeCompatibilityMap = useMemo(() => {
    const map = new Map<string, { system: Product; stageNumbers: number[] }[]>();
    initialProducts
      .filter((p) => p.category === "Filtration Systems" && p.stages)
      .forEach((system) => {
        system.stages!.forEach((stage) => {
          stage.cartridges.forEach((link) => {
            const existing = map.get(link.slug) || [];
            const systemEntry = existing.find((e) => e.system.slug === system.slug);
            if (systemEntry) {
              if (!systemEntry.stageNumbers.includes(stage.stageNumber)) {
                systemEntry.stageNumbers.push(stage.stageNumber);
              }
            } else {
              existing.push({ system, stageNumbers: [stage.stageNumber] });
            }
            map.set(link.slug, existing);
          });
        });
      });
    return map;
  }, [initialProducts]);

  function handleAddStage() {
    setFormStages([
      ...formStages,
      {
        stageNumber: formStages.length + 1,
        stageName: `Stage ${formStages.length + 1}`,
        cartridges: [],
      },
    ]);
  }

  function handleRemoveStage(index: number) {
    const updated = formStages
      .filter((_, i) => i !== index)
      .map((stage, i) => ({
        ...stage,
        stageNumber: i + 1,
      }));
    setFormStages(updated);
  }

  function handleStageNameChange(index: number, name: string) {
    setFormStages(
      formStages.map((stage, i) => (i === index ? { ...stage, stageName: name } : stage))
    );
  }

  function handleStageCartridgeToggle(stageIndex: number, slug: string, variantId: string) {
    setFormStages(
      formStages.map((stage, i) => {
        if (i !== stageIndex) return stage;
        const exists = stage.cartridges.some((c) => c.slug === slug && c.variantId === variantId);
        const updatedCartridges = exists
          ? stage.cartridges.filter((c) => !(c.slug === slug && c.variantId === variantId))
          : [...stage.cartridges, { slug, variantId }];
        return { ...stage, cartridges: updatedCartridges };
      })
    );
  }

  function handleAddVariant() {
    setFormVariants([
      ...formVariants,
      {
        id: "",
        label: "",
        name: "",
        price: "",
        shortDescription: "",
        image: "",
      },
    ]);
  }

  function handleRemoveVariant(index: number) {
    setFormVariants(formVariants.filter((_, i) => i !== index));
  }

  function handleVariantFieldChange(
    index: number,
    field: keyof ProductVariant,
    value: string
  ) {
    setFormVariants(
      formVariants.map((v, i) => {
        if (i !== index) return v;
        const updated = { ...v, [field]: value };
        if (field === "label") {
          if (!v.id) {
            updated.id = slugify(value);
          }
          if (!v.name) {
            const currentName = (document.getElementById("form-name") as HTMLInputElement)?.value || "";
            updated.name = `${currentName} ${value}`;
          }
        }
        return updated;
      })
    );
  }

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

  function handleCertificationToggle(id: string) {
    setFormCertifications((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function openCreateForm() {
    setEditingProduct(null);
    setFormError(null);
    setFormSuccess(null);
    setRecentChecked(false);
    setShowFinancingChecked(false);
    setManualSlug(false);
    setFormVariants([]);
    setFormCategory("Filtration Systems");
    setFormStages([]);
    setCartridgeSize("");
    setSizeKey("");
    setFormCertifications([]);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormError(null);
    setFormSuccess(null);
    setRecentChecked(!!product.recent);
    setShowFinancingChecked(!!product.showFinancing);
    setManualSlug(true);
    setFormVariants(product.variants || []);
    setFormCategory(product.category);
    setFormStages(product.stages || []);
    setCartridgeSize(product.cartridgeSize || "");
    setSizeKey(product.sizeKey || "");
    setFormCertifications(product.certifications?.map((c) => c.id) || []);
    setIsFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData(event.currentTarget);
    formData.append("recent", recentChecked ? "true" : "false");
    formData.append("showFinancing", showFinancingChecked ? "true" : "false");
    formData.append("variants", JSON.stringify(formVariants));
    formData.append("stages", JSON.stringify(formStages));
    formData.append("cartridgeSize", cartridgeSize);
    formData.append("sizeKey", sizeKey);
    formData.append("certifications", JSON.stringify(formCertifications));

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
          showFinancing: showFinancingChecked,
          image,
          imageAlt,
          cardDescription,
          shortDescription,
          description,
          features,
          variants: formVariants,
          stages: formStages,
          cartridgeSize: cartridgeSize ? cartridgeSize.trim() : "",
          sizeKey: sizeKey ? sizeKey.trim() : "",
          certifications: certifications.filter((c) => formCertifications.includes(c.id)),
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
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center justify-between pb-4 md:pb-6 border-b border-slate-800">
        <div className="space-y-0.5 sm:space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Droplets className="size-5 sm:size-6 text-primary" />
            Product Management
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Create and edit filtration systems and cartridge replacements
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          {/* Filter and search bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/70">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Filter products by name or category..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <button
            onClick={openCreateForm}
            className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/15 transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products list layout (Desktop Table / Mobile Cards) */}
      <div className="hidden md:block overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-900/20 backdrop-blur-md">
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
                      {product.category === "Cartridges" && (() => {
                        const systems = cartridgeCompatibilityMap.get(product.slug) || [];
                        return systems.length > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[9px] font-black text-sky-400 uppercase" title={systems.map((s) => s.system.name).join(", ")}>
                            {systems.length} System{systems.length !== 1 ? "s" : ""}
                          </span>
                        ) : null;
                      })()}
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

      {/* Mobile view stacked cards (visible only on mobile) */}
      <div className="grid gap-4 md:hidden">
        {paginatedProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 rounded-3xl border border-slate-800 bg-slate-900/10">
            No products registered in the database.
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <div
              key={product.slug}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/20 hover:border-slate-700 transition-all flex flex-col gap-3.5"
            >
              {/* Product info header */}
              <div className="flex items-start gap-4">
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
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white block leading-snug break-words">{product.name}</span>
                  <span className="text-[10px] text-slate-500 block break-all mt-0.5">
                    ID: {product.id} • Slug: {product.slug}
                  </span>
                </div>
              </div>

              {/* Category & Price */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                <div className="space-y-1 shrink-0">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider block">Category</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                    {product.category}
                  </span>
                </div>
                <div className="space-y-1 text-right shrink-0">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider block">Price</span>
                  <span className="font-bold text-sm text-slate-300 block">{product.price}</span>
                </div>
              </div>

              {/* Status/Badges & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {product.recent && (
                    <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase">
                      Recent
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 text-[9px] font-bold text-slate-400">
                    {product.features.length} Features
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/products/${product.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    title="View public page"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    onClick={() => openEditForm(product)}
                    className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    title="Edit product"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingProduct(product)}
                    className="size-8 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[70] animate-fadeIn">
          <div className="absolute inset-0 -z-10" onClick={() => setIsFormOpen(false)} />

          <div className="w-full max-w-2xl bg-sidebar border-l border-sidebar-border h-full flex flex-col justify-between shadow-2xl p-4 sm:p-6 md:p-8 animate-slideLeft">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-sidebar-border gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Droplets className="size-5 text-primary" />
                  {editingProduct ? "Edit Product Details" : "Create New Product"}
                </h3>
                <p className="text-xs text-muted-foreground/75 mt-1 truncate" title={editingProduct ? `Updating product: ${editingProduct.name}` : undefined}>
                  {editingProduct ? `Updating product: ${editingProduct.name}` : "Define product parameters and lists"}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="size-8 rounded-lg border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar py-4 sm:py-6 space-y-4 sm:space-y-6">
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
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-name">
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
                    className="w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-slug">
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
                    className="w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-category">
                    Product Category
                  </label>
                  <Select
                    name="category"
                    value={formCategory}
                    onValueChange={(val) => setFormCategory(val || "")}
                  >
                    <SelectTrigger className="w-full h-11 bg-background border border-sidebar-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-sidebar-border rounded-xl">
                      <SelectItem value="Filtration Systems">Filtration Systems</SelectItem>
                      <SelectItem value="Cartridges">Cartridges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-price">
                    Pricing Text
                  </label>
                  <input
                    id="form-price"
                    name="price"
                    type="text"
                    required
                    defaultValue={editingProduct?.price || "Call for Price"}
                    placeholder="$156.00 + GST or Call for Price"
                    className="w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Sorting ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-id">
                    Sort Index / ID
                  </label>
                  <input
                    id="form-id"
                    name="id"
                    type="number"
                    required
                    defaultValue={editingProduct?.id ?? (products.length + 1)}
                    placeholder="e.g. 1"
                    className="w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-image">
                    Cloudinary / Image URL
                  </label>
                  <input
                    id="form-image"
                    name="image"
                    type="text"
                    required
                    defaultValue={editingProduct?.image || ""}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Image Alt */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-image-alt">
                    Image Alt Description
                  </label>
                  <input
                    id="form-image-alt"
                    name="imageAlt"
                    type="text"
                    required
                    defaultValue={editingProduct?.imageAlt || ""}
                    placeholder="Description of the product image for accessibility"
                    className="w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Badge settings */}
                <div className="sm:col-span-2 p-4 rounded-xl border border-sidebar-border bg-background/40 select-none">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recentChecked}
                      onChange={(e) => setRecentChecked(e.target.checked)}
                      className="size-4.5 rounded border-sidebar-border bg-background text-primary focus:ring-primary focus:ring-offset-background"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground/90">Highlight as Recent Product</span>
                      <span className="text-[10px] text-muted-foreground/75">Adds an absolute ribbon badge and pushes item to prominent blocks</span>
                    </div>
                  </label>
                </div>

                {/* Financing setting */}
                <div className="sm:col-span-2 p-4 rounded-xl border border-sidebar-border bg-background/40 select-none">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFinancingChecked}
                      onChange={(e) => setShowFinancingChecked(e.target.checked)}
                      className="size-4.5 rounded border-sidebar-border bg-background text-primary focus:ring-primary focus:ring-offset-background"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground/90">Show Flexible Financing</span>
                      <span className="text-[10px] text-muted-foreground/75">Displays the financing banner on the product details page</span>
                    </div>
                  </label>
                </div>

                {/* Card Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-card-desc">
                    Short Card Subtitle
                  </label>
                  <input
                    id="form-card-desc"
                    name="cardDescription"
                    type="text"
                    required
                    defaultValue={editingProduct?.cardDescription || ""}
                    placeholder="e.g. Whole Home Micron Water Filtration System"
                    className="w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-short-desc">
                    Summary/Excerpt (SEO)
                  </label>
                  <textarea
                    id="form-short-desc"
                    name="shortDescription"
                    required
                    defaultValue={editingProduct?.shortDescription || ""}
                    placeholder="Short paragraph summary..."
                    rows={2}
                    className="w-full p-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>

                {/* Detailed Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-desc">
                    Detailed Paragraphs (One paragraph per line)
                  </label>
                  <textarea
                    id="form-desc"
                    name="description"
                    required
                    defaultValue={editingProduct?.description.join("\n") || ""}
                    placeholder="First paragraph text&#10;Second paragraph text&#10;Third paragraph text"
                    rows={6}
                    className="w-full p-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>

                {/* Features */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider" htmlFor="form-features">
                    Key Features List (One feature per line)
                  </label>
                  <textarea
                    id="form-features"
                    name="features"
                    required
                    defaultValue={editingProduct?.features.join("\n") || ""}
                    placeholder="Advanced multi-stage whole home filtration&#10;Dual-gradient sediment filtration (0.5 micron)&#10;Proprietary ACF technology"
                    rows={5}
                    className="w-full p-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>

                {/* Product Variants section */}
                <div className="space-y-4 sm:col-span-2 border-t border-sidebar-border/60 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Product Variants</h4>
                      <p className="text-[10px] text-muted-foreground">Define different options such as sizes or models for this product.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="h-9 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Variant</span>
                    </button>
                  </div>

                  {formVariants.length > 0 ? (
                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                      {formVariants.map((variant, index) => (
                        <div key={index} className="p-4 rounded-xl border border-sidebar-border bg-background/30 space-y-4 relative group/variant">
                          <div className="flex items-center justify-between pb-3 border-b border-sidebar-border/30">
                            <span className="text-[10px] font-black uppercase tracking-wider text-primary/90">
                              Variant #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="size-7 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all flex items-center justify-center cursor-pointer"
                              title="Remove variant"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            {/* Variant Label */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                Variant Label (e.g. 10", 20", UV5501)
                              </label>
                              <input
                                type="text"
                                required
                                value={variant.label}
                                onChange={(e) => handleVariantFieldChange(index, "label", e.target.value)}
                                placeholder='10"'
                                className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                              />
                            </div>

                            {/* Variant ID */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                Variant ID (URL key: e.g. 10, 20, uv5501)
                              </label>
                              <input
                                type="text"
                                required
                                value={variant.id}
                                onChange={(e) => handleVariantFieldChange(index, "id", e.target.value)}
                                placeholder="10"
                                className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                              />
                            </div>

                            {/* Variant Full Name */}
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                Variant Name (full header title)
                              </label>
                              <input
                                type="text"
                                required
                                value={variant.name}
                                onChange={(e) => handleVariantFieldChange(index, "name", e.target.value)}
                                placeholder='Pentek DGD Series 10"'
                                className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                              />
                            </div>

                            {/* Variant Price */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                Variant Price
                              </label>
                              <input
                                type="text"
                                required
                                value={variant.price}
                                onChange={(e) => handleVariantFieldChange(index, "price", e.target.value)}
                                placeholder="$49.00 + GST"
                                className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                              />
                            </div>

                            {/* Variant Image */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                Variant Image URL (Optional)
                              </label>
                              <input
                                type="text"
                                value={variant.image || ""}
                                onChange={(e) => handleVariantFieldChange(index, "image", e.target.value)}
                                placeholder="https://res.cloudinary.com/..."
                                className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                              />
                            </div>

                            {/* Variant Short Description */}
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                Variant Short Description
                              </label>
                              <textarea
                                required
                                value={variant.shortDescription}
                                onChange={(e) => handleVariantFieldChange(index, "shortDescription", e.target.value)}
                                placeholder='A 10" high-capacity sediment reduction cartridge...'
                                rows={2}
                                className="w-full p-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all resize-y"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-sidebar-border p-6 text-center">
                      <span className="text-xs text-muted-foreground">No variants configured. Product will render as standard.</span>
                    </div>
                  )}
                </div>

                {/* Filtration System Stages Configurator */}
                {formCategory === "Filtration Systems" && (
                  <div className="space-y-4 sm:col-span-2 border-t border-sidebar-border/60 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Filtration System Stages</h4>
                        <p className="text-[10px] text-muted-foreground">Configure the stages and link compatible cartridges.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddStage}
                        className="h-9 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Stage</span>
                      </button>
                    </div>

                    {/* Sizing Details */}
                    <div className="grid gap-3 sm:grid-cols-2 p-4 rounded-xl border border-sidebar-border bg-background/25">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                          Default Cartridge Size
                        </label>
                        <input
                          type="text"
                          value={cartridgeSize}
                          onChange={(e) => setCartridgeSize(e.target.value)}
                          placeholder='e.g. 20" BB'
                          className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                          Default Size Key
                        </label>
                        <input
                          type="text"
                          value={sizeKey}
                          onChange={(e) => setSizeKey(e.target.value)}
                          placeholder='e.g. 20 (matches cartridge variant)'
                          className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {formStages.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                        {formStages.map((stage, stageIdx) => (
                          <div key={stageIdx} className="p-4 rounded-xl border border-sidebar-border bg-background/30 space-y-4 relative group/stage">
                            <div className="flex items-center justify-between pb-3 border-b border-sidebar-border/30">
                              <span className="text-[10px] font-black uppercase tracking-wider text-primary/90">
                                Stage #{stage.stageNumber}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveStage(stageIdx)}
                                className="size-7 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all flex items-center justify-center cursor-pointer"
                                title="Remove stage"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>

                            {/* Stage Name */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                Stage Description / Title
                              </label>
                              <input
                                type="text"
                                required
                                value={stage.stageName}
                                onChange={(e) => handleStageNameChange(stageIdx, e.target.value)}
                                placeholder="Stage Name (e.g. Sediment Pre-Filter)"
                                className="w-full h-9 px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
                              />
                            </div>

                            {/* Cartridge Checklist */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">
                                Compatible Replacement Cartridges
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg border border-sidebar-border bg-background/10">
                                {cartridgeOptions.length > 0 ? (
                                  cartridgeOptions.map((opt) => {
                                    const isChecked = stage.cartridges.some(
                                      (c) => c.slug === opt.slug && c.variantId === opt.variantId
                                    );
                                    return (
                                      <label
                                        key={`${opt.slug}-${opt.variantId}`}
                                        className="flex items-center gap-2 text-xs font-semibold text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handleStageCartridgeToggle(stageIdx, opt.slug, opt.variantId)}
                                          className="rounded border-sidebar-border text-primary focus:ring-primary size-3.5 cursor-pointer"
                                        />
                                        <span className="truncate">{opt.label}</span>
                                      </label>
                                    );
                                  })
                                ) : (
                                  <span className="text-[10px] text-muted-foreground italic sm:col-span-2">
                                    No cartridge products found in database.
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-sidebar-border p-6 text-center">
                        <span className="text-xs text-muted-foreground">No stages configured. Compatible cartridges section will not render.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cartridge Reverse Compatibility Audit (read-only, edit mode only) */}
                {formCategory === "Cartridges" && editingProduct && (() => {
                  const systems = cartridgeCompatibilityMap.get(editingProduct.slug) || [];
                  return (
                    <div className="space-y-3 sm:col-span-2 border-t border-sidebar-border/60 pt-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Used In Filtration Systems</h4>
                        <p className="text-[10px] text-muted-foreground">Read-only view of systems that reference this cartridge in their stages.</p>
                      </div>
                      {systems.length > 0 ? (
                        <div className="space-y-2">
                          {systems.map(({ system, stageNumbers }) => (
                            <div
                              key={system.slug}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-sidebar-border bg-background/30"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {system.image && (
                                  <div className="relative size-8 rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shrink-0">
                                    <Image src={system.image} alt={system.name} fill className="object-cover" sizes="32px" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-foreground block truncate">{system.name}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {stageNumbers.sort((a, b) => a - b).map((n) => `Stage ${n}`).join(" & ")}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={`/products/${system.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="size-7 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 transition-all shrink-0"
                                title="View public page"
                              >
                                <ExternalLink className="size-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-sidebar-border p-5 text-center">
                          <span className="text-xs text-muted-foreground">This cartridge is not linked to any filtration system stages yet.</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Certifications Configurator */}
                <div className="space-y-4 sm:col-span-2 border-t border-sidebar-border/60 pt-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Product Certifications</h4>
                    <p className="text-[10px] text-muted-foreground">Select the certifications applicable to this product.</p>
                  </div>
                  <div className="grid gap-3 p-4 rounded-xl border border-sidebar-border bg-background/25">
                    {certifications.length > 0 ? (
                      certifications.map((cert) => {
                        const isChecked = formCertifications.includes(cert.id);
                        return (
                          <label key={cert.id} className="flex items-start gap-3 cursor-pointer select-none p-2 rounded-lg hover:bg-background/10 transition-colors">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCertificationToggle(cert.id)}
                              className="size-4 rounded border-sidebar-border text-primary focus:ring-primary size-4 cursor-pointer mt-1"
                            />
                            <div className="flex gap-3 min-w-0">
                              {cert.image && (
                                <div className="relative size-10 rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center p-1">
                                  <img src={cert.image} alt={cert.alt} className="max-h-full max-w-full object-contain" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-foreground block">{cert.name}</span>
                                <span className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed block mt-0.5">{cert.description}</span>
                              </div>
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">No certifications found in database.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer footer actions */}
              <div className="pt-4 sm:pt-6 border-t border-sidebar-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-11 px-6 rounded-xl border border-sidebar-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-sidebar border border-sidebar-border rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="size-8 shrink-0 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-foreground">Delete Product?</h3>
                <p className="text-xs text-muted-foreground/75 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-foreground">{deletingProduct.name}</span>? The product page and related collections will no longer be public.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-sidebar-border">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="h-10 px-4 rounded-xl border border-sidebar-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
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
