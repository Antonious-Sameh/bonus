import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ArrowRight, Tag, ImageIcon, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext.jsx";
import Header from "@/components/Header.jsx";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/offers";

function getRemainingDays(expiresAt) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function OffersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(API);
        setOffers(res.data);
      } catch {
        // هندل بصمت
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleBack = () => {
    if (user?.role === "admin") navigate("/admin");
    else navigate(`/customer/${user?.phone}`);
  };

  return (
    <>
      <Helmet>
        <title>عروضنا - نسر البرية</title>
        <meta name="description" content="اعرف أحدث عروض وتخفيضات نسر البرية" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* رأس الصفحة */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Button variant="ghost" size="icon" onClick={handleBack}
              className="text-muted-foreground hover:text-foreground">
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
                عروضنا <Zap className="w-7 h-7 text-primary" />
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {offers.length} عرض متاح دلوقتي
              </p>
            </div>
          </motion.div>

          {/* المحتوى */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
            </div>
          ) : offers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <Tag className="w-20 h-20 text-muted-foreground mx-auto mb-5 opacity-30" />
              <p className="text-2xl font-bold text-foreground">مفيش عروض دلوقتي</p>
              <p className="text-muted-foreground mt-2">هنضيف عروض قريباً، ابقى اتابع!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, index) => {
                const remaining = getRemainingDays(offer.expiresAt);
                const isUrgent = remaining !== null && remaining <= 2;

                return (
                  <motion.div
                    key={offer._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 group
                      ${isUrgent
                        ? "border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                        : "border-white/10 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(57,255,20,0.08)]"}`}
                  >
                    {/* صورة العرض */}
                    <div className="h-52 bg-white/5 relative overflow-hidden">
                      {offer.imageUrl ? (
                        <img src={offer.imageUrl} alt={offer.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                      ) : null}
                      <div className="w-full h-full items-center justify-center bg-white/5"
                        style={{ display: offer.imageUrl ? "none" : "flex" }}>
                        <Tag className="w-14 h-14 text-muted-foreground opacity-25" />
                      </div>

                      {/* شارة المدة */}
                      <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm
                        ${isUrgent
                          ? "bg-orange-500/90 text-white"
                          : remaining !== null
                            ? "bg-primary/80 text-primary-foreground"
                            : "bg-blue-500/80 text-white"}`}>
                        <Clock className="w-3 h-3" />
                        {remaining === null ? "عرض دايم" :
                          remaining === 0 ? "آخر يوم! ⚡" :
                          remaining === 1 ? "يوم واحد متبقي! 🔥" :
                          `${remaining} يوم متبقي`}
                      </div>

                      {/* gradient في الأسفل */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                    </div>

                    {/* بيانات العرض */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                        {offer.title}
                      </h3>
                      {offer.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {offer.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}