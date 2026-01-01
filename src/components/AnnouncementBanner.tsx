'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AhsanAiHubLogo } from '@/components/icons';

interface AnnouncementProps {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  senderName?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function AnnouncementBanner({ 
  id, 
  title, 
  message, 
  imageUrl, 
  senderName = "Ahsan Ali", 
  ctaText, 
  ctaLink 
}: AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(`announcement_${id}`);
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [id]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`announcement_${id}`, 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-4 bottom-6 z-[100] mx-auto max-w-2xl md:bottom-8 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2"
        >
          <Card className="relative overflow-hidden border-primary/20 bg-zinc-950/90 p-0 shadow-2xl backdrop-blur-xl">
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-[60px]" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[60px]" />

            <div className="relative flex flex-col md:flex-row">
              {/* Image Section */}
              {imageUrl && (
                <div className="relative h-48 w-full shrink-0 md:h-auto md:w-48">
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 md:bg-gradient-to-r" />
                </div>
              )}

              {/* Content Section */}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close announcement"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10">
                    <AhsanAiHubLogo width={32} height={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-100">Ahsan AI Hub</h3>
                    <p className="text-[10px] font-medium text-zinc-500">Official Announcement</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black tracking-tight text-white md:text-2xl">{title}</h4>
                  <p className="text-sm font-medium leading-relaxed text-zinc-400">{message}</p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      By <span className="text-zinc-300">{senderName}</span>
                    </span>
                  </div>

                  {ctaText && ctaLink && (
                    <Button 
                      asChild
                      size="sm"
                      className="rounded-xl bg-primary px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                    >
                      <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="gap-2">
                        {ctaText} <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
