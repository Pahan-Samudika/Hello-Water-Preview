import { requireSession } from "@/lib/admin-auth";
import { Sidebar } from "./sidebar";

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
      <Sidebar session={session} />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 md:h-full md:overflow-hidden pt-16 md:pt-0">
        {/* Top Navbar (Desktop only) */}
        <header className="hidden md:flex h-16 border-b border-border bg-card/40 items-center justify-between px-6 md:px-8 backdrop-blur-md sticky top-0 z-30">
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
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 sm:pb-28 md:pb-8 max-w-7xl w-full mx-auto md:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
