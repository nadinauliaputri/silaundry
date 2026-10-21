import React, { useState } from 'react';
import {
  X,
  Check,
  Calendar,
  ChevronDown,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function NewTransactionModal({
  isOpen,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    namaPelanggan: '',
    nomorWhatsApp: '',
    alamatPelanggan: '',
    jenisLayanan: 'Cuci Kiloan',
    hargaPerKg: 7000,
    tanggalMasuk: '21/05/2025',
    tanggalSelesai: '23/05/2025',
    isLunas: true,
    beratQty: 1,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrx = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      nota: `NOTA-${Math.floor(100 + Math.random() * 900)}`,
      tanggalMasuk: formData.tanggalMasuk,
      pelanggan: formData.namaPelanggan || 'Pelanggan Baru',
      telepon: formData.nomorWhatsApp ? `+62 ${formData.nomorWhatsApp}` : '08123456789',
      alamat: formData.alamatPelanggan || 'Surabaya',
      layanan: formData.jenisLayanan,
      kategori: 'Kiloan',
      beratQty: formData.beratQty,
      unit: 'kg',
      total: formData.hargaPerKg * formData.beratQty,
      statusBayar: formData.isLunas ? 'Lunas' : 'Belum Bayar',
      statusLaundry: 'Dalam pengerjaan',
    };

    if (onSave) {
      onSave(newTrx);
    }
    onClose();
  };

  const totalBiaya = formData.hargaPerKg * formData.beratQty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008A7B]">
              TRANSAKSI BARU
            </span>
            <h3 className="text-xl font-black text-[#101E2C] tracking-tight mt-0.5">
              Input layanan pelanggan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Nama pelanggan & Nomor WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama pelanggan
              </label>
              <input
                type="text"
                required
                value={formData.namaPelanggan}
                onChange={(e) => setFormData({ ...formData, namaPelanggan: e.target.value })}
                placeholder="Nama customer"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                required
                value={formData.nomorWhatsApp}
                onChange={(e) => setFormData({ ...formData, nomorWhatsApp: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Row 2: Alamat pelanggan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Alamat pelanggan
            </label>
            <input
              type="text"
              value={formData.alamatPelanggan}
              onChange={(e) => setFormData({ ...formData, alamatPelanggan: e.target.value })}
              placeholder="Masukkan alamat lengkap pelanggan"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Row 3: Jenis layanan & Harga per kg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jenis layanan
              </label>
              <div className="relative">
                <select
                  value={formData.jenisLayanan}
                  onChange={(e) => setFormData({ ...formData, jenisLayanan: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all appearance-none text-slate-800 cursor-pointer"
                >
                  <option value="Cuci Kiloan">Cuci Kiloan</option>
                  <option value="Cuci Setrika">Cuci Setrika</option>
                  <option value="Cuci Selimut">Cuci Selimut</option>
                  <option value="Cuci Sepatu">Cuci Sepatu</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Harga per kg
              </label>
              <input
                type="number"
                value={formData.hargaPerKg}
                onChange={(e) => setFormData({ ...formData, hargaPerKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all"
              />
            </div>
          </div>

          {/* Row 4: Tanggal masuk & Tanggal selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal masuk
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.tanggalMasuk}
                  onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal selesai
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.tanggalSelesai}
                  onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            <label htmlFor="isLunas" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
              Pembayaran sudah lunas
            </label>
          </div>

          {/* Total Biaya Box */}
          <div className="p-4 rounded-2xl bg-[#E6F8F5] border border-[#00C4B4]/30 flex items-center justify-between mt-2">
            <div>
              <p className="text-xs font-bold text-[#00665A]">Total biaya laundry</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{formData.beratQty} kg × {formatRupiah(formData.hargaPerKg)}</p>
            </div>
            <span className="text-lg font-black text-[#101E2C]">
              {formatRupiah(totalBiaya)}
            </span>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
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