
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, PenTool, Settings, MoreVertical } from 'lucide-react';
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
  { href: '/content-tools', icon: PenTool, label: 'Tools' },
];

const moreItems = [
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/about', icon: Home, label: 'About' },
  { href: '/faq', icon: Home, label: 'FAQ' },
  { href: '/contact', icon: Home, label: 'Contact' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleSettingsClick = () => {
    setOpenMobile(true);
  };

  return (
    <nav className="btm-nav md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            href={item.href} 
            key={item.href} 
            className={cn(
              "btm-nav-item transition-all duration-200",
              isActive && "btm-nav-item-active"
            )}
          >
            <div className="flex items-center justify-center">
              <item.icon className={cn("transition-all duration-200", isActive ? "h-6 w-6" : "h-5 w-5")} />
            </div>
            <span className="btm-nav-label text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="btm-nav-item transition-all duration-200 hover:bg-accent/50 rounded-lg"
            aria-label="More options"
          >
            <div className="flex items-center justify-center">
              <MoreVertical className="h-5 w-5" />
            </div>
            <span className="btm-nav-label text-xs font-medium">More</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-20">
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/about" className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              About
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/faq" className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              FAQ
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/contact" className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              Contact
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
