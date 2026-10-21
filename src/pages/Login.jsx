import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Key,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function Login({
  onBackToLanding,
  onLogin,
  onOpenRegister,
  adminProfile
}) {
  // Default email diset ke namatoko@gmail.com
  const [formData, setFormData] = useState({
    email: 'namatoko@gmail.com',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotTip, setShowForgotTip] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim()) {
      setErrorMessage('Silakan masukkan email admin.');
      return;
    }

    if (!formData.password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onLogin) {
        onLogin({
          email: formData.email,
          rememberMe: formData.rememberMe,
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-[#101E2C] font-sans antialiased flex flex-col selection:bg-teal-primary selection:text-white">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={onBackToLanding}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="/logo_silaundry.png"
              alt="Logo SI Laundry"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#101E2C]">
              SI LAUNDRY
            </span>
          </div>

          {/* Back to Home Button */}
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#008A7B] transition-colors cursor-pointer group"
          >
            <span>&larr; Kembali ke beranda</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]">
        {/* LEFT COLUMN: Dark Navy Section */}
        <div className="lg:col-span-6 bg-[#1D3244] text-white p-8 sm:p-14 lg:p-20 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#00C4B4]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />

          {/* Top Content */}
          <div className="relative z-10 space-y-8 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A4358] border border-[#3A566E] text-[11px] font-bold text-[#5CE1D0] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CE1D0]" />
              <span>RUANG KERJA ANDA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Lebih banyak waktu untuk pelanggan, lebih sedikit untuk administrasi.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Masuk dan pantau pergerakan antrean cuci, status nota pelanggan WhatsApp, serta rekap kas harian secara instan.
            </p>

            {/* Decorative Graphic Wave Line */}
            <div className="pt-12 pb-6 flex justify-center">
              <svg className="w-full max-w-md h-12 text-[#3A5870]" viewBox="0 0 400 40" fill="none">
                <path
                  d="M0 20 Q 100 5, 200 20 T 400 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <path
                  d="M0 20 Q 100 35, 200 20 T 400 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="200" cy="20" r="4" fill="#5CE1D0" />
              </svg>
            </div>
          </div>

          {/* Bottom Footer Item */}
          <div className="relative z-10 pt-8 flex items-center gap-2 text-xs font-medium text-[#5CE1D0]">
            <div className="w-4 h-4 rounded-full bg-[#5CE1D0]/20 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-[#5CE1D0]" />
            </div>
            <span>Sistem Operasional Laundry Pintar</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Section */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            {/* Center Logo diperbesar & tanpa teks di bawahnya */}
            <div className="flex justify-center mb-4">
              <img
                src="/logo_silaundry.png"
                alt="SI Laundry Logo"
                className="h-24 sm:h-28 w-auto object-contain"
              />
            </div>

            {/* Lock Badge */}
            <div className="w-10 h-10 rounded-2xl bg-[#E6F7F5] text-[#008A7B] flex items-center justify-center">
              <Lock className="w-5 h-5 fill-[#008A7B]/20" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101E2C] tracking-tight">
                Selamat datang kembali
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Masuk ke akun admin untuk mulai mengelola operasional laundry Anda.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Email Admin Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email admin <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 focus-within:border-[#008A7B] focus-within:bg-white transition-all">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="namatoko@gmail.com"
                    className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent text-slate-800"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata sandi <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 focus-within:border-[#008A7B] focus-within:bg-white transition-all">
                  <Key className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded text-[#00665A] border-slate-300 focus:ring-[#00665A] accent-[#00665A] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600">Ingat saya</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotTip(!showForgotTip)}
                  className="text-xs font-bold text-[#008A7B] hover:underline cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>

              {showForgotTip && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Untuk bantuan reset kata sandi akun toko Anda, silakan hubungi Customer Support SI LAUNDRY via WhatsApp.
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#00665A] hover:bg-[#005248] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
                >
                  <span>{isSubmitting ? 'Memproses...' : 'Masuk ke Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Register Link Capsule */}
              <div className="pt-4">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] text-center text-xs text-slate-600">
                  Belum punya akun toko?{' '}
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="text-[#008A7B] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Daftar sekarang
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}