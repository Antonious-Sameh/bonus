import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/orders";

export default function OrderRequestSheet({ open, onClose, phone }) {
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!request.trim()) { toast.error("اكتب طلبك الأول"); return; }
    setLoading(true);
    try {
      await axios.post(API, { phone, request });
      setDone(true);
      setRequest("");
      setTimeout(() => { setDone(false); onClose(); }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل إرسال الطلب");
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
            style={{ background: "hsl(24 7% 9%)", border: "1px solid hsl(43 85% 55% / 0.12)", maxHeight: "85dvh" }}
          >
            {/* مقبض */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            {/* هيدر */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "hsl(43 85% 55% / 0.12)", border: "1px solid hsl(43 85% 55% / 0.22)" }}>
                  <ShoppingBag className="w-4 h-4" style={{ color: "hsl(43 85% 62%)" }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">اطلب منتج</h3>
                  <p className="text-xs text-muted-foreground">هيوصل طلبك للمحل على طول</p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {done ? (
                  /* حالة النجاح */
                  <motion.div key="done"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-3">
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                      style={{ background: "hsl(145 60% 40% / 0.15)", border: "1px solid hsl(145 60% 40% / 0.3)" }}>
                      <CheckCircle className="w-8 h-8" style={{ color: "#34d399" }} />
                    </div>
                    <p className="font-bold text-foreground">وصل طلبك! 🎉</p>
                    <p className="text-sm text-muted-foreground">هنحاول نجيبه في أقرب وقت</p>
                  </motion.div>
                ) : (
                  /* فورم الطلب */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold tracking-wide uppercase"
                        style={{ color: "hsl(40 10% 55%)" }}>
                        إيه اللي عاوزه؟
                      </label>
                      <textarea
                        value={request}
                        onChange={e => setRequest(e.target.value)}
                        placeholder="مثلاً: شاحن سامسونج 65W أو سماعة JBL Tune 520..."
                        rows={4}
                        className="w-full rounded-xl p-3.5 text-sm resize-none transition-all outline-none"
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "hsl(40 20% 92%)",
                          caretColor: "hsl(43 85% 58%)"
                        }}
                        onFocus={e => e.target.style.borderColor = "hsl(43 85% 55% / 0.4)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                      <p className="text-xs text-muted-foreground/50">
                        {request.length}/200 حرف
                      </p>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={handleSubmit} disabled={loading || !request.trim()}
                      className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, hsl(43 85% 58%), hsl(35 78% 40%))",
                        color: "hsl(24 8% 8%)",
                        boxShadow: "0 3px 16px hsl(43 85% 55% / 0.25)"
                      }}>
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />جاري الإرسال...</>
                      ) : (
                        <><Send className="w-4 h-4" />ابعت الطلب</>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
