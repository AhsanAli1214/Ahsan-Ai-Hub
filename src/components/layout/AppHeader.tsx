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
    <header className="sticky top-0 z-[60] flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 contain-intrinsic-size-[auto_64px]">
      <div className="md:hidden flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleMobileMenuToggle}
          className="rounded-lg h-10 w-10 flex items-center justify-center"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      <h1 className="font-headline text-xl font-bold md:text-2xl flex-1 tracking-tight">{title}</h1>
      <div className={cn("ml-auto flex items-center gap-2 md:gap-4", "w-auto")}>
        <Button asChild className="md:hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2 h-10 px-3" aria-label="View AI Content Tools">
          <Link href="/content-tools" title="AI Tools">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-bold">Tools</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
