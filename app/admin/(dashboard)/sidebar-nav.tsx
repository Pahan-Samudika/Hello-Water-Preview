"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Droplets,
  BookOpen,
  HelpCircle,
  Inbox,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  permissions: string[];
}

export function SidebarNav({ permissions }: SidebarNavProps) {
  const pathname = usePathname();

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
      show: permissions.includes("Product Management"),
    },
    {
      name: "Enquiries",
      href: "/admin/enquiries",
      icon: Inbox,
      show: permissions.includes("Enquiry View") || permissions.includes("Enquiry Management"),
    },
    {
      name: "Contact Submissions",
      href: "/admin/contacts",
      icon: PhoneCall,
      show: permissions.includes("Contact View") || permissions.includes("Contact Management"),
    },
    {
      name: "Blogs",
      href: "/admin/blogs",
      icon: BookOpen,
      show: permissions.includes("Blogs Management"),
    },
    {
      name: "FAQs",
      href: "/admin/faqs",
      icon: HelpCircle,
      show: permissions.includes("FAQs Management"),
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      show: permissions.includes("User Management"),
    },
  ];

  return (
    <nav className="space-y-1.5 px-3 py-4">
      {navigationItems
        .filter((item) => item.show)
        .map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("size-4.5 shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                <span>{item.name}</span>
              </div>
              <ChevronRight
                className={cn(
                  "size-3.5 transition-transform duration-200 opacity-0 group-hover:opacity-100",
                  isActive ? "text-white opacity-100" : "text-slate-600",
                  isActive ? "translate-x-0" : "group-hover:translate-x-0.5"
                )}
              />
            </Link>
          );
        })}
    </nav>
  );
}
