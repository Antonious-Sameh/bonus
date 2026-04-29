import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, Store } from 'lucide-react';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full glass-panel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Right side (RTL) - Store Logo/Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 glow-neon">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            نسر <span className="text-primary">البرية</span>
          </span>
        </div>

        {/* Left side (RTL) - Social Icons */}
        <div className="flex items-center gap-4">
          <a 
            href="https://wa.me/201009012719" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-[#25D366] transition-colors duration-300 hover:scale-110"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a 
            href="https://www.instagram.com/nsrlbryhlmwbylwlkombutr?igsh=Y2NjZ3BnZW13eGU5" 
            className="text-muted-foreground hover:text-[#E1306C] transition-colors duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a 
            href="https://www.facebook.com/share/1BvNmZsbCZ/" 
            className="text-muted-foreground hover:text-[#1877F2] transition-colors duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}