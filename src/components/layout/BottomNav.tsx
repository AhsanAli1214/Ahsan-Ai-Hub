
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, PenTool, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/recommendations', icon: Sparkles, label: 'AI Chat' },
  { href: '/content-tools', icon: PenTool, label: 'Tools' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

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
    </nav>
  );
}
