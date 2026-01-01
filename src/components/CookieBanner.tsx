'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck, ArrowRight, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-8 md:max-w-[440px]"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] bg-black/95 border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-500/10 blur-[80px] rounded-full" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-500 border border-blue-500/20">
                  <Cookie className="h-6 w-6" />
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-1 rounded-full hover:bg-white/5 text-muted-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Cookie Preference
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  We use cookies to enhance your experience, analyze site traffic, and support our 
                  <span className="text-blue-500 font-bold mx-1">Privacy-First</span> 
                  mission. By clicking "Accept All", you agree to our use of cookies.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAccept}
                    className="flex-1 h-12 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20"
                  >
                    Accept All
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={handleDecline}
                    className="flex-1 h-12 rounded-2xl text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 border border-white/5"
                  >
                    Necessary Only
                  </Button>
                </div>
                
                <div className="flex items-center justify-between px-1">
                  <Link 
                    href="/privacy" 
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-blue-500 transition-colors flex items-center gap-1.5"
                  >
                    Privacy Policy <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5">
                    <Settings2 className="h-3 w-3" /> Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}