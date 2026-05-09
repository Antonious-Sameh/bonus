import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { LogOut, Receipt, Info, Star, Package, Tag, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import PointsBadge from "@/components/PointsBadge.jsx";
import RewardCard from "@/components/RewardCard.jsx";
import TransactionItem from "@/components/TransactionItem.jsx";
import CommunityRank from "@/components/CommunityRank.jsx";
import ExpirationWarning from "@/components/ExpirationWarning.jsx";
import Header from "@/components/Header.jsx";
import NotificationPrompt from "@/components/NotificationPrompt.jsx";
import axios from "axios";

export default function CustomerProfile() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://bonus-system-tau.vercel.app/api/admin/customer/${phone}`
        );
        setCustomerData(response.data);
      } catch {
        setCustomerData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerDetails();
  }, [phone, user, navigate]);

  const handleLogout = () => { logout(); navigate("/login"); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );

  if (!customerData?.user) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-muted-foreground">مش عارفين نوصل لبياناتك حالياً يا بطل..</p>
    </div>
  );

  const handleRedeemPoints = () => {
    const msg =
      `طلب استبدال نقاط - نسر البرية 🦅%0A%0A` +
      `العميل: ${customerData.user.name}%0A` +
      `رقم الهاتف: ${customerData.user.phone}%0A` +
      `إجمالي النقاط: ${customerData.user.points} نقطة%0A` +
      `المبلغ المستحق: ${customerData.user.points} جنيه%0A%0A` +
      `محتاج أستخدم النقاط دي في مشترياتي القادمة، شكراً!`;
    window.open(`https://wa.me/201009012719?text=${msg}`, "_blank");
  };

  const navItems = [
    { label: "منتجاتنا", icon: Package, path: "/products", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-400/20 hover:bg-amber-400/15" },
    { label: "عروضنا",   icon: Tag,     path: "/offers",   color: "text-violet-400", bg: "bg-violet-500/10 border-violet-400/20 hover:bg-violet-400/15" },
  ];

  return (
    <>
      <Helmet>
        <title>{`${customerData.user.name} — نسر البرية`}</title>
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-cairo text-right" dir="rtl">
        <Header />

        {/* خلفية */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full blur-[120px]"
            style={{ background: 'hsl(43 85% 55% / 0.05)' }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px]"
            style={{ background: 'hsl(43 85% 55% / 0.03)' }} />
        </div>

        <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-5 py-6 relative z-10">

          {/* شريط التنقل العلوي */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-7"
          >
            {/* روابط يمين */}
            <div className="flex items-center gap-2">
              {navItems.map(({ label, icon: Icon, path, color, bg }) => (
                <button key={path} onClick={() => navigate(path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${bg} ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* زرار الخروج شمال */}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hover:border-red-400/20 text-xs font-semibold transition-all">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </motion.div>

          {/* الترحيب */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold"
              style={{
                background: 'hsl(43 85% 55% / 0.1)',
                border: '1px solid hsl(43 85% 55% / 0.2)',
                color: 'hsl(43 85% 65%)'
              }}>
              🦅 نسر البرية
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
              أهلاً يا {customerData.user.name} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              رقمك: <span className="text-foreground font-mono">{customerData.user.phone}</span>
            </p>

            {/* زرار التقييم */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open("https://g.page/r/CSSPGLjbftidEBI/review", "_blank")}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#1a1200',
                boxShadow: '0 4px 16px rgba(245,158,11,0.25)'
              }}
            >
              <Star className="w-4 h-4 fill-current" />
              قيّم تجربتك على جوجل
            </motion.button>
          </motion.div>

          {/* تنبيه نظام النقاط */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-start gap-3 p-4 rounded-2xl mb-8"
            style={{
              background: 'hsl(43 85% 55% / 0.07)',
              border: '1px solid hsl(43 85% 55% / 0.18)'
            }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'hsl(43 85% 55% / 0.15)' }}>
              <Info className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              كل <strong className="text-primary">100 جنيه</strong> مشتريات = <strong className="text-primary">10 نقاط</strong> ·
              عند الاستبدال <strong className="text-primary">كل نقطة = 1 جنيه</strong> خصم فوري! 🎉
            </p>
          </motion.div>

          {/* النقاط والرانك */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <PointsBadge points={customerData.user.points || 0} />
            </motion.div>

            <div className="space-y-4">
              <CommunityRank rank={customerData.rank} totalCustomers={customerData.totalCustomers} />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <ExpirationWarning expirationDate={customerData.user.expirationDate} />
              </motion.div>
            </div>
          </div>

          {/* كارت الاستبدال */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <RewardCard userPoints={customerData.user.points || 0} delay={0.35} onRedeem={handleRedeemPoints} />
          </motion.div>

          {/* سجل العمليات */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card overflow-hidden"
          >
            <div className="flex items-center gap-3 p-5 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(43 85% 55% / 0.12)', border: '1px solid hsl(43 85% 55% / 0.2)' }}>
                <Receipt className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-base font-bold text-foreground">عملياتك اللي فاتت</h2>
            </div>

            {customerData.history?.length > 0 ? (
              <div className="divide-y divide-white/[0.04]">
                {customerData.history.map((transaction, index) => (
                  <TransactionItem key={index} transaction={transaction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-14">
                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-base font-medium text-foreground/60">لسه مفيش عمليات</p>
                <p className="text-sm text-muted-foreground mt-1">ابدأ التسوق واكسب نقاط 🛍️</p>
              </div>
            )}
          </motion.div>

          
        </div>

        <NotificationPrompt phone={customerData.user.phone} />
      </div>
    </>
  );
}