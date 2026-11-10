import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function NewTransactionModal({
  isOpen,
  onClose,
  onSave,
  servicesList = [],
  transactionCount = 0
}) {
  const getInitialFormData = () => {
    const defaultSvc = servicesList && servicesList.length > 0 ? servicesList[0] : null;
    return {
      namaPelanggan: '',
      nomorWhatsApp: '',
      alamatPelanggan: '',
      jenisLayanan: defaultSvc ? (defaultSvc.name || defaultSvc.nama || '') : '',
      hargaPerKg: defaultSvc ? (defaultSvc.price || 0) : 0,
      tanggalMasuk: new Date().toISOString().split('T')[0],
      tanggalSelesai: '',
      isLunas: true,
      beratQty: 1,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);

  // Fungsi untuk mereset seluruh isi state form menjadi default/kosong
  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  // Reset form otomatis setiap kali modal dibuka atau servicesList berubah
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, servicesList]);

  const handleClose = () => {
    resetForm();
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSvc = servicesList.find(s => (s.name || s.nama) === formData.jenisLayanan);

    const nextSeq = Number(transactionCount || 0) + 1;
    const seqId = `TRX-${nextSeq}`;

    const newTrx = {
      id: seqId,
      nota: seqId,
      tanggalMasuk: formData.tanggalMasuk,
      tanggalSelesai: formData.tanggalSelesai,
      pelanggan: formData.namaPelanggan || 'Pelanggan Baru',
      telepon: formData.nomorWhatsApp ? `+62 ${formData.nomorWhatsApp}` : '08123456789',
      alamat: formData.alamatPelanggan || 'Surabaya',
      layanan: formData.jenisLayanan,
      kategori: selectedSvc?.unit || 'kg',
      beratQty: Number(formData.beratQty),
      unit: selectedSvc?.unit ? (selectedSvc.unit.toLowerCase().includes('item') ? 'pcs' : selectedSvc.unit.toLowerCase().includes('pasang') ? 'pasang' : 'kg') : 'kg',
      total: Number(formData.hargaPerKg) * Number(formData.beratQty),
      statusBayar: formData.isLunas ? 'Lunas' : 'Belum Bayar',
      statusLaundry: 'Baru Masuk',
    };

    if (onSave) {
      onSave(newTrx);
    }
    resetForm();
    if (onClose) onClose();
  };

  const totalBiaya = Number(formData.hargaPerKg || 0) * Number(formData.beratQty || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#172A3B] rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#00C4B4]">
              TRANSAKSI BARU
            </span>
            <h3 className="text-xl font-black text-[#101E2C] dark:text-white tracking-tight mt-0.5">
              Input layanan pelanggan
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Nama pelanggan & Nomor WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama pelanggan *
              </label>
              <input
                type="text"
                required
                value={formData.namaPelanggan}
                onChange={(e) => setFormData({ ...formData, namaPelanggan: e.target.value })}
                placeholder="Nama customer"
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nomor WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.nomorWhatsApp}
                onChange={(e) => setFormData({ ...formData, nomorWhatsApp: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Row 2: Alamat pelanggan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Alamat pelanggan
            </label>
            <input
              type="text"
              value={formData.alamatPelanggan}
              onChange={(e) => setFormData({ ...formData, alamatPelanggan: e.target.value })}
              placeholder="Masukkan alamat lengkap pelanggan"
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Row 3: Jenis layanan & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Jenis layanan *
              </label>
              <div className="relative">
                <select
                  value={formData.jenisLayanan}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const foundSvc = servicesList.find((s) => (s.name || s.nama) === selectedName);
                    setFormData({
                      ...formData,
                      jenisLayanan: selectedName,
                      hargaPerKg: foundSvc ? foundSvc.price : 0,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all appearance-none text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  {servicesList && servicesList.length > 0 ? (
                    servicesList.map((svc) => (
                      <option key={svc.id} value={svc.name || svc.nama}>
                        {svc.name || svc.nama} ({formatRupiah(svc.price)})
                      </option>
                    ))
                  ) : (
                    <option value="">Belum ada layanan di katalog</option>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Harga Satuan (Otomatis)
              </label>
              <input
                type="text"
                disabled
                value={formatRupiah(formData.hargaPerKg)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed font-bold"
              />
            </div>
          </div>

          {/* Row 4: Jumlah / Berat (Kg/Pcs) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Jumlah (Kg / Pcs) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              required
              value={formData.beratQty}
              onChange={(e) => setFormData({ ...formData, beratQty: e.target.value })}
              placeholder="Contoh: 2"
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all font-bold"
            />
          </div>

          {/* Row 5: Tanggal masuk & Tanggal selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tanggal masuk
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.tanggalMasuk}
                  onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tanggal selesai
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.tanggalSelesai}
                  onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Checkbox Pembayaran lunas */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isLunas"
              checked={formData.isLunas}
              onChange={(e) => setFormData({ ...formData, isLunas: e.target.checked })}
              className="w-4 h-4 rounded text-[#008A7B] border-slate-300 focus:ring-[#008A7B] accent-[#008A7B] cursor-pointer"
            />
            <label htmlFor="isLunas" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              Pembayaran sudah lunas
            </label>
          </div>

          {/* Total Biaya Box */}
          <div className="p-4 rounded-2xl bg-[#E6F8F5] dark:bg-[#112E2B] border border-[#00C4B4]/30 flex items-center justify-between mt-2">
            <div>
              <p className="text-xs font-bold text-[#00665A] dark:text-[#00C4B4]">Total biaya laundry</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {formData.beratQty || 0} unit × {formatRupiah(formData.hargaPerKg)}
              </p>
            </div>
            <span className="text-lg font-black text-[#101E2C] dark:text-white">
              {formatRupiah(totalBiaya)}
            </span>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#008A7B] hover:bg-[#007366] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Simpan & buat struk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}