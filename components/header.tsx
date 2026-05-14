"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { PhoneCall, ChevronDown } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";

import LogoSVG from "@/assets/svg/logo.svg";
import TxtLogoSVG from "@/assets/svg/txtlogo-white.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavItem = {
  title: string;
  href: string;
  children?: {
    title: string;
    href: string;
  }[];
};

export const navigationData: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "About Us",
    href: "/about-us",
    children: [
      { title: "Who We Are", href: "/about-us" },
      { title: "FAQs", href: "/faq" },
      { title: "Benefits", href: "/benefits" },
      { title: "Technology", href: "/technology" },
      { title: "Certifications", href: "/certifications" },
    ],
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <>
      <div className="h-18 md:h-16" />
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ease-out",
          {
            "":
              scrolled,
          }
        )}
      >
        <header
          className={cn(
            "mx-auto w-full max-w-7xl bg-base-100 border-transparent border-b md:rounded-full md:border md:transition-all md:ease-out",
            {
              "bg-base-300 backdrop-blur-sm supports-backdrop-filter:bg-background/80 border-border md:mt-2 md:max-w-6xl md:shadow":
                scrolled,
            }
          )}
        >
          <nav
            className={cn(
              "relative flex h-18 w-full items-center justify-between px-4 md:h-16 md:px-8 md:transition-all md:ease-out",
              {
                "md:px-4": scrolled,
              }
            )}
          >
            {/* Left: Text Logo (Mobile & Desktop) */}
            <div className="z-10 flex flex-1 justify-start">
              <Link
                href="/"
                className="flex items-center rounded-md p-2"
              >
                <Image src={TxtLogoSVG} alt="Hello Water Filtration" className="h-4.5 w-auto md:h-5" priority />
              </Link>
            </div>

            {/* Center: Droplet Logo (Mobile & Desktop) */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <Link href="/">
                <Image src={LogoSVG} alt="HelloWater Logo" className="h-9 w-auto" priority />
              </Link>
            </div>

            {/* Right: Desktop nav links + Phone CTA / Mobile Hamburger */}
            <div className="z-10 flex flex-1 items-center justify-end gap-2 md:gap-4">
              {/* Desktop nav links */}
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex items-center">
                  {navigationData.map((item) =>
                    item.children ? (
                      <DropdownMenu key={item.title}>
                        <DropdownMenuTrigger
                          className="flex items-center gap-1 cursor-pointer"
                          render={<Button size="sm" variant="ghost" />}
                        >
                          {item.title}
                          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="bg-background/80 backdrop-blur-xl border-primary/20 min-w-[150px]"
                        >
                          <DropdownMenuGroup>
                            {item.children.map((child) => (
                              <DropdownMenuItem
                                key={child.href}
                                className="cursor-pointer"
                              >
                                <Link href={child.href} className="w-full">
                                  {child.title}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        key={item.href}
                        size="sm"
                        variant="ghost"
                        render={<Link href={item.href} />}
                        nativeButton={false}
                      >
                        {item.title}
                      </Button>
                    )
                  )}
                </div>
                <a
                  href="tel:1300515469"
                  className="bg-primary/30 hover:bg-primary/10 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  1300 515 469
                </a>
              </div>

              {/* Mobile nav */}
              <MobileNav />
            </div>
          </nav>
        </header>
      </div>
    </>
  );
}

