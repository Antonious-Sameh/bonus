import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Clock, Eye, CheckCircle, Trash2, RefreshCw, Filter } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header.jsx";
import axios from "axios";

const API = "https://bonus-system-tau.vercel.app/api/orders";

const STATUS = {
  pending: { label: "جديد",    color: "#fbbf24", bg: "hsl(43 85% 55% / 0.12)",  border: "hsl(43 85% 55% / 0.25)",  icon: Clock },
  seen:    { label: "تمت رؤيته", color: "#60a5fa", bg: "hsl(220 80% 55% / 0.1)", border: "hsl(220 80% 55% / 0.25)", icon: Eye },
  done:    { label: "تم",       color: "#34d399", bg: "hsl(145 60% 40% / 0.1)", border: "hsl(145 60% 40% / 0.25)", icon: CheckCircle },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      <Icon className="w-3 h-3" />{s.label}
    </span>
  );
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get(API);
      setOrders(res.data);
    } catch { toast.error("فشل تحميل الطلبات"); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API}/${id}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success("تم تحديث الحالة ✅");
    } catch { toast.error("فشل تحديث الحالة"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("تمسح الطلب ده؟")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.success("تم الحذف");
    } catch { toast.error("فشل الحذف"); }
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    seen: orders.filter(o => o.status === "seen").length,
    done: orders.filter(o => o.status === "done").length,
  };

  return (
    <>
      <Helmet><title>طلبات الزباين — نسر البرية</title></Helmet>

      <div className="min-h-screen bg-background flex flex-col" dir="rtl">
        <Header />

        <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-5 py-6">

          {/* رأس الصفحة */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin")}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "hsl(40 10% 55%)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "hsl(43 85% 58%)" }}>نوتة الطلبات</span>
                <h1 className="text-xl sm:text-2xl font-black text-foreground">
                  طلبات الزباين 📋
                </h1>
              </div>
            </div>

            <button onClick={() => fetchOrders(true)} disabled={refreshing}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "hsl(40 10% 60%)" }}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </motion.div>

          {/* فلتر */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-5 flex-wrap">
            {[
              { key: "all",     label: "الكل" },
              { key: "pending", label: "جديدة" },
              { key: "seen",    label: "تمت رؤيتها" },
              { key: "done",    label: "تمت" },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: filter === key ? "hsl(43 85% 55% / 0.15)" : "rgba(255,255,255,0.04)",
                  border: filter === key ? "1px solid hsl(43 85% 55% / 0.3)" : "1px solid rgba(255,255,255,0.07)",
                  color: filter === key ? "hsl(43 85% 62%)" : "hsl(40 10% 55%)"
                }}>
                {label}
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </motion.div>

          {/* الطلبات */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20">
              <ShoppingBag className="w-14 h-14 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-sm text-muted-foreground">مفيش طلبات دلوقتي</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((order, index) => (
                  <motion.div key={order._id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-2xl p-4 sm:p-5"
                    style={{
                      background: "hsl(24 7% 10%)",
                      border: order.status === "pending"
                        ? "1px solid hsl(43 85% 55% / 0.18)"
                        : "1px solid rgba(255,255,255,0.06)"
                    }}
                  >
                    {/* هيدر الكارت */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                          style={{
                            background: `hsl(${(order.customerName?.charCodeAt(0) || 65) % 360} 40% 18%)`,
                            border: `1px solid hsl(${(order.customerName?.charCodeAt(0) || 65) % 360} 40% 28%)`,
                            color: `hsl(${(order.customerName?.charCodeAt(0) || 65) % 360} 70% 68%)`
                          }}>
                          {order.customerName?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-foreground truncate">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* نص الطلب */}
                    <div className="rounded-xl p-3.5 mb-4"
                      style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p className="text-sm text-foreground/85 leading-relaxed">{order.request}</p>
                    </div>

                    {/* فوتر الكارت */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-xs text-muted-foreground/50">{timeAgo(order.createdAt)}</p>

                      <div className="flex items-center gap-2">
                        {/* تغيير الحالة */}
                        {order.status === "pending" && (
                          <button onClick={() => handleStatus(order._id, "seen")}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: "hsl(220 80% 55% / 0.1)", border: "1px solid hsl(220 80% 55% / 0.22)", color: "#60a5fa" }}>
                            <Eye className="w-3 h-3" /> شفته
                          </button>
                        )}
                        {order.status === "seen" && (
                          <button onClick={() => handleStatus(order._id, "done")}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: "hsl(145 60% 40% / 0.1)", border: "1px solid hsl(145 60% 40% / 0.25)", color: "#34d399" }}>
                            <CheckCircle className="w-3 h-3" /> تم
                          </button>
                        )}

                        {/* حذف */}
                        <button onClick={() => handleDelete(order._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                          style={{ color: "#f87171" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f8717115"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
