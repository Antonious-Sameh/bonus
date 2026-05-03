import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ArrowRight, LogOut, Receipt, Info, Star } from "lucide-react"; // ضفنا Star هنا
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext.jsx";
import PointsBadge from "@/components/PointsBadge.jsx";
import RewardCard from "@/components/RewardCard.jsx";
import TransactionItem from "@/components/TransactionItem.jsx";
import CommunityRank from "@/components/CommunityRank.jsx";
import ExpirationWarning from "@/components/ExpirationWarning.jsx";
import Header from "@/components/Header.jsx";
import axios from "axios";

export default function CustomerProfile() {
  const { phone } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://bonus-system-tau.vercel.app/api/admin/customer/${phone}`,
        );
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setCustomerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [phone, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!customerData || !customerData.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>مش عارفين نوصل لبياناتك حالياً يا بطل..</p>
      </div>
    );
  }

  const handleRedeemPoints = () => {
    const adminPhone = "201009012719";
    const cashValue = customerData.user.points;

    const message =
      `طلب استبدال نقاط - نسر البرية 🦅%0A%0A` +
      `العميل: ${customerData.user.name}%0A` +
      `رقم الهاتف: ${customerData.user.phone}%0A` +
      `إجمالي النقاط: ${customerData.user.points} نقطة%0A` +
      `المبلغ المستحق للخصم: ${cashValue} جنيه مصري%0A%0A` +
      `محتاج أستخدم النقاط دي في مشترياتي القادمة، شكراً!`;

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>{`${customerData.user.name || "البروفايل"} - نظام نسر البرية`}</title>
        <meta name="description" content="شوف نقاطك واستبدلها بهدايا مجانية" />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-cairo text-right" dir="rtl">
        <Header />

        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* أزرار التنقل */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="glass-card border-white/10 hover:bg-white/10"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              رجوع
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="glass-card border-white/10 hover:bg-white/10"
            >
              <LogOut className="w-5 h-5 ml-2" />
              خروج
            </Button>
          </motion.div>

          {/* رسالة الترحيب */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              أهلاً يا {customerData.user.name} 👋
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              نورت المحل، رقمك: {customerData.user.phone}
            </p>

            {/* زرار التقييم الجديد */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => window.open("https://g.page/r/CSSPGLjbftidEBI/review", "_blank")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 px-8 rounded-full shadow-lg shadow-yellow-500/20 flex items-center gap-2 mx-auto transition-all"
              >
                <Star className="w-5 h-5 fill-black" />
                قيم تجربتك معانا على جوجل
              </Button>
            </motion.div>
          </motion.div>

          {/* تنبيه توضيحي لنظام النقاط الجديد */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-10 flex items-center gap-4 text-primary"
          >
            <div className="bg-primary/20 p-2 rounded-full">
              <Info className="w-6 h-6" />
            </div>
            <p className="text-sm md:text-base font-medium leading-relaxed">
              نظامنا الجديد: كل 100 جنيه مشتريات بتديك 10 نقط.. وعند الاستبدال{" "}
              <strong>كل نقطة بتساوي 1 جنيه</strong> خصم فوري!
            </p>
          </motion.div>

          {/* باقي الكود كما هو... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <PointsBadge points={customerData.user.points || 0} />
            </motion.div>

            <div className="space-y-6">
              <CommunityRank
                rank={customerData.rank}
                totalCustomers={customerData.totalCustomers}
              />

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ExpirationWarning
                  expirationDate={customerData.user.expirationDate}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <RewardCard
              userPoints={customerData.user.points || 0}
              delay={0.4}
              onRedeem={handleRedeemPoints}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Receipt className="w-6 h-6 text-primary" />
              عملياتك اللي فاتت
            </h2>

            {customerData.history && customerData.history.length > 0 ? (
              <div className="space-y-1">
                {customerData.history.map((transaction, index) => (
                  <TransactionItem key={index} transaction={transaction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5">
                <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-foreground font-medium">
                  لسه مفيش عمليات تمت
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  ابدأ التسوق واكسب نقاط
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}