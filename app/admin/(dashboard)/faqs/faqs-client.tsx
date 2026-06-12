"use client";

import React, { useState } from "react";
import { type FAQ } from "@/lib/db-queries";
import { createFAQAction, updateFAQAction, deleteFAQAction } from "./actions";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Check,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const FAQ_CATEGORIES = [
  "Product & Benefits",
  "Installation",
  "Maintenance & Service",
  "Cost & Warranty",
  "About Hello Water",
];

interface FAQsClientProps {
  initialFAQs: FAQ[];
}

export function FAQsClient({ initialFAQs }: FAQsClientProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [deletingFAQ, setDeletingFAQ] = useState<FAQ | null>(null);

  // Filter FAQs by search term and selected category
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFAQs = filteredFAQs.slice(startIndex, endIndex);

  function openCreateForm() {
    setEditingFAQ(null);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  }

  function openEditForm(faq: FAQ) {
    setEditingFAQ(faq);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData(event.currentTarget);
    const category = formData.get("category") as string;
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    try {
      let result;
      if (editingFAQ) {
        result = await updateFAQAction(editingFAQ.id, null, formData);
      } else {
        result = await createFAQAction(null, formData);
      }

      if (result.success) {
        setFormSuccess(
          editingFAQ ? "FAQ updated successfully!" : "New FAQ created successfully!"
        );

        if (editingFAQ) {
          setFaqs(
            faqs.map((f) =>
              f.id === editingFAQ.id ? { ...f, category, question, answer } : f
            )
          );
        } else {
          // Add newly created FAQ to state. Since id is generated on server, we do a fallback or fetch.
          // For immediate UI update, we can generate a temporary id or append.
          setFaqs([
            ...faqs,
            {
              id: Date.now().toString(), // temporary ID, will sync on reload
              category,
              question,
              answer,
            },
          ]);
        }

        setTimeout(() => {
          setIsFormOpen(false);
          setEditingFAQ(null);
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

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const result = await deleteFAQAction(id);
      if (result.success) {
        setFaqs(faqs.filter((f) => f.id !== id));
        setDeletingFAQ(null);
      } else {
        alert(result.error || "Failed to delete FAQ");
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
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <HelpCircle className="size-6 text-primary" />
            FAQs Management
          </h1>
          <p className="text-xs text-slate-500">
            Create and edit questions & answers for the dynamic FAQ page
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Search FAQs by keywords..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-all"
            />
          </div>

          {/* Category selector */}
          <Select
            value={selectedCategory}
            onValueChange={(val) => handleCategoryFilterChange(val || "All")}
          >
            <SelectTrigger className="h-10 w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-slate-700 transition-all shrink-0">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border border-slate-800 rounded-xl">
              <SelectItem value="All">All Categories</SelectItem>
              {FAQ_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={openCreateForm}
            className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/15 transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* FAQs list rendering */}
      {filteredFAQs.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/10 p-12 text-center text-slate-500">
          No FAQs match the search filters. Click &quot;Add FAQ&quot; to write one.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {paginatedFAQs.map((faq) => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/20 flex flex-col justify-between hover:bg-slate-900 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditForm(faq)}
                        className="size-7 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title="Edit FAQ"
                      >
                        <Edit2 className="size-3" />
                      </button>
                      <button
                        onClick={() => setDeletingFAQ(faq)}
                        className="size-7 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all"
                        title="Delete FAQ"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white leading-snug">{faq.question}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line truncate-3-lines">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            totalItems={filteredFAQs.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[4, 8, 12, 20]}
            className="rounded-2xl border border-slate-800 bg-slate-900/20"
          />
        </div>
      )}

      {/* Drawer overlay form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 animate-fadeIn">
          <div className="absolute inset-0 -z-10" onClick={() => setIsFormOpen(false)} />

          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl p-6 md:p-8 animate-slideLeft">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="size-5 text-primary" />
                  {editingFAQ ? "Edit FAQ Details" : "Create New FAQ"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {editingFAQ ? "Update questionnaire items" : "Configure question and answer details"}
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

              <div className="space-y-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-category">
                    Category Group
                  </label>
                  <Select
                    name="category"
                    defaultValue={editingFAQ?.category || FAQ_CATEGORIES[0]}
                  >
                    <SelectTrigger className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border border-slate-800 rounded-xl">
                      {FAQ_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-question">
                    Question Text
                  </label>
                  <input
                    id="form-question"
                    name="question"
                    type="text"
                    required
                    defaultValue={editingFAQ?.question || ""}
                    placeholder="Enter question..."
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Answer */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-answer">
                    Detailed Answer
                  </label>
                  <textarea
                    id="form-answer"
                    name="answer"
                    required
                    defaultValue={editingFAQ?.answer || ""}
                    placeholder="Provide a comprehensive answer description..."
                    rows={8}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all resize-y"
                  />
                </div>
              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3 mt-6">
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
                  ) : editingFAQ ? (
                    "Save Changes"
                  ) : (
                    "Create FAQ"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingFAQ && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="size-8 shrink-0 text-rose-500" />
              <div>
                <h3 className="text-base font-bold text-white">Delete FAQ?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the FAQ: &quot;
              <span className="font-bold text-white">{deletingFAQ.question}</span>&quot;? This Q&amp;A
              will be immediately removed from the public website layout.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingFAQ(null)}
                className="h-10 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingFAQ.id)}
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
