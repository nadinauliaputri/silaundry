import React, { useState } from 'react';
import {
  Menu,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';

export default function Header({
  activePage,
  setIsMobileOpen,
  adminProfile,
  onOpenProfile,
  isDarkMode = false,
  onToggleDarkMode
}) {
  const [currentDateFormatted] = useState(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  });

  const getPageTitle = (page) => {
    switch (page) {
      case 'dashboard': return 'Dashboard';
      case 'transaksi': return 'Transaksi';
      case 'pelanggan': return 'Pelanggan';
      case 'laporan': return 'Laporan';
      case 'pendapatan': return 'Pendapatan';
      case 'profil': return 'Profil Admin';
      default: return 'Dashboard';
    }
  };

  // Ambil huruf pertama dari nama toko untuk inisial avatar (Cth: 'S')
  const storeInitial = adminProfile?.namaToko ? adminProfile.namaToko.charAt(0).toUpperCase() : 'S';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#101E2C]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <button
          onClick={() => setIsMobileOpen && setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Buka navigasi menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#E6F8F5] dark:bg-[#008A7B]/20 border border-[#008A7B]/25 dark:border-[#008A7B]/40 text-[#008A7B] dark:text-[#00C4B4] font-extrabold text-xs sm:text-sm tracking-wide shadow-xs shrink-0 select-none">
          <span className="w-2 h-2 rounded-full bg-[#008A7B] dark:bg-[#00C4B4] animate-pulse" />
          <span>{getPageTitle(activePage)}</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-xs shrink-0 select-none">
          <Calendar className="w-4 h-4 text-[#008A7B] dark:text-[#00C4B4] shrink-0" />
          <span className="whitespace-nowrap">{currentDateFormatted}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#008A7B]/30"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700" />
          )}
        </button>

        {/* Avatar Profil / Inisial Toko di Pojok Kanan Atas */}
        <div
          onClick={onOpenProfile}
          className="flex items-center cursor-pointer group"
          title={`Profil Admin: ${adminProfile?.namaAdmin || 'Admin'}`}
        >
          {adminProfile?.avatar ? (
            <img
              src={adminProfile.avatar}
              alt={adminProfile?.namaAdmin || 'Admin'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-[#008A7B] transition-all shadow-xs"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#101E2C] to-[#008A7B] text-white flex items-center justify-center font-black text-sm ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-[#008A7B] transition-all shadow-xs">
              {storeInitial}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}