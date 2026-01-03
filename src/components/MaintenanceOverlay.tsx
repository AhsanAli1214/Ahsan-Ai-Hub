"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Twitter, Github, Instagram, Facebook, Hammer, AlertTriangle, Sparkles } from "lucide-react";
import { siteStatusConfig } from "@/config/site-status";
import Image from "next/image";

export const MaintenanceOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] overflow-y-auto overflow-x-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Logo Section */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 flex justify-center w-full"
          >
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <Image 
                src={siteStatusConfig.comingSoon.logo} 
                alt="Logo" 
                fill 
                className="object-contain grayscale opacity-80"
                priority
              />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-full backdrop-blur-sm">
            <Hammer className="w-3 h-3 animate-pulse" />
            <span>Systems Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
            Refining the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
              Experience.
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-base sm:text-lg text-white/50 mb-12 leading-relaxed">
            {siteStatusConfig.maintenance.description}
          </p>

          <div className="w-full grid gap-8 pt-10 border-t border-white/5">
            <div className="flex flex-col items-center gap-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/20">Technical Support</span>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:${siteStatusConfig.maintenance.contactEmail}`}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-semibold transition-all group backdrop-blur-md shadow-xl"
              >
                <Mail className="w-5 h-5 text-orange-500" />
                <span>{siteStatusConfig.maintenance.contactEmail}</span>
              </motion.a>
            </div>

            <div className="flex items-center justify-center gap-8">
              {[
                { icon: Twitter, href: siteStatusConfig.socials.twitter },
                { icon: Github, href: siteStatusConfig.socials.github },
                { icon: Instagram, href: siteStatusConfig.socials.instagram },
                { icon: Facebook, href: siteStatusConfig.socials.facebook }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-all">
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
