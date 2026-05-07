import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, Store, X, Menu } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const socials = [
    { href: "https://wa.me/201009012719", label: "واتساب", icon: MessageCircle, color: "hover:text-[#25D366]" },
    { href: "https://www.instagram.com/nsrlbryhlmwbylwlkombutr?igsh=Y2NjZ3BnZW13eGU5", label: "إنستجرام", icon: Instagram, color: "hover:text-[#E1306C]" },
    { href: "https://www.facebook.com/share/1BvNmZsbCZ/", label: "فيسبوك", icon: Facebook, color: "hover:text-[#1877F2]" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full glass-panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* لوجو + اسم المحل */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 glow-neon shrink-0">
              <Store className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              نسر <span className="text-primary">البرية</span>
            </span>
          </div>

          {/* أيقونات السوشيال — ديسكتوب */}
          <div className="hidden sm:flex items-center gap-4">
            {socials.map(({ href, label, icon: Icon, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className={`text-muted-foreground ${color} transition-all duration-300 hover:scale-110`}
                aria-label={label}>
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* زرار الهامبرغر — موبايل */}
          <button
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="القائمة"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* قائمة موبايل */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="sm:hidden border-t border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 flex items-center justify-center gap-6">
                {socials.map(({ href, label, icon: Icon, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className={`flex flex-col items-center gap-1.5 text-muted-foreground ${color} transition-colors`}>
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">{label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}