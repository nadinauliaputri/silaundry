// Mock Data for SI LAUNDRY Express & Clean

export const initialProfile = {
  namaAdmin: "Nadine Aulia Putri",
  namaToko: "SI LAUNDRY Express & Clean",
  email: "silaundryexpressclean@gmail.com",
  whatsapp: "0812-3456-7890",
  jamOperasional: "08:00 - 21:00 WIB",
  alamatToko: "Jl. Raya Kampus No. 42, Sukolilo, Surabaya, Jawa Timur 60111",
  statusAkun: "Aktif & Terverifikasi",
  role: "Pengelola toko",
  avatar: null // Diatur null agar otomatis menggunakan Avatar Inisial Abjad Toko
};

export const initialTransactions = [
  {
    id: "TRX-20261016-001",
    nota: "SL-01",
    pelanggan: "Budi Santoso",
    telepon: "0812-9876-5432",
    alamat: "Jl. Kenjeran No. 15, Surabaya",
    layanan: "Cuci Komplit Regular",
    kategori: "Kiloan",
    beratQty: 4.5,
    unit: "Kg",
    hargaPerUnit: 8000,
    total: 36000,
    statusBayar: "Lunas",
    metodeBayar: "QRIS",
    statusLaundry: "Siap diambil",
    tanggalMasuk: "2026-10-15 09:30",
    estimasiSelesai: "2026-10-16 12:00",
    catatan: "Baju putih dipisah, softener lavender"
  },
  {
    id: "TRX-20261016-002",
    nota: "SL-02",
    pelanggan: "Siti Rahmawati",
    telepon: "0813-2345-6789",
    alamat: "Perumahan Graha Asri Blok B3, Surabaya",
    layanan: "Cuci Kering Express 6 Jam",
    kategori: "Express",
    beratQty: 6.0,
    unit: "Kg",
    hargaPerUnit: 14000,
    total: 84000,
    statusBayar: "Lunas",
    metodeBayar: "Transfer Bank",
    statusLaundry: "Dalam pengerjaan",
    tanggalMasuk: "2026-10-16 08:15",
    estimasiSelesai: "2026-10-16 14:15",
    catatan: "Harap cepat untuk dinas luar kota"
  },
  {
    id: "TRX-20261016-003",
    nota: "SL-03",
    pelanggan: "Ahmad Fauzi",
    telepon: "0856-7890-1234",
    alamat: "Jl. Gebang Wetan No. 8A, Surabaya",
    layanan: "Bed Cover Jumbo + Sprei",
    kategori: "Satuan",
    beratQty: 2,
    unit: "Pcs",
    hargaPerUnit: 35000,
    total: 70000,
    statusBayar: "Belum Bayar",
    metodeBayar: "Tunai",
    statusLaundry: "Dalam pengerjaan",
    tanggalMasuk: "2026-10-15 14:00",
    estimasiSelesai: "2026-10-17 10:00",
    catatan: "Wangi floral ekstra segar"
  },
  {
    id: "TRX-20261016-004",
    nota: "SL-04",
    pelanggan: "Dewi Lestari",
    telepon: "0878-1122-3344",
    alamat: "Apartemen Puncak Dharmahusada Lt. 12",
    layanan: "Dry Clean Jas & Celana Formal",
    kategori: "Dry Clean",
    beratQty: 3,
    unit: "Pcs",
    hargaPerUnit: 40000,
    total: 120000,
    statusBayar: "Lunas",
    metodeBayar: "QRIS",
    statusLaundry: "Sudah selesai",
    tanggalMasuk: "2026-10-14 10:00",
    estimasiSelesai: "2026-10-15 16:00",
    catatan: "Jas warna navy mohon jangan kena panas tinggi"
  },
  {
    id: "TRX-20261016-005",
    nota: "SL-05",
    pelanggan: "Rian Hidayat",
    telepon: "0821-5566-7788",
    alamat: "Kost Putra Mandiri, Mulyorejo",
    layanan: "Setrika Saja Regular",
    kategori: "Setrika",
    beratQty: 5.2,
    unit: "Kg",
    hargaPerUnit: 5000,
    total: 26000,
    statusBayar: "Lunas",
    metodeBayar: "Tunai",
    statusLaundry: "Siap diambil",
    tanggalMasuk: "2026-10-15 16:20",
    estimasiSelesai: "2026-10-16 11:00",
    catatan: "Kemeja digantung rapi"
  },
  {
    id: "TRX-20261016-006",
    nota: "SL-06",
    pelanggan: "Maya Indah",
    telepon: "0899-4433-2211",
    alamat: "Jl. Manyar Sabrangan No. 41",
    layanan: "Cuci Komplit Regular",
    kategori: "Kiloan",
    beratQty: 7.8,
    unit: "Kg",
    hargaPerUnit: 8000,
    total: 62400,
    statusBayar: "Lunas",
    metodeBayar: "QRIS",
    statusLaundry: "Dalam pengerjaan",
    tanggalMasuk: "2026-10-16 09:10",
    estimasiSelesai: "2026-10-17 12:00",
    catatan: "Parfum Sakura"
  },
  {
    id: "TRX-20261016-007",
    nota: "SL-07",
    pelanggan: "Hendra Wijaya",
    telepon: "0812-4455-6677",
    alamat: "Kertajaya Indah Regency Blok E-4",
    layanan: "Cuci Sepatu Premium Sneakers",
    kategori: "Sepatu",
    beratQty: 2,
    unit: "Pasang",
    hargaPerUnit: 45000,
    total: 90000,
    statusBayar: "Lunas",
    metodeBayar: "Transfer Bank",
    statusLaundry: "Sudah selesai",
    tanggalMasuk: "2026-10-13 11:30",
    estimasiSelesai: "2026-10-15 15:00",
    catatan: "Deep cleaning sol bawah"
  },
  {
    id: "TRX-20261016-008",
    nota: "SL-08",
    pelanggan: "Putri Anggraini",
    telepon: "0877-6655-4433",
    alamat: "Jl. Dharmawangsa No. 20",
    layanan: "Cuci Gorden Tebal",
    kategori: "Satuan",
    beratQty: 8.0,
    unit: "Kg",
    hargaPerUnit: 12000,
    total: 96000,
    statusBayar: "Belum Bayar",
    metodeBayar: "Tunai",
    statusLaundry: "Dalam pengerjaan",
    tanggalMasuk: "2026-10-16 08:45",
    estimasiSelesai: "2026-10-18 10:00",
    catatan: "Gorden ruang tamu bahan beludru"
  }
];

