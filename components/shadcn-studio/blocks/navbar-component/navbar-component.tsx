import Image from 'next/image'
import Link from 'next/link'
import { MenuIcon, SearchIcon } from 'lucide-react'

import LogoSVG from '@/assets/svg/logo.svg'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type NavigationItem = {
  title: string
  href: string
}[]

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  const midpoint = Math.ceil(navigationData.length / 2)
  const leftItems = navigationData.slice(0, midpoint)
  const rightItems = navigationData.slice(midpoint)

  return (
    <header className='bg-background/55 sticky top-0 z-50 border-b border-white/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.45)]'>
      <div className='mx-auto flex w-full items-center justify-between gap-8 px-4 py-4 sm:px-6'>
        <div className='text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16'>
          {leftItems.map((item) => (
            <Link key={item.href} href={item.href} className='hover:text-primary max-md:hidden'>
              {item.title}
            </Link>
          ))}
          <Link href='/' className='flex items-center gap-3'>
            <Image src={LogoSVG} alt='Logo' className='w-5' priority />
          </Link>
          {rightItems.map((item) => (
            <Link key={item.href} href={item.href} className='hover:text-primary max-md:hidden'>
              {item.title}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-6'>
          <Button variant='ghost' size='icon'>
            <SearchIcon />
            <span className='sr-only'>Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className='md:hidden' render={<Button variant='outline' size='icon' />}><MenuIcon /><span className='sr-only'>Menu</span></DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end'>
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link href={item.href} className='w-full'>
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
  )
}

export default Navbar
