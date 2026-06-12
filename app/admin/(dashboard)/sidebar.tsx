"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { logoutAction } from "./actions";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Droplets,
  Inbox,
  PhoneCall,
  BookOpen,
  HelpCircle,
  Users,
  Smartphone
} from "lucide-react";
import { usePwa } from "@/hooks/use-pwa";
import Image from "next/image";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const { isInstallable, installPwa } = usePwa();

  const navigationItems = [
    {
      name: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Droplets,
      show: session.permissions.includes("Product Management"),
    },
    {
      name: "Enquiries",
      href: "/admin/enquiries",
      icon: Inbox,
      show: session.permissions.includes("Enquiry View") || session.permissions.includes("Enquiry Management"),
    },
    {
      name: "Contacts",
      href: "/admin/contacts",
      icon: PhoneCall,
      show: session.permissions.includes("Contact View") || session.permissions.includes("Contact Management"),
    },
    {
      name: "Blogs",
      href: "/admin/blogs",
      icon: BookOpen,
      show: session.permissions.includes("Blogs Management"),
    },
    {
      name: "FAQs",
      href: "/admin/faqs",
      icon: HelpCircle,
      show: session.permissions.includes("FAQs Management"),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      show: session.permissions.includes("User Management"),
    },
  ];

  const visibleItems = navigationItems.filter((item) => item.show);
  const displayItems = visibleItems.length <= 5 ? visibleItems : visibleItems.slice(0, 4);
  const showMoreButton = visibleItems.length > 5;

  // Close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header (visible on mobile only) */}
      <header className="md:hidden h-16 w-full bg-sidebar border-b border-sidebar-border flex items-center justify-between px-6 shrink-0 z-[60] fixed top-0 left-0">
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
        <Portal className="top-16 bottom-16 z-50 md:hidden" id="mobile-admin-menu">
          <PortalBackdrop className="bg-background/95 backdrop-blur-sm" />
          <div className="flex-1 overflow-y-auto p-4 bg-sidebar flex flex-col justify-between border-b border-sidebar-border z-10">
            <div className="flex flex-col">
              <SidebarNav permissions={session.permissions} />
            </div>

            <div className="p-4 border-t border-sidebar-border bg-background/20 mt-6">
              {isInstallable && (
                <button
                  type="button"
                  onClick={installPwa}
                  className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 text-xs font-bold text-primary hover:bg-primary/10 active:scale-98 transition-all cursor-pointer mb-3"
                >
                  <Smartphone className="size-3.5 text-primary animate-pulse" />
                  <span>Install Web App</span>
                </button>
              )}

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

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[calc(4.75rem+env(safe-area-inset-bottom))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-sidebar border-t border-sidebar-border md:hidden flex items-center justify-around z-[55] px-2 shadow-2xl">
        {displayItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 transition-all relative h-full",
                isActive ? "text-primary font-bold" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <item.icon className={cn("size-5 mb-0.5", isActive ? "text-primary" : "text-slate-500")} />
              <span className="text-[9px] uppercase tracking-wider font-bold truncate max-w-full px-1">{item.name}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
              )}
            </Link>
          );
        })}

        {showMoreButton && (
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-all relative h-full cursor-pointer",
              open ? "text-primary font-bold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {open ? (
              <X className="size-5 mb-0.5 text-primary" />
            ) : (
              <Menu className="size-5 mb-0.5 text-slate-500" />
            )}
            <span className="text-[9px] uppercase tracking-wider font-bold truncate max-w-full px-1">
              {open ? "Close" : "More"}
            </span>
            {open && (
              <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
            )}
          </button>
        )}
      </div>
    </>
  );
}
