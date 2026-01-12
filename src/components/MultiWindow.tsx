'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';

interface MultiWindowProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function MultiWindow({ title, children, isOpen, onClose }: MultiWindowProps) {
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && !externalWindow) {
      const newWindow = window.open(
        '',
        `AhsanAiHub_${title.replace(/\s+/g, '_')}`,
        'width=600,height=800,left=200,top=200'
      );

      if (newWindow) {
        // Copy styles
        const styles = document.querySelectorAll('link[rel="stylesheet"], style');
        styles.forEach((style) => {
          newWindow.document.head.appendChild(style.cloneNode(true));
        });

        // Add tailwind CDN as fallback/support
        const script = newWindow.document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        newWindow.document.head.appendChild(script);

        newWindow.document.title = `${title} - Ahsan AI Hub`;
        
        const container = newWindow.document.createElement('div');
        container.className = 'bg-background text-foreground min-h-screen p-4';
        newWindow.document.body.appendChild(container);
        
        setContainerEl(container);
        setExternalWindow(newWindow);

        newWindow.addEventListener('beforeunload', () => {
          onClose();
        });
      }
    }

    return () => {
      if (externalWindow) {
        externalWindow.close();
      }
    };
  }, [isOpen, externalWindow, title, onClose]);

  if (!isOpen || !containerEl) return null;

  return createPortal(
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="font-bold text-lg">{title}</h2>
        <Button variant="ghost" size="icon" onClick={() => externalWindow?.close()}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>,
    containerEl
  );
}

export function PopoutTrigger({ onPopout, label = "Pop out" }: { onPopout: () => void, label?: string }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onPopout}
      className="gap-2 rounded-xl text-[10px] font-bold uppercase tracking-wider"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
