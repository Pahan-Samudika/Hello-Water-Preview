import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MenuIcon, SearchIcon, PhoneCall } from "lucide-react";
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

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) =>
      item.children ? (
        <DropdownMenu key={item.title}>
          <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary focus:outline-none cursor-pointer">
            {item.title}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-background/80 backdrop-blur-xl border-primary/20 min-w-[150px]"
          >
            <DropdownMenuGroup>
              {item.children.map((child) => (
                <DropdownMenuItem
                  key={child.href}
                  className="focus:bg-primary focus:text-primary cursor-pointer"
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
        <Link key={item.href} href={item.href} className="hover:text-primary">
          {item.title}
        </Link>
      )
    );

  return (
    <header className="dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.1),transparent)] sticky top-0 z-50 h-17.5 border-b border-primary/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 shadow-sm">
      <div className="mx-auto relative flex max-w-7xl items-center gap-8 px-4 py-4 sm:px-6 h-full">
        <Link href="/" className="flex items-center gap-3 lg:hidden">
          <Image src={LogoSVG} alt="Logo" className="w-5" priority />
        </Link>

        {/* Desktop Navigation - Centered Logo Layout */}
        <div className="absolute inset-x-0 hidden h-full items-center font-medium lg:flex pointer-events-none">
          <div className="flex-1 flex justify-end gap-8 lg:gap-16 pointer-events-auto pr-8 lg:pr-16">
            {renderNavItems(leftItems)}
          </div>
          <Link
            href="/"
            className="flex items-center pointer-events-auto shrink-0 transition-transform hover:scale-110"
          >
            <Image src={LogoSVG} alt="Logo" className="w-6" priority />
          </Link>
          <div className="flex-1 flex justify-start gap-8 lg:gap-16 pointer-events-auto pl-8 lg:pl-16">
            {renderNavItems(rightItems)}
          </div>
        </div>

        <div className="ml-auto relative z-10 flex items-center gap-2">
          {/* <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button> */}
          {/* <ModeToggle /> */}
          <a href="tel:0498588725"
            className="bg-primary/30 hover:bg-primary/10 inline-flex items-center px-4 py-2 text-sm font-medium rounded-full gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            1300 515 469
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="lg:hidden"
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
