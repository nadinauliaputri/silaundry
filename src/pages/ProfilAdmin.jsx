import React, { useState } from 'react';
import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Clock,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Save,
  KeyRound
} from 'lucide-react';

export default function ProfilAdmin({
  adminProfile,
  onUpdateProfile,
  onOpenPasswordModal,
  onShowToast
}) {
  // Inisialisasi state: Jika email masih menggunakan domain lama atau kosong, langsung set ke namatoko@gmail.com
  const initialStoreName = adminProfile?.namaToko || 'SI LAUNDRY Express & Clean';
  const generatedEmail = initialStoreName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com';

  const [formData, setFormData] = useState({
    ...adminProfile,
    namaToko: initialStoreName,
    email: adminProfile?.email && !adminProfile.email.includes('silaundry.co.id') ? adminProfile.email : generatedEmail,
    // Kosongkan avatar / set null agar otomatis beralih menggunakan Avatar Abjad
    avatar: null
  });

  const [isSaved, setIsSaved] = useState(false);

  // Handler saat nama toko diketik/berubah
  const handleStoreNameChange = (e) => {
    const newName = e.target.value;
    const newEmail = newName
      ? newName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com'
      : 'admin@gmail.com';

    setFormData({
      ...formData,
      namaToko: newName,
      email: newEmail
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    if (onShowToast) {
      onShowToast('Data profil admin dan gerai laundry berhasil diperbarui!');
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Ambil huruf pertama dari nama toko untuk inisial avatar (Cth: 'S' dari 'SI LAUNDRY')
  const storeInitial = formData.namaToko ? formData.namaToko.charAt(0).toUpperCase() : 'S';

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-[#101E2C]">Profil Administrator & Pengaturan Gerai</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola identitas pemilik gerai, informasi kontak laundry, dan keamanan kata sandi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Security Overview */}
        <div className="space-y-6">
          {/* Profile Identity Card (Avatar Abjad & Tanpa Super Admin) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 text-center space-y-4">
            {/* Avatar / Inisial Toko Box (Abjad) */}
            <div className="relative w-24 h-24 mx-auto">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.namaAdmin}
                  className="w-full h-full rounded-2xl object-cover ring-4 ring-[#008A7B]/20 shadow-sm"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#101E2C] to-[#182C3F] text-white flex items-center justify-center text-3xl font-black ring-4 ring-[#008A7B]/20 shadow-sm">
                  {storeInitial}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-[#101E2C]">{formData.namaAdmin}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{formData.namaToko}</p>
            </div>

            {/* Account Status Badge */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{formData.statusAkun || 'Aktif & Terverifikasi'}</span>
              </span>
            </div>
          </div>

          {/* Security & Password Action Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#101E2C] text-white flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-[#00C4B4]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#101E2C]">Keamanan Akun</h4>
                <p className="text-[11px] text-slate-500">Kata sandi & autentikasi</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Disarankan untuk memperbarui kata sandi secara berkala guna melindungi data transaksi dan privasi pelanggan.
            </p>

            <button
              type="button"
              onClick={onOpenPasswordModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#101E2C] hover:bg-[#182C3F] text-white text-xs font-bold transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#00C4B4] group-hover:scale-110 transition-transform" />
              <span>Ubah Kata Sandi</span>
            </button>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-[#101E2C]">Informasi Profil & Gerai</h3>
                <p className="text-xs text-slate-500 mt-0.5">Informasi ini akan tercetak otomatis pada struk nota pelanggan</p>
              </div>
              {isSaved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Admin & Toko */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#008A7B]" />
                    Nama Administrator <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaAdmin}
                    onChange={(e) => setFormData({ ...formData, namaAdmin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#008A7B]" />
                    Nama Toko / Brand <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaToko}
                    onChange={handleStoreNameChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Email Resmi Gerai (Otomatis namatoko@gmail.com) & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#008A7B]" />
                    Email Resmi Gerai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 bg-slate-100/70"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Otomatis sinkron dengan nama toko (namatoko@gmail.com).</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#008A7B]" />
                    No. WhatsApp Layanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Jam Operasional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#008A7B]" />
                  Jam Operasional Toko
                </label>
                <input
                  type="text"
                  value={formData.jamOperasional}
                  onChange={(e) => setFormData({ ...formData, jamOperasional: e.target.value })}
                  placeholder="Contoh: 08:00 - 21:00 WIB"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800"
                />
              </div>

              {/* Alamat Toko */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#008A7B]" />
                  Alamat Lengkap Gerai <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.alamatToko}
                  onChange={(e) => setFormData({ ...formData, alamatToko: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 leading-relaxed"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#008A7B] hover:bg-[#007063] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}