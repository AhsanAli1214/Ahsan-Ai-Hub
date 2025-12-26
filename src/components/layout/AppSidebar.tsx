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
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Home, Info, Mail, PenTool, HelpCircle, Settings, Clock, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useChatHistory } from '@/context/ChatHistoryContext';

import { ChatHistory } from '@/components/ChatHistory';

const mainNav = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'AI Chat', href: '/recommendations', icon: Sparkles },
  { name: 'Content Tools', href: '/content-tools', icon: PenTool },
  { name: 'History', href: '/chat-history', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: Mail },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  const { createSession } = useChatHistory();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleNewConversation = () => {
    createSession();
    router.push('/recommendations');
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar side="left" collapsible="icon" className="hidden md:block">
      <SidebarHeader className="border-b space-y-3">
        <div className="flex items-center gap-2 p-2">
          <AhsanAiHubLogo className="h-8 w-8" />
          <span className="font-headline text-lg font-semibold">Ahsan Ai Hub</span>
        </div>
        <Button
          onClick={handleNewConversation}
          className="w-full gap-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 font-semibold transition-all duration-300"
          variant="ghost"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden group-data-[state=expanded]/sidebar:inline">New Chat</span>
        </Button>
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
