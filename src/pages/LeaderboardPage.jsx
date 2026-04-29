import React, { useState, useEffect } from "react"; // 💡 ضفنا دول
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Medal, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header.jsx";
import axios from "axios"; // 💡 ضفنا axios

export default function LeaderboardPage() {
  const navigate = useNavigate();

  // 💡 التعديل الجوهري: هنجيب الداتا من السيرفر مش من الـ Context
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://bonus-system-tau.vercel.app/api/admin/leaderboard",
        );

        // التعديل هنا يا ريس:
        // بنشوف لو الداتا جاية في الـ property اللي اسمها customers
        if (response.data && response.data.customers) {
          setCustomersList(response.data.customers);
        } else if (Array.isArray(response.data)) {
          // دي عشان لو السيرفر لسه بيبعت قديم (احتياطي)
          setCustomersList(response.data);
        } else {
          setCustomersList([]);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setCustomersList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // ترتيب الزبائن حسب النقاط
  const sortedCustomers = [...customersList].sort(
    (a, b) => b.points - a.points,
  );

  const getBadgeIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
        );
      case 2:
        return (
          <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]" />
        );
      case 3:
        return (
          <Award className="w-6 h-6 text-amber-600 drop-shadow-[0_0_8px_rgba(205,127,50,0.5)]" />
        );
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRowStyle = (rank) => {
    switch (rank) {
      case 1:
        return "border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/50";
      case 2:
        return "border-gray-300/30 bg-gray-300/5 hover:border-gray-300/50";
      case 3:
        return "border-amber-600/30 bg-amber-600/5 hover:border-amber-600/50";
      default:
        return "hover:border-primary/30 hover:bg-white/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>لوحة المتصدرين - نظام الولاء</title>
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-cairo">
        <Header />

        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10 text-primary" />
                لوحة المتصدرين
              </h1>
              <p className="text-lg text-muted-foreground">
                أفضل الزباين وأكثرهم نقاطاً
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="glass-card border-white/10 hover:bg-white/10"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              رجوع للوحة التحكم
            </Button>
          </motion.div>

          <div className="space-y-4">
            {sortedCustomers.length > 0 ? (
              sortedCustomers.map((customer, index) => (
                <motion.div
                  key={customer.phone}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`glass-card p-4 sm:p-6 flex items-center gap-4 sm:gap-6 transition-all duration-300 ${getRowStyle(index + 1)}`}
                >
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-background/50 rounded-full border border-white/10">
                    {getBadgeIcon(index + 1)}
                  </div>

                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-foreground truncate">
                        {customer.name}
                      </p>
                      {/* إضافة كود الزبون هنا 👇 */}
                      {customer.customerCode && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 font-mono">
                          #{customer.customerCode}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>

                  <div className="text-left flex-shrink-0">
                    <p className="text-2xl sm:text-3xl font-bold text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]">
                      {customer.points}
                    </p>
                    <p className="text-xs text-muted-foreground">نقطة</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-foreground font-medium">
                  لسه مفيش زباين
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  ابدأ ضيف زباين عشان يظهروا هنا
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
