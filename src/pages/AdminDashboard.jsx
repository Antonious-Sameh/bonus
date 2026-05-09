import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, TrendingUp, DollarSign, Plus, UserPlus, LogOut,
  Search, Trophy, BarChart3, Pencil, Trash2, Key, Package,
  Tag, ChevronLeft, X, Check, AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext.jsx";
import Header from "@/components/Header.jsx";
import axios from "axios";

// ── مكوّن كارت الإحصائية ──────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, delay, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${accent}12 0%, ${accent}04 100%)`,
        border: `1px solid ${accent}22`,
      }}
      whileHover={onClick ? { scale: 1.02 } : {}}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-black text-foreground">{value}</p>
      </div>
      {/* زخرفة */}
      <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full opacity-20"
        style={{ background: accent, filter: "blur(20px)" }} />
    </motion.div>
  );
}

// ── مكوّن زرار التنقل ─────────────────────────────────────────────
function NavBtn({ icon: Icon, label, onClick, accent = "#888" }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick}
      className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200"
      style={{ background: `${accent}12`, border: `1px solid ${accent}25`, color: accent }}
      onMouseEnter={e => { e.currentTarget.style.background = `${accent}20`; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${accent}12`; }}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </motion.button>
  );
}

// ── مكوّن Sheet (Drawer جانبي) ────────────────────────────────────
function Sheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full z-50 w-full max-w-sm overflow-y-auto"
            style={{
              background: "hsl(24 7% 9%)",
              borderLeft: "1px solid hsl(43 85% 55% / 0.12)"
            }}
          >
            {/* هيدر الـ sheet */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
              style={{ background: "hsl(24 7% 9%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── حقل Input بتصميم موحد ─────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "hsl(40 10% 55%)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldClass = "h-11 text-sm bg-black/30 border-white/8 text-foreground placeholder:text-muted-foreground/40 focus:border-primary/35 transition-all";

// ── زرار الإجراء الذهبي ───────────────────────────────────────────
function ActionBtn({ onClick, disabled, children, variant = "gold" }) {
  const styles = {
    gold: {
      background: "linear-gradient(135deg, hsl(43 85% 58%), hsl(35 78% 40%))",
      color: "hsl(24 8% 8%)",
      boxShadow: "0 3px 16px hsl(43 85% 55% / 0.25), inset 0 1px 0 hsl(43 85% 78% / 0.3)"
    },
    ghost: {
      background: "rgba(255,255,255,0.04)",
      color: "hsl(40 15% 70%)",
      border: "1px solid rgba(255,255,255,0.08)"
    }
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={styles[variant]}
    >
      {children}
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { user, logout, addPoints, registerCustomer } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [serverStats, setServerStats] = useState({ todaySales: 0, totalCustomers: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);

  // Sheets
  const [addPointsOpen, setAddPointsOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Forms
  const [pointsPhone, setPointsPhone] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [note, setNote] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCustomerCode, setNewCustomerCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [newPasswordForEdit, setNewPasswordForEdit] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://bonus-system-tau.vercel.app/api/admin/leaderboard");
      setCustomers(res.data.customers);
      setServerStats(res.data.stats);
    } catch { toast.error("فشل تحديث البيانات"); }
  };

  useEffect(() => { fetchData(); }, []);

  const totalPoints = customers.reduce((s, c) => s + (c.points || 0), 0);
  const filteredCustomers = customers.filter(c =>
    c.name?.includes(searchQuery) || c.phone?.includes(searchQuery)
  );

  const handleAddPoints = async () => {
    if (!pointsPhone || !billAmount) { toast.error("لازم تملا كل الحقول"); return; }
    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) { toast.error("المبلغ لازم يكون رقم صحيح"); return; }
    setIsLoadingPoints(true);
    const result = await addPoints(pointsPhone, amount, note);
    setIsLoadingPoints(false);
    if (result.success) {
      toast.success("✅ تم إضافة النقاط بنجاح!");
      setPointsPhone(""); setBillAmount(""); setNote("");
      setAddPointsOpen(false); fetchData();
    } else { toast.error(result.error || "الرقم مش موجود"); }
  };

  const handleRegister = async () => {
    if (!newName || !newPhone || !newPassword || !newCustomerCode) {
      toast.error("لازم تملا كل الحقول"); return;
    }
    setIsLoadingRegister(true);
    const result = await registerCustomer(newName, newPhone, newPassword, newCustomerCode);
    setIsLoadingRegister(false);
    if (result.success) {
      toast.success(`✅ تم تسجيل ${newName}!`);
      setNewName(""); setNewPhone(""); setNewPassword(""); setNewCustomerCode("");
      setRegisterOpen(false); fetchData();
    } else { toast.error(result.error); }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://bonus-system-tau.vercel.app/api/admin/update-customer/${editUser._id}`, {
        name: editUser.name, phone: editUser.phone, points: editUser.points, customerCode: editUser.customerCode,
      });
      toast.success("✅ تم التحديث"); setEditOpen(false); fetchData();
    } catch { toast.error("فشل التعديل"); }
  };

  const handleChangePassword = async () => {
    if (!newPasswordForEdit || newPasswordForEdit.length < 4) { toast.error("لازم 4 حروف على الأقل"); return; }
    setIsChangingPassword(true);
    try {
      await axios.put(`https://bonus-system-tau.vercel.app/api/admin/change-password/${editUser._id}`,
        { newPassword: newPasswordForEdit });
      toast.success(`✅ تم تغيير كلمة سر ${editUser.name}`);
      setNewPasswordForEdit("");
    } catch { toast.error("فشل تغيير كلمة السر"); }
    finally { setIsChangingPassword(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل تريد حذف "${name}"؟`)) return;
    try {
      await axios.delete(`https://bonus-system-tau.vercel.app/api/admin/delete-customer/${id}`);
      toast.success("تم الحذف"); fetchData();
    } catch { toast.error("فشل الحذف"); }
  };

  // ── الـ JSX ────────────────────────────────────────────────────
  return (
    <>
      <Helmet><title>لوحة التحكم — نسر البرية</title></Helmet>

      <div className="min-h-screen bg-background flex flex-col" dir="rtl">
        <Header />

        {/* خلفية */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
            style={{ background: "hsl(43 85% 55% / 0.04)", filter: "blur(100px)" }} />
          <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full"
            style={{ background: "hsl(43 85% 55% / 0.03)", filter: "blur(80px)" }} />
        </div>

        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-5 py-6 relative z-10">

          {/* ── رأس الصفحة ── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            className="mb-7">

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* الترحيب */}
              <div>
                <span className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "hsl(43 85% 58%)" }}>
                  لوحة التحكم
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
                  أهلاً يا {user?.name} 👋
                </h1>
              </div>

              {/* أزرار التنقل */}
              <div className="grid grid-cols-3 sm:flex gap-2">
                <NavBtn icon={BarChart3} label="التقارير"    onClick={() => navigate("/admin/reports")}     accent="#60a5fa" />
                <NavBtn icon={Package}   label="المنتجات"   onClick={() => navigate("/admin/products")}    accent="#fbbf24" />
                <NavBtn icon={Tag}       label="العروض"     onClick={() => navigate("/admin/offers")}      accent="#a78bfa" />
                <NavBtn icon={Trophy}    label="المتصدرين"  onClick={() => navigate("/admin/leaderboard")} accent="#34d399" />
                <NavBtn icon={LogOut}    label="خروج"       onClick={() => { logout(); navigate("/login"); }} accent="#f87171" />
              </div>
            </div>
          </motion.div>

          {/* ── إحصائيات ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <StatCard icon={Users}     label="إجمالي الزباين"   value={serverStats.totalCustomers} accent="#fbbf24" delay={0.1} />
            <StatCard icon={TrendingUp} label="النقاط الكلية"   value={totalPoints.toLocaleString()} accent="#a78bfa" delay={0.15} />
            <StatCard icon={DollarSign} label="مبيعات النهاردة" value={`${serverStats.todaySales} ج`} accent="#34d399" delay={0.2}
              onClick={() => navigate("/admin/reports")} />
          </div>

          {/* ── أزرار الإجراءات الرئيسية ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">

            {/* ضيف نقاط */}
            <motion.button whileTap={{ scale: 0.98 }}
              onClick={() => setAddPointsOpen(true)}
              className="group h-14 flex items-center justify-center gap-3 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(43 85% 58%), hsl(35 78% 40%))",
                color: "hsl(24 8% 8%)",
                boxShadow: "0 4px 24px hsl(43 85% 55% / 0.3), inset 0 1px 0 hsl(43 85% 78% / 0.35)"
              }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">ضيف نقاط للزبون</span>
            </motion.button>

            {/* سجل زبون */}
            <motion.button whileTap={{ scale: 0.98 }}
              onClick={() => setRegisterOpen(true)}
              className="group h-14 flex items-center justify-center gap-3 rounded-2xl font-bold text-base transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "hsl(40 20% 82%)"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            >
              <UserPlus className="w-5 h-5" />
              سجل زبون جديد
            </motion.button>
          </motion.div>

          {/* ── قائمة الزباين ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(24 7% 10%)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* هيدر القائمة */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(43 85% 55% / 0.12)", border: "1px solid hsl(43 85% 55% / 0.2)" }}>
                  <Users className="w-3.5 h-3.5" style={{ color: "hsl(43 85% 60%)" }} />
                </div>
                <h2 className="text-sm font-bold text-foreground">
                  قائمة الزباين
                  <span className="text-xs font-normal text-muted-foreground mr-1.5">({filteredCustomers.length})</span>
                </h2>
              </div>

              {/* بحث */}
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {activeSearch && (
                    <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 180, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder="اسم أو رقم..." autoFocus
                        className="h-8 text-xs bg-black/30 border-white/8 text-foreground w-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={() => { setActiveSearch(v => !v); if (activeSearch) setSearchQuery(""); }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                  style={{
                    background: activeSearch ? "hsl(43 85% 55% / 0.12)" : "rgba(255,255,255,0.05)",
                    border: activeSearch ? "1px solid hsl(43 85% 55% / 0.25)" : "1px solid rgba(255,255,255,0.08)",
                    color: activeSearch ? "hsl(43 85% 60%)" : "hsl(40 10% 55%)"
                  }}>
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* صفوف الزباين */}
            <div className="divide-y" style={{ divideColor: "rgba(255,255,255,0.04)" }}>
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer, index) => (
                <motion.div key={customer._id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                  className="group flex items-center gap-3 px-5 py-3.5 transition-all duration-200"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* أفاتار */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                    style={{
                      background: `hsl(${(customer.name?.charCodeAt(0) || 65) % 360} 40% 20%)`,
                      border: `1px solid hsl(${(customer.name?.charCodeAt(0) || 65) % 360} 40% 30%)`,
                      color: `hsl(${(customer.name?.charCodeAt(0) || 65) % 360} 70% 70%)`
                    }}>
                    {customer.name?.charAt(0) || "?"}
                  </div>

                  {/* اسم ورقم */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-foreground truncate">{customer.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0"
                        style={{ background: "hsl(43 85% 55% / 0.09)", border: "1px solid hsl(43 85% 55% / 0.18)", color: "hsl(43 85% 62%)" }}>
                        #{customer.customerCode || "---"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{customer.phone}</p>
                  </div>

                  {/* النقاط */}
                  <div className="text-center shrink-0 ml-2">
                    <p className="text-xl font-black" style={{ color: "hsl(43 85% 58%)" }}>
                      {(customer.points || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">نقطة</p>
                  </div>

                  {/* أزرار التعديل */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                    <button onClick={() => { setEditUser({ ...customer }); setEditOpen(true); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ color: "#60a5fa" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#60a5fa18"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(customer._id, customer.name)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ color: "#f87171" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8717118"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "مفيش نتايج للبحث" : "لسه مفيش زباين"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ══ Sheet إضافة نقاط ══ */}
        <Sheet open={addPointsOpen} onClose={() => setAddPointsOpen(false)} title="إضافة نقاط">
          <div className="space-y-5">
            {/* معلومة */}
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-medium"
              style={{ background: "hsl(43 85% 55% / 0.08)", border: "1px solid hsl(43 85% 55% / 0.18)", color: "hsl(43 85% 62%)" }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              كل 10 جنيه = 1 نقطة تضاف تلقائياً
            </div>

            <Field label="رقم موبايل الزبون">
              <Input type="tel" value={pointsPhone} onChange={e => setPointsPhone(e.target.value)}
                placeholder="01xxxxxxxxx" className={fieldClass} />
            </Field>

            <Field label="اشترى إيه؟ (اختياري)">
              <Input value={note} onChange={e => setNote(e.target.value)}
                placeholder="مثلاً: شاحن سامسونج" className={fieldClass} />
            </Field>

            <Field label="مبلغ الفاتورة (جنيه)">
              <Input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)}
                placeholder="150" className={fieldClass} />
              {billAmount && !isNaN(parseFloat(billAmount)) && (
                <p className="text-xs mt-1.5" style={{ color: "hsl(43 85% 60%)" }}>
                  ✨ هيكسب {Math.floor(parseFloat(billAmount) / 10)} نقطة
                </p>
              )}
            </Field>

            <ActionBtn onClick={handleAddPoints} disabled={isLoadingPoints}>
              {isLoadingPoints ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  جاري الإضافة...
                </span>
              ) : (
                <><Plus className="w-4 h-4" /> إضافة النقاط</>
              )}
            </ActionBtn>
          </div>
        </Sheet>

        {/* ══ Sheet تسجيل زبون ══ */}
        <Sheet open={registerOpen} onClose={() => setRegisterOpen(false)} title="تسجيل زبون جديد">
          <div className="space-y-4">
            <Field label="الاسم الكامل">
              <Input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="اسم الزبون" className={fieldClass} />
            </Field>
            <Field label="رقم الموبايل">
              <Input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                placeholder="01xxxxxxxxx" className={fieldClass} />
            </Field>
            <Field label="كلمة السر">
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••" className={fieldClass} />
            </Field>
            <Field label="كود الزبون المميز">
              <Input value={newCustomerCode} onChange={e => setNewCustomerCode(e.target.value)}
                placeholder="مثلاً: 101" className={fieldClass} />
            </Field>
            <div className="pt-2">
              <ActionBtn onClick={handleRegister} disabled={isLoadingRegister}>
                {isLoadingRegister ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    جاري التسجيل...
                  </span>
                ) : (
                  <><UserPlus className="w-4 h-4" /> تسجيل الزبون</>
                )}
              </ActionBtn>
            </div>
          </div>
        </Sheet>

        {/* ══ Sheet تعديل الزبون ══ */}
        <Sheet open={editOpen} onClose={() => { setEditOpen(false); setNewPasswordForEdit(""); }}
          title={editUser ? `تعديل: ${editUser.name}` : "تعديل"}>
          {editUser && (
            <div className="space-y-5">
              <Field label="كود الزبون">
                <Input value={editUser.customerCode || ""} onChange={e => setEditUser({ ...editUser, customerCode: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="الاسم">
                <Input value={editUser.name || ""} onChange={e => setEditUser({ ...editUser, name: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="رقم الموبايل">
                <Input value={editUser.phone || ""} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="النقاط">
                <Input type="number" value={editUser.points || 0}
                  onChange={e => setEditUser({ ...editUser, points: parseInt(e.target.value) || 0 })} className={fieldClass} />
              </Field>

              <ActionBtn onClick={handleUpdate}>
                <Check className="w-4 h-4" /> حفظ التعديلات
              </ActionBtn>

              {/* تغيير كلمة السر */}
              <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
                  style={{ color: "hsl(40 10% 50%)" }}>
                  <Key className="w-3.5 h-3.5" style={{ color: "hsl(43 85% 58%)" }} />
                  تغيير كلمة السر
                </p>
                <div className="flex gap-2">
                  <Input type="password" value={newPasswordForEdit}
                    onChange={e => setNewPasswordForEdit(e.target.value)}
                    placeholder="كلمة السر الجديدة" className={`${fieldClass} flex-1 h-10`} />
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={handleChangePassword} disabled={isChangingPassword}
                    className="px-4 h-10 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0"
                    style={{ background: "hsl(43 85% 55% / 0.12)", border: "1px solid hsl(43 85% 55% / 0.25)", color: "hsl(43 85% 62%)" }}>
                    {isChangingPassword ? "..." : "تغيير"}
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </Sheet>
      </div>
    </>
  );
}