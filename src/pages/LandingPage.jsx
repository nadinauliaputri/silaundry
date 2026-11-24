import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  Wallet,
  Layers,
  ShoppingBag,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  Sun,
  Moon,
  Check,
  X,
  Menu
} from 'lucide-react';

export default function LandingPage({ onEnterLogin, onOpenRegister }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [registerForm, setRegisterForm] = useState({
    namaPemilik: '',
    namaToko: '',
    whatsapp: '',
    alamat: ''
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // State mode gelap/terang terpusat via ThemeContext
  const { isDarkMode, toggleDarkMode: handleToggleDarkMode } = useTheme();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterSuccess(true);
    setTimeout(() => {
      setIsRegisterModalOpen(false);
      setRegisterSuccess(false);
      onEnterLogin();
    }, 1500);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1520] text-[#101E2C] dark:text-slate-100 font-sans antialiased selection:bg-[#008A7B] selection:text-white overflow-x-hidden transition-colors duration-300">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#101E2C]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
            onClick={() => {
              setActiveSection('');
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src={isDarkMode ? '/logo_dark.png' : '/logo_silaundry.png'}
              alt="Logo SI Laundry"
              onError={(e) => {
                e.currentTarget.src = '/logo_silaundry.png';
              }}
              className="h-10 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#101E2C] dark:text-white">
              SI LAUNDRY
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollToSection('fitur')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeSection === 'fitur'
                  ? 'bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#2AD3C0] shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#008A7B] dark:hover:text-[#2AD3C0]'
                }`}
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection('cara-kerja')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeSection === 'cara-kerja'
                  ? 'bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#2AD3C0] shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#008A7B] dark:hover:text-[#2AD3C0]'
                }`}
            >
              Cara Kerja
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Daftar Toko Link */}
            <button
              onClick={onOpenRegister || (() => setIsRegisterModalOpen(true))}
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#008A7B] dark:hover:text-[#2AD3C0] transition-colors hidden md:block cursor-pointer"
            >
              Daftar toko
            </button>

            {/* Desktop Masuk Admin Button */}
            <button
              onClick={onEnterLogin}
              className="hidden md:flex px-4 sm:px-5 py-2.5 rounded-xl bg-[#101E2C] hover:bg-[#182C3F] dark:bg-[#008A7B] dark:hover:bg-[#007366] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all items-center gap-2 group cursor-pointer"
            >
              <span>Masuk / Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Manual Toggle Mode Terang / Gelap */}
            <button
              type="button"
              onClick={handleToggleDarkMode}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F0F4FA] dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-transparent dark:border-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#008A7B]/30"
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle Button (visible on < md) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800 dark:text-slate-100" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800 dark:text-slate-100" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown / Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-[#101E2C]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection('fitur');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${activeSection === 'fitur'
                    ? 'bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#2AD3C0]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-[#008A7B]'
                  }`}
              >
                <span>Fitur</span>
                {activeSection === 'fitur' && <span className="w-2 h-2 rounded-full bg-[#008A7B]" />}
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection('cara-kerja');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${activeSection === 'cara-kerja'
                    ? 'bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#2AD3C0]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-[#008A7B]'
                  }`}
              >
                <span>Cara Kerja</span>
                {activeSection === 'cara-kerja' && <span className="w-2 h-2 rounded-full bg-[#008A7B]" />}
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenRegister) {
                    onOpenRegister();
                  } else {
                    setIsRegisterModalOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-[#008A7B] transition-all text-left cursor-pointer"
              >
                <span>Daftar toko</span>
                <span className="text-[11px] font-bold text-[#008A7B] dark:text-[#2AD3C0] bg-[#E6F8F5] dark:bg-[#008A7B]/20 px-2 py-0.5 rounded-full">
                  Gratis
                </span>
              </button>
            </div>

            {/* CTA Masuk / Login in Mobile Menu */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onEnterLogin();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#101E2C] hover:bg-[#182C3F] dark:bg-[#008A7B] dark:hover:bg-[#007366] active:bg-[#0a131c] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk / Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-28 bg-gradient-to-b from-[#EBF5FB] via-[#E6F8F6] to-white dark:from-[#0F2233] dark:via-[#0D1E2C] dark:to-[#0B1520] transition-colors duration-300">
        {/* Glow Biru-Teal di Latar Belakang */}
        <div className="absolute top-0 -left-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#38BDF8]/20 dark:bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-[#00C4B4]/20 dark:bg-[#00C4B4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-[#D5E7F3] dark:border-slate-700 text-[10px] sm:text-[11px] font-bold text-[#008A7B] dark:text-[#2AD3C0] tracking-wider uppercase shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#008A7B] dark:bg-[#2AD3C0] shrink-0" />
                <span>OPERASIONAL LAUNDRY, LEBIH SEDERHANA</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#101E2C] dark:text-white tracking-tight leading-[1.18] sm:leading-[1.12]">
                Laundry rapi.<br />
                <span className="text-[#008A7B] dark:text-[#2AD3C0]">Bisnis terkendali.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl">
                Satu ruang kerja untuk mencatat transaksi, memantau cucian, dan memahami performa bisnis Anda—tanpa buku catatan yang berantakan.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <button
                  onClick={onOpenRegister || (() => setIsRegisterModalOpen(true))}
                  className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#00665A] hover:bg-[#005248] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Daftarkan toko laundry</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => scrollToSection('fitur')}
                  className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#EBF1FA] hover:bg-[#DEE7F5] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#3B5B84] dark:text-slate-200 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Pelajari fitur</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Core Highlights Capsule */}
              <div className="pt-2 sm:pt-4">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2.5 sm:gap-6 p-3 sm:px-5 sm:py-3.5 rounded-2xl bg-white/90 dark:bg-[#101E2C]/90 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>100% Data terpusat</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-[#008A7B] dark:text-[#2AD3C0] flex items-center justify-center shrink-0">
                      <RefreshCw className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Real-time Status cucian</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Otomatis Rekap laporan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Floating Cards */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Laundry Room Image */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white dark:border-slate-800 aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                  <img
                    src="/laundry_hero.jpg"
                    alt="Interior Ruang Laundry Modern"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Card 1: Pendapatan Hari Ini */}
                <div className="absolute top-3 left-2 sm:top-8 sm:-left-6 lg:-left-8 bg-white/95 dark:bg-[#101E2C]/95 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/80 flex items-center gap-2.5 sm:gap-3 animate-bounce-short z-10 max-w-[calc(100%-16px)] sm:max-w-none">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C4B4]" />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-tight">Pendapatan hari ini</p>
                    <p className="text-xs sm:text-base font-extrabold text-[#101E2C] dark:text-white leading-tight mt-0.5">Rp 1.248.000</p>
                  </div>
                </div>

                {/* Floating Card 2: 8 Cucian Siap Diambil */}
                <div className="absolute bottom-3 left-3 sm:bottom-8 sm:left-8 bg-white/95 dark:bg-[#101E2C]/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/80 flex items-center gap-2 sm:gap-3 z-10 max-w-[calc(100%-24px)] sm:max-w-none">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    8 cucian siap diambil
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION FITUR */}
      <section id="fitur" className="py-20 sm:py-28 bg-white dark:bg-[#0B1520] border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#2AD3C0]">
                SATU SISTEM, SEMUA BERES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101E2C] dark:text-white tracking-tight mt-2">
                Dibuat untuk ritme bisnis laundry Anda.
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
              Dirancang khusus untuk mempermudah operasional admin, hingga pemilik bisnis laundry dalam satu platform terintegrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div className="bg-[#F7FAFD] dark:bg-[#101E2C] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl sm:text-4xl font-black text-[#5CC2B8]">01</span>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-[#008A7B] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[#008A7B] dark:text-[#2AD3C0]" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[#101E2C] dark:text-white group-hover:text-[#008A7B] dark:group-hover:text-[#2AD3C0] transition-colors">
                  Transaksi tanpa repot
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                  Hitung biaya otomatis, catat pembayaran, dan cetak nota.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={onEnterLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008A7B] dark:text-[#2AD3C0] hover:text-[#005B52] transition-colors cursor-pointer"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-[#F7FAFD] dark:bg-[#101E2C] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl sm:text-4xl font-black text-[#5CC2B8]">02</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[#101E2C] dark:text-white group-hover:text-[#008A7B] dark:group-hover:text-[#2AD3C0] transition-colors">
                  Pantau setiap cucian
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                  Perbarui tahapan pengerjaan dan prioritas cucian.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={onEnterLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008A7B] dark:text-[#2AD3C0] hover:text-[#005B52] transition-colors cursor-pointer"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 03 */}
            <div className="bg-[#F7FAFD] dark:bg-[#101E2C] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl sm:text-4xl font-black text-[#5CC2B8]">03</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[#101E2C] dark:text-white group-hover:text-[#008A7B] dark:group-hover:text-[#2AD3C0] transition-colors">
                  Laporan yang berbicara
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                  Lihat pemasukan harian dan bulanan.
                </p>
              </div>

              <div className="pt-8">
                <button
                  onClick={onEnterLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008A7B] dark:text-[#2AD3C0] hover:text-[#005B52] transition-colors cursor-pointer"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION CARA KERJA */}
      <section id="cara-kerja" className="py-20 sm:py-28 bg-[#1B2A3A] dark:bg-[#0E1924] text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2AD3C0]">
              ALUR KERJA CERDAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Dari datang sampai pulang, semuanya tercatat.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#00A391] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-500/20 mb-4">
                1
              </div>
              <h4 className="font-bold text-base text-white">Daftarkan pelanggan</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-[200px]">
                Simpan riwayat & kontak pelanggan setia secara instan.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#00A391] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-500/20 mb-4">
                2
              </div>
              <h4 className="font-bold text-base text-white">Input cucian & layanan</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-[200px]">
                Pilih kiloan, satuan, atau express dengan kalkulasi akurat.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#00A391] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-500/20 mb-4">
                3
              </div>
              <h4 className="font-bold text-base text-white">Pantau proses</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-[200px]">
                Status cuci, kering, setrika ter-update otomatis.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#00A391] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-500/20 mb-4">
                4
              </div>
              <h4 className="font-bold text-base text-white">Selesai & masuk laporan</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-[200px]">
                Pelanggan diberi notifikasi, kas dan omzet terdata rapi.
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-6xl mx-auto rounded-2xl bg-[#233549]/90 border border-[#2F445B] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#2AD3C0] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Siap mengotomasi operasional laundry Anda?
                </h4>
              </div>
            </div>

            <button
              onClick={onOpenRegister || (() => setIsRegisterModalOpen(true))}
              className="px-6 py-3 rounded-xl bg-[#58E0CD] hover:bg-[#3CD5C0] text-[#101E2C] font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 group cursor-pointer"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#0C1622] py-8 border-t border-slate-800 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <img
              src="/logo_dark.png"
              alt="Logo SI Laundry"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow"
            />
            <span>SI LAUNDRY</span>
          </div>

          <p className="text-slate-400 text-center">
            Kelola lebih mudah, layani lebih baik.
          </p>

          <p className="text-slate-500">
            © 2026 SI LAUNDRY
          </p>
        </div>
      </footer>

      {/* Modal: Daftarkan Toko Laundry */}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101E2C]/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-[#101E2C] text-[#101E2C] dark:text-slate-100 rounded-2xl shadow-modal overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#101E2C] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">Daftarkan Toko Laundry Anda</h3>
                <p className="text-xs text-slate-300">Mulai coba gratis 14 hari tanpa biaya</p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {registerSuccess ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-slate-800 dark:text-white">Toko Berhasil Didaftarkan!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mengalihkan ke Dashboard Admin...</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Pemilik / Admin</label>
                  <input
                    type="text"
                    required
                    value={registerForm.namaPemilik}
                    onChange={(e) => setRegisterForm({ ...registerForm, namaPemilik: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Gerai / Toko Laundry</label>
                  <input
                    type="text"
                    required
                    value={registerForm.namaToko}
                    onChange={(e) => setRegisterForm({ ...registerForm, namaToko: e.target.value })}
                    placeholder="Contoh: Clean & Fresh Laundry"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={registerForm.whatsapp}
                    onChange={(e) => setRegisterForm({ ...registerForm, whatsapp: e.target.value })}
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kota / Alamat Singkat</label>
                  <input
                    type="text"
                    value={registerForm.alamat}
                    onChange={(e) => setRegisterForm({ ...registerForm, alamat: e.target.value })}
                    placeholder="Contoh: Surabaya Timur"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#008A7B] hover:bg-[#007366] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Daftar Sekarang & Masuk Sistem
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}