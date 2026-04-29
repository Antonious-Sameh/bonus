import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ExpirationWarning({ expirationDate }) {
  // Calculate days left
  const today = new Date('2026-04-28'); // Using current date from prompt context
  const expDate = new Date(expirationDate);
  const diffTime = expDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let statusClass = 'status-green';
  let Icon = CheckCircle2;
  
  if (daysLeft <= 7) {
    statusClass = 'status-red';
    Icon = AlertCircle;
  } else if (daysLeft <= 60) {
    statusClass = 'status-orange';
    Icon = Clock;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-5 border ${statusClass} flex flex-col sm:flex-row items-start sm:items-center gap-4`}
    >
      <div className="p-3 rounded-xl bg-background/20 backdrop-blur-sm">
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-1">
          {daysLeft > 0 ? `فاضل ${daysLeft} يوم على انتهاء نقطك` : 'نقطك انتهت صلاحيتها'}
        </h3>
        <p className="text-sm opacity-90">
          تاريخ انتهاء النقاط: {formatDate(expirationDate)}
        </p>
        <p className="text-xs opacity-75 mt-2">
          * نقطك صالحة لمدة 3 شهور من تاريخ الشراء
        </p>
      </div>
    </motion.div>
  );
}