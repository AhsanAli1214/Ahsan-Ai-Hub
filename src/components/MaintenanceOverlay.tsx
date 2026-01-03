"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Twitter, Github, Instagram, Linkedin, Hammer, AlertTriangle } from "lucide-react";
import { siteStatusConfig } from "@/config/site-status";

export const MaintenanceOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20">
            <Hammer className="w-10 h-10 text-orange-500 animate-bounce" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            {siteStatusConfig.maintenance.title}
          </h1>
          
          <p className="text-lg text-white/60 mb-10 leading-relaxed">
            {siteStatusConfig.maintenance.description}
          </p>

          <div className="flex flex-col items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 text-orange-400 font-bold uppercase tracking-widest text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Fixing for perfection</span>
            </div>
            
            <a 
              href={`mailto:${siteStatusConfig.maintenance.contactEmail}`}
              className="text-white hover:text-orange-400 transition-colors font-medium flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {siteStatusConfig.maintenance.contactEmail}
            </a>

            <div className="flex items-center gap-6 mt-2">
              <a href={siteStatusConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href={siteStatusConfig.socials.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href={siteStatusConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href={siteStatusConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
