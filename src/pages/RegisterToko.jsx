import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Eye,
  EyeOff,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

export default function RegisterToko({ onBackToLanding, onRegisterSuccess, onEnterDashboard, onOpenLogin }) {
  const [formData, setFormData] = useState({
    namaToko: '',
    namaAdmin: '',
    whatsapp: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Silakan setujui Ketentuan Layanan dan Kebijakan Privasi terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    // Simulate registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      if (onRegisterSuccess) {
        onRegisterSuccess({
          namaToko: formData.namaToko || 'SI LAUNDRY Express',
          namaAdmin: formData.namaAdmin || 'Admin Laundry',
          whatsapp: formData.whatsapp ? `+62 ${formData.whatsapp}` : '0812-3456-7890',
          email: formData.email || 'admin@silaundry.co.id',
        });
      }

      // Auto redirect to dashboard after 1.2s
      setTimeout(() => {
        if (onEnterDashboard) {
          onEnterDashboard();
        }
      }, 1200);
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
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke beranda</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]">
        {/* LEFT COLUMN: Hero & 3 Key Steps (Dark Navy Background) */}
        <div className="lg:col-span-6 bg-[#122232] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Lighting & Wave Patterns */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#00C4B4]/15 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4" />

          {/* Subtle curved wave background lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
            viewBox="0 0 600 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M-100 200 C 150 150, 350 400, 700 250" stroke="#00C4B4" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M-100 450 C 200 350, 400 650, 700 500" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M-50 680 C 180 580, 380 780, 650 650" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="450" cy="180" r="180" stroke="#00C4B4" strokeWidth="1" strokeOpacity="0.2" />
            <circle cx="100" cy="700" r="250" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.2" />
          </svg>

          {/* Top & Middle Content */}
          <div className="relative z-10 max-w-xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A3348] border border-[#234562] text-[11px] font-bold text-[#00C4B4] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00C4B4]" />
              <span>MULAI DARI TOKO ANDA</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.18] mt-6 text-white">
              Daftarkan toko sekali, lalu kelola setiap cucian dalam satu alur.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4 max-w-lg">
              Sistem operasional modern berbasis cloud untuk otomasi pesanan, nota digital WhatsApp, hingga pembukuan akurat.
            </p>

            {/* 3 Step List */}
            <div className="mt-10 sm:mt-12 space-y-7">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#008A7B] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-lg shadow-teal-900/40">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Daftarkan akun admin</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1">
                    Buat profil toko dan akses akun pemilik laundry dalam hitungan menit tanpa instalasi rumit.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#008A7B] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-lg shadow-teal-900/40">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Input cucian pelanggan</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1">
                    Catat jenis pakaian, hitung kiloan akurat, estimasi selesai otomatis, atau paket satuan premium.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#008A7B] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-lg shadow-teal-900/40">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Pantau hingga selesai</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1">
                    Perbarui progres cuci, kering, setrika hingga nota dan status terkirim otomatis ke WhatsApp pelanggan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column Bottom Footer */}
          <div className="relative z-10 pt-10 mt-10 border-t border-white/10 text-slate-400 text-xs font-medium">
            <p>SI LAUNDRY &bull; Sistem Manajemen Laundry Pintar Indonesia</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Registration Form (Clean White Background) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-12 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Logo Center */}
            <div className="text-center">
              <img
                src="/logo_silaundry.png"
                alt="Logo SI Laundry"
                className="h-16 w-auto object-contain mx-auto"
              />
              <h2 className="text-2xl sm:text-3xl font-black text-[#101E2C] tracking-tight mt-4">
                Daftarkan toko laundry
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">
                Buat akun admin untuk mulai mencatat dan memantau cucian pelanggan.
              </p>
            </div>

            {/* Success Notification */}
            {isSuccess ? (
              <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-scaleUp">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-emerald-900">Pendaftaran Berhasil!</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Akun toko <span className="font-semibold">{formData.namaToko || 'Laundry Anda'}</span> siap digunakan. Mengalihkan ke dashboard...
                </p>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {/* Row 1: Nama Toko & Nama Admin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Nama toko <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Laundry Bersih"
                      value={formData.namaToko}
                      onChange={(e) => setFormData({ ...formData, namaToko: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Nama admin <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama pengelola"
                      value={formData.namaAdmin}
                      onChange={(e) => setFormData({ ...formData, namaAdmin: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Row 2: WhatsApp Number with +62 Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#008A7B]/20 focus-within:border-[#008A7B] transition-all bg-white">
                    <div className="px-3.5 py-2.5 bg-[#E8F8F5] text-[#008A7B] font-bold text-xs sm:text-sm flex items-center gap-1.5 border-r border-slate-200 shrink-0">
                      <MessageSquare className="w-4 h-4 fill-[#008A7B]/20" />
                      <span>+62</span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="81234567890"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Digunakan untuk kirim nota digital &amp; verifikasi toko
                  </p>
                </div>

                {/* Row 3: Email Admin */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Email admin <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 gap-2.5 focus-within:ring-2 focus-within:ring-[#008A7B]/20 focus-within:border-[#008A7B] transition-all bg-white">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="admin@laundry.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent"
                    />
                  </div>
                </div>

                {/* Row 4: Password with Toggle and Hint */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Kata sandi <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Minimal 6 karakter</span>
                  </div>
                  <div className="flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 gap-2.5 focus-within:ring-2 focus-within:ring-[#008A7B]/20 focus-within:border-[#008A7B] transition-all bg-white">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Buat sandi yang aman"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent"
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

                {/* Checkbox: Terms & Conditions */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    required
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-[#008A7B] border-slate-300 focus:ring-[#008A7B] accent-[#008A7B] cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-snug cursor-pointer select-none">
                    Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi SI LAUNDRY untuk pengelolaan data toko.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#00665A] hover:bg-[#005248] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Mendaftarkan Toko...' : 'Daftar & masuk dashboard'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Footer: Already have account */}
                <p className="text-center text-xs text-slate-500 pt-2">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="text-[#008A7B] font-bold hover:underline cursor-pointer"
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}