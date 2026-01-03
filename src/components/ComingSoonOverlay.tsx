"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Mail, Twitter, Github, Instagram, Linkedin, Rocket, Sparkles } from "lucide-react";
import { siteStatusConfig } from "@/config/site-status";
import Image from "next/image";

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl min-w-[90px] sm:min-w-[130px] shadow-2xl">
    <span className="text-3xl sm:text-5xl font-black text-white tabular-nums tracking-tighter">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em] text-blue-400 mt-2">{label}</span>
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030014] overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo Section */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-10 inline-block"
          >
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto p-4 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
              <Image 
                src={siteStatusConfig.comingSoon.logo} 
                alt="Logo" 
                fill 
                className="object-contain p-4"
                priority
              />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full">
            <Rocket className="w-3 h-3" />
            <span>Mission: Launch 2026</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight">
            {siteStatusConfig.comingSoon.siteName} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">
              {siteStatusConfig.comingSoon.tagline}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/50 mb-16 leading-relaxed">
            {siteStatusConfig.comingSoon.description}
          </p>

          {/* Countdown */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-20">
            <CountdownItem value={timeLeft.days} label="Days" />
            <CountdownItem value={timeLeft.hours} label="Hours" />
            <CountdownItem value={timeLeft.minutes} label="Min" />
            <CountdownItem value={timeLeft.seconds} label="Sec" />
          </div>

          {/* Footer Socials */}
          <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/5">
            <div className="flex items-center gap-10">
              {[
                { icon: Twitter, href: siteStatusConfig.socials.twitter },
                { icon: Github, href: siteStatusConfig.socials.github },
                { icon: Instagram, href: siteStatusConfig.socials.instagram },
                { icon: Linkedin, href: siteStatusConfig.socials.linkedin }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white hover:scale-110 transition-all">
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Stay connected for updates</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
