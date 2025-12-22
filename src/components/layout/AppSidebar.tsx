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
import { AIHubExpressLogo } from '@/components/icons';
import { categories } from '@/lib/data';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutGrid, Sparkles, Heart, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';

const mainNav = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Browse Tools', href: '/browse', icon: LayoutGrid },
  { name: 'Get Recommendations', href: '/recommendations', icon: Sparkles },
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
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  onClick={handleLinkClick}
                  asChild
                  isActive={pathname === item.href && !currentCategory && pathname !== '/favorites'}
                  tooltip={item.name}
                >
                  <a>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {user && (
            <SidebarMenuItem>
              <Link href="/favorites" passHref legacyBehavior>
                <SidebarMenuButton
                  onClick={handleLinkClick}
                  asChild
                  isActive={pathname === '/favorites'}
                  tooltip="My Favorites"
                >
                  <a>
                    <Heart />
                    <span>My Favorites</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categories.map((category) => (
              <SidebarMenuItem key={category.name}>
                <Link href={`/browse?category=${encodeURIComponent(category.name)}`} passHref legacyBehavior>
                  <SidebarMenuButton
                    onClick={handleLinkClick}
                    asChild
                    isActive={currentCategory === category.name}
                    tooltip={category.name}
                  >
                    <a>
                      <category.icon />
                      <span>{category.name}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