export const initialCustomers = [
  {
    id: "CUST-001",
    nama: "Budi Santoso",
    telepon: "0812-9876-5432",
    alamat: "Jl. Kenjeran No. 15, Surabaya",
    totalTransaksi: 28,
    totalPengeluaran: 1420000,
    terakhirLaundry: "15 Okt 2026",
    kategoriFavorit: "Kiloan Regular",
    statusMember: "VIP Member",
    riwayat: [
      { nota: "SL-01", tanggal: "15 Okt 2026", total: 36000, status: "Siap diambil" }
    ]
  },
  {
    id: "CUST-002",
    nama: "Siti Rahmawati",
    telepon: "0813-2345-6789",
    alamat: "Perum Graha Asri B3, Surabaya",
    totalTransaksi: 19,
    totalPengeluaran: 1280000,
    terakhirLaundry: "16 Okt 2026",
    kategoriFavorit: "Express 6 Jam",
    statusMember: "Loyal Customer",
    riwayat: [
      { nota: "SL-02", tanggal: "16 Okt 2026", total: 84000, status: "Dalam pengerjaan" }
    ]
  },
  {
    id: "CUST-003",
    nama: "Dewi Lestari",
    telepon: "0878-1122-3344",
    alamat: "Apt. Puncak Dharmahusada Lt. 12",
    totalTransaksi: 34,
    totalPengeluaran: 2950000,
    terakhirLaundry: "14 Okt 2026",
    kategoriFavorit: "Dry Clean Jas",
    statusMember: "VIP Member",
    riwayat: [
      { nota: "SL-04", tanggal: "14 Okt 2026", total: 120000, status: "Sudah selesai" }
    ]
  },
  {
    id: "CUST-004",
    nama: "Ahmad Fauzi",
    telepon: "0856-7890-1234",
    alamat: "Jl. Gebang Wetan No. 8A, Surabaya",
    totalTransaksi: 12,
    totalPengeluaran: 640000,
    terakhirLaundry: "15 Okt 2026",
    kategoriFavorit: "Bed Cover & Selimut",
    statusMember: "Reguler",
    riwayat: [
      { nota: "SL-03", tanggal: "15 Okt 2026", total: 70000, status: "Dalam pengerjaan" }
    ]
  },
  {
    id: "CUST-005",
    nama: "Hendra Wijaya",
    telepon: "0812-4455-6677",
    alamat: "Kertajaya Indah Regency E-4",
    totalTransaksi: 22,
    totalPengeluaran: 1850000,
    terakhirLaundry: "13 Okt 2026",
    kategoriFavorit: "Cuci Sepatu Premium",
    statusMember: "VIP Member",
    riwayat: [
      { nota: "SL-07", tanggal: "13 Okt 2026", total: 90000, status: "Sudah selesai" }
    ]
  },
  {
    id: "CUST-006",
    nama: "Rian Hidayat",
    telepon: "0821-5566-7788",
    alamat: "Kost Putra Mandiri, Mulyorejo",
    totalTransaksi: 15,
    totalPengeluaran: 410000,
    terakhirLaundry: "15 Okt 2026",
    kategoriFavorit: "Setrika Saja",
    statusMember: "Reguler",
    riwayat: [
      { nota: "SL-05", tanggal: "15 Okt 2026", total: 26000, status: "Siap diambil" }
    ]
  }
];

