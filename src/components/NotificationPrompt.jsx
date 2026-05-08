import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X, BellRing } from "lucide-react";
import { toast } from "sonner";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function NotificationPrompt({ phone }) {
  const { permission, isSubscribed, requestPermission } = usePushNotifications(phone);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // مش بنوري البانر لو:
  // - مفيش Push support
  // - الإذن اتعطى قبل كده
  // - المستخدم رفض قبل كده
  // - اتعمل dismiss
  // - بالفعل مشترك
  const shouldShow =
    "Notification" in window &&
    "serviceWorker" in navigator &&
    permission === "default" &&
    !dismissed &&
    !isSubscribed;

  const handleAllow = async () => {
    setLoading(true);
    const success = await requestPermission();
    setLoading(false);
    if (success) {
      toast.success("🔔 تم تفعيل الإشعارات! هتعرف على طول لما تتضاف نقاط");
    } else {
      toast.error("مش قادر يفعّل الإشعارات، تقدر تفعّلها من إعدادات المتصفح");
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, delay: 1.5 }} // بتظهر بعد ثانية ونص
          className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50"
        >
          <div className="glass-card border border-primary/20 p-4 shadow-[0_8px_32px_rgba(57,255,20,0.12)] rounded-2xl">
            {/* زرار إغلاق */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm leading-snug">
                  فعّل إشعارات نقاطك! 🔔
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  هتعرف على طول لما الأدمن يضيف نقاط لحسابك
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                disabled={loading}
                className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary-foreground" />
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    فعّل
                  </>
                )}
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="px-4 h-9 rounded-xl bg-white/5 text-muted-foreground text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <BellOff className="w-3.5 h-3.5" />
                مش دلوقتي
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* لو بالفعل مشترك — بنوري badge صغير */}
      {isSubscribed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 left-4 z-40"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <Bell className="w-3 h-3" />
            الإشعارات شغالة
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}