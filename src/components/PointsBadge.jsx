import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function PointsBadge({ points }) {
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 1500; // 1.5s
    const startValue = 0;
    const endValue = points;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayPoints(Math.floor(startValue + (endValue - startValue) * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [points]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="relative mx-auto w-48 h-48 flex items-center justify-center"
    >
      <div className="absolute inset-0 rounded-full bg-primary/20 glow-intense animate-glow-pulse blur-md" />
      <div className="relative z-10 flex flex-col items-center justify-center glass-card rounded-full w-40 h-40 border-2 border-primary/50">
        <Sparkles className="w-8 h-8 text-primary mb-2" />
        <p className="text-5xl font-extrabold text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]" style={{ letterSpacing: '-0.02em' }}>
          {displayPoints}
        </p>
        <p className="text-sm text-muted-foreground font-medium mt-1">نقطة</p>
      </div>
    </motion.div>
  );
}