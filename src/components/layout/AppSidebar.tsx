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
      <SidebarHeader className="border-b space-y-4 p-4">
        <div className="flex items-center gap-3 p-1">
          <AhsanAiHubLogo className="h-10 w-10 shrink-0" />
          <span className="font-headline text-xl font-bold tracking-tight">Ahsan Ai Hub</span>
        </div>
        <Button
          onClick={handleNewConversation}
          className="w-full gap-3 rounded-2xl h-14 bg-gradient-to-br from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 border-2 border-primary/30 font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 group"
          variant="ghost"
          size="lg"
          title="Start a new conversation with AI Chat"
        >
          <div className="relative">
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="group-data-[state=collapsed]/sidebar:hidden inline text-base font-bold">New Chat</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu className="gap-2">
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={handleLinkClick}
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
                size="lg"
                className="h-14 rounded-xl px-4 transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:shadow-sm"
              >
                <Link href={item.href} className="flex items-center gap-4 w-full">
                  <item.icon className="size-6 shrink-0" />
                  <span className="text-base font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
