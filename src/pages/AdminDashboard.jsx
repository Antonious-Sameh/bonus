import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  UserPlus,
  LogOut,
  Search,
  Trophy,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext.jsx";
import StatsCard from "@/components/StatsCard.jsx";
import Header from "@/components/Header.jsx";
import axios from "axios";

export default function AdminDashboard() {
  // بنجيب الدوال من الـ AuthContext اللي إحنا لسه معدلينه
  const { user, logout, addPoints, registerCustomer } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]); // لستة العملاء من الداتابيز
  const [addPointsOpen, setAddPointsOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [pointsPhone, setPointsPhone] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [note, setNote] = useState("");

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // دالة لجلب البيانات فورياً
  const fetchStatsAndCustomers = async () => {
    try {
      const response = await axios.get(
        "https://bonus-system-tau.vercel.app/api/admin/leaderboard",
      );
      // التعديل هنا: السيرفر دلوقتي بيبعت object فيه حاجتين
      setCustomers(response.data.customers); // لستة الزباين
      setServerStats(response.data.stats); // المبيعات والعدد الإجمالي
    } catch (error) {
      console.error("Error fetching admin data", error);
      toast.error("فشل في تحديث البيانات");
    }
  };
  const [serverStats, setServerStats] = useState({
    todaySales: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    fetchStatsAndCustomers();
  }, []);

  // الحسابات بناءً على البيانات اللي راجعة من السيرفر
  const totalPoints = customers.reduce((sum, c) => sum + (c.points || 0), 0);

  // لحساب مبيعات النهاردة من الداتا اللي راجعة (بشرط الباك إيند بيبعت الـ history)

  const handleAddPoints = async () => {
    if (!pointsPhone || !billAmount) {
      toast.error("لازم تملا كل الحقول");
      return;
    }

    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("المبلغ لازم يكون رقم صحيح");
      return;
    }

    // التعديل هنا: ضفنا note كباراميتر تالت للدالة
    const result = await addPoints(pointsPhone, amount, note);

    if (result.success) {
      toast.success(`تم يا ريس! ضفنا النقاط بنجاح`);
      setPointsPhone("");
      setBillAmount("");
      setNote(""); // التعديل هنا: بنصفر الملاحظة بعد النجاح
      setAddPointsOpen(false);
      fetchStatsAndCustomers();
    } else {
      toast.error(result.error || "الرقم ده مش موجود");
    }
  };

  const handleRegister = async () => {
    if (!newName || !newPhone || !newPassword) {
      toast.error("لازم تملا كل الحقول");
      return;
    }

    const result = await registerCustomer(newName, newPhone, newPassword);

    if (result.success) {
      toast.success(`تم تسجيل ${newName} بنجاح!`);
      setNewName("");
      setNewPhone("");
      setNewPassword("");
      setRegisterOpen(false);
      fetchStatsAndCustomers();
    } else {
      toast.error(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredCustomers = customers.filter(
    (c) => c.name.includes(searchQuery) || c.phone.includes(searchQuery),
  );

  return (
    <>
      <Helmet>
        <title>لوحة التحكم - نسر البرية</title>
        <meta
          name="description"
          content="إدارة العملاء والنقاط في نظام الولاء"
        />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <Header />

        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2">
                أهلاً يا {user?.name} 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                إدارة نظام نسر البرية
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* زرار التقارير الجديد اللي ضفناه */}
              <Button
                onClick={() => navigate("/admin/reports")}
                className="flex-1 sm:flex-none bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20"
              >
                <BarChart3 className="w-5 h-5 ml-2" />
                تقارير المبيعات
              </Button>

              <Button
                onClick={() => navigate("/admin/leaderboard")}
                className="flex-1 sm:flex-none bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
              >
                <Trophy className="w-5 h-5 ml-2" />
                لوحة المتصدرين
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="glass-card border-white/10 hover:bg-white/10"
              >
                <LogOut className="w-5 h-5 ml-2" />
                خروج
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={Users}
              label="إجمالي الزباين"
              value={serverStats.totalCustomers}
              delay={0.1}
            />
            <StatsCard
              icon={TrendingUp}
              label="النقاط اللي طلعت"
              value={customers.reduce((sum, c) => sum + (c.points || 0), 0)}
              delay={0.2}
            />
            <div
              onClick={() => navigate("/admin/reports")}
              className="cursor-pointer"
            >
              <StatsCard
                icon={DollarSign}
                label="مبيعات النهاردة"
                value={`${serverStats.todaySales} جنيه`}
                delay={0.3}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Dialog open={addPointsOpen} onOpenChange={setAddPointsOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all duration-300 active:scale-[0.98]">
                  <Plus className="w-6 h-6 ml-2" />
                  ضيف نقاط للزبون
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    ضيف نقاط
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="pointsPhone">رقم موبايل الزبون</Label>
                    <Input
                      id="pointsPhone"
                      type="tel"
                      value={pointsPhone}
                      onChange={(e) => setPointsPhone(e.target.value)}
                      placeholder="0101"
                      className="h-12 bg-background/50 border-white/10 text-foreground"
                    />
                    <div>
                      <Label htmlFor="note">اشترى إيه؟ (اختياري)</Label>
                      <Input
                        id="note"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="مثلاً: شاحن سامسونج  "
                        className="h-12 bg-background/50 border-white/10 text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="billAmount">مبلغ الفاتورة (جنيه)</Label>
                    <Input
                      id="billAmount"
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="150"
                      className="h-12 bg-background/50 border-white/10 text-foreground"
                    />
                  </div>
                  <p className="text-sm text-primary/80 bg-primary/10 p-3 rounded-lg border border-primary/20">
                    كل 10 جنيه = 1 نقطة
                  </p>
                  <Button
                    onClick={handleAddPoints}
                    className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground"
                  >
                    ضيف النقاط
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 h-14 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-secondary/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 active:scale-[0.98]">
                  <UserPlus className="w-6 h-6 ml-2" />
                  سجل زبون جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    تسجيل زبون جديد
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="newName">اسم الزبون</Label>
                    <Input
                      id="newName"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="الاسم"
                      className="h-12 bg-background/50 border-white/10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPhone">رقم الموبايل</Label>
                    <Input
                      id="newPhone"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="010000"
                      className="h-12 bg-background/50 border-white/10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">الباسورد</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••"
                      className="h-12 bg-background/50 border-white/10"
                    />
                  </div>
                  <Button
                    onClick={handleRegister}
                    className="w-full h-12 text-lg font-bold bg-primary"
                  >
                    سجل الزبون
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              قائمة الزباين
            </h2>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو رقم الموبايل"
                  className="pr-10 h-12 bg-background/50 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <motion.div
                    key={customer.phone}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all duration-300"
                  >
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.phone}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-primary drop-shadow-[0_0_5px_rgba(57,255,20,0.3)]">
                        {customer.points || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">نقطة</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-foreground font-medium">
                    لسه مفيش زباين
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
