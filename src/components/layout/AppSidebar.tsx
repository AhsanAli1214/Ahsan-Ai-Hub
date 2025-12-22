'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { AhsanAILogo, AIHubExpressLogo } from '@/components/icons';
import { categories } from '@/lib/data';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutGrid, Sparkles, Heart, Home, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';

const mainNav = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Browse Tools', href: '/browse', icon: LayoutGrid },
  { name: 'AI Chat', href: '/recommendations', icon: Sparkles },
  { name: 'About', href: '/about', icon: Info },
];

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2">
          <AIHubExpressLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-semibold">AI Hub Express</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={handleLinkClick}
                asChild
                isActive={pathname === item.href && !currentCategory && pathname !== '/favorites'}
                tooltip={item.name}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLinkClick}
                asChild
                isActive={pathname === '/favorites'}
                tooltip="My Favorites"
              >
                <Link href="/favorites">
                  <Heart />
                  <span>My Favorites</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categories.map((category) => (
              <SidebarMenuItem key={category.name}>
                <SidebarMenuButton
                  onClick={handleLinkClick}
                  asChild
                  isActive={currentCategory === category.name}
                  tooltip={category.name}
                >
                  <Link href={`/browse?category=${encodeURIComponent(category.name)}`}>
                    <category.icon />
                    <span>{category.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
