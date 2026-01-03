"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Mail, Twitter, Github, Instagram, ArrowRight, Sparkles, Linkedin, Rocket } from "lucide-react";
import { maintenanceConfig } from "@/config/maintenance";

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl min-w-[80px] sm:min-w-[120px] shadow-2xl shadow-blue-500/5"
  >
    <span className="text-3xl sm:text-5xl font-black text-white tabular-nums tracking-tighter">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em] text-blue-400/80 mt-2">{label}</span>
  </motion.div>
);

const Particle = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: "110%", opacity: 0 }}
    animate={{ 
      y: "-10%", 
      opacity: [0, 1, 0],
      x: Math.random() * 100 - 50 + "%"
    }}
    transition={{ 
      duration: 10 + Math.random() * 20, 
      repeat: Infinity, 
      delay,
      ease: "linear"
    }}
    className="absolute w-1 h-1 bg-blue-400/30 rounded-full blur-[1px]"
  />
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] overflow-hidden selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} delay={i * 1.5} />
        ))}
      </div>
      
      <div className="relative z-10 w-full max-w-5xl px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-400/5 border border-blue-400/20 rounded-full backdrop-blur-sm shadow-inner cursor-default"
          >
            <Sparkles className="w-3 h-3 animate-spin-slow" />
            <span>Systems Upgrade in Progress</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            {maintenanceConfig.siteName.split(' ').map((word, i) => (
              <span key={i} className={i === 2 ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40" : ""}>
                {word}{' '}
              </span>
            ))}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 animate-gradient-x">
              {maintenanceConfig.tagline}
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-white/50 mb-16 leading-relaxed font-medium">
            {maintenanceConfig.description}
          </p>

          {/* Countdown Grid */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-20">
            <CountdownItem value={timeLeft.days} label="Days" />
            <CountdownItem value={timeLeft.hours} label="Hours" />
            <CountdownItem value={timeLeft.minutes} label="Min" />
            <CountdownItem value={timeLeft.seconds} label="Sec" />
          </div>

          {/* Action & Socials */}
          <div className="flex flex-col items-center gap-12 pt-12 border-t border-white/5">
            <div className="flex flex-col items-center gap-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Direct Inquiries</span>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:${maintenanceConfig.contactEmail}`}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-semibold transition-all group backdrop-blur-md shadow-xl"
              >
                <Mail className="w-5 h-5 text-blue-400" />
                <span>{maintenanceConfig.contactEmail}</span>
                <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </motion.a>
            </div>

            <div className="flex items-center gap-8">
              {[
                { icon: Twitter, href: maintenanceConfig.socials.twitter },
                { icon: Github, href: maintenanceConfig.socials.github },
                { icon: Instagram, href: maintenanceConfig.socials.instagram },
                { icon: Linkedin, href: maintenanceConfig.socials.linkedin }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -4, color: '#fff' }}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 transition-colors p-2"
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3b82f615_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
      </div>
      
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
