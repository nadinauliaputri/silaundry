import React, { useState } from 'react';
import {
  Search,
  Printer
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function Transaksi({
  transactions = [],
  onUpdateStatus,
  onUpdatePayment,
  onSelectReceipt
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Daftar kartu ringkasan di atas (pasif / non-clickable)
  const summaryCards = [
    { id: 'Baru Masuk', label: 'BARU MASUK' },
    { id: 'Proses Cuci', label: 'PROSES CUCI' },
    { id: 'Proses Setrika', label: 'PROSES SETRIKA' },
    { id: 'Siap Diambil', label: 'SIAP AMBIL' },
    { id: 'Selesai', label: 'SELESAI' },
  ];

  // Hitung jumlah untuk tiap kategori kartu
  const getCardCount = (cardId) => {
    return transactions.filter(t => {
      const st = (t.statusLaundry || '').toLowerCase();
      if (cardId === 'Baru Masuk') return st.includes('baru masuk');
      if (cardId === 'Proses Cuci') return st.includes('cuci') || st.includes('pengerjaan');
      if (cardId === 'Proses Setrika') return st.includes('setrika');
      if (cardId === 'Siap Diambil') return st.includes('siap diambil');
      if (cardId === 'Selesai') return st.includes('selesai');
      return false;
    }).length;
  };

  // Logika Filter utama berdasarkan Dropdown Status Riwayat dan Pencarian
  const filteredTransactions = transactions.filter(trx => {
    const st = (trx.statusLaundry || '').toLowerCase();

    let matchesStatusFilter = true;
    if (statusFilter !== 'Semua Status') {
      if (statusFilter === 'Baru Masuk') {
        matchesStatusFilter = st.includes('baru masuk');
      } else if (statusFilter === 'Proses Cuci') {
        matchesStatusFilter = st.includes('cuci') || st.includes('pengerjaan');
      } else if (statusFilter === 'Proses Setrika') {
        matchesStatusFilter = st.includes('setrika');
      } else if (statusFilter === 'Siap Diambil') {
        matchesStatusFilter = st.includes('siap diambil');
      } else if (statusFilter === 'Selesai') {
        matchesStatusFilter = st.includes('selesai');
      } else {
        matchesStatusFilter = trx.statusLaundry === statusFilter;
      }
    }

    const matchesSearch =
      (trx.nota && trx.nota.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trx.pelanggan && trx.pelanggan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trx.telepon && trx.telepon.includes(searchTerm)) ||
      (trx.layanan && trx.layanan.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatusFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedItems = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadgeStyle = (status) => {
    const st = (status || '').toLowerCase();
    if (st.includes('baru masuk')) return 'bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] border-[#008A7B]/25';
    if (st.includes('cuci') || st.includes('pengerjaan')) return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    if (st.includes('setrika')) return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    if (st.includes('siap diambil')) return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    if (st.includes('selesai')) return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getAvatarBg = (name) => {
    const colors = ['bg-teal-700', 'bg-slate-700', 'bg-indigo-700', 'bg-cyan-800', 'bg-blue-800'];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#00C4B4]">
            OPERASIONAL
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#101E2C] dark:text-white tracking-tight mt-0.5">
            Transaksi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola alur cucian dan pantau status riwayat transaksi pelanggan.
          </p>
        </div>
      </div>

      {/* 5 Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((card) => {
          const isActive = statusFilter === card.id;
          const count = getCardCount(card.id);
          return (
            <div
              key={card.id}
              className={`px-4 py-3.5 rounded-2xl border transition-all flex items-center justify-between gap-2 select-none ${isActive
                  ? 'bg-[#EBF5F4] dark:bg-[#17303A] border-[#008A7B] dark:border-[#00C4B4] shadow-sm ring-1 ring-[#008A7B]/30'
                  : 'bg-white dark:bg-[#172A3B] border-slate-200/80 dark:border-slate-700/60'
                }`}
            >
              <span className={`text-[10px] font-extrabold tracking-wider truncate ${isActive ? 'text-[#008A7B] dark:text-[#00C4B4]' : 'text-slate-500 dark:text-slate-300'}`}>
                {card.label}
              </span>
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isActive
                  ? 'bg-[#008A7B] dark:bg-[#00C4B4] text-white dark:text-[#101E2C]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Search & Status Riwayat Filter Toolbar */}
      <div className="bg-white dark:bg-[#172A3B] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari pelanggan, layanan, alamat, atau ID..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] dark:text-white dark:placeholder-slate-400 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-300 font-medium">Status Riwayat:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="Semua Status" className="dark:bg-[#112232]">Semua Status</option>
            <option value="Baru Masuk" className="dark:bg-[#112232]">Baru Masuk</option>
            <option value="Proses Cuci" className="dark:bg-[#112232]">Proses Cuci</option>
            <option value="Proses Setrika" className="dark:bg-[#112232]">Proses Setrika</option>
            <option value="Siap Diambil" className="dark:bg-[#112232]">Siap Diambil</option>
            <option value="Selesai" className="dark:bg-[#112232]">Selesai</option>
          </select>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white dark:bg-[#172A3B] rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#101E2C] dark:bg-[#0D1824] text-slate-200 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">ID / Tanggal</th>
                <th className="py-3.5 px-5">Pelanggan</th>
                <th className="py-3.5 px-5">Layanan</th>
                <th className="py-3.5 px-5">Berat & Harga</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 dark:text-slate-400">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Tidak ada data transaksi yang ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba ubah filter status riwayat atau kata kunci pencarian</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 dark:hover:bg-[#1D354A]/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-extrabold text-[#101E2C] dark:text-white text-sm">{trx.nota}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                        <span>{trx.tanggalMasuk || '1 Jan 2025'}</span>
                        {trx.tanggalKeluar && (
                          <>
                            <span>&rarr;</span>
                            <span>{trx.tanggalKeluar}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${getAvatarBg(trx.pelanggan)} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}>
                          {getInitials(trx.pelanggan)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{trx.pelanggan}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {trx.telepon} {trx.alamat ? `• ${trx.alamat}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{trx.layanan}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">{trx.kategori || 'Reguler'}</div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {trx.beratQty || 1} {trx.unit || 'kg'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        ({formatRupiah(trx.hargaSatuan || (trx.total / (trx.beratQty || 1)))} / {trx.unit || 'kg'})
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <select
                        value={trx.statusLaundry || 'Baru Masuk'}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(trx.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-all ${getStatusBadgeStyle(trx.statusLaundry)}`}
                      >
                        <option value="Baru Masuk" className="dark:bg-[#112232] dark:text-slate-200">Baru Masuk</option>
                        <option value="Proses Cuci" className="dark:bg-[#112232] dark:text-slate-200">Proses Cuci</option>
                        <option value="Proses Setrika" className="dark:bg-[#112232] dark:text-slate-200">Proses Setrika</option>
                        <option value="Siap Diambil" className="dark:bg-[#112232] dark:text-slate-200">Siap Diambil</option>
                        <option value="Selesai" className="dark:bg-[#112232] dark:text-slate-200">Selesai</option>
                      </select>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-black text-[#101E2C] dark:text-white text-sm">
                        {formatRupiah(trx.total)}
                      </div>
                      <select
                        value={trx.statusBayar || 'Lunas'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (onUpdatePayment) {
                            onUpdatePayment(trx.id, val);
                          } else {
                            trx.statusBayar = val;
                          }
                        }}
                        className={`mt-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer transition-all ${trx.statusBayar === 'Lunas'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          }`}
                      >
                        <option value="Lunas" className="dark:bg-[#112232]">Lunas</option>
                        <option value="Belum Bayar" className="dark:bg-[#112232]">Belum Bayar</option>
                      </select>
                    </td>

                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => onSelectReceipt && onSelectReceipt(trx)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-[#008A7B] hover:text-white dark:bg-slate-800 dark:hover:bg-[#008A7B] text-slate-600 dark:text-slate-300 transition-all shadow-xs cursor-pointer inline-flex items-center justify-center"
                        title="Cetak Struk Nota"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50/70 dark:bg-[#112232] border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div>
            Menampilkan <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + (paginatedItems.length > 0 ? 1 : 0)}</span> - <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + paginatedItems.length}</span> dari{' '}
            <span className="font-bold text-slate-800 dark:text-white">{filteredTransactions.length}</span> transaksi
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#172A3B] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1D354A] disabled:opacity-40 font-semibold transition-all cursor-pointer"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === pg
                    ? 'bg-[#00A391] dark:bg-[#00C4B4] text-white dark:text-[#101E2C] shadow-sm'
                    : 'bg-white dark:bg-[#172A3B] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1D354A]'
                  }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#172A3B] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1D354A] disabled:opacity-40 font-semibold transition-all cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}