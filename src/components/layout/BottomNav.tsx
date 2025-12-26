
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, PenTool, Settings, MoreVertical, History, Info, Mail, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/recommendations', icon: Sparkles, label: 'AI Chat' },
  { href: '/chat-history', icon: History, label: 'History' },
];

const moreItems = [
  { href: '/content-tools', icon: PenTool, label: 'Tools' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/about', icon: Info, label: 'About' },
  { href: '/faq', icon: HelpCircle, label: 'FAQ' },
  { href: '/contact', icon: Mail, label: 'Contact' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="btm-nav md:hidden border-t bg-background/80 backdrop-blur-lg safe-area-bottom h-20">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            href={item.href} 
            key={item.href} 
            className={cn(
              "btm-nav-item transition-all duration-300 flex flex-col items-center justify-center gap-1",
              isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex items-center justify-center rounded-2xl p-2 transition-all duration-300",
              isActive && "bg-primary/10 shadow-sm scale-110"
            )}>
              <item.icon className={cn("transition-all duration-300", isActive ? "h-6 w-6" : "h-5 w-5")} />
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-60")}>
              {item.label}
            </span>
          </Link>
        );
      })}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="btm-nav-item transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:bg-accent/50"
            aria-label="More options"
          >
            <div className="flex items-center justify-center p-2">
              <MoreVertical className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">More</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-56 mb-4 p-2 rounded-[2rem] border-primary/20 bg-background/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
          {moreItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-primary/10 transition-colors group">
                <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
