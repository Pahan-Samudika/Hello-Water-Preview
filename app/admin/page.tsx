import { requireSession } from "@/lib/admin-auth";
import { getProducts, getBlogs, getEnquiries, getContacts } from "@/lib/db-queries";
import { Inbox, PhoneCall, Droplets, BookOpen, Clock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await requireSession();
  const { error } = await searchParams;

  // Fetch metrics and records concurrently
  const [products, blogs, enquiries, contacts] = await Promise.all([
    getProducts(),
    getBlogs(),
    getEnquiries(),
    getContacts(),
  ]);

  const canViewEnquiries =
    session.permissions.includes("Enquiry View") ||
    session.permissions.includes("Enquiry Management");

  const canViewContacts =
    session.permissions.includes("Contact View") ||
    session.permissions.includes("Contact Management");

  // Get recent 5 items for preview
  const recentEnquiries = enquiries.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  const stats = [
    {
      name: "Total Enquiries",
      value: canViewEnquiries ? enquiries.length : "Locked",
      icon: Inbox,
      href: canViewEnquiries ? "/admin/enquiries" : null,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      name: "Contact Forms",
      value: canViewContacts ? contacts.length : "Locked",
      icon: PhoneCall,
      href: canViewContacts ? "/admin/contacts" : null,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      name: "Products Count",
      value: products.length,
      icon: Droplets,
      href: session.permissions.includes("Product Management") ? "/admin/products" : null,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      name: "Blog Articles",
      value: blogs.length,
      icon: BookOpen,
      href: session.permissions.includes("Blogs Management") ? "/admin/blogs" : null,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Alert message if redirected due to unauthorized access */}
      {error === "Unauthorized" && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-300 flex items-center gap-3 animate-shake">
          <AlertCircle className="size-5 shrink-0 text-rose-400" />
          <span className="font-semibold">Access Denied: You do not have permission to view that page.</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-8 overflow-hidden">
        <div className="absolute top-0 right-0 size-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Welcome back, {session.name}!
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            Manage your store configuration, publish blog posts, respond to enquiries, and coordinate team permissions from this centralized administrative console.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            {session.permissions.map((perm) => (
              <span
                key={perm}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 tracking-wide uppercase"
              >
                <ShieldCheck className="size-3 text-emerald-400" />
                {perm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const CardContent = (
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-all hover:border-slate-700 flex items-center justify-between group cursor-pointer">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.name}
                </p>
                <p className="text-2xl font-black text-white group-hover:scale-102 transition-transform origin-left">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-2xl border ${stat.color} transition-all`}>
                <stat.icon className="size-5" />
              </div>
            </div>
          );

          if (stat.href) {
            return (
              <Link key={stat.name} href={stat.href}>
                {CardContent}
              </Link>
            );
          }

          return <div key={stat.name} className="opacity-75 cursor-not-allowed">{CardContent}</div>;
        })}
      </div>

      {/* Recent submissions grid */}
      {(canViewEnquiries || canViewContacts) && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Enquiries panel */}
          {canViewEnquiries && (
            <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Recent Enquiries</h3>
                  <p className="text-xs text-slate-500">Latest submissions from lead generation</p>
                </div>
                <Link
                  href="/admin/enquiries"
                  className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
                >
                  View All
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {recentEnquiries.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                  <Inbox className="size-8 opacity-45" />
                  No enquiries recorded.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEnquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 flex items-center justify-between"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-bold text-white truncate">{enquiry.name}</p>
                        <p className="text-xs text-slate-500 truncate">{enquiry.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0 pl-4">
                        <span className="text-[10px] text-slate-600 flex items-center gap-1 font-semibold">
                          <Clock className="size-3" />
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            enquiry.status === "Resolved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : enquiry.status === "In Progress"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {enquiry.status || "New"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contact Submissions panel */}
          {canViewContacts && (
            <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Recent Contacts</h3>
                  <p className="text-xs text-slate-500">Latest submissions from standard contact forms</p>
                </div>
                <Link
                  href="/admin/contacts"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold hover:underline"
                >
                  View All
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {recentContacts.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
                  <PhoneCall className="size-8 opacity-45" />
                  No contact submissions recorded.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 flex items-center justify-between"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-bold text-white truncate">{contact.name}</p>
                        <p className="text-xs text-slate-500 truncate">{contact.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0 pl-4">
                        <span className="text-[10px] text-slate-600 flex items-center gap-1 font-semibold">
                          <Clock className="size-3" />
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            contact.status === "Resolved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : contact.status === "In Progress"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {contact.status || "New"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
