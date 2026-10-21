import React, { useState } from 'react';
import {
  BarChart3,
  RotateCw,
  TrendingUp,
  FileText
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function Laporan({ transactions, onSelectReceipt, onShowToast }) {
  // Data grafik harian dengan nominal asli (puluhan ribu / ribuan)
  const chartData = [
    { day: 'Sen', label: 'Senin', revenue: 85000, orders: 5, weight: 25 },
    { day: 'Sel', label: 'Selasa', revenue: 78000, orders: 4, weight: 20 },
    { day: 'Rab', label: 'Rabu', revenue: 48000, orders: 2, weight: 12 },
    { day: 'Kam', label: 'Kamis', revenue: 96000, orders: 6, weight: 30 },
    { day: 'Jum', label: 'Jumat', revenue: 67000, orders: 3, weight: 18 },
    { day: 'Sab', label: 'Sabtu', revenue: 124000, orders: 8, weight: 40 },
    { day: 'Min', label: 'Minggu', revenue: 42000, orders: 1, weight: 10 },
  ];

  const [selectedDay, setSelectedDay] = useState(chartData[5]); // Default ke Sabtu (puncak omset)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const maxRevenue = 150000; // Skala maksimum sumbu Y (150k)

  const totalMingguIni = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  // Fungsi refresh lokal tanpa reload halaman / pindah ke landing page
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onShowToast) {
        onShowToast('Data progres operasional berhasil diperbarui!');
      }
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#00C4B4]">
          LAPORAN HARIAN
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#101E2C] dark:text-white tracking-tight mt-0.5">
          Laporan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ringkasan performa toko hari ini dan tren tujuh hari terakhir.
        </p>
      </div>

      {/* 2 Summary Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Pendapatan hari ini */}
        <div className="bg-white dark:bg-[#172A3B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Pendapatan hari ini</span>
            <p className="text-2xl sm:text-3xl font-black text-[#101E2C] dark:text-white mt-1">
              Rp 42.000
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Transaksi hari ini */}
        <div className="bg-white dark:bg-[#172A3B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Transaksi hari ini</span>
            <p className="text-2xl sm:text-3xl font-black text-[#101E2C] dark:text-white mt-1">
              1
            </p>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">Pelanggan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grafik Penghasilan 7 Hari Terakhir Card */}
      <div className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-[#101E2C] dark:text-white">
                Penghasilan 7 hari terakhir
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] text-[10px] font-extrabold border border-[#00C4B4]/20">
                7 hari
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Total minggu ini <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(totalMingguIni)}</span>
            </p>
          </div>

          {/* Badge Puncak Omset di Kanan Atas */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#112232] border border-slate-200/80 dark:border-slate-700 rounded-2xl flex items-center gap-2.5 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Puncak Omset</span>
              <span className="text-xs font-bold text-[#101E2C] dark:text-white">Sabtu (Rp 124.000)</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="pt-4 pb-2">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 border-b border-slate-100 dark:border-slate-800 px-2 sm:px-4 relative">
            {/* Background Guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-45 px-2 sm:px-4 pb-6">
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full flex justify-between text-[10px] text-slate-400">
                <span>150k</span>
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full flex justify-between text-[10px] text-slate-400">
                <span>100k</span>
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full flex justify-between text-[10px] text-slate-400">
                <span>50k</span>
              </div>
              <div className="border-b border-slate-200 dark:border-slate-700 w-full flex justify-between text-[10px] text-slate-400">
                <span>0</span>
              </div>
            </div>

            {/* Bars */}
            {chartData.map((item, idx) => {
              const heightPx = Math.round((item.revenue / maxRevenue) * 190);
              const isSelected = selectedDay && selectedDay.day === item.day;
              const isSaturday = item.day === 'Sab';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(item)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                >
                  <div className="w-full flex flex-col items-center transition-all duration-300 transform group-hover:-translate-y-1.5">
                    <div className={`mb-1 text-[10px] sm:text-xs font-extrabold transition-all px-2 py-0.5 rounded-lg text-white shadow-xs ${isSelected || isSaturday ? 'bg-[#008A7B] dark:bg-[#00C4B4] dark:text-[#101E2C]' : 'bg-slate-700 dark:bg-slate-800 group-hover:bg-[#008A7B]'
                      }`}>
                      {Math.round(item.revenue / 1000)}k
                    </div>

                    <div className="w-full max-w-[42px] rounded-t-2xl overflow-hidden flex flex-col justify-end">
                      <div
                        style={{ height: `${heightPx}px` }}
                        className={`w-full rounded-t-2xl transition-all duration-300 shadow-xs ${isSaturday || isSelected
                            ? 'bg-gradient-to-t from-teal-600 to-[#00C4B4] shadow-teal-500/30 shadow-md'
                            : 'bg-gradient-to-t from-sky-100 to-sky-200 dark:from-slate-700 dark:to-slate-600 group-hover:from-teal-200 group-hover:to-teal-300'
                          }`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <p className={`text-xs font-bold transition-colors ${isSelected || isSaturday ? 'text-[#008A7B] dark:text-[#00C4B4]' : 'text-slate-600 dark:text-slate-300 group-hover:text-[#008A7B]'
                      }`}>
                      {item.day}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progres Operasional Card (Diperjelas untuk Dark Mode) */}
      <div className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-[#101E2C] dark:text-white">
              Progres operasional
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kondisi cucian dan antrean pengerjaan saat ini
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-slate-50 dark:bg-[#112232] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer ${isRefreshing ? 'rotate-180 duration-500' : ''
              }`}
            title="Refresh Status"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 5 Status Operational List Cards */}
        <div className="space-y-3">
          {/* 1. Baru Masuk */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Baru Masuk</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                0
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 2. Proses Cuci */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Proses Cuci</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                4
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 3. Proses Setrika */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Proses Setrika</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                0
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 4. Siap Diambil/Diantarkan */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Siap Diambil/Diantarkan</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 5. Sudah Selesai */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <div>
                <span className="font-extrabold text-xs text-[#101E2C] dark:text-white block">Sudah Selesai</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Telah diserahkan ke pelanggan & lunas</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}