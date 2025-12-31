'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AppHeader({ title }: { title: string }) {
  const { setOpenMobile } = useSidebar();

  const handleMobileMenuToggle = () => {
    setOpenMobile(true);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 contain-intrinsic-size-[auto_64px]">
      <div className="md:hidden flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleMobileMenuToggle}
          className="rounded-lg"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <h1 className="font-headline text-xl font-semibold md:text-2xl">{title}</h1>
      <div className={cn("ml-auto flex items-center gap-2 md:gap-4", "w-auto")}>
        <Button asChild className="md:hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2">
          <Link href="/content-tools" title="AI Tools">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold">Tools</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
