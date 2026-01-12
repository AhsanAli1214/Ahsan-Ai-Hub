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
    const phoneNumber = "923316041183"; // Ahsan AI Hub WhatsApp
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
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #22245b, #312e81, #1e1b4b);
          background-size: 200% auto;
          color: #ffffff;
          padding: 16px 28px;
          border-radius: 18px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 10px 25px -5px rgba(34, 36, 91, 0.4), 0 8px 10px -6px rgba(34, 36, 91, 0.4);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          animation: gradient 5s ease infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .support-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 35px -5px rgba(34, 36, 91, 0.5), 0 12px 15px -8px rgba(34, 36, 91, 0.5);
          border-color: rgba(255, 255, 255, 0.2);
          filter: brightness(1.1);
        }

        .support-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
      <a 
        id="wa-support" 
        href={waLink}
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contact Ahsan AI Hub Support on WhatsApp"
        className={cn("support-btn focus-visible:ring-4 focus-visible:ring-primary", className)}
      >
        <MessageCircle className="h-5 w-5" />
        Contact Ahsan AI Hub Support
      </a>
    </>
  );
}
