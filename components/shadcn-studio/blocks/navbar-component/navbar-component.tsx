import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MenuIcon, SearchIcon } from "lucide-react";
import { ModeToggle } from "@/components/custom/theme-button";

import LogoSVG from "@/assets/svg/logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  title: string;
  href: string;
  children?: {
    title: string;
    href: string;
  }[];
};

const Navbar = ({ navigationData }: { navigationData: NavItem[] }) => {
  const midpoint = Math.ceil(navigationData.length / 2);
  const leftItems = navigationData.slice(0, midpoint);
  const rightItems = navigationData.slice(midpoint);

  return (
    <header className="dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.1),transparent)] fixed sticky top-0 z-50 h-17.5 border-b border-primary/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 shadow-sm">
      <div className="mx-auto relative flex max-w-7xl items-center gap-8 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 md:hidden">
          <Image src={LogoSVG} alt="Logo" className="w-5" priority />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 font-medium md:flex lg:gap-16">
          {leftItems.map((item) => (
            item.children ? (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary focus:outline-none cursor-pointer">
                  {item.title}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background/80 backdrop-blur-xl border-primary/20 min-w-[150px]">
                  <DropdownMenuGroup>
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} className="focus:bg-primary/10">
                        <Link href={child.href} className="w-full">
                          {child.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-primary"
              >
                {item.title}
              </Link>
            )
          ))}
          <Link href="/" className="flex items-center gap-3">
            <Image src={LogoSVG} alt="Logo" className="w-5" priority />
          </Link>
          {rightItems.map((item) => (
            item.children ? (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary focus:outline-none cursor-pointer">
                  {item.title}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background/80 backdrop-blur-xl border-primary/20 min-w-[150px]">
                  <DropdownMenuGroup>
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} className="focus:bg-primary/10">
                        <Link href={child.href} className="w-full">
                          {child.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-primary"
              >
                {item.title}
              </Link>
            )
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              className="md:hidden"
              render={<Button variant="outline" size="icon" />}
            >
              <MenuIcon />
              <span className="sr-only">Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <div key={index}>
                    <DropdownMenuItem>
                      <Link href={item.href} className="w-full font-semibold">
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                    {item.children?.map((child, childIndex) => (
                      <DropdownMenuItem key={`${index}-${childIndex}`} className="pl-6 opacity-80">
                        <Link href={child.href} className="w-full">
                          {child.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
