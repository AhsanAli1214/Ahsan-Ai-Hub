'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Menu, PenTool } from 'lucide-react';
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
        <Button asChild variant="outline" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all group border-primary/20 h-9" title="Tools">
          <Link href="/content-tools">
            <PenTool className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Tools</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
