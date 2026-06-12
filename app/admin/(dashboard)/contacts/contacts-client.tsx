"use client";

import React, { useState } from "react";
import { type ContactSubmission } from "@/lib/db-queries";
import { updateContactStatusAction, deleteContactAction } from "./actions";
import {
  PhoneCall,
  Search,
  Check,
  AlertTriangle,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  X,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactsClientProps {
  initialContacts: ContactSubmission[];
  canManage: boolean;
}

export function ContactsClient({ initialContacts, canManage }: ContactsClientProps) {
  const [contacts, setContacts] = useState<ContactSubmission[]>(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [loading, setLoading] = useState(false);
  const [deletingContact, setDeletingContact] = useState<ContactSubmission | null>(null);
  const [viewingContact, setViewingContact] = useState<ContactSubmission | null>(null);

  // Filter contacts by search query and status
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.suburb && c.suburb.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "New" && !c.status) ||
      c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function handleStatusChange(id: string, newStatus: ContactSubmission["status"]) {
    setLoading(true);
    try {
      const result = await updateContactStatusAction(id, newStatus);
      if (result.success) {
        setContactsState(
          contacts.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
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

  function setContactsState(updatedList: ContactSubmission[]) {
    setContacts(updatedList);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const result = await deleteContactAction(id);
      if (result.success) {
        setContacts(contacts.filter((c) => c.id !== id));
        setDeletingContact(null);
      } else {
        alert(result.error || "Failed to delete contact submission");
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
          <PhoneCall className="size-6 text-primary" />
          Contact Submissions
        </h1>
        <p className="text-xs text-slate-500">
          {canManage
            ? "View customer messages and update contact statuses"
            : "View submitted feedback and customer questions (Read Only)"}
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
            placeholder="Search contacts by name, email, suburb, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-all"
          />
        </div>

        {/* Status filter selector */}
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "All")}>
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

      {/* Contacts list table */}
      <div className="overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Sender Account</th>
              <th className="py-4 px-6">Suburb</th>
              <th className="py-4 px-6">Message Preview</th>
              <th className="py-4 px-6">Submission Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="py-12 text-center text-slate-500">
                  No contact form submissions recorded.
                </td>
              </tr>
            ) : (
              filteredContacts.map((c) => {
                const currentStatus = c.status || "New";
                return (
                  <tr key={c.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-1">
                        <span className="font-bold text-white block">{c.name}</span>
                        <a
                          href={`mailto:${c.email}`}
                          className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-all"
                        >
                          <Mail className="size-3" />
                          {c.email}
                        </a>
                        {c.phone && (
                          <a
                            href={`tel:${c.phone}`}
                            className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-all"
                          >
                            <Phone className="size-3" />
                            {c.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {c.suburb ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5 text-slate-600" />
                          {c.suburb}
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">Not provided</span>
                      )}
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <span className="text-slate-400 block truncate leading-relaxed">
                        {c.message}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-slate-600" />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {canManage ? (
                        <Select
                          value={currentStatus}
                          disabled={loading}
                          onValueChange={(val) =>
                            handleStatusChange(c.id, (val || "New") as ContactSubmission["status"])
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
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingContact(c)}
                          className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                          title="Read message content"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        {canManage && (
                          <button
                            onClick={() => setDeletingContact(c)}
                            className="size-8 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all"
                            title="Delete submission record"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Message Reader Modal */}
      {viewingContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare className="size-5" />
                <h3 className="text-base font-bold text-white">Customer Message</h3>
              </div>
              <button
                onClick={() => setViewingContact(null)}
                className="size-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Sender</span>
                  <span className="text-sm font-bold text-white block">{viewingContact.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Date Submitted</span>
                  <span className="text-sm font-semibold text-slate-300 block">
                    {new Date(viewingContact.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Email</span>
                  <a href={`mailto:${viewingContact.email}`} className="text-sm text-primary hover:underline block truncate">
                    {viewingContact.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Phone / Mobile</span>
                  {viewingContact.phone ? (
                    <a href={`tel:${viewingContact.phone}`} className="text-sm text-primary hover:underline block">
                      {viewingContact.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500 italic block">Not provided</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Full Message Body</span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {viewingContact.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="h-10 px-6 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="size-8 shrink-0 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-white">Delete Submission?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the message submission from{" "}
              <span className="font-bold text-white">{deletingContact.name}</span>? This record will be deleted from the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingContact(null)}
                className="h-10 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingContact.id)}
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
