import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ضفنا onRedeem هنا عشان نستقبل الدالة من الصفحة الأم
export default function RewardCard({ userPoints, delay = 0, onRedeem }) {
  const cashValue = Math.floor(userPoints / 10); // كل 10 نقط بجنيه

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 sm:p-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-20 -mt-20 transition-all duration-500 group-hover:bg-primary/20 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            رصيدك الحالي
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            تقدر تستبدل نقطك بأي حاجة من المحل
          </h3>
          
          <p className="text-lg text-muted-foreground mb-6">
            نقطك دي فلوس في جيبك، اشتري بيها اللي يعجبك من الدكان!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">قيمة النقط كاش</p>
                <p className="text-2xl font-bold text-primary">{cashValue} جنيه</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/10 mx-2"></div>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              كل 100 نقطة = 10 جنيه خصم على أي منتج
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 min-w-[200px]">
          <p className="text-sm text-muted-foreground mb-2">إجمالي النقط</p>
          <p className="text-5xl font-extrabold text-foreground drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-6">
            {userPoints}
          </p>
          
          <Button 
            onClick={onRedeem} // هنا ربطنا الدالة بالزرار
            disabled={userPoints <= 0} // الزرار مبيشتغلش لو مفيش نقط
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            استخدم النقط
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}