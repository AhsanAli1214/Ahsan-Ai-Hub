'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppSupportButtonProps {
  className?: string;
}

export function WhatsAppSupportButton({ className }: WhatsAppSupportButtonProps) {
  const [waLink, setWaLink] = useState('#');

  useEffect(() => {
    const phoneNumber = "15557818398"; // Ahsan AI Hub WhatsApp
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    const device = /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
    const time = new Date().toLocaleString();

    const message = `Hello Ahsan AI Hub Support Team 👋,

I’m contacting you regarding assistance with Ahsan AI Hub.

📌 Reason:
• Support / Inquiry / Error Report

🔹 Page: ${pageTitle}
🔹 URL: ${pageUrl}
🔹 Device: ${device}
🔹 Time: ${time}

Please assist me at your earliest convenience.
Thank you for your support! 🙏`;

    const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    setWaLink(link);
  }, []);

  return (
    <>
      <style jsx>{`
        .support-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #0f172a, #312e81);
          color: #ffffff;
          padding: 14px 26px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 15px 35px rgba(15,23,42,0.45);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .support-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 22px 50px rgba(49,46,129,0.6);
          color: #ffffff;
        }
      `}</style>
      <a 
        id="wa-support" 
        href={waLink}
        target="_blank" 
        rel="noopener noreferrer"
        className={cn("support-btn", className)}
      >
        <MessageCircle className="h-5 w-5" />
        Contact Ahsan AI Hub Support
      </a>
    </>
  );
}
