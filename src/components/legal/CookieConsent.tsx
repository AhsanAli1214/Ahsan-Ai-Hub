'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ahsan-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('ahsan-cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-50"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card/90 backdrop-blur-2xl shadow-2xl p-6 md:p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                    Cookie Policy
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    We use cookies to enhance your experience and analyze our traffic. No personal data is stored or tracked.
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={acceptCookies}
                    className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                  >
                    Accept All
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsVisible(false)}
                    className="h-12 w-12 rounded-xl p-0 hover:bg-primary/5"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
