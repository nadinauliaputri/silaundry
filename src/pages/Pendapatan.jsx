import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  Coins
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';
import { supabase } from '../lib/supabaseClient';

export default function Pendapatan({
  transactions: propTransactions = [],
  onShowToast
}) {
  const [transactions, setTransactions] = useState(propTransactions);

  // State Filter Periode Pendapatan
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const [jenisPeriode, setJenisPeriode] = useState('Semua Periode');
  const [pilihTahun, setPilihTahun] = useState(currentYear);
  const [pilihBulan, setPilihBulan] = useState(currentMonth);
  const [tanggalSpesifik, setTanggalSpesifik] = useState(currentDate);
  const [bulanMulai, setBulanMulai] = useState(`${currentYear}-01`);
  const [bulanSelesai, setBulanSelesai] = useState(currentMonth);

  // Sinkronisasi state lokal jika props berubah
  useEffect(() => {
    if (propTransactions && propTransactions.length > 0) {
      setTransactions(propTransactions);
    }
  }, [propTransactions]);

  // Fetch data transaksi khusus user yang sedang login & pasang Realtime listener
  useEffect(() => {
    let isMounted = true;

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
        if (!error && data && isMounted) {
          setTransactions(data);
        }
      } catch (err) {
        console.error('Error fetching transactions in Pendapatan:', err);
      }
    };

    fetchUserTransactions();

    const channel = supabase
      .channel('pendapatan-realtime-page')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          fetchUserTransactions();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Format tanggal ke Bahasa Indonesia (contoh: 19 Oktober 2026)
  const formatIndonesianDate = (dateStr) => {
    if (!dateStr || dateStr === '-') return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Kelompokkan transaksi aktual dari database berdasarkan tanggal
  const allPendapatanData = useMemo(() => {
    const grouped = {};

    transactions.forEach(trx => {
      const dateKey = trx.tanggalMasuk || (trx.created_at ? trx.created_at.split('T')[0] : currentDate);

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          tanggalRaw: dateKey,
          tanggal: formatIndonesianDate(dateKey),
          totalHarian: 0,
          transaksiList: [],
          allPaid: true
        };
      }

      const totalVal = Number(trx.total) || 0;
      const beratVal = Number(trx.beratQty) || 1;
      const unitVal = trx.unit || 'kg';
      const hargaSatuan = Number(trx.hargaSatuan) || (beratVal > 0 ? Math.round(totalVal / beratVal) : totalVal);

      if (trx.statusBayar !== 'Lunas') {
        grouped[dateKey].allPaid = false;
      }

      grouped[dateKey].totalHarian += totalVal;
      grouped[dateKey].transaksiList.push({
        idNota: trx.nota || trx.id || 'TRX',
        pelanggan: trx.pelanggan || 'Pelanggan',
        layanan: trx.layanan || 'Reguler',
        berat: `${beratVal} ${unitVal}`,
        hargaSatuan: hargaSatuan,
        total: totalVal,
        statusBayar: trx.statusBayar || 'Lunas'
      });
    });

    // Urutkan tanggal secara descending (terbaru di atas)
    return Object.values(grouped)
      .map(item => ({
        ...item,
        statusBuku: item.allPaid ? 'Tutup Buku' : 'Buku Aktif'
      }))
      .sort((a, b) => b.tanggalRaw.localeCompare(a.tanggalRaw));
  }, [transactions, currentDate]);

  // Logika Filter Berdasarkan Jenis Periode yang Dipilih
  const filteredPendapatanList = useMemo(() => {
    return allPendapatanData.filter(item => {
      if (jenisPeriode === 'Semua Periode') {
        return true;
      } else if (jenisPeriode === 'Tanggal spesifik') {
        return item.tanggalRaw === tanggalSpesifik;
      } else if (jenisPeriode === 'Bulan spesifik') {
        return item.tanggalRaw.startsWith(pilihBulan);
      } else if (jenisPeriode === 'Tahun spesifik') {
        return item.tanggalRaw.startsWith(pilihTahun);
      } else if (jenisPeriode === 'Rentang bulan') {
        const itemBulan = item.tanggalRaw.substring(0, 7);
        return itemBulan >= bulanMulai && itemBulan <= bulanSelesai;
      }
      return true;
    });
  }, [allPendapatanData, jenisPeriode, tanggalSpesifik, pilihBulan, pilihTahun, bulanMulai, bulanSelesai]);

  // Total keseluruhan berdasarkan hasil filter
  const totalKeseluruhan = useMemo(() => {
    return filteredPendapatanList.reduce((acc, curr) => acc + curr.totalHarian, 0);
  }, [filteredPendapatanList]);

  // Export Excel dengan format .xls agar otomatis rapi terpisah per kolom
  const handleExportExcel = () => {
    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Laporan Pendapatan</title>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 11pt; }
          th { background-color: #101E2C; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #cccccc; text-align: center; }
          td { padding: 8px; border: 1px solid #cccccc; vertical-align: middle; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
        </style>
      </head>
      <body>
        <h2>Laporan Rekapitulasi Pendapatan SI LAUNDRY</h2>
        <p>Periode Filter: ${jenisPeriode} (${jenisPeriode === 'Bulan spesifik' ? pilihBulan : jenisPeriode === 'Tanggal spesifik' ? tanggalSpesifik : pilihTahun})</p>
        <p>Total Pendapatan: Rp ${totalKeseluruhan.toLocaleString('id-ID')}</p>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Status Buku</th>
              <th>ID Nota</th>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Berat</th>
              <th>Harga Satuan</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredPendapatanList.forEach(item => {
      item.transaksiList.forEach((trx, tIdx) => {
        htmlContent += `
          <tr>
            ${tIdx === 0 ? `<td rowspan="${item.transaksiList.length}" class="text-center"><b>${item.tanggal}</b></td>` : ''}
            ${tIdx === 0 ? `<td rowspan="${item.transaksiList.length}" class="text-center">${item.statusBuku}</td>` : ''}
            <td class="text-center">${trx.idNota}</td>
            <td>${trx.pelanggan}</td>
            <td>${trx.layanan}</td>
            <td class="text-center">${trx.berat}</td>
            <td class="text-right">Rp ${trx.hargaSatuan.toLocaleString('id-ID')}</td>
            <td class="text-right"><b>Rp ${trx.total.toLocaleString('id-ID')}</b></td>
          </tr>
        `;
      });
    });

    htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Pendapatan_SI_LAUNDRY_${currentDate}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('File Excel Berhasil Diexport dengan Format Kolom Rapi!', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Top Header & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#00C4B4]">
            REKAPITULASI KEUANGAN
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#101E2C] dark:text-white tracking-tight mt-0.5">
            Pendapatan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rekapitulasi omset harian berdasarkan filter periode dan rincian transaksi kasir real-time.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* FILTER PERIODE PENDAPATAN CARD */}
      <div className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/85 dark:border-slate-700/60 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#101E2C] dark:text-white">Filter periode pendapatan</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pilih semua periode, satu tanggal, satu bulan, rentang bulan, atau tahun.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] text-xs font-extrabold border border-[#00C4B4]/20 dark:border-[#00C4B4]/40">
            {jenisPeriode === 'Semua Periode'
              ? 'Semua Periode'
              : jenisPeriode === 'Bulan spesifik'
              ? `Bulan: ${pilihBulan}`
              : jenisPeriode === 'Tanggal spesifik'
              ? `Tgl: ${tanggalSpesifik}`
              : jenisPeriode === 'Rentang bulan'
              ? `Rentang: ${bulanMulai} - ${bulanSelesai}`
              : `Tahun ${pilihTahun}`}
          </span>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Jenis Periode Selector */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Jenis periode
            </label>
            <select
              value={jenisPeriode}
              onChange={(e) => setJenisPeriode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
            >
              <option value="Semua Periode" className="dark:bg-[#112232]">Semua Periode</option>
              <option value="Tanggal spesifik" className="dark:bg-[#112232]">Tanggal spesifik</option>
              <option value="Bulan spesifik" className="dark:bg-[#112232]">Bulan spesifik</option>
              <option value="Tahun spesifik" className="dark:bg-[#112232]">Tahun spesifik</option>
              <option value="Rentang bulan" className="dark:bg-[#112232]">Rentang bulan</option>
            </select>
          </div>

          {/* Conditional Input based on Jenis Periode */}
          {jenisPeriode === 'Semua Periode' && (
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Keterangan
              </label>
              <div className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400">
                Menampilkan seluruh rekapan pendapatan toko
              </div>
            </div>
          )}

          {jenisPeriode === 'Tahun spesifik' && (
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Tahun
              </label>
              <input
                type="number"
                min="2020"
                max="2035"
                value={pilihTahun}
                onChange={(e) => setPilihTahun(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
              />
            </div>
          )}

          {jenisPeriode === 'Bulan spesifik' && (
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Bulan
              </label>
              <input
                type="month"
                value={pilihBulan}
                onChange={(e) => setPilihBulan(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
              />
            </div>
          )}

          {jenisPeriode === 'Tanggal spesifik' && (
            <div>
              <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Tanggal
              </label>
              <input
                type="date"
                value={tanggalSpesifik}
                onChange={(e) => setTanggalSpesifik(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B]"
              />
            </div>
          )}

          {jenisPeriode === 'Rentang bulan' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Dari Bulan</label>
                <input
                  type="month"
                  value={bulanMulai}
                  onChange={(e) => setBulanMulai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Sampai Bulan</label>
                <input
                  type="month"
                  value={bulanSelesai}
                  onChange={(e) => setBulanSelesai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BANNER TOTAL PENDAPATAN KESELURUHAN */}
      <div className="bg-[#101E2C] dark:bg-black rounded-3xl p-6 sm:p-8 text-white dark:text-white relative overflow-hidden shadow-sm border border-slate-800 dark:border-[#00C4B4] transition-colors duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-[#008A7B]/20 text-[#00C4B4] dark:text-[#00C4B4] border border-white/10 dark:border-[#00C4B4]/20 text-xs font-bold mb-3">
              <Coins className="w-3.5 h-3.5" />
              <span>Total Pendapatan Keseluruhan</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white dark:text-white">
              {formatRupiah(totalKeseluruhan)}
            </h3>
            <p className="text-xs text-slate-300 dark:text-slate-400 mt-1">
              Akumulasi seluruh transaksi pada periode filter yang aktif
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#00C4B4]/10 dark:bg-[#00C4B4]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* PENDAPATAN PER TANGGAL LIST SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-base text-[#101E2C] dark:text-white">
            Pendapatan per tanggal
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {filteredPendapatanList.length} catatan hari ditemukan
          </span>
        </div>

        {/* List Card per Tanggal / Kondisi Kosong */}
        {filteredPendapatanList.length === 0 ? (
          <div className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/80 dark:border-slate-700/60 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-[#101E2C] dark:text-white">Tidak ada data pendapatan untuk periode ini</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Coba sesuaikan kembali filter tanggal atau bulan yang kamu pilih pada panel di atas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPendapatanList.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs p-5 space-y-4"
              >
                {/* Header Tanggal & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#008A7B] dark:bg-[#00C4B4]" />
                    <span className="font-extrabold text-sm text-[#101E2C] dark:text-white">{item.tanggal}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      item.statusBuku === 'Tutup Buku'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800'
                    }`}>
                      {item.statusBuku}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mr-2">Total hari ini:</span>
                    <span className="text-sm font-black text-[#101E2C] dark:text-white">{formatRupiah(item.totalHarian)}</span>
                  </div>
                </div>

                {/* Table Rincian Transaksi dalam Tanggal Tersebut */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-[#112232] text-slate-500 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-4 rounded-l-xl border-l dark:border-slate-700/50">ID / Nota</th>
                        <th className="py-2.5 px-4">Pelanggan</th>
                        <th className="py-2.5 px-4">Layanan</th>
                        <th className="py-2.5 px-4">Berat</th>
                        <th className="py-2.5 px-4">Harga Satuan</th>
                        <th className="py-2.5 px-4">Status Bayar</th>
                        <th className="py-2.5 px-4 rounded-r-xl text-right border-r dark:border-slate-700/50">Sub Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-200">
                      {item.transaksiList.map((trx, tIdx) => (
                        <tr key={tIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#008A7B] dark:text-[#00C4B4] border-l dark:border-slate-700/50">{trx.idNota}</td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{trx.pelanggan}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{trx.layanan}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{trx.berat}</td>
                          <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">
                            {formatRupiah(trx.hargaSatuan)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              trx.statusBayar === 'Lunas'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}>
                              {trx.statusBayar}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-black text-[#101E2C] dark:text-white border-r dark:border-slate-700/50">
                            {formatRupiah(trx.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
