'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function FooterWrapper() {
  const pathname = usePathname();
  
  // Hide footer on chat/recommendations page
  const isChatPage = pathname === '/recommendations' || pathname?.includes('/recommendations');
  
  if (isChatPage) {
    return null;
  }
  
  return <Footer />;
}
