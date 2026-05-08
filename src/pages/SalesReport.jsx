import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Star, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import axios from 'axios';

export default function SalesReport() {
  const navigate = useNavigate();
  const [data, setData] = useState({ summary: {}, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('https://bonus-system-tau.vercel.app/api/admin/sales-report');
        setData(response.data);
      } catch (err) {
        console.error("Error fetching report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-cairo text-right" dir="rtl">
      <Header />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Calendar className="text-primary w-7 h-7" /> تقرير اليوم
            </h1>
            <p className="text-muted-foreground text-sm mt-1">متابعة المبيعات والعمليات لحظة بلحظة</p>
          </div>
          <Button onClick={() => navigate('/admin')} variant="outline"
            className="glass-card border-white/10 hover:bg-white/10 gap-2">
            <ArrowRight className="w-4 h-4" /> رجوع
          </Button>
        </div>

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="إجمالي الدخل" value={`${data.summary.totalSales ?? 0} ج.م`} icon={<DollarSign />} color="text-green-400" delay={0.1} />
          <StatCard title="عدد المبيعات" value={data.summary.ordersCount ?? 0} icon={<ShoppingBag />} color="text-blue-400" delay={0.2} />
          <StatCard title="نقط تم توزيعها" value={data.summary.totalPoints ?? 0} icon={<Star />} color="text-yellow-400" delay={0.3} />
        </div>

        {/* جدول العمليات */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }} className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/10 bg-white/5">
            <h2 className="font-bold text-lg">سجل عمليات اليوم</h2>
          </div>

          {/* موبايل: cards بدل table */}
          <div className="block sm:hidden divide-y divide-white/5">
            {data.transactions.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">مفيش مبيعات سجلتها النهاردة لسه</div>
            ) : data.transactions.map((t) => (
              <div key={t.id} className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground">{t.customerName}</p>
                  <p className="text-primary font-bold">{t.amount} ج.م</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">{t.customerPhone}</p>
                  <p className="text-yellow-400 font-medium">+{t.points} نقطة</p>
                </div>
                {t.note && <p className="text-sm text-muted-foreground">{t.note}</p>}
                <p className="text-xs text-muted-foreground/60">
                  {new Date(t.time).toLocaleTimeString('ar-EG')}
                </p>
              </div>
            ))}
          </div>

          {/* ديسكتوب: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="p-4 text-right">الزبون</th>
                  <th className="p-4 text-right">المبلغ</th>
                  <th className="p-4 text-right">النقط</th>
                  <th className="p-4 text-right">الملاحظة</th>
                  <th className="p-4 text-right">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold">{t.customerName}</p>
                      <p className="text-xs text-muted-foreground">{t.customerPhone}</p>
                    </td>
                    <td className="p-4 text-primary font-bold">{t.amount} ج.م</td>
                    <td className="p-4 text-yellow-400">+{t.points}</td>
                    <td className="p-4 text-sm">{t.note}</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(t.time).toLocaleTimeString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.transactions.length === 0 && (
              <div className="p-10 text-center text-muted-foreground">مفيش مبيعات سجلتها النهاردة لسه</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="glass-card p-5 flex items-center gap-4"
    >
      <div className={`p-3 rounded-xl bg-white/5 ${color}`}>{icon}</div>
      <div>
        <p className="text-muted-foreground text-xs mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

