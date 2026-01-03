'use client';

import React from "react";
import dynamic from 'next/dynamic';
import { SidebarProvider } from "@/components/ui/sidebar";

const AppSidebar = dynamic(() => import("@/components/layout/AppSidebar").then(mod => mod.AppSidebar), { 
  ssr: false,
  loading: () => <div className="w-64 h-screen bg-sidebar animate-pulse hidden md:block" />
});
const BottomNav = dynamic(() => import("@/components/layout/BottomNav").then(mod => mod.BottomNav), { 
  ssr: false,
  loading: () => <div className="h-16 w-full bg-background animate-pulse md:hidden" />
});
const FooterWrapper = dynamic(() => import("@/components/layout/FooterWrapper").then(mod => mod.FooterWrapper), { ssr: false });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="md:flex md:justify-center w-full">
        <AppSidebar />
        <main className="flex-1 bg-background pb-24 md:pb-0 md:max-w-7xl flex flex-col min-h-screen relative">
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
