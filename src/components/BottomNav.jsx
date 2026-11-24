import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  BarChart3,
  Wallet
} from 'lucide-react';

export default function BottomNav({
  activePage,
  setActivePage,
  pendingCount = 0
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transaksi', label: 'Transaksi', icon: Receipt, badge: pendingCount },
    { id: 'pelanggan', label: 'Pelanggan', icon: Users },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'pendapatan', label: 'Pendapatan', icon: Wallet },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-[#101E2C]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-[env(safe-area-inset-bottom)] transition-colors duration-300"
      aria-label="Navigasi Utama Mobile"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActivePage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 relative transition-all duration-200 select-none group cursor-pointer ${
                isActive
                  ? 'text-[#008A7B] dark:text-[#00C4B4]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Top Line / Glow Indicator */}
              {isActive && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-[#008A7B] dark:bg-[#00C4B4] rounded-full shadow-[0_0_8px_#008A7B]" />
              )}

              {/* Icon Container with Optional Badge */}
              <div
                className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E6F8F5] dark:bg-[#008A7B]/20 scale-105'
                    : 'group-active:scale-95'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />

                {item.badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight truncate max-w-full ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

