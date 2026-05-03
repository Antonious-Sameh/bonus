import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Smartphone, Lock, LogIn } from 'lucide-react'; // شيلنا الـ Info
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    if (!phone || !password) {
      setError('لازم تملا كل الحقول');
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(phone, password); 
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(`/customer/${result.user.phone}`);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("حصلت مشكلة غير متوقعة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول - نظام نسر البرية</title>
        <meta name="description" content="سجل دخولك لنظام نسر البرية واكسب نقاط مع كل عملية شراء" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background relative overflow-hidden font-cairo">
        <Header />
        
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6 border border-primary/20 glow-neon"
              >
                <Smartphone className="w-10 h-10" />
              </motion.div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2">
                سجل دخولك يا بطل
              </h1>
              <p className="text-lg text-muted-foreground">اكسب نقاط مع كل عملية شراء</p>
            </div>

            <div className="glass-card p-8 relative overflow-hidden group">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="phone" className="text-base font-medium text-foreground mb-2 block">
                    رقم الموبايل
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="pr-10 h-12 text-base bg-background/50 border-white/10 text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-base font-medium text-foreground mb-2 block">
                    الباسورد
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="pr-10 h-12 text-base bg-background/50 border-white/10 text-foreground"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                    <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all duration-300 active:scale-[0.98]"
                >
                  {isLoading ? <span>جاري التحميل...</span> : (
                    <>
                      <LogIn className="w-5 h-5 ml-2" />
                      دخول
                    </>
                  )}
                </Button>
              </form>
              
              {/* تاتش المطور تحت الفورم مباشرة */}
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 mb-1">Developed By</p>
                <p className="text-sm font-medium text-foreground/60">Eng. Antonious Sameh</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* الفوتر في آخر الصفحة */}
        <footer className="py-6 text-center relative z-10">
           <p className="text-xs text-muted-foreground opacity-50 hover:opacity-100 transition-opacity">
             جميع الحقوق محفوظة &copy; {new Date().getFullYear()} | 
             <a href="tel:01223307593" className="hover:text-primary mx-1 transition-colors">
                م/ أنطونيوس سامح (01223307593)
             </a>
           </p>
        </footer>
      </div>
    </>
  );
}