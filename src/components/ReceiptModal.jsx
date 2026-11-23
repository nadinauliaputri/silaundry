import React, { useState, useRef, useEffect } from 'react';
import { X, Printer, CheckCircle, Settings, Download, Bluetooth } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { formatRupiah } from '../utils/helpers';
import { supabase } from '../lib/supabaseClient';

export default function ReceiptModal({
  isOpen,
  transaction,
  adminProfile,
  onClose,
  onShowToast
}) {
  const [paperSize, setPaperSize] = useState('58mm');
  const [selectedPrinter, setSelectedPrinter] = useState('Printer Bluetooth (Thermal 58mm)');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);

  // State profil toko dinamis untuk header struk
  const [profile, setProfile] = useState(() => ({
    namaToko: adminProfile?.namaToko || '',
    namaAdmin: adminProfile?.namaAdmin || '',
    alamat: adminProfile?.alamatToko || adminProfile?.alamat || '',
    whatsapp: adminProfile?.whatsapp || '',
    email: adminProfile?.email || '',
    jamOperasional: adminProfile?.jamOperasional || ''
  }));

  const receiptRef = useRef(null);

  // Sinkronisasi jika prop adminProfile dari parent diperbarui
  useEffect(() => {
    if (adminProfile) {
      setProfile(prev => ({
        namaToko: adminProfile.namaToko || prev.namaToko,
        namaAdmin: adminProfile.namaAdmin || prev.namaAdmin,
        alamat: adminProfile.alamatToko || adminProfile.alamat || prev.alamat,
        whatsapp: adminProfile.whatsapp || prev.whatsapp,
        email: adminProfile.email || prev.email,
        jamOperasional: adminProfile.jamOperasional || prev.jamOperasional,
      }));
    }
  }, [adminProfile]);

  // Fetch profil toko dari Supabase & pasang listener Realtime
  useEffect(() => {
    let isMounted = true;

    const fetchStoreProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || localStorage.getItem('profileId');
        if (!userId) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data && isMounted) {
          setProfile({
            namaToko: data.nama_toko || '',
            namaAdmin: data.nama_admin || '',
            alamat: data.alamat || '',
            whatsapp: data.no_whatsapp || '',
            email: data.email || session?.user?.email || '',
            jamOperasional: data.jam_operasional || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile in ReceiptModal:', err);
      }
    };

    if (isOpen) {
      fetchStoreProfile();
    }

    const channel = supabase
      .channel('receipt-profile-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async (payload) => {
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id || localStorage.getItem('profileId');

          if (payload?.new && (!payload.new.id || payload.new.id === userId)) {
            if (isMounted) {
              setProfile({
                namaToko: payload.new.nama_toko || '',
                namaAdmin: payload.new.nama_admin || '',
                alamat: payload.new.alamat || '',
                whatsapp: payload.new.no_whatsapp || '',
                email: payload.new.email || session?.user?.email || '',
                jamOperasional: payload.new.jam_operasional || ''
              });
              return;
            }
          }
          fetchStoreProfile();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

  if (!isOpen || !transaction) return null;

  // Mapping identitas toko dengan fallback default yang rapi
  const storeName = (profile.namaToko || adminProfile?.namaToko || 'SI LAUNDRY').toUpperCase();
  const storeAddress = profile.alamat || adminProfile?.alamatToko || 'Alamat gerai laundry';
  const rawWa = profile.whatsapp || adminProfile?.whatsapp || '';
  const rawEmail = profile.email || adminProfile?.email || '';

  let contactInfo = '';
  if (rawWa && rawEmail) {
    contactInfo = `${rawWa} • ${rawEmail}`;
  } else if (rawWa) {
    contactInfo = rawWa;
  } else if (rawEmail) {
    contactInfo = rawEmail;
  } else {
    contactInfo = 'No. Kontak & Email belum diatur';
  }

  const adminName = profile.namaAdmin || adminProfile?.namaAdmin || 'Admin';

  // Fungsi helper untuk memformat tanggal string dengan pembatas vertikal "|"
  const formatTanggalMasuk = (dateString) => {
    if (!dateString) return '-';
    try {
      const parts = dateString.split(' ');
      const datePart = parts[0];
      const timePart = parts[1] || '';

      const [year, month, day] = datePart.split('-');
      if (!year || !month || !day) return dateString;

      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const monthName = months[parseInt(month, 10) - 1] || month;

      const formattedDate = `${parseInt(day, 10)} ${monthName} ${year}`;
      return timePart ? `${formattedDate} | ${timePart}` : formattedDate;
    } catch {
      return dateString;
    }
  };

  const handlePrint = () => {
    window.print();
    if (onShowToast) {
      onShowToast(`Mengirim data ke ${selectedPrinter} (${paperSize})...`);
    }
  };

  // Fungsi simpan JPG dengan menangkap seluruh tinggi konten tanpa terpotong scroll
  const handleSaveAsImage = async () => {
    if (receiptRef.current) {
      try {
        setIsSavingImage(true);
        const dataUrl = await toJpeg(receiptRef.current, {
          quality: 0.95,
          backgroundColor: '#ffffff',
          height: receiptRef.current.scrollHeight
        });

        const link = document.createElement('a');
        const notaName = transaction.no_nota || transaction.id || transaction.nota || 'Laundry';
        link.download = `Struk-${notaName}.jpg`;
        link.href = dataUrl;
        link.click();

        if (onShowToast) {
          onShowToast(`Struk ${notaName} berhasil disimpan sebagai JPG!`);
        }
      } catch (err) {
        console.error('Gagal menyimpan gambar:', err);
        if (onShowToast) {
          onShowToast('Gagal menyimpan struk sebagai gambar.', 'error');
        }
      } finally {
        setIsSavingImage(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div
        className={`relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] transition-all ${
          paperSize === '58mm' ? 'max-w-md' : 'max-w-lg'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Fixed Header) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSettingsOpen ? 'bg-[#008A7B] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Printer</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Pengaturan Printer & Ukuran Kertas (Collapsible Header Panel) */}
        {isSettingsOpen && (
          <div className="bg-slate-800 px-6 py-4 border-t border-slate-700 space-y-3 text-xs text-slate-200 animate-fadeIn shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Ukuran Kertas Thermal
                </label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-[#00C4B4] text-white"
                >
                  <option value="58mm">Thermal 58 mm (Standard)</option>
                  <option value="80mm">Thermal 80 mm (Wide)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Koneksi Printer Bluetooth
                </label>
                <div className="relative">
                  <select
                    value={selectedPrinter}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-[#00C4B4] text-white appearance-none"
                  >
                    <option value="Printer Bluetooth (Thermal 58mm)">Bluetooth: MTP-II / POS-58</option>
                    <option value="Bluetooth RPP02 (80mm)">Bluetooth: RPP02 (80mm)</option>
                    <option value="Printer Kasir USB Standard">USB Cable Printer</option>
                  </select>
                  <Bluetooth className="w-4 h-4 text-[#00C4B4] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              * Pastikan perangkat Bluetooth Anda sudah tersanding (*paired*) dengan perangkat ini.
            </p>
          </div>
        )}

        {/* Scrollable Container untuk Tampilan di Layar (Flex-1 Overflow Auto) */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Receipt Content yang dibungkus Ref */}
          <div ref={receiptRef} className="p-6 sm:p-8 space-y-5 bg-white">
            {/* 1. Header Toko Dinamis */}
            <div className="text-center pt-2 space-y-0.5">
              <h3 className="font-black text-base sm:text-lg tracking-wide text-[#101E2C] uppercase">
                {storeName}
              </h3>
              <p className="text-[11px] text-slate-500">
                {storeAddress}
              </p>
              <p className="text-[11px] text-slate-500">
                {contactInfo}
              </p>
              <p className="text-[11px] text-slate-600 font-semibold pt-0.5">
                Admin: {adminName}
              </p>
            </div>

            {/* Divider Dot Line */}
            <div className="border-b border-dashed border-slate-200 my-2" />

            {/* 2. Title & ID Transaksi Badge */}
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                STRUK LAUNDRY
              </h4>
              <span className="px-3 py-1 rounded-full bg-[#E6F8F5] text-[#008A7B] text-xs font-bold border border-[#00C4B4]/20">
                {transaction.no_nota || transaction.id || transaction.nota || 'TRX-1'}
              </span>
            </div>

            {/* 3. Customer & Info Box */}
            <div className="p-4 rounded-2xl bg-[#E6F8F5]/60 border border-[#00C4B4]/20 space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex">
                <span className="w-20 text-slate-500">Nama</span>
                <span className="font-bold text-[#101E2C]">: {transaction.pelanggan}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-slate-500">No. HP</span>
                <span className="font-bold text-[#101E2C]">: {transaction.telepon}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-slate-500">Alamat</span>
                <span className="font-bold text-[#101E2C] truncate">: {transaction.alamat || '-'}</span>
              </div>
            </div>

            {/* 4. Detail Layanan Table/List */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between font-bold text-slate-700">
                <span>JENIS LAYANAN</span>
                <span className="text-[#008A7B]">{transaction.layanan}</span>
              </div>
              <div className="p-4 space-y-2.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah</span>
                  <span className="font-bold text-slate-800">{transaction.beratQty} {transaction.unit || 'kg'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Harga Satuan</span>
                  <span className="font-bold text-slate-800">{formatRupiah(transaction.total / (transaction.beratQty || 1))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Masuk</span>
                  <span className="font-semibold text-slate-800">{formatTanggalMasuk(transaction.tanggalMasuk)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Selesai</span>
                  <span className="font-semibold text-slate-800">
                    {formatTanggalMasuk(transaction.tanggalSelesai || transaction.estimasiSelesai) || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Status Pembayaran</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3 h-3" />
                    <span>{transaction.statusBayar}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Total Biaya Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">TOTAL</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {transaction.beratQty} {transaction.unit || 'kg'} &times; {formatRupiah(transaction.total / (transaction.beratQty || 1))}
                </p>
              </div>
              <span className="text-xl font-black text-[#101E2C]">
                {formatRupiah(transaction.total)}
              </span>
            </div>

            {/* Footer note */}
            <p className="text-[10px] text-center text-slate-400 italic px-4">
              &ldquo;Terima kasih telah mempercayakan cucian Anda kepada kami. Sampai jumpa di laundry kami berikutnya.&rdquo;
            </p>
          </div>
        </div>

        {/* Action Footer Buttons (Fixed Bottom) */}
        <div className="p-6 pt-4 flex flex-wrap items-center justify-between gap-3 bg-white border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={handleSaveAsImage}
            disabled={isSavingImage}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Simpan Struk Menjadi Gambar JPG"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{isSavingImage ? 'Memproses JPG...' : 'Simpan JPG'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#008A7B] hover:bg-[#007366] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Cetak Struk</span>
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}