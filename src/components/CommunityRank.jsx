import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

// 💡 التعديل: المكون الآن يستقبل rank و totalCustomers مباشرة من الأب (CustomerProfile)
export default function CommunityRank({ rank, totalCustomers }) {
  
  // حماية: لو الداتا لسه مجتش من السيرفر (rank بـ undefined أو null)
  if (!rank) {
    return (
      <div className="glass-card p-6 opacity-50">
        <p className="text-sm text-center text-muted-foreground animate-pulse font-cairo">
          جاري حساب ترتيبك العالمي...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 relative overflow-hidden group border-primary/20"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
      
      <div className="relative z-10 flex items-center gap-6">
        {/* عرض رقم الترتيب */}
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary shadow-[0_0_15px_rgba(57,255,20,0.2)]">
          <span className="text-2xl font-bold text-primary">#{rank}</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-1 font-cairo">
            ترتيبك رقم #{rank}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-cairo">
            <Users className="w-4 h-4" />
            <span>وسط {totalCustomers} زبون في نسر البرية</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}