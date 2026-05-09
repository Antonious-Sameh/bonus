import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone || !password) { setError('لازم تملا كل الحقول'); return; }
    setIsLoading(true);
    try {
      const result = await login(phone, password);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : `/customer/${result.user.phone}`);
      } else {
        setError(result.error);
      }
    } catch {
      setError('حصلت مشكلة غير متوقعة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0a0a0a] text-white selection:bg-primary/30 font-cairo overflow-x-hidden relative" dir="rtl">
      <Helmet>
        <title>دخول نسر البرية | فخامة التوفير</title>
      </Helmet>



        <Header />

      {/* خلفية سينمائية متطورة */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[100px]" 
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
        
        {/* منطقة اللوجو */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 text-center"
        >
          <div className="relative inline-block">
             <motion.div 
              animate={{ boxShadow: ["0 0 20px rgba(184,134,11,0.2)", "0 0 40px rgba(184,134,11,0.4)", "0 0 20px rgba(184,134,11,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 flex items-center justify-center text-5xl shadow-2xl relative z-10"
             >
               🦅
             </motion.div>
             <div className="absolute -inset-2 bg-primary/10 blur-2xl rounded-full z-0 animate-pulse" />
          </div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="mt-6 text-4xl font-black tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              نسر <span className="text-primary">البرية</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium tracking-[0.1em]">PREMIUM LOYALTY SYSTEM</p>
          </motion.div>
        </motion.div>

        {/* كارت التسجيل */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="w-full max-w-sm"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            
            {/* لمعة خفيفة بتتحرك */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase mr-1 tracking-widest">رقم الموبايل</label>
                <div className="relative group/input">
                  <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-primary transition-colors" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="h-14 pr-12 bg-black/40 border-white/10 rounded-2xl focus:ring-primary/20 focus:border-primary/40 text-lg transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase mr-1 tracking-widest">كلمة السر</label>
                <div className="relative group/input">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-primary transition-colors" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-14 pr-12 bg-black/40 border-white/10 rounded-2xl focus:ring-primary/20 focus:border-primary/40 text-lg transition-all"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">⚠️</div>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-primary via-[#ffcf67] to-primary bg-[length:200%_auto] hover:bg-right text-[#1a1a1a] rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(184,134,11,0.3)] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full animate-spin" />
                    جاري التحقق..
                  </div>
                ) : (
                  <>
                    دخول للنظام
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
          
          {/* Developed By - وضع بشكل أرقى */}
          <div className="mt-10 text-center">
             <div className="inline-flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-default">
                <span className="text-[9px] uppercase tracking-[0.3em] text-primary mb-1">Architecture By</span>
                <span className="text-sm font-light tracking-wide text-white">Eng. <span className="font-bold uppercase">Antonious Sameh</span></span>
             </div>
          </div>
        </motion.div>
      </main>

      
    </div>
  );
}