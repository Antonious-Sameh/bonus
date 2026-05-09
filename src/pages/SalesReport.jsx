import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  DollarSign,
  ShoppingBag,
  Star,
  Minus,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/Header.jsx";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/admin/sales-report";

// ── helpers ──────────────────────────────────────────────────────
function toLocalISO(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatArabicDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function diffPercent(current, prev) {
  if (!prev) return null;
  return Math.round(((current - prev) / prev) * 100);
}

// ── مكون StatCard ─────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4"
      style={{ background: `${accent}10`, border: `1px solid ${accent}22` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium mb-0.5">
          {label}
        </p>
        <p className="text-2xl font-black text-foreground truncate">{value}</p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: `${accent}bb` }}>
            {sub}
          </p>
        )}
      </div>
      <div
        className="absolute -left-3 -bottom-3 w-16 h-16 rounded-full opacity-15"
        style={{ background: accent, filter: "blur(16px)" }}
      />
    </motion.div>
  );
}

// ── مكون صف العملية ───────────────────────────────────────────────
function TxRow({ tx, type = "sale" }) {
  const isRedeem = type === "redeem";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-3.5 transition-all"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* أفاتار */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs"
        style={{
          background: isRedeem
            ? "hsl(0 70% 50% / 0.12)"
            : "hsl(43 85% 55% / 0.1)",
          border: isRedeem
            ? "1px solid hsl(0 70% 50% / 0.22)"
            : "1px solid hsl(43 85% 55% / 0.2)",
          color: isRedeem ? "#f87171" : "hsl(43 85% 62%)",
        }}
      >
        {tx.customerName?.charAt(0) || "?"}
      </div>

      {/* بيانات */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {tx.customerName}
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          {tx.customerPhone}
        </p>
        {tx.note && (
          <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
            {tx.note}
          </p>
        )}
      </div>

      {/* قيمة */}
      <div className="text-left shrink-0">
        {isRedeem ? (
          <p className="text-sm font-bold" style={{ color: "#f87171" }}>
            -{tx.points} نقطة
          </p>
        ) : (
          <p className="text-sm font-bold" style={{ color: "hsl(43 85% 60%)" }}>
            {tx.amount} ج
          </p>
        )}
        {!isRedeem && (
          <p className="text-xs text-muted-foreground/60">+{tx.points} نقطة</p>
        )}
        <p className="text-[10px] text-muted-foreground/40 mt-0.5">
          {formatTime(tx.time)}
        </p>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function SalesReport() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(toLocalISO(new Date()));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("sales"); // sales | redeem

  const fetchReport = useCallback(async (date, silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get(`${API}?date=${date}`);
      setData(res.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate, fetchReport]);

  const goDay = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    if (d > new Date()) return; // مش نروح مستقبل
    setSelectedDate(toLocalISO(d));
  };

  const isToday = selectedDate === toLocalISO(new Date());
  const isYesterday =
    selectedDate === toLocalISO(new Date(Date.now() - 86400000));

  const diff = data
    ? diffPercent(data.summary.totalSales, data.summary.yesterdaySales)
    : null;

  return (
    <>
      <Helmet>
        <title>تقرير المبيعات — نسر البرية</title>
      </Helmet>

      <div
        className="min-h-screen bg-background flex flex-col font-cairo"
        dir="rtl"
      >
        <Header />

        {/* خلفية */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full"
            style={{
              background: "hsl(43 85% 55% / 0.04)",
              filter: "blur(100px)",
            }}
          />
        </div>

        <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-5 py-6 relative z-10">
          {/* ── رأس الصفحة ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin")}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "hsl(40 10% 55%)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div>
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "hsl(43 85% 58%)" }}
                >
                  تقرير المبيعات
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-foreground">
                  {isToday
                    ? "النهارده 📊"
                    : isYesterday
                      ? "أمبارح 📅"
                      : "تقرير مخصص 📅"}
                </h1>
              </div>
            </div>

            <button
              onClick={() => fetchReport(selectedDate, true)}
              disabled={refreshing}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "hsl(40 10% 60%)",
              }}
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </motion.div>

          {/* ── Date Picker ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl p-4 mb-5"
            style={{
              background: "hsl(24 7% 10%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* أزرار سريعة */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {[
                { label: "النهارده", val: toLocalISO(new Date()) },
                {
                  label: "أمبارح",
                  val: toLocalISO(new Date(Date.now() - 86400000)),
                },
                {
                  label: "قبل كده",
                  val: toLocalISO(new Date(Date.now() - 2 * 86400000)),
                },
              ].map(({ label, val }) => (
                <button
                  key={val}
                  onClick={() => setSelectedDate(val)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background:
                      selectedDate === val
                        ? "hsl(43 85% 55% / 0.15)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      selectedDate === val
                        ? "1px solid hsl(43 85% 55% / 0.3)"
                        : "1px solid rgba(255,255,255,0.07)",
                    color:
                      selectedDate === val
                        ? "hsl(43 85% 62%)"
                        : "hsl(40 10% 55%)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Date Navigator */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => goDay(-1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all shrink-0"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "hsl(40 10% 60%)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div
                className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl justify-center"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <CalendarDays
                  className="w-4 h-4 shrink-0"
                  style={{ color: "hsl(43 85% 58%)" }}
                />
                <input
                  type="date"
                  value={selectedDate}
                  max={toLocalISO(new Date())}
                  onChange={(e) =>
                    e.target.value && setSelectedDate(e.target.value)
                  }
                  className="bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer flex-1 text-center"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <button
                onClick={() => goDay(1)}
                disabled={isToday}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all shrink-0 disabled:opacity-30"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "hsl(40 10% 60%)",
                }}
                onMouseEnter={(e) =>
                  !isToday &&
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* التاريخ بالعربي */}
            <p className="text-center text-xs text-muted-foreground mt-2.5">
              {formatArabicDate(selectedDate)}
            </p>
          </motion.div>

          {/* ── المحتوى ── */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">
                  جاري تحميل التقرير...
                </p>
              </motion.div>
            ) : !data ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-sm">
                  فشل تحميل البيانات
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* ── إحصائيات ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <StatCard
                    icon={DollarSign}
                    label="إجمالي المبيعات"
                    value={`${data.summary.totalSales.toLocaleString()} ج`}
                    accent="#fbbf24"
                    delay={0.05}
                    sub={
                      diff !== null
                        ? diff >= 0
                          ? `▲ ${diff}% عن أمس`
                          : `▼ ${Math.abs(diff)}% عن أمس`
                        : undefined
                    }
                  />
                  <StatCard
                    icon={ShoppingBag}
                    label="عدد العمليات"
                    value={data.summary.ordersCount}
                    accent="#60a5fa"
                    delay={0.1}
                  />
                  <StatCard
                    icon={Star}
                    label="نقاط أضيفت"
                    value={data.summary.totalPoints.toLocaleString()}
                    accent="#a78bfa"
                    delay={0.15}
                  />
                  <StatCard
                    icon={Minus}
                    label="نقاط استُبدلت"
                    value={data.summary.totalRedeem || 0}
                    accent="#f87171"
                    delay={0.2}
                  />
                </div>

                {/* مقارنة مع أمس */}
                {diff !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm font-semibold"
                    style={{
                      background:
                        diff >= 0
                          ? "hsl(145 60% 40% / 0.08)"
                          : "hsl(0 70% 50% / 0.08)",
                      border:
                        diff >= 0
                          ? "1px solid hsl(145 60% 40% / 0.2)"
                          : "1px solid hsl(0 70% 50% / 0.2)",
                      color: diff >= 0 ? "#34d399" : "#f87171",
                    }}
                  >
                    {diff >= 0 ? (
                      <TrendingUp className="w-4 h-4 shrink-0" />
                    ) : (
                      <TrendingDown className="w-4 h-4 shrink-0" />
                    )}
                    <span>
                      {diff >= 0
                        ? `المبيعات أحسن من أمس بنسبة ${diff}% 🎉`
                        : `المبيعات أقل من أمس بنسبة ${Math.abs(diff)}%`}
                    </span>
                    <span className="text-xs font-normal mr-auto text-muted-foreground">
                      أمس: {data.summary.yesterdaySales.toLocaleString()} ج
                    </span>
                  </motion.div>
                )}

                {/* ── Tabs ── */}
                <div className="flex items-center gap-2 mb-4">
                  {[
                    {
                      key: "sales",
                      label: "المبيعات",
                      count: data.transactions.length,
                    },
                    {
                      key: "redeem",
                      label: "الاستبدالات",
                      count: data.redeemTransactions?.length || 0,
                    },
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background:
                          activeTab === key
                            ? "hsl(43 85% 55% / 0.14)"
                            : "rgba(255,255,255,0.04)",
                        border:
                          activeTab === key
                            ? "1px solid hsl(43 85% 55% / 0.28)"
                            : "1px solid rgba(255,255,255,0.07)",
                        color:
                          activeTab === key
                            ? "hsl(43 85% 62%)"
                            : "hsl(40 10% 55%)",
                      }}
                    >
                      {label}
                      <span
                        className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        {count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* ── جدول العمليات ── */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "hsl(24 7% 10%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* هيدر الجدول */}
                  <div
                    className="flex items-center gap-2.5 px-4 py-3.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{
                        background: "hsl(43 85% 55% / 0.12)",
                        border: "1px solid hsl(43 85% 55% / 0.2)",
                      }}
                    >
                      <ReceiptText
                        className="w-3 h-3"
                        style={{ color: "hsl(43 85% 60%)" }}
                      />
                    </div>
                    <h2 className="text-sm font-bold text-foreground">
                      {activeTab === "sales"
                        ? "عمليات البيع"
                        : "عمليات الاستبدال"}
                    </h2>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "sales" ? (
                      <motion.div
                        key="sales"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {data.transactions.length > 0 ? (
                          data.transactions.map((tx) => (
                            <TxRow key={tx.id} tx={tx} type="sale" />
                          ))
                        ) : (
                          <div className="text-center py-14">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                            <p className="text-sm text-muted-foreground">
                              مفيش مبيعات في اليوم ده
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="redeem"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {data.redeemTransactions?.length > 0 ? (
                          data.redeemTransactions.map((tx) => (
                            <TxRow key={tx.id} tx={tx} type="redeem" />
                          ))
                        ) : (
                          <div className="text-center py-14">
                            <Minus className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                            <p className="text-sm text-muted-foreground">
                              مفيش استبدالات في اليوم ده
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
