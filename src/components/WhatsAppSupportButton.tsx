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
          gap: 16px;
          background: linear-gradient(145deg, #1e1b4b, #2e2a77, #1e1b4b);
          background-size: 200% auto;
          color: #ffffff;
          padding: 20px 42px;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          box-shadow: 
            0 25px 35px -10px rgba(0, 0, 0, 0.4),
            0 12px 15px -8px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: float-shimmer 6s ease-in-out infinite;
        }

        @keyframes float-shimmer {
          0%, 100% { 
            transform: translateY(0) scale(1);
            background-position: 0% 50%;
            box-shadow: 0 25px 35px -10px rgba(0, 0, 0, 0.4), 0 12px 15px -8px rgba(0, 0, 0, 0.3);
          }
          50% { 
            transform: translateY(-8px) scale(1.02);
            background-position: 100% 50%;
            box-shadow: 0 35px 45px -12px rgba(49, 46, 129, 0.5), 0 15px 18px -10px rgba(49, 46, 129, 0.4);
          }
        }

        .support-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: all 0.8s;
          pointer-events: none;
        }

        .support-btn:hover::before {
          left: 150%;
        }

        .support-btn:hover {
          border-color: rgba(255, 255, 255, 0.5);
          filter: brightness(1.2);
          color: #ffffff;
        }

        .support-btn:active {
          transform: translateY(-2px) scale(0.97);
          transition: all 0.1s;
        }

        .support-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          padding: 10px;
          border-radius: 14px;
          margin-right: -4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
        <span className="support-icon-wrapper">
          <MessageCircle className="h-5 w-5" />
        </span>
        Contact Support
      </a>
    </>
  );
}
