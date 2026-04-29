import React from 'react';
import { Receipt } from 'lucide-react';

export default function TransactionItem({ transaction }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // حل مشكلة النقط
  const displayPoints = transaction.pointsAdded || transaction.points || 0;

  return (
    <div className="glass-card p-4 mb-3 flex flex-col gap-2 transition-all duration-300 hover:bg-white/10 hover:border-primary/30">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Receipt className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{formatDate(transaction.date || transaction.createdAt)}</p>
          <p className="text-base font-medium text-foreground">فاتورة {transaction.amount} جنيه</p>
        </div>
        <div className="text-left">
          <p className="text-lg font-bold text-primary drop-shadow-[0_0_5px_rgba(57,255,20,0.3)]">
            +{displayPoints}
          </p>
          <p className="text-xs text-muted-foreground">نقطة</p>
        </div>
      </div>

      {/* التعديل هنا: هيظهر "تفاصيل" حتى لو السيرفر مبعتهاش */}
      <div className="mt-1 mr-12 px-3 py-1.5 bg-primary/5 border-r-2 border-primary/40 rounded-sm">
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          <span className="text-primary/80 font-bold ml-1 non-italic">تفاصيل:</span>
          {transaction.note || "عملية شراء"}
        </p>
      </div>
    </div>
  );
}