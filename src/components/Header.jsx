import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, X, Menu } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const socials = [
    { href: "https://wa.me/201009012719",          label: "واتساب",   icon: MessageCircle, color: "#25D366" },
    { href: "https://www.instagram.com/nsrlbryhlmwbylwlkombutr?igsh=Y2NjZ3BnZW13eGU5", label: "إنستجرام", icon: Instagram,      color: "#E1306C" },
    { href: "https://www.facebook.com/share/1BvNmZsbCZ/",  label: "فيسبوك",   icon: Facebook,      color: "#1877F2" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(14, 12, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid hsl(43 85% 55% / 0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* لوجو */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(43 85% 55% / 0.2), hsl(43 85% 55% / 0.05))',
                border: '1px solid hsl(43 85% 55% / 0.3)',
                boxShadow: '0 0 16px hsl(43 85% 55% / 0.12)'
              }}
            >
              🦅
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight" style={{ color: 'hsl(40 20% 93%)' }}>
              نسر <span style={{ color: 'hsl(43 85% 58%)' }}>البرية</span>
            </span>
          </div>

          {/* سوشيال — ديسكتوب */}
          <div className="hidden sm:flex items-center gap-1">
            {socials.map(({ href, label, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300"
                style={{ color: 'hsl(40 10% 55%)' }}
                onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = `${color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'hsl(40 10% 55%)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
              </a>
            ))}
          </div>

          {/* هامبرغر — موبايل */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="القائمة"
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{
              background: menuOpen ? 'hsl(43 85% 55% / 0.1)' : 'rgba(255,255,255,0.04)',
              border: menuOpen ? '1px solid hsl(43 85% 55% / 0.25)' : '1px solid rgba(255,255,255,0.08)',
              color: menuOpen ? 'hsl(43 85% 60%)' : 'hsl(40 10% 55%)'
            }}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* قائمة موبايل */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="sm:hidden overflow-hidden"
              style={{ borderTop: '1px solid hsl(43 85% 55% / 0.08)', background: 'rgba(10, 9, 7, 0.95)' }}
            >
              <div className="px-4 py-5 flex items-center justify-center gap-4">
                {socials.map(({ href, label, icon: Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center gap-2 transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                      style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
                    >
                      <Icon style={{ width: '20px', height: '20px' }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'hsl(40 10% 60%)' }}>{label}</span>
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