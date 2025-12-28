'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Menu, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AppHeader({ title }: { title: string }) {
  const { setOpenMobile } = useSidebar();

  const handleMobileMenuToggle = () => {
    setOpenMobile(true);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleMobileMenuToggle}
          className="rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <h1 className="font-headline text-xl font-semibold md:text-2xl">{title}</h1>
      <div className={cn("ml-auto flex items-center gap-2 md:gap-4", "w-auto")}>
        <Button asChild variant="ghost" size="icon" className="md:hidden rounded-lg">
          <Link href="/content-tools" title="Tools">
            <Wrench className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
