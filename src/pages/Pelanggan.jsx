import React, { useState } from 'react';
import {
  Users,
  Search,
  Calendar,
  Printer,
  CheckCircle,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function Pelanggan({
  customers = [],
  transactions = [],
  onSelectReceipt,
  onOpenNewTransaction
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [jenisPeriode, setJenisPeriode] = useState('Tahun spesifik');

  // State untuk berbagai jenis filter periode
  const [tahunTransaksi, setTahunTransaksi] = useState('2026');
  const [selectedDate, setSelectedDate] = useState('2026-10-18');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [rangeStartMonth, setRangeStartMonth] = useState('2026-01');
  const [rangeEndMonth, setRangeEndMonth] = useState('2026-12');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Ubah data customer & riwayatnya menjadi list item per transaksi pelanggan
  const allCustomerTransactions = customers.flatMap(cust => {
    return (cust.riwayat || []).map((hist, idx) => {
      const matchedTrx = transactions.find(t => t.nota === hist.nota && t.pelanggan.toLowerCase() === cust.nama.toLowerCase());
      return {
        id: `${cust.id}-${idx}`,
        nota: hist.nota,
        nama: cust.nama,
        telepon: cust.telepon,
        alamat: cust.alamat,
        layanan: matchedTrx ? matchedTrx.layanan : (cust.kategoriFavorit || 'Cuci Komplit Regular'),
        beratQty: matchedTrx ? matchedTrx.beratQty : 4.5,
        unit: matchedTrx ? matchedTrx.unit : 'kg',
        total: hist.total,
        tanggalMasuk: hist.tanggal,
        statusBayar: matchedTrx ? matchedTrx.statusBayar : 'Lunas',
        rawTransaction: matchedTrx || {
          id: Date.now() + idx,
          nota: hist.nota,
          pelanggan: cust.nama,
          telepon: cust.telepon,
          alamat: cust.alamat,
          layanan: cust.kategoriFavorit || 'Cuci Komplit Regular',
          beratQty: 4.5,
          unit: 'kg',
          total: hist.total,
          statusBayar: 'Lunas',
          statusLaundry: hist.status,
          tanggalMasuk: hist.tanggal
        }
      };
    });
  });

  // Filter berdasarkan pencarian & jenis periode yang dipilih
  const filteredItems = allCustomerTransactions.filter(item => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.telepon.includes(searchTerm) ||
      item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.layanan.toLowerCase().includes(searchTerm.toLowerCase());

    let matchPeriod = true;
    if (jenisPeriode === 'Tahun spesifik') {
      matchPeriod = !tahunTransaksi || item.tanggalMasuk.includes(tahunTransaksi);
    } else if (jenisPeriode === 'Tanggal spesifik') {
      matchPeriod = selectedDate ? item.tanggalMasuk.includes(selectedDate) : true;
    } else if (jenisPeriode === 'Bulan spesifik') {
      matchPeriod = selectedMonth ? item.tanggalMasuk.includes(selectedMonth) : true;
    } else if (jenisPeriode === 'Rentang bulan') {
      const itemMonth = item.tanggalMasuk.substring(0, 7);
      matchPeriod = (!rangeStartMonth || itemMonth >= rangeStartMonth) && (!rangeEndMonth || itemMonth <= rangeEndMonth);
    }

    return matchSearch && matchPeriod;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Label badge ringkasan periode
  const getPeriodeBadgeLabel = () => {
    if (jenisPeriode === 'Tanggal spesifik') return `Tanggal: ${selectedDate}`;
    if (jenisPeriode === 'Bulan spesifik') return `Bulan: ${selectedMonth}`;
    if (jenisPeriode === 'Rentang bulan') return `Rentang: ${rangeStartMonth} s.d. ${rangeEndMonth}`;
    return tahunTransaksi ? `Tahun ${tahunTransaksi}` : 'Semua Periode';
  };

  // Variasi warna soft terang (Light Mode & Dark Mode) agar tidak monoton
  const detailBoxBgVariants = [
    {
      light: 'bg-[#E6F8F5] border-[#008A7B]/20',
      dark: 'dark:bg-[#112E2B] dark:border-[#008A7B]/40',
      labelColor: 'text-slate-500 dark:text-teal-200/80',
      textColor: 'text-slate-800 dark:text-emerald-100',
      priceColor: 'text-[#008A7B] dark:text-[#00C4B4]'
    },
    {
      light: 'bg-[#EFEBF8] border-[#6C5CE7]/20',
      dark: 'dark:bg-[#201C38] dark:border-[#6C5CE7]/40',
      labelColor: 'text-slate-500 dark:text-purple-200/80',
      textColor: 'text-slate-800 dark:text-purple-100',
      priceColor: 'text-[#6C5CE7] dark:text-[#A78BFA]'
    },
    {
      light: 'bg-[#FEF3E2] border-[#D35400]/20',
      dark: 'dark:bg-[#332214] dark:border-[#D35400]/40',
      labelColor: 'text-slate-500 dark:text-amber-200/80',
      textColor: 'text-slate-800 dark:text-amber-100',
      priceColor: 'text-[#D35400] dark:text-[#F97316]'
    },
    {
      light: 'bg-[#EBF5F4] border-[#00A391]/20',
      dark: 'dark:bg-[#152B3C] dark:border-[#00A391]/40',
      labelColor: 'text-slate-500 dark:text-cyan-200/80',
      textColor: 'text-slate-800 dark:text-cyan-100',
      priceColor: 'text-[#00A391] dark:text-[#38BDF8]'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Page Header Bar */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#00C4B4]">
          RIWAYAT TRANSAKSI CUSTOMER
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#101E2C] dark:text-white tracking-tight mt-0.5">
          Pelanggan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Lihat kembali detail layanan dan total transaksi setiap pelanggan.
        </p>
      </div>

      {/* Filter Periode Pelanggan Card */}
      <div className="bg-white dark:bg-[#172A3B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#101E2C] dark:text-white">Filter periode pelanggan</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-400">Pilih satu tanggal, satu bulan, rentang bulan, atau satu tahun.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#E6F8F5] dark:bg-[#008A7B]/20 text-[#008A7B] dark:text-[#00C4B4] text-[11px] font-extrabold border border-[#00C4B4]/20">
            {getPeriodeBadgeLabel()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-300 mb-1.5">
              Jenis periode
            </label>
            <select
              value={jenisPeriode}
              onChange={(e) => {
                setJenisPeriode(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="Tahun spesifik" className="dark:bg-[#112232]">Tahun spesifik</option>
              <option value="Tanggal spesifik" className="dark:bg-[#112232]">Tanggal spesifik</option>
              <option value="Bulan spesifik" className="dark:bg-[#112232]">Bulan spesifik</option>
              <option value="Rentang bulan" className="dark:bg-[#112232]">Rentang bulan</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-300 mb-1.5">
              {jenisPeriode === 'Tanggal spesifik' && 'Pilih Tanggal'}
              {jenisPeriode === 'Bulan spesifik' && 'Pilih Bulan'}
              {jenisPeriode === 'Tahun spesifik' && 'Pilih Tahun'}
              {jenisPeriode === 'Rentang bulan' && 'Rentang Bulan (Dari - Sampai)'}
            </label>

            {jenisPeriode === 'Tanggal spesifik' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              />
            )}

            {jenisPeriode === 'Bulan spesifik' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              />
            )}

            {jenisPeriode === 'Tahun spesifik' && (
              <input
                type="number"
                min="2000"
                max="2100"
                value={tahunTransaksi}
                onChange={(e) => {
                  setTahunTransaksi(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Contoh: 2026"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              />
            )}

            {jenisPeriode === 'Rentang bulan' && (
              <div className="flex items-center gap-2">
                <input
                  type="month"
                  value={rangeStartMonth}
                  onChange={(e) => {
                    setRangeStartMonth(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="month"
                  value={rangeEndMonth}
                  onChange={(e) => {
                    setRangeEndMonth(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari berdasarkan nama pelanggan, nomor nota, atau layanan..."
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] dark:text-white dark:placeholder-slate-400 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Header Info Jumlah Transaksi pada Periode */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-sm text-[#101E2C] dark:text-white">
          Transaksi pelanggan pada periode {getPeriodeBadgeLabel()}
        </h3>
        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-extrabold">
          {filteredItems.length} transaksi
        </span>
      </div>

      {/* Grid Kartu Pelanggan (2 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedItems.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-[#172A3B] p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-500" />
            <p className="font-semibold text-slate-600 dark:text-slate-200">Tidak ada data transaksi untuk periode ini</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter periode atau kata kunci pencarian Anda</p>
          </div>
        ) : (
          paginatedItems.map((item, idx) => {
            const theme = detailBoxBgVariants[idx % detailBoxBgVariants.length];

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#172A3B] rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-sm transition-all p-5 flex flex-col justify-between gap-4"
              >
                {/* Bagian Atas: Profil Pelanggan & Nota Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${getAvatarBg(item.nama)} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}>
                      {getInitials(item.nama)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#101E2C] dark:text-white">{item.nama}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{item.telepon}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[180px] sm:max-w-[220px]">{item.alamat || 'Surabaya'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-[11px] shrink-0 border border-slate-200 dark:border-slate-700">
                    {item.nota}
                  </span>
                </div>

                {/* Bagian Kotak Detail Transaksi (Soft & Terang di Dark Mode) */}
                <div className={`p-3.5 rounded-xl border grid grid-cols-2 gap-3 text-xs ${theme.light} ${theme.dark}`}>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme.labelColor}`}>Layanan</span>
                    <span className={`font-bold mt-0.5 block truncate ${theme.textColor}`}>{item.layanan}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme.labelColor}`}>Tanggal Masuk</span>
                    <span className={`font-semibold mt-0.5 block ${theme.textColor}`}>{item.tanggalMasuk}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme.labelColor}`}>Jumlah Cucian</span>
                    <span className={`font-bold mt-0.5 block ${theme.textColor}`}>{item.beratQty} {item.unit}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme.labelColor}`}>Total Harga</span>
                    <span className={`font-black mt-0.5 block ${theme.priceColor}`}>{formatRupiah(item.total)}</span>
                  </div>
                </div>

                {/* Bagian Bawah: Status Pembayaran & Tombol Cetak Struk */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    {item.statusBayar === 'Lunas' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Lunas</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Belum lunas</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectReceipt && onSelectReceipt(item.rawTransaction)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#008A7B] dark:text-[#00C4B4]" />
                    <span>Lihat & cetak struk</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      <div className="p-4 bg-white dark:bg-[#172A3B] rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div>
          Menampilkan <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + (paginatedItems.length > 0 ? 1 : 0)}</span> - <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + paginatedItems.length}</span> dari{' '}
          <span className="font-bold text-slate-800 dark:text-white">{filteredItems.length}</span> total pelanggan aktif pada periode terpilih
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#112232] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#182C3F] disabled:opacity-40 font-semibold transition-all cursor-pointer"
          >
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === pg
                ? 'bg-[#00A391] dark:bg-[#00C4B4] text-white dark:text-[#101E2C] shadow-sm'
                : 'bg-white dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#182C3F]'
                }`}
            >
              {pg}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#112232] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#182C3F] disabled:opacity-40 font-semibold transition-all cursor-pointer"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}