import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Receipt, Info, Star, Package, Tag,
  ChevronLeft, Sparkles, Wallet, Gift, Clock, Phone, ShoppingBag
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import PointsBadge from "@/components/PointsBadge.jsx";
import RewardCard from "@/components/RewardCard.jsx";
import TransactionItem from "@/components/TransactionItem.jsx";
import CommunityRank from "@/components/CommunityRank.jsx";
import ExpirationWarning from "@/components/ExpirationWarning.jsx";
import Header from "@/components/Header.jsx";
import NotificationPrompt from "@/components/NotificationPrompt.jsx";
import OrderRequestSheet from "@/components/OrderRequestSheet.jsx";
import axios from "axios";

// ── مكوّن كارت المعلومة الصغيرة ──────────────────────────────────
function InfoChip({ icon: Icon, label, value, accent = "#fbbf24" }) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl"
      style={{ background: `${accent}0D`, border: `1px solid ${accent}22` }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-[10px] font-medium" style={{ color: `${accent}99` }}>{label}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ── شاشة التحميل ──────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-5">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full flex items-center justify-center text-xl">🦅</div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">جاري تحميل بياناتك...</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function CustomerProfile() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://bonus-system-tau.vercel.app/api/admin/customer/${phone}`
        );
        setCustomerData(res.data);
      } catch { setCustomerData(null); }
      finally { setLoading(false); }
    };
    fetch();
  }, [phone, user, navigate]);

  if (loading) return <LoadingScreen />;

  if (!customerData?.user) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <p className="text-4xl">😕</p>
        <p className="text-foreground font-bold">مش قادرين يوصلوا لبياناتك</p>
        <button onClick={() => navigate("/login")}
          className="text-sm text-primary underline underline-offset-2">رجوع للدخول</button>
      </div>
    </div>
  );

  const { user: cu, rank, totalCustomers, history } = customerData;
  const points = cu.points || 0;

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleRedeem = () => {
    const msg =
      `طلب استبدال نقاط - نسر البرية 🦅%0A%0A` +
      `العميل: ${cu.name}%0A` +
      `رقم الهاتف: ${cu.phone}%0A` +
      `إجمالي النقاط: ${points} نقطة%0A` +
      `المبلغ المستحق: ${points} جنيه%0A%0A` +
      `محتاج أستخدم النقاط دي في مشترياتي القادمة، شكراً!`;
    window.open(`https://wa.me/201009012719?text=${msg}`, "_blank");
  };

  // ── الـ JSX ────────────────────────────────────────────────────
  return (
    <>
      <Helmet><title>{`${cu.name} — نسر البرية`}</title></Helmet>

      <div className="min-h-screen bg-background flex flex-col font-cairo" dir="rtl">
        <Header />

        {/* خلفية */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: "hsl(43 85% 55% / 0.05)", filter: "blur(100px)" }} />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full"
            style={{ background: "hsl(43 85% 55% / 0.03)", filter: "blur(80px)" }} />
        </div>

        <div className="flex-1 max-w-xl w-full mx-auto px-4 py-5 relative z-10 pb-28">

          {/* ── شريط التنقل العلوي ── */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/products")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "hsl(43 85% 55% / 0.08)", border: "1px solid hsl(43 85% 55% / 0.2)", color: "hsl(43 85% 62%)" }}
                onMouseEnter={e => e.currentTarget.style.background = "hsl(43 85% 55% / 0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "hsl(43 85% 55% / 0.08)"}>
                <Package className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">منتجاتنا</span>
              </button>

              <button onClick={() => navigate("/offers")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "hsl(270 70% 60% / 0.08)", border: "1px solid hsl(270 70% 60% / 0.2)", color: "hsl(270 70% 72%)" }}
                onMouseEnter={e => e.currentTarget.style.background = "hsl(270 70% 60% / 0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "hsl(270 70% 60% / 0.08)"}>
                <Tag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">عروضنا</span>
              </button>

              <button onClick={() => setOrderSheetOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "hsl(145 60% 40% / 0.08)", border: "1px solid hsl(145 60% 40% / 0.22)", color: "#34d399" }}
                onMouseEnter={e => e.currentTarget.style.background = "hsl(145 60% 40% / 0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "hsl(145 60% 40% / 0.08)"}>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">اطلب منتج</span>
              </button>
            </div>

            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "hsl(40 10% 55%)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "hsl(0 70% 50% / 0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "hsl(40 10% 55%)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </motion.div>

          {/* ── بطاقة الترحيب ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative overflow-hidden rounded-3xl p-6 mb-5 text-center"
            style={{
              background: "linear-gradient(135deg, hsl(24 7% 12%), hsl(24 7% 10%))",
              border: "1px solid hsl(43 85% 55% / 0.15)"
            }}
          >
            {/* بريق خلفي */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none"
              style={{ background: "hsl(43 85% 55% / 0.06)", filter: "blur(40px)" }} />

            {/* badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: "hsl(43 85% 55% / 0.12)", border: "1px solid hsl(43 85% 55% / 0.25)", color: "hsl(43 85% 62%)" }}>
              🦅 نسر البرية
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-foreground mb-1">
              أهلاً يا {cu.name} 👋
            </h1>
            <p className="text-xs text-muted-foreground mb-5 flex items-center justify-center gap-1.5">
              <Phone className="w-3 h-3" />
              {cu.phone}
              <span className="mx-1">·</span>
              <span className="font-mono" style={{ color: "hsl(43 85% 60%)" }}>#{cu.customerCode || "---"}</span>
            </p>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-2 gap-3">
              <InfoChip icon={Sparkles} label="رصيد النقاط" value={`${points.toLocaleString()} نقطة`} accent="#fbbf24" />
              <InfoChip icon={Gift} label="ترتيبك" value={rank ? `#${rank} من ${totalCustomers}` : "—"} accent="#a78bfa" />
            </div>

            {/* زرار التقييم */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => window.open("https://g.page/r/CSSPGLjbftidEBI/review", "_blank")}
              className="mt-4 w-full h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#1a1000",
                boxShadow: "0 3px 14px rgba(245,158,11,0.22)"
              }}>
              <Star className="w-4 h-4 fill-current" />
              قيّم تجربتك على جوجل ⭐
            </motion.button>
          </motion.div>

          {/* ── تنبيه نظام النقاط ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="flex items-start gap-3 p-4 rounded-2xl mb-5"
            style={{ background: "hsl(43 85% 55% / 0.06)", border: "1px solid hsl(43 85% 55% / 0.15)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "hsl(43 85% 55% / 0.12)" }}>
              <Info className="w-4 h-4" style={{ color: "hsl(43 85% 60%)" }} />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(40 15% 75%)" }}>
              كل <strong style={{ color: "hsl(43 85% 62%)" }}>100 جنيه</strong> مشتريات تكسب{" "}
              <strong style={{ color: "hsl(43 85% 62%)" }}>10 نقاط</strong> ·
              وعند الاستبدال كل <strong style={{ color: "hsl(43 85% 62%)" }}>نقطة = 1 جنيه</strong> خصم فوري 🎉
            </p>
          </motion.div>

          {/* ── Badge النقاط ── */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }} className="flex justify-center mb-5">
            <PointsBadge points={points} />
          </motion.div>

          {/* ── Rank + Expiration ── */}
          <div className="space-y-3 mb-5">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}>
              <CommunityRank rank={rank} totalCustomers={totalCustomers} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.33 }}>
              <ExpirationWarning expirationDate={cu.expirationDate} />
            </motion.div>
          </div>

          {/* ── كارت الاستبدال ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }} className="mb-5">
            <RewardCard userPoints={points} delay={0.38} onRedeem={handleRedeem} />
          </motion.div>

          {/* ── Tabs: الرئيسية / السجل ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(24 7% 10%)", border: "1px solid rgba(255,255,255,0.06)" }}>

            {/* هيدر السجل */}
            <div className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "hsl(43 85% 55% / 0.12)", border: "1px solid hsl(43 85% 55% / 0.2)" }}>
                <Receipt className="w-3.5 h-3.5" style={{ color: "hsl(43 85% 60%)" }} />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                عملياتك اللي فاتت
                {history?.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground mr-1.5">({history.length})</span>
                )}
              </h2>
            </div>

            {/* العمليات */}
            {history?.length > 0 ? (
              <div className="divide-y" style={{ divideColor: "rgba(255,255,255,0.04)" }}>
                {history.map((transaction, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04 }}>
                    <TransactionItem transaction={transaction} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-14">
                <div className="text-4xl mb-3">🛍️</div>
                <p className="text-sm font-medium text-foreground/60">لسه مفيش عمليات</p>
                <p className="text-xs text-muted-foreground mt-1">ابدأ التسوق واكسب نقاط!</p>
              </div>
            )}
          </motion.div>
          
        </div>

        <NotificationPrompt phone={cu.phone} />
        <OrderRequestSheet open={orderSheetOpen} onClose={() => setOrderSheetOpen(false)} phone={cu.phone} />
      </div>
    </>
  );
}
