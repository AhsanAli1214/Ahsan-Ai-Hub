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
      <div className="relative flex min-h-screen w-full flex-col md:flex-row md:justify-center">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen md:max-w-7xl w-full">
          <div className="flex-1 pb-24 md:pb-0">
            {children}
          </div>
          <FooterWrapper />
        </main>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
