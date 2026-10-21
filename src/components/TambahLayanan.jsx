import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Check,
    WashingMachine,
    Clock,
    Coins,
    Package,
    Layers,
    CheckCircle2,
    AlertCircle,
    Trash2
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';

export default function TambahLayanan({
    isOpen,
    onClose,
    onSaveService,
    onDeleteService,
    initialData = null
}) {
    const isEditMode = Boolean(initialData);

    const [formData, setFormData] = useState({
        nama: '',
        harga: '',
        satuan: 'Kilogram (kg)',
        estimasi: 2,
        status: 'Tersedia'
    });

    const [errors, setErrors] = useState({});

        useEffect(() => {
        if (!isOpen) return;
        // Populate form when modal opens
        if (initialData) {
            let unitValue = initialData.unit || 'Kilogram (kg)';
            if (unitValue.toLowerCase().startsWith('kg')) {
                unitValue = 'Kilogram (kg)';
            } else if (unitValue.toLowerCase().includes('item') || unitValue.toLowerCase().includes('pcs')) {
                unitValue = 'Item / Pcs';
            } else if (unitValue.toLowerCase().includes('pasang')) {
                unitValue = 'Pasang';
            }

            let estimasiValue = initialData.days;
            if (!estimasiValue && initialData.estimation) {
                const match = String(initialData.estimation).match(/\d+/);
                estimasiValue = match ? Number(match[0]) : 2;
            }

            setFormData({
                nama: initialData.name || initialData.nama || '',
                harga: initialData.price !== undefined ? initialData.price : (initialData.harga || ''),
                satuan: unitValue,
                estimasi: estimasiValue || 2,
                status: initialData.status || 'Tersedia'
            });
        } else {
            setFormData({
                nama: '',
                harga: '',
                satuan: 'Kilogram (kg)',
                estimasi: 2,
                status: 'Tersedia'
            });
        }
        setErrors({});
    }, [isOpen]);

        useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.nama.trim()) {
            newErrors.nama = 'Nama layanan wajib diisi';
        }
        if (!formData.harga || Number(formData.harga) <= 0) {
            newErrors.harga = 'Harga layanan harus lebih dari Rp 0';
        }
        if (!formData.estimasi || Number(formData.estimasi) < 1) {
            newErrors.estimasi = 'Estimasi pengerjaan minimal 1 hari';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            id: initialData?.id,
            nama: formData.nama.trim(),
            name: formData.nama.trim(),
            harga: Number(formData.harga),
            price: Number(formData.harga),
            satuan: formData.satuan,
            unit: formData.satuan,
            estimasi: Number(formData.estimasi),
            days: Number(formData.estimasi),
            status: formData.status
        };

        if (onSaveService) {
            onSaveService(payload);
        }
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus layanan "${formData.nama}"?`)) {
            if (onDeleteService) {
                onDeleteService(initialData?.id || initialData);
            }
            onClose();
        }
    };

    const satuanOptions = [
        'Kilogram (kg)',
        'Item / Pcs',
        'Pasang',
        'Meter'
    ];

    const shortUnit = formData.satuan.includes('kg')
        ? 'kg'
        : formData.satuan.includes('Item')
            ? 'item'
            : formData.satuan.includes('Pasang')
                ? 'pasang'
                : 'meter';

    const modalContent = (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn overflow-y-auto"
            onClick={onClose}
        >
            {/* Modal Box Utama */}
            <div
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Bungkus seluruh isi dengan form agar tombol simpan berfungsi di dalam */}
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    {/* Header Modal */}
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white shrink-0">
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008A7B]">
                                {isEditMode ? 'EDIT LAYANAN' : 'TAMBAH LAYANAN'}
                            </span>
                            <h3 className="text-lg font-black text-[#101E2C] tracking-tight">
                                {isEditMode ? 'Ubah Informasi Layanan' : 'Buat Layanan Laundry Baru'}
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                            title="Tutup Modal"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Form Body yang bisa di-scroll */}
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        {/* Input Nama Layanan */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-[#008A7B]" />
                                <span>Nama Layanan</span>
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.nama}
                                onChange={(e) => {
                                    setFormData({ ...formData, nama: e.target.value });
                                    if (errors.nama) setErrors({ ...errors, nama: '' });
                                }}
                                placeholder="Contoh: Cuci Kiloan Premium, Cuci Bedcover"
                                className={`w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border ${
                                    errors.nama ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400 font-medium`}
                            />
                            {errors.nama && (
                                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        {/* Grid: Harga & Satuan */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Coins className="w-3.5 h-3.5 text-[#008A7B]" />
                                    <span>Harga Layanan (Rp)</span>
                                    <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="500"
                                        value={formData.harga}
                                        onChange={(e) => {
                                            setFormData({ ...formData, harga: e.target.value });
                                            if (errors.harga) setErrors({ ...errors, harga: '' });
                                        }}
                                        placeholder="7000"
                                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/50 border ${
                                            errors.harga ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all placeholder:text-slate-400 font-medium`}
                                    />
                                </div>
                                {errors.harga && (
                                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.harga}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-[#008A7B]" />
                                    <span>Satuan Hitung</span>
                                    <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={formData.satuan}
                                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all font-medium cursor-pointer"
                                >
                                    {satuanOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Grid: Estimasi Hari & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#008A7B]" />
                                    <span>Estimasi Pengerjaan</span>
                                    <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={formData.estimasi}
                                        onChange={(e) => {
                                            setFormData({ ...formData, estimasi: e.target.value });
                                            if (errors.estimasi) setErrors({ ...errors, estimasi: '' });
                                        }}
                                        className={`w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border ${
                                            errors.estimasi ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all font-medium`}
                                    />
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        Hari
                                    </span>
                                </div>
                                {errors.estimasi && (
                                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.estimasi}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008A7B]" />
                                    <span>Status Layanan</span>
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] transition-all font-medium cursor-pointer"
                                >
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Tidak Tersedia">Tidak Tersedia</option>
                                </select>
                            </div>
                        </div>

                        {/* Pratinjau Card Layanan */}
                        <div className="pt-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                PRATINJAU KARTU LAYANAN:
                            </span>
                            <div className="bg-[#E6F8F5] rounded-2xl p-4 border border-[#008A7B]/15 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white text-[#008A7B] flex items-center justify-center shadow-xs">
                                        <WashingMachine className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-sm text-[#101E2C]">
                                            {formData.nama.trim() || 'Nama Layanan Laundry'}
                                        </h4>
                                        <p className="text-[11px] text-slate-500">
                                            Estimasi pengerjaan {formData.estimasi || 2} hari
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-sm font-black text-[#101E2C] block">
                                        {formatRupiah(Number(formData.harga) || 0)}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500">
                                        / {shortUnit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Modal (Tombol Aksi) */}
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
                        <div>
                            {isEditMode && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Hapus</span>
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-[#00A391] hover:bg-[#008A7B] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>{isEditMode ? 'Simpan Perubahan' : 'Tambah Layanan'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

    return typeof document !== 'undefined'
        ? createPortal(modalContent, document.body)
        : modalContent;
}