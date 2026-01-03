'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BiometricLock({ children }: { children: React.ReactNode }) {
  const { biometricEnabled, isLocked, setIsLocked } = useAppContext();
  const [isSupported, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'PublicKeyCredential' in window) {
      setIsMounted(true);
    }
    
    // Auto-trigger biometric prompt on mount if locked and enabled
    if (biometricEnabled && isLocked) {
      const timer = setTimeout(() => {
        handleUnlock();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [biometricEnabled, isLocked]);

  const handleUnlock = async () => {
    if (!biometricEnabled) return;

    try {
      if ('PublicKeyCredential' in window) {
        const options: any = {
          publicKey: {
            challenge: new Uint8Array(32),
            rpId: window.location.hostname,
            userVerification: 'required',
            timeout: 60000,
          }
        };

        await (navigator as any).credentials.get(options);
        setIsLocked(false);
        sessionStorage.setItem('sessionUnlocked', 'true');
      } else {
        setIsLocked(false);
        sessionStorage.setItem('sessionUnlocked', 'true');
      }
    } catch (err) {
      console.error('Biometric authentication failed:', err);
      // REAL-TIME protection: If authentication fails, we don't unlock.
      // We inform the user they must authenticate.
    }
  };

  if (!biometricEnabled) return <>{children}</>;

  return (
    <>
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
          >
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-2xl shadow-primary/20">
              <Lock className="h-10 w-10" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border-2 border-primary/20"
              />
            </div>
            
            <div className="text-center space-y-2 mb-8 px-6">
              <h2 className="text-2xl font-black tracking-tight">App Locked</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ahsan AI Hub is secured with Biometric Protection. Unlock to continue your session.
              </p>
              <div className="pt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Need help?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  If you're having trouble with biometrics, please use the <span className="text-primary font-bold italic">BotSailor Support Widget</span> at the bottom right to reach our team.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleUnlock}
              size="lg"
              className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20"
            >
              <Fingerprint className="h-6 w-6" />
              Unlock with Biometrics
            </Button>

            <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              Privacy-First Security
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={isLocked ? 'pointer-events-none blur-sm' : ''}>
        {children}
      </div>
    </>
  );
}
