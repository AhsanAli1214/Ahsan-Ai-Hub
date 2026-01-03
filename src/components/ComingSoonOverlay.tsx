"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Mail, Twitter, Github, Instagram, Facebook, Rocket } from "lucide-react";
import { siteStatusConfig } from "@/config/site-status";
import Image from "next/image";

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-md min-w-[70px] sm:min-w-[110px] shadow-lg">
    <span className="text-2xl sm:text-4xl font-black text-white tabular-nums tracking-tighter">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-blue-400 mt-1 sm:mt-2">{label}</span>
  </div>
);

export const ComingSoonOverlay = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(siteStatusConfig.comingSoon.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] overflow-y-auto overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 py-8 sm:py-12 flex flex-col items-center justify-center min-h-screen sm:min-h-0 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          {/* Logo Section - Removed the box/div as requested */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 sm:mb-8 flex justify-center w-full"
          >
            <div className="relative w-24 h-24 sm:w-36 sm:h-36">
              <Image 
                src={siteStatusConfig.comingSoon.logo} 
                alt="Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full">
            <Rocket className="w-3 h-3" />
            <span>Mission: Launch 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tighter leading-tight sm:leading-[1.1]">
            {siteStatusConfig.comingSoon.siteName} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600">
              {siteStatusConfig.comingSoon.tagline}
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-lg text-white/50 mb-10 sm:mb-16 leading-relaxed px-4">
            {siteStatusConfig.comingSoon.description}
          </p>

          {/* Countdown - Better mobile spacing */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-12 sm:mb-20 px-2 w-full max-w-lg mx-auto">
            <CountdownItem value={timeLeft.days} label="Days" />
            <CountdownItem value={timeLeft.hours} label="Hours" />
            <CountdownItem value={timeLeft.minutes} label="Min" />
            <CountdownItem value={timeLeft.seconds} label="Sec" />
          </div>

          {/* Action & Socials - Better visibility */}
          <div className="flex flex-col items-center gap-8 sm:gap-10 pt-8 sm:pt-10 border-t border-white/5 w-full max-w-md">
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {[
                { icon: Twitter, href: siteStatusConfig.socials.twitter },
                { icon: Github, href: siteStatusConfig.socials.github },
                { icon: Instagram, href: siteStatusConfig.socials.instagram },
                { icon: Facebook, href: siteStatusConfig.socials.facebook }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-white hover:scale-110 active:scale-95 transition-all p-2"
                >
                  <social.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              ))}
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Stay connected for the revolution</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
