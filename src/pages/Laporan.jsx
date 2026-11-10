import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  RotateCw,
  TrendingUp,
  FileText
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';
import { supabase } from '../lib/supabaseClient';

export default function Laporan({
  transactions: propTransactions = [],
  onSelectReceipt,
  onShowToast
}) {
  const [transactions, setTransactions] = useState(propTransactions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(6); // Default ke hari ini (indeks terakhir dari 7 hari)

  // Sinkronisasi state lokal jika props dari parent berubah
  useEffect(() => {
    if (propTransactions && propTransactions.length > 0) {
      setTransactions(propTransactions);
    }
  }, [propTransactions]);

  // Fungsi fetch data transaksi Supabase khusus user yang sedang login
  const fetchUserTransactions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || localStorage.getItem('profileId');

      if (!userId) return;

      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      query = query.eq('user_id', userId);

      const { data, error } = await query;
      if (!error && data) {
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error fetching transactions in Laporan:', err);
    }
  };

  // Fetch pertama kali dan pasang Realtime listener pada tabel transactions
  useEffect(() => {
    fetchUserTransactions();

    const channel = supabase
      .channel('laporan-realtime-page')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          fetchUserTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Normalisasi status laundry agar konsisten dengan seluruh sistem
  const normalizeStatus = (status) => {
    const st = (status || '').trim().toLowerCase();
    if (!st || st === 'baru masuk' || st === 'baru' || st === 'dalam pengerjaan') {
      return 'Baru Masuk';
    }
    if (st.includes('cuci')) {
      return 'Proses Cuci';
    }
    if (st.includes('setrika')) {
      return 'Proses Setrika';
    }
    if (st.includes('siap diambil') || st.includes('siap ambil') || st.includes('siap')) {
      return 'Siap Diambil';
    }
    if (st.includes('selesai')) {
      return 'Selesai';
    }
    return status || 'Baru Masuk';
  };

  // 1. Perhitungan Pendapatan Hari Ini & Transaksi Hari Ini
  const { todayRevenue, todayCount } = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const todayTrx = transactions.filter(t => {
      const tDate = t.tanggalMasuk || (t.created_at ? t.created_at.split('T')[0] : '');
      return tDate === todayStr;
    });

    const revenue = todayTrx.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    return {
      todayRevenue: revenue,
      todayCount: todayTrx.length
    };
  }, [transactions]);

  // 2. Perhitungan Grafik Penghasilan 7 Hari Terakhir secara Dinamis
  const chartData = useMemo(() => {
    const daysShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const daysFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${dayNum}`;

      const dayTrx = transactions.filter(t => {
        const tDate = t.tanggalMasuk || (t.created_at ? t.created_at.split('T')[0] : '');
        return tDate === dateKey;
      });

      const dayRevenue = dayTrx.reduce((acc, t) => acc + (Number(t.total) || 0), 0);
      const dayWeight = dayTrx.reduce((acc, t) => acc + (Number(t.beratQty) || 0), 0);

      result.push({
        dateStr: dateKey,
        day: daysShort[d.getDay()],
        label: daysFull[d.getDay()],
        revenue: dayRevenue,
        orders: dayTrx.length,
        weight: dayWeight,
        isToday: i === 0
      });
    }

    return result;
  }, [transactions]);

  const selectedDay = chartData[selectedDayIndex] || chartData[chartData.length - 1];

  // Total pendapatan minggu ini (akumulasi 7 hari terakhir)
  const totalMingguIni = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [chartData]);

  // Cari hari dengan puncak omset tertinggi
  const peakDay = useMemo(() => {
    let max = null;
    chartData.forEach(item => {
      if (!max || item.revenue > max.revenue) {
        max = item;
      }
    });
    return max;
  }, [chartData]);

  // Skala maksimum sumbu Y
  const maxDayRevenue = Math.max(...chartData.map(d => d.revenue), 0);
  const chartMax = maxDayRevenue > 0 ? Math.ceil(maxDayRevenue / 50000) * 50000 : 150000;

  // 3. Perhitungan Progres Operasional secara Dinamis
  const operationalProgress = useMemo(() => {
    const counts = {
      'Baru Masuk': 0,
      'Proses Cuci': 0,
      'Proses Setrika': 0,
      'Siap Diambil': 0,
      'Selesai': 0
    };

    transactions.forEach(t => {
      const norm = normalizeStatus(t.statusLaundry);
      if (counts[norm] !== undefined) {
        counts[norm]++;
      } else {
        counts['Baru Masuk']++;
      }
    });

    return counts;
  }, [transactions]);

  // Fungsi refresh manual
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserTransactions();
    setTimeout(() => {
      setIsRefreshing(false);
      if (onShowToast) {
        onShowToast('Data laporan berhasil diperbarui dari Supabase!', 'success');
      }
    }, 400);
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
              {formatRupiah(todayRevenue)}
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
              {todayCount}
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
              <span className="text-xs font-bold text-[#101E2C] dark:text-white">
                {peakDay && peakDay.revenue > 0
                  ? `${peakDay.label} (${formatRupiah(peakDay.revenue)})`
                  : 'Belum ada omset'}
              </span>
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
                <span>{formatRupiah(chartMax)}</span>
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full flex justify-between text-[10px] text-slate-400">
                <span>{formatRupiah(Math.round(chartMax * 0.66))}</span>
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 w-full flex justify-between text-[10px] text-slate-400">
                <span>{formatRupiah(Math.round(chartMax * 0.33))}</span>
              </div>
              <div className="border-b border-slate-200 dark:border-slate-700 w-full flex justify-between text-[10px] text-slate-400">
                <span>0</span>
              </div>
            </div>

            {/* Bars */}
            {chartData.map((item, idx) => {
              const heightPx = chartMax > 0
                ? Math.max(Math.round((item.revenue / chartMax) * 190), item.revenue > 0 ? 14 : 4)
                : 4;
              const isSelected = selectedDayIndex === idx;
              const isPeak = peakDay && peakDay.revenue > 0 && item.revenue === peakDay.revenue;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                >
                  <div className="w-full flex flex-col items-center transition-all duration-300 transform group-hover:-translate-y-1.5">
                    <div className={`mb-1 text-[10px] sm:text-xs font-extrabold transition-all px-2 py-0.5 rounded-lg text-white shadow-xs ${
                      isSelected || isPeak
                        ? 'bg-[#008A7B] dark:bg-[#00C4B4] dark:text-[#101E2C]'
                        : 'bg-slate-700 dark:bg-slate-800 group-hover:bg-[#008A7B]'
                    }`}>
                      {item.revenue >= 1000 ? `${Math.round(item.revenue / 1000)}k` : item.revenue}
                    </div>

                    <div className="w-full max-w-[42px] rounded-t-2xl overflow-hidden flex flex-col justify-end">
                      <div
                        style={{ height: `${heightPx}px` }}
                        className={`w-full rounded-t-2xl transition-all duration-300 shadow-xs ${
                          isPeak || isSelected
                            ? 'bg-gradient-to-t from-teal-600 to-[#00C4B4] shadow-teal-500/30 shadow-md'
                            : 'bg-gradient-to-t from-sky-100 to-sky-200 dark:from-slate-700 dark:to-slate-600 group-hover:from-teal-200 group-hover:to-teal-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <p className={`text-xs font-bold transition-colors ${
                      isSelected || isPeak
                        ? 'text-[#008A7B] dark:text-[#00C4B4]'
                        : 'text-slate-600 dark:text-slate-300 group-hover:text-[#008A7B]'
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

      {/* Progres Operasional Card */}
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
            className={`p-2 rounded-xl bg-slate-50 dark:bg-[#112232] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer ${
              isRefreshing ? 'rotate-180 duration-500' : ''
            }`}
            title="Refresh Status"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 5 Status Operational List Cards */}
        <div className="space-y-3">
          {/* 1. Baru Masuk */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Baru Masuk</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                {operationalProgress['Baru Masuk']}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 2. Proses Cuci */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Proses Cuci</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                {operationalProgress['Proses Cuci']}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 3. Proses Setrika */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Proses Setrika</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                {operationalProgress['Proses Setrika']}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 4. Siap Diambil/Diantarkan */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
              <span className="font-extrabold text-xs text-[#101E2C] dark:text-white">Siap Diambil/Diantarkan</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#E6F8F5] dark:bg-[#008A7B]/30 text-[#008A7B] dark:text-[#00C4B4] font-black text-xs flex items-center justify-center">
                {operationalProgress['Siap Diambil']}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>

          {/* 5. Sudah Selesai */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#112232] hover:bg-slate-100/80 dark:hover:bg-[#1A3147] border border-slate-200/60 dark:border-slate-700/80 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <div>
                <span className="font-extrabold text-xs text-[#101E2C] dark:text-white block">Sudah Selesai</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Telah diserahkan ke pelanggan & lunas</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs flex items-center justify-center">
                {operationalProgress['Selesai']}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">&rsaquo;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