export const revenueChartData = [
  { day: "Senin", date: "10 Okt", revenue: 1150000, orders: 28, weight: 145 },
  { day: "Selasa", date: "11 Okt", revenue: 1380000, orders: 32, weight: 168 },
  { day: "Rabu", date: "12 Okt", revenue: 1220000, orders: 29, weight: 152 },
  { day: "Kamis", date: "13 Okt", revenue: 1490000, orders: 36, weight: 184 },
  { day: "Jumat", date: "14 Okt", revenue: 1780000, orders: 42, weight: 215 },
  { day: "Sabtu", date: "15 Okt", revenue: 2150000, orders: 48, weight: 248 },
  { day: "Minggu", date: "16 Okt", revenue: 1840000, orders: 39, weight: 196 }
];

export const itemizedRevenueDays = [
  {
    tanggal: "16 Okt 2026",
    hari: "Hari Ini",
    transaksi: 39,
    beratTotal: "196 Kg",
    tunai: 420000,
    nonTunai: 1420000,
    total: 1840000,
    status: "Sedang Berjalan"
  },
  {
    tanggal: "15 Okt 2026",
    hari: "Kemarin",
    transaksi: 48,
    beratTotal: "248 Kg",
    tunai: 650000,
    nonTunai: 1500000,
    total: 2150000,
    status: "Tutup Buku"
  },
  {
    tanggal: "14 Okt 2026",
    hari: "Jumat",
    transaksi: 42,
    beratTotal: "215 Kg",
    tunai: 510000,
    nonTunai: 1270000,
    total: 1780000,
    status: "Tutup Buku"
  },
  {
    tanggal: "13 Okt 2026",
    hari: "Kamis",
    transaksi: 36,
    beratTotal: "184 Kg",
    tunai: 390000,
    nonTunai: 1100000,
    total: 1490000,
    status: "Tutup Buku"
  },
  {
    tanggal: "12 Okt 2026",
    hari: "Rabu",
    transaksi: 29,
    beratTotal: "152 Kg",
    tunai: 320000,
    nonTunai: 900000,
    total: 1220000,
    status: "Tutup Buku"
  },
  {
    tanggal: "11 Okt 2026",
    hari: "Selasa",
    transaksi: 32,
    beratTotal: "168 Kg",
    tunai: 400000,
    nonTunai: 980000,
    total: 1380000,
    status: "Tutup Buku"
  },
  {
    tanggal: "10 Okt 2026",
    hari: "Senin",
    transaksi: 28,
    beratTotal: "145 Kg",
    tunai: 290000,
    nonTunai: 860000,
    total: 1150000,
    status: "Tutup Buku"
  }
];

export const operationalChecklists = {
  dalamPengerjaan: [
    { nota: "SL-02", pelanggan: "Siti Rahmawati", proses: "Pencucian & Pengeringan", target: "14:15 WIB", sisaWaktu: "1 Jam lagi" },
    { nota: "SL-03", pelanggan: "Ahmad Fauzi", proses: "Pencucian Bed Cover", target: "16:00 WIB", sisaWaktu: "3 Jam lagi" },
    { nota: "SL-06", pelanggan: "Maya Indah", proses: "Setrika Uap & Packing", target: "17:30 WIB", sisaWaktu: "4.5 Jam lagi" },
    { nota: "SL-08", pelanggan: "Putri Anggraini", proses: "Perendaman Gorden Beludru", target: "Besok 10:00", sisaWaktu: "Besok" }
  ],
  siapDiambil: [
    { nota: "SL-01", pelanggan: "Budi Santoso", rak: "Rak A-03", waTerkirim: true, waktuSelesai: "10:30 WIB" },
    { nota: "SL-05", pelanggan: "Rian Hidayat", rak: "Rak B-12", waTerkirim: true, waktuSelesai: "11:15 WIB" }
  ],
  sudahSelesai: [
    { nota: "SL-04", pelanggan: "Dewi Lestari", diambilOleh: "Pelanggan langsung", jamAmbil: "11:40 WIB" },
    { nota: "SL-07", pelanggan: "Hendra Wijaya", diambilOleh: "Kurir GoSend", jamAmbil: "10:15 WIB" }
  ]
};