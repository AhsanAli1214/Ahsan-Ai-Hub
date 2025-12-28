import React from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { FooterWrapper } from '@/components/layout/FooterWrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="md:flex md:justify-center w-full">
        <AppSidebar />
        <main className="flex-1 bg-background pb-20 md:pb-0 md:p-4 lg:p-6 md:max-w-7xl flex flex-col min-h-screen">
          <div className="flex-1 animate-in fade-in duration-300">
            {children}
          </div>
          <FooterWrapper />
        </main>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
