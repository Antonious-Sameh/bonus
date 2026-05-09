import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/admin";

export default function RedeemSheet({ open, onClose, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [points, setPoints] = useState("");
  const [redeemNote, setRedeemNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!phone || !points) { toast.error("لازم تملا كل الحقول"); return; }
    const pts = parseInt(points);
    if (isNaN(pts) || pts <= 0) { toast.error("عدد النقاط لازم يكون صحيح"); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/redeem-points`, {
        phone, pointsToRedeem: pts,
        redeemNote: redeemNote || `استبدال ${pts} نقطة`
      });
      toast.success(`✅ ${res.data.message}`);
      setPhone(""); setPoints(""); setRedeemNote("");
      onClose(); onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل الاستبدال");
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full z-50 w-full max-w-sm overflow-y-auto"
            style={{ background: "hsl(24 7% 9%)", borderLeft: "1px solid hsl(43 85% 55% / 0.12)" }}
          >
            {/* هيدر */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
              style={{ background: "hsl(24 7% 9%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(0 70% 50% / 0.12)", border: "1px solid hsl(0 70% 50% / 0.25)" }}>
                  <Minus className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                </div>
                <h3 className="text-base font-bold text-foreground">استبدال نقاط</h3>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* تنبيه */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm"
                style={{ background: "hsl(0 70% 50% / 0.07)", border: "1px solid hsl(0 70% 50% / 0.18)", color: "#fca5a5" }}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>النقاط هتتخصم من رصيد العميل وهيوصله إشعار فوراً</span>
              </div>

              {/* رقم الموبايل */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "hsl(40 10% 55%)" }}>رقم موبايل العميل</label>
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="h-11 text-sm bg-black/30 border-white/8 text-foreground placeholder:text-muted-foreground/40" />
              </div>

              {/* عدد النقاط */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "hsl(40 10% 55%)" }}>عدد النقاط اللي هتتخصم</label>
                <Input type="number" value={points} onChange={e => setPoints(e.target.value)}
                  placeholder="مثلاً: 50"
                  className="h-11 text-sm bg-black/30 border-white/8 text-foreground placeholder:text-muted-foreground/40" />
                {points && !isNaN(parseInt(points)) && (
                  <p className="text-xs mt-1" style={{ color: "#fca5a5" }}>
                    💸 قيمة الاستبدال: {parseInt(points)} جنيه خصم
                  </p>
                )}
              </div>

              {/* سبب الاستبدال */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "hsl(40 10% 55%)" }}>سبب الاستبدال (اختياري)</label>
                <Input value={redeemNote} onChange={e => setRedeemNote(e.target.value)}
                  placeholder="مثلاً: شراء شاحن بالنقاط"
                  className="h-11 text-sm bg-black/30 border-white/8 text-foreground placeholder:text-muted-foreground/40" />
              </div>

              {/* زرار */}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={handleRedeem} disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: "hsl(0 70% 50% / 0.15)", border: "1px solid hsl(0 70% 50% / 0.3)", color: "#fca5a5" }}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />جاري الخصم...</>
                ) : (
                  <><Minus className="w-4 h-4" />خصم النقاط</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
