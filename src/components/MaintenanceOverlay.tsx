"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Mail, Twitter, Github, Instagram, ArrowRight } from "lucide-react";
import { maintenanceConfig } from "@/config/maintenance";

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md min-w-[70px] sm:min-w-[90px]">
    <span className="text-2xl sm:text-4xl font-bold text-white">{value.toString().padStart(2, '0')}</span>
    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50 mt-1">{label}</span>
  </div>
);

export const MaintenanceOverlay = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(maintenanceConfig.targetDate).getTime();
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
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      
      <div className="relative w-full max-w-4xl px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full">
            <Timer className="w-3 h-3" />
            <span>Launching Soon</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Ahsan AI Hub <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Is Evolving.
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-lg text-white/60 mb-12 leading-relaxed">
            We're building the most powerful privacy-first AI companion. 
            Something big is coming, and we can't wait to share it with you.
          </p>

          {/* Countdown Grid */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-16">
            <CountdownItem value={timeLeft.days} label="Days" />
            <CountdownItem value={timeLeft.hours} label="Hours" />
            <CountdownItem value={timeLeft.minutes} label="Minutes" />
            <CountdownItem value={timeLeft.seconds} label="Seconds" />
          </div>

          {/* Contact & Socials */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-white/5">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="text-xs text-white/40 uppercase tracking-widest">Need help?</span>
              <a 
                href={`mailto:${maintenanceConfig.contactEmail}`}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span>{maintenanceConfig.contactEmail}</span>
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            </div>

            <div className="h-px w-12 sm:h-12 sm:w-px bg-white/10" />

            <div className="flex items-center gap-6">
              <a href={maintenanceConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={maintenanceConfig.socials.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href={maintenanceConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Background Effect */}
      <div className="absolute inset-0 z-[-1] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </div>
  );
};
