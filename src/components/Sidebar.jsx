import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  BarChart3,
  Wallet,
  UserCog,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  adminProfile,
  isMobileOpen,
  setIsMobileOpen,
  onLogout
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transaksi', label: 'Transaksi', icon: Receipt },
    { id: 'pelanggan', label: 'Pelanggan', icon: Users },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'pendapatan', label: 'Pendapatan', icon: Wallet },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Ambil huruf pertama dari nama toko (Cth: 'S')
  const storeInitial = adminProfile?.namaToko ? adminProfile.namaToko.charAt(0).toUpperCase() : 'S';

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#101E2C]/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#122232] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-[#1B2F44] lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="py-5 px-6 flex flex-col items-center justify-center border-b border-[#1A2E40] relative">
          <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 duration-200" onClick={() => handleNavClick('dashboard')}>
            <img
              src="/logo_sidebar.png"
              alt="Logo SI Laundry"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-lg"
            />
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-5 overflow-y-auto space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            RUANG KERJA
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all group relative ${isActive
                    ? 'bg-[#1A3144] text-white shadow-inner font-bold border-l-4 border-[#00C4B4]'
                    : 'text-slate-300 hover:text-white hover:bg-[#182C3F]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#00C4B4]' : 'text-slate-400 group-hover:text-[#00C4B4]'
                    }`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          {/* User Profile Card di Sidebar */}
          <div className="pt-6">
            <div
              onClick={() => handleNavClick('profil')}
              className={`p-3.5 rounded-2xl bg-[#172A3B] border border-[#21384D] cursor-pointer transition-all group ${activePage === 'profil' ? 'ring-2 ring-[#00C4B4]' : 'hover:border-slate-500'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar Abjad Berdasarkan Nama Toko */}
                  <div className="w-9 h-9 rounded-xl bg-[#008A7B] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm shrink-0">
                    {storeInitial}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-bold text-white truncate max-w-[120px]">
                      {adminProfile.namaAdmin || 'Admin Laundry'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Pengelola toko
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#21384D] flex items-center justify-between text-[11px]">
                <span className="text-[#00C4B4] font-semibold group-hover:underline">Kelola profil</span>
                <UserCog className="w-3.5 h-3.5 text-[#00C4B4]" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-rose-500/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
                <span>Keluar akun</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}