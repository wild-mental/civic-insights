'use client';

import Link from 'next/link';
import { Newspaper, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
  { href: '/archive', label: '콘텐츠 아카이브' },
  { href: '/subscribe', label: '소개 및 구독' },
];

export default function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn(
          'text-base font-medium',
          pathname === href ? 'text-primary hover:text-primary' : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => setIsSheetOpen(false)}
      >
        {label}
      </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" passHref>
          <Newspaper className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Civic Insights
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(link => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col p-4">
                <div className='flex justify-between items-center mb-6'>
                    <Link href="/" className="flex items-center gap-2" passHref onClick={() => setIsSheetOpen(false)}>
                        <Newspaper className="h-6 w-6 text-primary" />
                        <span className="font-headline text-xl font-bold text-foreground">
                        Civic Insights
                        </span>
                    </Link>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetClose>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-lg font-medium p-2 rounded-md',
                        pathname === link.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
                      )}
                       onClick={() => setIsSheetOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
