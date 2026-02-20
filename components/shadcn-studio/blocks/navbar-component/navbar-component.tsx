import Image from "next/image";
import Link from "next/link";
import { MenuIcon, SearchIcon, ShoppingCart } from "lucide-react";
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

type NavigationItem = {
  title: string;
  href: string;
}[];

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  const midpoint = Math.ceil(navigationData.length / 2);
  const leftItems = navigationData.slice(0, midpoint);
  const rightItems = navigationData.slice(midpoint);

  return (
    <header className="dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.1),transparent)] fixed sticky top-0 z-50 h-17.5  border-b border-secondary backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 shadow-sm">
      <div className="mx-auto relative flex w-full items-center gap-8 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 md:hidden">
          <Image src={LogoSVG} alt="Logo" className="w-5" priority />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 font-medium md:flex lg:gap-16">
          {leftItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
          <Link href="/" className="flex items-center gap-3">
            <Image src={LogoSVG} alt="Logo" className="w-5" priority />
          </Link>
          {rightItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart />
            <span className="sr-only">Cart</span>
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
                  <DropdownMenuItem key={index}>
                    <Link href={item.href} className="w-full">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
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
