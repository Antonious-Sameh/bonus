import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Star, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 font-cairo text-right" dir="rtl">
      {/* الهيدر */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="text-primary" /> تقرير اليوم
          </h1>
          <p className="text-muted-foreground text-sm">متابعة المبيعات والعمليات لحظة بلحظة</p>
        </div>
        <Button onClick={() => navigate('/admin')} variant="outline" className="gap-2">
          <ArrowRight className="w-4 h-4" /> رجوع
        </Button>
      </div>

      {/* كروت الإحصائيات */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="إجمالي الدخل" value={`${data.summary.totalSales} ج.م`} icon={<DollarSign />} color="text-green-500" />
        <StatCard title="عدد المبيعات" value={data.summary.ordersCount} icon={<ShoppingBag />} color="text-blue-500" />
        <StatCard title="نقط تم توزيعها" value={data.summary.totalPoints} icon={<Star />} color="text-yellow-500" />
      </div>

      {/* جدول العمليات */}
      <div className="max-w-6xl mx-auto glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="font-bold">سجل عمليات اليوم</h2>
        </div>
        <div className="overflow-x-auto">
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
                  <td className="p-4 text-yellow-500">+{t.points}</td>
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
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 flex items-center gap-4">
      <div className={`p-4 rounded-xl bg-white/5 ${color}`}>{icon}</div>
      <div>
        <p className="text-muted-foreground text-xs">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}