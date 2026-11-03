"use client";

import React, { useMemo, useState } from "react";
import { type Product } from "@/constants/products";
import {
  computePackageTotals,
  formatAud,
  MAX_PACKAGE_ITEMS,
  type CartridgePackage,
} from "@/constants/packages";
import { parseProductPrice } from "@/hooks/use-cart";
import {
  createPackageAction,
  updatePackageAction,
  setPackageActiveAction,
  deletePackageAction,
  type PackageInput,
} from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PackageOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Check,
  AlertTriangle,
  Wand2,
} from "lucide-react";

const ALL_SIZES = "__all__";

interface PackagesClientProps {
  initialPackages: CartridgePackage[];
  products: Product[];
}

type ItemRow = {
  key: string;
  /** `${slug}::${variantId}` or "" while unselected */
  cartridge: string;
  quantity: string;
  offerPrice: string;
};

type CartridgeOption = {
  value: string;
  slug: string;
  variantId: string;
  label: string;
  regularPrice: number;
};

let rowCounter = 0;
const newRowKey = () => `row-${++rowCounter}`;

function cartridgeValue(slug: string, variantId: string) {
  return `${slug}::${variantId}`;
}

export function PackagesClient({ initialPackages, products }: PackagesClientProps) {
  const [packages, setPackages] = useState<CartridgePackage[]>(initialPackages);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CartridgePackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<CartridgePackage | null>(null);

  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [systemSlug, setSystemSlug] = useState("");
  const [systemVariantId, setSystemVariantId] = useState(ALL_SIZES);
  const [deliveryFee, setDeliveryFee] = useState("");
  const [active, setActive] = useState(true);
  const [rows, setRows] = useState<ItemRow[]>([]);

  const systems = useMemo(
    () => products.filter((p) => p.category === "Filtration Systems"),
    [products]
  );
  const productsBySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);

  const cartridgeOptions = useMemo<CartridgeOption[]>(() => {
    const options: CartridgeOption[] = [];
    for (const p of products) {
      if (p.category !== "Cartridges") continue;
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          options.push({
            value: cartridgeValue(p.slug, v.id),
            slug: p.slug,
            variantId: v.id,
            label: `${p.name} (${v.label})`,
            regularPrice: parseProductPrice(v.price),
          });
        }
      } else {
        options.push({
          value: cartridgeValue(p.slug, ""),
          slug: p.slug,
          variantId: "",
          label: p.name,
          regularPrice: parseProductPrice(p.price),
        });
      }
    }
    return options;
  }, [products]);
  const optionsByValue = useMemo(
    () => new Map(cartridgeOptions.map((o) => [o.value, o])),
    [cartridgeOptions]
  );

  const selectedSystem = productsBySlug.get(systemSlug);

  function describePackage(pkg: CartridgePackage) {
    const system = productsBySlug.get(pkg.systemSlug);
    const size = pkg.systemVariantId
      ? system?.variants?.find((v) => v.id === pkg.systemVariantId)?.label ?? pkg.systemVariantId
      : "";
    const missing = pkg.items.filter(
      (item) => !optionsByValue.has(cartridgeValue(item.slug, item.variantId))
    ).length;
    const regular = pkg.items.reduce((sum, item) => {
      const opt = optionsByValue.get(cartridgeValue(item.slug, item.variantId));
      return sum + (opt?.regularPrice ?? 0) * item.quantity;
    }, 0);
    return {
      systemName: system?.name ?? `${pkg.systemSlug} (missing)`,
      size,
      missing: missing + (system ? 0 : 1),
      regular,
      totals: computePackageTotals(pkg),
    };
  }

  const filteredPackages = packages.filter((pkg) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    const systemName = productsBySlug.get(pkg.systemSlug)?.name ?? pkg.systemSlug;
    return pkg.name.toLowerCase().includes(term) || systemName.toLowerCase().includes(term);
  });

  function resetForm(pkg: CartridgePackage | null) {
    setName(pkg?.name ?? "");
    setSystemSlug(pkg?.systemSlug ?? "");
    setSystemVariantId(pkg?.systemVariantId || ALL_SIZES);
    setDeliveryFee(pkg ? String(pkg.deliveryFee) : "");
    setActive(pkg?.active ?? true);
    setRows(
      (pkg?.items ?? []).map((item) => ({
        key: newRowKey(),
        cartridge: cartridgeValue(item.slug, item.variantId),
        quantity: String(item.quantity),
        offerPrice: String(item.offerPrice),
      }))
    );
  }

  function openCreateForm() {
    setEditingPackage(null);
    resetForm(null);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  }

  function openEditForm(pkg: CartridgePackage) {
    setEditingPackage(pkg);
    resetForm(pkg);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  }

  function updateRow(key: string, patch: Partial<ItemRow>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addRow() {
    if (rows.length >= MAX_PACKAGE_ITEMS) return;
    setRows((prev) => [...prev, { key: newRowKey(), cartridge: "", quantity: "1", offerPrice: "" }]);
  }

  /** Fill the item list from the system's configured filtration stages. */
  function prefillFromStages() {
    if (!selectedSystem?.stages?.length) {
      setFormError("This system has no filtration stages configured to prefill from.");
      return;
    }
    const variant =
      systemVariantId !== ALL_SIZES
        ? selectedSystem.variants?.find((v) => v.id === systemVariantId)
        : undefined;
    const sizeKey = variant ? variant.sizeKey || selectedSystem.sizeKey || "" : "";

    const counts = new Map<string, number>();
    for (const stage of selectedSystem.stages) {
      for (const link of stage.cartridges) {
        if (sizeKey && link.variantId !== sizeKey && link.variantId !== "") continue;
        const value = cartridgeValue(link.slug, link.variantId);
        if (!optionsByValue.has(value)) continue;
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }

    if (counts.size === 0) {
      setFormError("No matching cartridges found in this system's stages.");
      return;
    }

    setFormError(null);
    setRows(
      Array.from(counts.entries())
        .slice(0, MAX_PACKAGE_ITEMS)
        .map(([value, quantity]) => {
          const opt = optionsByValue.get(value)!;
          return {
            key: newRowKey(),
            cartridge: value,
            quantity: String(quantity),
            offerPrice: opt.regularPrice > 0 ? opt.regularPrice.toFixed(2) : "",
          };
        })
    );
  }

  // Live totals preview
  const preview = useMemo(() => {
    const items = rows.map((r) => ({
      slug: "",
      variantId: "",
      quantity: parseInt(r.quantity, 10) || 0,
      offerPrice: parseFloat(r.offerPrice) || 0,
    }));
    const regular = rows.reduce(
      (sum, r, i) => sum + (optionsByValue.get(r.cartridge)?.regularPrice ?? 0) * items[i].quantity,
      0
    );
    const totals = computePackageTotals({ items, deliveryFee: parseFloat(deliveryFee) || 0 });
    return { ...totals, regular };
  }, [rows, deliveryFee, optionsByValue]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (rows.some((r) => !r.cartridge)) {
      setFormError("Choose a cartridge for every row, or remove empty rows.");
      return;
    }

    const input: PackageInput = {
      name,
      systemSlug,
      systemVariantId: systemVariantId === ALL_SIZES ? "" : systemVariantId,
      deliveryFee: Number(deliveryFee),
      active,
      items: rows.map((r) => {
        const opt = optionsByValue.get(r.cartridge)!;
        return {
          slug: opt.slug,
          variantId: opt.variantId,
          quantity: Number(r.quantity),
          offerPrice: Number(r.offerPrice),
        };
      }),
    };

    setLoading(true);
    try {
      const result = editingPackage
        ? await updatePackageAction(editingPackage.id, input)
        : await createPackageAction(input);

      if (result.success) {
        const saved = result.package;
        setPackages((prev) =>
          editingPackage ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
        );
        setFormSuccess(editingPackage ? "Package updated successfully!" : "Package created successfully!");
        setTimeout(() => {
          setIsFormOpen(false);
          setEditingPackage(null);
        }, 1000);
      } else {
        setFormError(result.error);
      }
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(pkg: CartridgePackage) {
    setTogglingId(pkg.id);
    try {
      const result = await setPackageActiveAction(pkg.id, !pkg.active);
      if (result.success) {
        setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, active: !pkg.active } : p)));
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const result = await deletePackageAction(id);
      if (result.success) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
        setDeletingPackage(null);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full h-11 px-4 bg-background border border-sidebar-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all";
  const labelClass = "text-xs font-bold text-muted-foreground uppercase tracking-wider";

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col xl:flex-row gap-3 xl:gap-4 items-start xl:items-center justify-between pb-4 xl:pb-6 border-b border-slate-800">
        <div className="space-y-0.5 sm:space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <PackageOpen className="size-5 sm:size-6 text-primary" />
            Cartridge Packages
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Sell a whole set of replacement cartridges for a system at offer prices with one delivery fee
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-stretch sm:items-center">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/70">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Search packages or systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <button
            onClick={openCreateForm}
            className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/15 transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Package list */}
      {filteredPackages.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/10 p-12 text-center text-slate-500">
          No packages yet. Click &quot;Add Package&quot; to create a whole-set cartridge bundle.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPackages.map((pkg) => {
            const info = describePackage(pkg);
            return (
              <div
                key={pkg.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          pkg.active
                            ? "inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-400 uppercase tracking-wider"
                            : "inline-flex items-center px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                        }
                      >
                        {pkg.active ? "Active" : "Hidden"}
                      </span>
                      {info.missing > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          <AlertTriangle className="size-3" />
                          {info.missing} missing product{info.missing > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{pkg.name}</h3>
                    <p className="text-xs text-slate-400">
                      {info.systemName}
                      {info.size ? ` · ${info.size}` : " · All sizes"} · {pkg.items.length} cartridge
                      {pkg.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleActive(pkg)}
                      disabled={togglingId === pkg.id}
                      className="h-7 px-2.5 inline-flex items-center justify-center rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                      title={pkg.active ? "Hide from website" : "Show on website"}
                    >
                      {pkg.active ? "Hide" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEditForm(pkg)}
                      className="size-7 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                      title="Edit package"
                    >
                      <Edit2 className="size-3" />
                    </button>
                    <button
                      onClick={() => setDeletingPackage(pkg)}
                      className="size-7 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all cursor-pointer"
                      title="Delete package"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
                  <span className="text-base font-black text-primary">
                    {formatAud(info.totals.subtotal)}
                  </span>
                  <span className="text-slate-400">
                    + GST + {formatAud(info.totals.delivery)} delivery
                  </span>
                  {info.regular > info.totals.subtotal && (
                    <span className="text-slate-500 line-through">{formatAud(info.regular)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[70] animate-fadeIn">
          <div className="absolute inset-0 -z-10" onClick={() => setIsFormOpen(false)} />

          <div className="w-full max-w-2xl bg-sidebar border-l border-sidebar-border h-full flex flex-col justify-between shadow-2xl p-4 sm:p-6 md:p-8 animate-slideLeft">
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-sidebar-border">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <PackageOpen className="size-5 text-primary" />
                  {editingPackage ? "Edit Package" : "Create Package"}
                </h3>
                <p className="text-xs text-muted-foreground/75 mt-1">
                  Offer prices and delivery fee are excl. GST. GST (10%) is added on the cartridges at checkout.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="size-8 rounded-lg border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar py-4 sm:py-6 space-y-5">
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

              {/* Name */}
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="package-name">
                  Package Name
                </label>
                <input
                  id="package-name"
                  type="text"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Whole Set of Cartridges"
                  className={inputClass}
                />
              </div>

              {/* System + size */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className={labelClass}>Filtration System</span>
                  <Select
                    value={systemSlug || null}
                    onValueChange={(val) => {
                      setSystemSlug(val || "");
                      setSystemVariantId(ALL_SIZES);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 bg-background border border-sidebar-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-all">
                      <SelectValue placeholder="Choose a system">
                        {(value: string) => productsBySlug.get(value)?.name ?? "Choose a system"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-sidebar-border rounded-xl">
                      {systems.map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <span className={labelClass}>System Size</span>
                  <Select
                    value={systemVariantId}
                    onValueChange={(val) => setSystemVariantId(val || ALL_SIZES)}
                    disabled={!selectedSystem?.variants?.length}
                  >
                    <SelectTrigger className="w-full h-11 bg-background border border-sidebar-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-all">
                      <SelectValue>
                        {(value: string) =>
                          value === ALL_SIZES
                            ? "All sizes"
                            : selectedSystem?.variants?.find((v) => v.id === value)?.label ?? value
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-sidebar-border rounded-xl">
                      <SelectItem value={ALL_SIZES}>All sizes</SelectItem>
                      {(selectedSystem?.variants ?? []).map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={labelClass}>Cartridges &amp; Offer Prices</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prefillFromStages}
                      disabled={!selectedSystem}
                      className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg border border-sidebar-border text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all disabled:opacity-40"
                      title="Replace the list with the cartridges from this system's filtration stages"
                    >
                      <Wand2 className="size-3.5" />
                      Prefill from stages
                    </button>
                    <button
                      type="button"
                      onClick={addRow}
                      disabled={rows.length >= MAX_PACKAGE_ITEMS}
                      className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg border border-sidebar-border text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all disabled:opacity-40"
                    >
                      <Plus className="size-3.5" />
                      Add cartridge
                    </button>
                  </div>
                </div>

                {rows.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-sidebar-border p-6 text-center text-xs text-muted-foreground">
                    Choose a system and use &quot;Prefill from stages&quot;, or add cartridges manually.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rows.map((row) => {
                      const opt = optionsByValue.get(row.cartridge);
                      return (
                        <div
                          key={row.key}
                          className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_5rem_7rem_auto] gap-2 items-start rounded-xl border border-sidebar-border p-2.5"
                        >
                          <div className="col-span-2 sm:col-span-1 space-y-1 min-w-0">
                            <Select
                              value={row.cartridge || null}
                              onValueChange={(val) => {
                                const next = optionsByValue.get(val || "");
                                updateRow(row.key, {
                                  cartridge: val || "",
                                  ...(next && !row.offerPrice && next.regularPrice > 0
                                    ? { offerPrice: next.regularPrice.toFixed(2) }
                                    : {}),
                                });
                              }}
                            >
                              <SelectTrigger className="w-full h-10 bg-background border border-sidebar-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition-all">
                                <SelectValue placeholder="Choose cartridge">
                                  {(value: string) => optionsByValue.get(value)?.label ?? "Choose cartridge"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-sidebar-border rounded-xl max-h-72">
                                {cartridgeOptions.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {opt && opt.regularPrice > 0 && (
                              <p className="text-[10px] text-muted-foreground pl-1">
                                Regular {formatAud(opt.regularPrice)} + GST
                              </p>
                            )}
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            step={1}
                            required
                            aria-label="Quantity"
                            value={row.quantity}
                            onChange={(e) => updateRow(row.key, { quantity: e.target.value })}
                            className="h-10 w-full px-3 bg-background border border-sidebar-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-muted-foreground">$</span>
                            <input
                              type="number"
                              min={0.01}
                              step={0.01}
                              required
                              aria-label="Offer price excl. GST"
                              placeholder="Offer"
                              value={row.offerPrice}
                              onChange={(e) => updateRow(row.key, { offerPrice: e.target.value })}
                              className="h-10 w-full pl-6 pr-2 bg-background border border-sidebar-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                            className="size-10 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all"
                            title="Remove cartridge"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Delivery + active */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor="package-delivery">
                    Delivery Fee (per order)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-sm text-muted-foreground">$</span>
                    <input
                      id="package-delivery"
                      type="number"
                      min={0}
                      step={0.01}
                      required
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      placeholder="19.00"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 rounded-xl border border-sidebar-border px-4 h-11 self-end cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="size-4 accent-primary"
                  />
                  <span className="text-xs font-bold text-foreground">Show on product page</span>
                </label>
              </div>

              {/* Totals preview */}
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Package price</span>
                  <span className="font-bold text-foreground">{formatAud(preview.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (10%)</span>
                  <span>{formatAud(preview.gst)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>{formatAud(preview.delivery)}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-primary/20 font-black text-foreground">
                  <span>Customer pays</span>
                  <span>{formatAud(preview.total)}</span>
                </div>
                {preview.regular > preview.subtotal && (
                  <p className="text-emerald-400 font-semibold pt-1">
                    Saves {formatAud(preview.regular - preview.subtotal)} vs. regular prices (
                    {formatAud(preview.regular)})
                  </p>
                )}
              </div>

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
                  disabled={loading || !systemSlug || rows.length === 0}
                  className="h-11 px-6 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center min-w-32 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="size-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : editingPackage ? (
                    "Save Changes"
                  ) : (
                    "Create Package"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingPackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-sidebar border border-sidebar-border rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="size-8 shrink-0 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-foreground">Delete package?</h3>
                <p className="text-xs text-muted-foreground/75 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed">
              &quot;<span className="font-bold text-foreground">{deletingPackage.name}</span>&quot; will be removed
              from the website immediately. Past orders keep their details.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-sidebar-border">
              <button
                type="button"
                onClick={() => setDeletingPackage(null)}
                className="h-10 px-4 rounded-xl border border-sidebar-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingPackage.id)}
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
