"use client";

import React, { useState } from "react";
import { type Enquiry } from "@/lib/db-queries";
import { updateEnquiryStatusAction, deleteEnquiryAction } from "./actions";
import { Pagination } from "@/components/ui/pagination";
import {
  Inbox,
  Search,
  Check,
  AlertTriangle,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnquiriesClientProps {
  initialEnquiries: Enquiry[];
  canManage: boolean;
}

export function EnquiriesClient({ initialEnquiries, canManage }: EnquiriesClientProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [loading, setLoading] = useState(false);
  const [deletingEnquiry, setDeletingEnquiry] = useState<Enquiry | null>(null);

  // Filter enquiries based on search term and status dropdown
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.mobile.includes(searchTerm) ||
      enq.postcode.includes(searchTerm) ||
      (enq.installedAddress && enq.installedAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "New" && !enq.status) ||
      enq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string | null) => {
    setStatusFilter(val || "All");
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  async function handleStatusChange(id: string, newStatus: Enquiry["status"]) {
    setLoading(true);
    try {
      const result = await updateEnquiryStatusAction(id, newStatus);
      if (result.success) {
        setFaqs(
          enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // Trigger helper state mapper
  function setFaqs(updatedList: Enquiry[]) {
    setEnquiries(updatedList);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const result = await deleteEnquiryAction(id);
      if (result.success) {
        setEnquiries(enquiries.filter((e) => e.id !== id));
        setDeletingEnquiry(null);
      } else {
        alert(result.error || "Failed to delete enquiry");
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
      <div className="pb-6 border-b border-slate-800 space-y-1">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Inbox className="size-6 text-primary" />
          Customer Enquiries
        </h1>
        <p className="text-xs text-slate-500">
          {canManage
            ? "View and update lead statuses or delete entries"
            : "View and filter submitted lead enquiries (Read Only)"}
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="size-4" />
          </span>
          <input
            type="text"
            placeholder="Search leads by name, email, phone, postcode..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-all"
          />
        </div>

        {/* Status filter selector */}
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="h-10 w-44 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-slate-700 transition-all">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border border-slate-800 rounded-xl">
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enquiries table view */}
      <div className="overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Customer Details</th>
              <th className="py-4 px-6">Installed Address</th>
              <th className="py-4 px-6">Postcode</th>
              <th className="py-4 px-6">Submission Date</th>
              <th className="py-4 px-6">Status</th>
              {canManage && <th className="py-4 px-6 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {paginatedEnquiries.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="py-12 text-center text-slate-500">
                  No enquiries found matching the search criteria.
                </td>
              </tr>
            ) : (
              paginatedEnquiries.map((enq) => {
                const currentStatus = enq.status || "New";
                return (
                  <tr key={enq.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-1">
                        <span className="font-bold text-white block">{enq.name}</span>
                        <a
                          href={`mailto:${enq.email}`}
                          className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-all"
                        >
                          <Mail className="size-3" />
                          {enq.email}
                        </a>
                        <a
                          href={`tel:${enq.mobile}`}
                          className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-all"
                        >
                          <Phone className="size-3" />
                          {enq.mobile}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      {enq.installedAddress ? (
                        <span className="text-slate-300 flex items-start gap-1">
                          <MapPin className="size-3.5 shrink-0 text-slate-600 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">{enq.installedAddress}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">Not provided</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-400">{enq.postcode}</td>
                    <td className="py-4 px-6 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-slate-600" />
                        {new Date(enq.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {canManage ? (
                        <Select
                          value={currentStatus}
                          disabled={loading}
                          onValueChange={(val) =>
                            handleStatusChange(enq.id, (val || "New") as Enquiry["status"])
                          }
                        >
                          <SelectTrigger
                            className={`h-8 min-w-28 px-2.5 rounded-lg border-3 text-xs font-bold text-white focus:outline-none transition-all ${
                              currentStatus === "Resolved"
                                ? "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                                : currentStatus === "In Progress"
                                ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border border-slate-800 rounded-lg">
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            currentStatus === "Resolved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : currentStatus === "In Progress"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      )}
                    </td>
                    {canManage && (
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setDeletingEnquiry(enq)}
                          className="size-8 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all"
                          title="Delete enquiry record"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <Pagination
          totalItems={filteredEnquiries.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deletingEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="size-8 shrink-0 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-white">Delete Enquiry?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the lead record for{" "}
              <span className="font-bold text-white">{deletingEnquiry.name}</span>? This record will be deleted from the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingEnquiry(null)}
                className="h-10 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingEnquiry.id)}
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
