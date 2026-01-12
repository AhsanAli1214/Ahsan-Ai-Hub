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
          background: linear-gradient(135deg, #22245b, #4338ca, #1e1b4b);
          background-size: 200% auto;
          color: #ffffff;
          padding: 16px 32px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          box-shadow: 
            0 10px 15px -3px rgba(34, 36, 91, 0.3),
            0 4px 6px -2px rgba(34, 36, 91, 0.05),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          animation: premium-gradient 6s ease infinite;
          position: relative;
          overflow: hidden;
        }

        @keyframes premium-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .support-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: all 0.6s;
        }

        .support-btn:hover::before {
          left: 100%;
        }

        .support-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 25px 50px -12px rgba(34, 36, 91, 0.5),
            0 0 20px rgba(67, 56, 202, 0.4);
          border-color: rgba(255, 255, 255, 0.3);
          filter: brightness(1.15);
        }

        .support-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .support-icon {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
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
        <MessageCircle className="h-5 w-5 support-icon" />
        Contact Ahsan AI Hub Support
      </a>
    </>
  );
}
