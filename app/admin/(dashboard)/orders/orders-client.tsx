"use client";

import React, { useState } from "react";
import { type Order, type ShippingSettings } from "@/lib/db-queries";
import { Pagination } from "@/components/ui/pagination";
import { SmartImage } from "@/components/ui/smart-image";
import {
  updateOrderStatusAction,
  deleteOrderAction,
  updateShippingFeeAction,
} from "./actions";
import {
  ShoppingBag,
  Search,
  Filter,
  Trash2,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  DollarSign,
  Edit2,
  Info,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";

interface OrdersClientProps {
  initialOrders: Order[];
  shippingSettings: ShippingSettings;
}

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

export function OrdersClient({ initialOrders, shippingSettings }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [shippingFee, setShippingFee] = useState(shippingSettings.standardDeliveryFee);
  
  // Settings edit state
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [inputShippingFee, setInputShippingFee] = useState(shippingSettings.standardDeliveryFee.toString());
  const [savingShipping, setSavingShipping] = useState(false);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Active viewed order
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Update Standard Delivery Fee
  const handleSaveShippingFee = async (e: React.FormEvent) => {
    e.preventDefault();
    const feeNum = parseFloat(inputShippingFee);
    if (isNaN(feeNum) || feeNum < 0) {
      toast.error("Please enter a valid shipping fee.");
      return;
    }

    setSavingShipping(true);
    try {
      const res = await updateShippingFeeAction(feeNum);
      if (res.success) {
        setShippingFee(feeNum);
        setIsEditingShipping(false);
        toast.success("Standard delivery fee updated successfully!");
      } else {
        toast.error(res.error || "Failed to update shipping fee.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setSavingShipping(false);
    }
  };

  // Update Status of Selected Order
  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);

    try {
      const res = await updateOrderStatusAction(selectedOrder.id, newStatus);
      if (res.success) {
        const updated = {
          ...selectedOrder,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
        setSelectedOrder(updated);
        setOrders(orders.map((o) => (o.id === selectedOrder.id ? updated : o)));
        toast.success(`Order ${selectedOrder.id} status updated to ${newStatus}!`);
      } else {
        toast.error(res.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete Order Action
  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    setIsDeleting(true);

    try {
      const res = await deleteOrderAction(deletingOrder);
      if (res.success) {
        setOrders(orders.filter((o) => o.id !== deletingOrder));
        if (selectedOrder?.id === deletingOrder) {
          setSelectedOrder(null);
        }
        setDeletingOrder(null);
        toast.success(`Order ${deletingOrder} deleted successfully.`);
      } else {
        toast.error(res.error || "Failed to delete order.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "Processing":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "Shipped":
        return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "Completed":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "Cancelled":
        return "bg-rose-500/10 border-rose-500/20 text-rose-400";
      default:
        return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-4 md:pb-6 border-b border-slate-800">
        <div className="space-y-0.5 sm:space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="size-5 sm:size-6 text-primary" />
            Order Management
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500">
            View orders, update processing status, and edit delivery options
          </p>
        </div>

        {/* Dynamic Shipping Configuration */}
        <div className="w-full md:w-auto">
          {!isEditingShipping ? (
            <div className="flex items-center gap-4 bg-slate-900/30 border border-slate-800 rounded-2xl p-3 px-4 shadow-sm">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                  Standard Delivery Fee
                </span>
                <span className="font-bold text-sm text-primary">
                  ${shippingFee.toFixed(2)} AUD
                </span>
              </div>
              <button
                onClick={() => setIsEditingShipping(true)}
                className="size-9 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
                title="Edit Shipping Fee"
              >
                <Edit2 className="size-3.5" />
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSaveShippingFee}
              className="flex items-center gap-2 bg-slate-900/30 border border-slate-800 rounded-2xl p-2 shadow-sm animate-fadeIn"
            >
              <div className="flex flex-col px-2">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500">
                  Delivery Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={inputShippingFee}
                  onChange={(e) => setInputShippingFee(e.target.value)}
                  className="w-24 bg-transparent border-0 p-0 text-sm font-bold text-foreground focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setInputShippingFee(shippingFee.toString());
                    setIsEditingShipping(false);
                  }}
                  className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingShipping}
                  className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center cursor-pointer min-w-[50px]"
                >
                  {savingShipping ? (
                    <div className="size-3 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/75">
            <Search className="size-4" />
          </span>
          <input
            type="text"
            placeholder="Search orders by ID, name or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-11 pl-9 pr-4 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="relative sm:w-48 shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground/75">
            <Filter className="size-4" />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="w-full h-11 pl-9 pr-4 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders list layout (Desktop Table) */}
      <div className="hidden md:block overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Order Date</th>
              <th className="py-4 px-6">Customer Details</th>
              <th className="py-4 px-6">Total Paid</th>
              <th className="py-4 px-6">PayPal ID</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No orders found matching the filter criteria.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    <div className="flex flex-col">
                      <span>{order.id}</span>
                    {order.package && (
                      <span
                        className="mt-1 inline-flex w-fit items-center gap-1 rounded bg-primary/10 border border-primary/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary"
                        title={order.package.name}
                      >
                        <PackageCheck className="size-3" />
                        Package
                      </span>
                    )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{order.customer.name}</span>
                      <span className="text-xs text-slate-500 max-w-[180px] truncate" title={order.customer.email}>
                        {order.customer.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-500 truncate max-w-[120px]" title={order.payment.id}>
                    {order.payment.id}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex h-8 items-center justify-center px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          totalItems={filteredOrders.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Mobile Stacked Cards (visible only on mobile) */}
      <div className="grid gap-4 md:hidden">
        {paginatedOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 rounded-3xl border border-slate-800 bg-slate-900/10">
            No orders found matching the filter criteria.
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/20 hover:border-slate-700 transition-all flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  {order.id}
                  {order.package && (
                    <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                      <PackageCheck className="size-3" />
                      Package
                    </span>
                  )}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-white">{order.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total:</span>
                  <span className="font-bold text-primary">${order.total.toFixed(2)} AUD</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(order)}
                className="w-full h-9 inline-flex items-center justify-center rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer mt-1"
              >
                View Details
              </button>
            </div>
          ))
        )}

        <Pagination
          totalItems={filteredOrders.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Drawer: Detailed View */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-[70] animate-fadeIn">
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedOrder(null)} />

          <div className="w-full max-w-2xl bg-sidebar border-l border-sidebar-border h-full flex flex-col justify-between shadow-2xl p-4 sm:p-6 md:p-8 animate-slideLeft overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-sidebar-border gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShoppingBag className="size-5 text-primary" />
                  Order Reference: {selectedOrder.id}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="size-8 rounded-lg border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 space-y-6 py-6 overflow-y-auto pr-1 no-scrollbar">
              {/* Order Status Control */}
              <div className="rounded-2xl border border-sidebar-border bg-background/30 p-4 space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Truck className="size-3.5" />
                  Manage Order Status
                </h4>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold w-fit ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={selectedOrder.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(e.target.value as Order["status"])}
                      className="h-10 px-3 bg-background border border-sidebar-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          Mark as {status}
                        </option>
                      ))}
                    </select>
                    {updatingStatus && (
                      <div className="size-10 rounded-xl border border-sidebar-border flex items-center justify-center shrink-0">
                        <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Delivery details */}
                <div className="rounded-2xl border border-sidebar-border bg-background/30 p-5 space-y-3.5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    Delivery Information
                  </h4>
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-foreground">{selectedOrder.customer.name}</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedOrder.customer.address},<br />
                      {selectedOrder.customer.suburb}, {selectedOrder.customer.state} {selectedOrder.customer.postcode}<br />
                      Australia
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="size-3 shrink-0" />
                      <span>{selectedOrder.customer.email}</span>
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Phone className="size-3 shrink-0" />
                      <span>{selectedOrder.customer.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Payment Record */}
                <div className="rounded-2xl border border-sidebar-border bg-background/30 p-5 space-y-3.5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="size-3.5" />
                    PayPal Payment Record
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gateway Status:</span>
                      <span className="font-semibold text-emerald-400 uppercase">{selectedOrder.payment.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-mono text-foreground select-all">{selectedOrder.payment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payer Account:</span>
                      <span className="text-foreground truncate max-w-[120px] sm:max-w-[140px]" title={selectedOrder.payment.payerEmail}>
                        {selectedOrder.payment.payerEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Date:</span>
                      <span className="text-foreground">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-2xl border border-sidebar-border bg-background/30 p-5 space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-sidebar-border">
                  <ShoppingBag className="size-3.5" />
                  Cartridge Items Purchased
                </h4>

                {selectedOrder.package && (
                  <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-xs">
                    <PackageCheck className="size-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Cartridge set:</span>
                    <span className="font-bold text-foreground">{selectedOrder.package.name}</span>
                  </div>
                )}

                <div className="divide-y divide-sidebar-border/40 space-y-3.5">
                  {selectedOrder.items.map((item) => (
                    <div key={`${item.slug}-${item.variantId ?? ""}`} className="flex gap-4 pt-3.5 first:pt-0">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-sidebar-border bg-background">
                        <SmartImage
                          src={item.image}
                          alt={item.name}
                          useNextImage
                          fill
                          sizes="48px"
                          containerClassName="h-full w-full"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h5 className="font-bold text-xs text-foreground line-clamp-2" title={item.name}>
                          {item.name}
                        </h5>
                        <p className="text-[10px] text-muted-foreground">
                          {item.quantity} x {item.priceString}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-xs text-foreground shrink-0 pt-0.5">
                        ${(item.priceNumeric * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations Summary */}
                <div className="border-t border-sidebar-border pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal (excl. GST)</span>
                    <span className="font-semibold text-foreground">${selectedOrder.subtotal.toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (10%)</span>
                    <span className="font-semibold text-foreground">${selectedOrder.gst.toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Standard Delivery</span>
                    <span className="font-semibold text-foreground">${selectedOrder.shipping.toFixed(2)} AUD</span>
                  </div>
                  <div className="border-t border-sidebar-border/40 pt-2 flex justify-between text-sm font-black text-foreground">
                    <span>Grand Total</span>
                    <span className="text-primary">${selectedOrder.total.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-sidebar-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDeletingOrder(selectedOrder.id)}
                className="h-10 px-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="size-4" />
                <span>Delete Order</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="h-10 px-6 rounded-xl border border-sidebar-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[80] animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="size-8 shrink-0 text-rose-500" />
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white">Delete Order?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is permanent.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete order record{" "}
              <span className="font-bold text-white">{deletingOrder}</span>? This will wipe the transaction log from Firestore.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="h-10 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteOrder}
                className="h-10 px-4 rounded-xl bg-rose-500 text-xs font-bold text-white hover:bg-rose-600 transition-all flex items-center justify-center min-w-20 cursor-pointer"
              >
                {isDeleting ? (
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
