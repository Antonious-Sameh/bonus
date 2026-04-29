import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(57,255,20,0.1)]"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}