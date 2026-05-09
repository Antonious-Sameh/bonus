import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Smartphone, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';

const BackgroundEffects = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Glow 1 */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      {/* Glow 2 */}
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      {/* Texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
        }}
      />
    </div>
  );
});

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!phone.trim() || !password.trim()) {
      setError('لازم تملا كل الحقول');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(phone, password);

      if (result.success) {
        navigate(
          result.user.role === 'admin'
            ? '/admin'
            : `/customer/${result.user.phone}`
        );
      } else {
        setError(result.error || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError('حصلت مشكلة غير متوقعة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-[100dvh] bg-[#0b0b0b] text-white relative overflow-hidden font-cairo"
    >
      <Helmet>
        <title>تسجيل الدخول | نسر البرية</title>
      </Helmet>

      <BackgroundEffects />

      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        <Header />

        <main className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-10">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl" />

                <div className="relative w-full h-full rounded-[2rem] border border-primary/20 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-5xl shadow-2xl">
                  🦅
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight">
                نسر <span className="text-primary">البرية</span>
              </h1>

              <p className="mt-2 text-sm text-gray-500 tracking-wide">
                PREMIUM LOYALTY SYSTEM
              </p>
            </div>

            {/* Card */}
            <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-[2rem] p-7 shadow-2xl transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm text-primary font-bold">
                    رقم الموبايل
                  </label>

                  <div className="relative">
                    <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <Input
                      autoFocus
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="h-14 pr-12 rounded-2xl bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-2 text-sm text-primary font-bold">
                    كلمة السر
                  </label>

                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-14 pr-12 pl-12 rounded-2xl bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl px-4 py-3">
                    {error}
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-[#ffcf67] text-[#1a1a1a] font-black text-lg flex items-center justify-center gap-3 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      جاري التحقق...
                    </div>
                  ) : (
                    <>
                      دخول للنظام
                      <LogIn className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center opacity-50">
              <p className="text-xs tracking-[0.2em] text-primary uppercase mb-1">
                Developed By
              </p>

              <p className="text-sm text-white">
                Eng.{' '}
                <span className="font-bold uppercase">
                  Antonious Sameh
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}