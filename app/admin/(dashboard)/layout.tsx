import { requireSession } from "@/lib/admin-auth";
import { SidebarNav } from "./sidebar-nav";
import { logoutAction } from "./actions";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guard the entire /admin sub-tree
  const session = await requireSession();

  return (
    <div className="dark min-h-screen md:h-screen md:overflow-hidden bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-sidebar border-b md:border-b-0 md:border-r border-sidebar-border flex flex-col justify-between shrink-0 overflow-y-auto">
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
              className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 active:scale-98 transition-all"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 md:h-full md:overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card/40 flex items-center justify-between px-6 md:px-8 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <span>Management Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-xs text-muted-foreground font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Database Connected
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto md:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
