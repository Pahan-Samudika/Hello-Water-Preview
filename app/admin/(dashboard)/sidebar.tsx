"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { logoutAction } from "./actions";
import { Menu, X, LogOut, User } from "lucide-react";
import Image from "next/image";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  session: {
    name: string;
    email: string;
    permissions: string[];
  };
}

export function Sidebar({ session }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header (visible on mobile only) */}
      <header className="md:hidden h-16 w-full bg-sidebar border-b border-sidebar-border flex items-center justify-between px-6 shrink-0 z-[60] sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center bg-black rounded-full p-1.5 overflow-hidden shadow-md shrink-0">
            <Image
              src="/logo.svg"
              alt="Hello Water Filtration"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-sidebar-foreground tracking-wide truncate">Hello Water Filtration</span>
            <span className="text-[9px] text-sidebar-foreground/50 font-semibold uppercase tracking-wider truncate">Management Dashboard</span>
          </div>
        </div>

        {/* Mobile Hamburger toggle button */}
        <Button
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          size="icon"
          variant="outline"
          className="h-9 w-9 text-slate-400 hover:text-white border-sidebar-border cursor-pointer"
        >
          {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
        </Button>
      </header>

      {/* Desktop Sidebar (visible on desktop only) */}
      <aside className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border flex-col justify-between shrink-0 overflow-y-auto h-screen sticky top-0">
        <div className="flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border bg-background/40">
            <div className="flex size-9 items-center justify-center bg-black rounded-full p-1.5 overflow-hidden shadow-md shrink-0">
              <Image
                src="/logo.svg"
                alt="Hello Water Filtration"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-sidebar-foreground tracking-wide truncate">Hello Water Filtration</span>
              <span className="text-[9px] text-sidebar-foreground/50 font-semibold uppercase tracking-wider truncate">Management Dashboard</span>
            </div>
          </div>

          {/* Nav Items */}
          <SidebarNav permissions={session.permissions} />
        </div>

        {/* User Profile Summary & Logout */}
        <div className="p-4 border-t border-sidebar-border bg-background/20">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-sidebar-accent/50 transition-all mb-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground/75">
              <User className="size-4.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-sidebar-foreground truncate">{session.name}</span>
              <span className="text-[10px] text-sidebar-foreground/50 truncate">{session.email}</span>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 active:scale-98 transition-all cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Portal Navigation Dropdown (opens below header) */}
      {open && (
        <Portal className="top-16 z-50 md:hidden" id="mobile-admin-menu">
          <PortalBackdrop className="bg-background/95 backdrop-blur-sm" />
          <div className="flex-1 overflow-y-auto p-4 bg-sidebar flex flex-col justify-between border-b border-sidebar-border z-10">
            <div className="flex flex-col">
              <SidebarNav permissions={session.permissions} />
            </div>

            <div className="p-4 border-t border-sidebar-border bg-background/20 mt-6">
              <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-sidebar-accent/50 transition-all mb-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground/75">
                  <User className="size-4.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-sidebar-foreground truncate">{session.name}</span>
                  <span className="text-[10px] text-sidebar-foreground/50 truncate">{session.email}</span>
                </div>
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 active:scale-98 transition-all cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
