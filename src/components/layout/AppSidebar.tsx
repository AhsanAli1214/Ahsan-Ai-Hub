'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { AhsanAiHubLogo } from '@/components/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Home, Info, Mail, PenTool, HelpCircle, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';

const mainNav = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'AI Chat', href: '/recommendations', icon: Sparkles },
  { name: 'Content Tools', href: '/content-tools', icon: PenTool },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2">
          <AhsanAiHubLogo className="h-8 w-8" />
          <span className="font-headline text-lg font-semibold">Ahsan Ai Hub</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={handleLinkClick}
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
