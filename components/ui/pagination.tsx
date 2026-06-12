"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Safeguard: if currentPage is out of bounds, trigger a correction
  React.useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [totalPages, currentPage, onPageChange]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const pageBuffer = 1; // Number of pages to show on either side of current page

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show left ellipsis if needed
      if (currentPage - pageBuffer > 2) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - pageBuffer);
      const end = Math.min(totalPages - 1, currentPage + pageBuffer);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Show right ellipsis if needed
      if (currentPage + pageBuffer < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/10 backdrop-blur-md rounded-b-[1.5rem]",
        className
      )}
    >
      {/* Items count & size selector */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-white">{startItem}</span> to{" "}
          <span className="font-bold text-white">{endItem}</span> of{" "}
          <span className="font-bold text-white">{totalItems}</span> entries
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <span className="text-[11px] text-slate-500 font-medium">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => onPageSizeChange(Number(val))}
            >
              <SelectTrigger size="sm" className="h-7 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 gap-1 pl-2 pr-1.5 focus:outline-none focus:border-slate-700 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border border-slate-800 rounded-lg min-w-[70px]">
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1.5">
        {/* Go to First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
          title="First Page"
        >
          <ChevronsLeft className="size-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
          title="Previous Page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="size-8 inline-flex items-center justify-center text-xs font-semibold text-slate-600 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "size-8 text-xs font-bold rounded-lg transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                    : "border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
          title="Next Page"
        >
          <ChevronRight className="size-4" />
        </button>

        {/* Go to Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
          title="Last Page"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
