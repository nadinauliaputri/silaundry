import React, { useState, useEffect, useRef } from 'react';
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
  KeyRound,
  Camera,
  Upload,
  Trash2,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ProfilAdmin({
  adminProfile,
  onUpdateProfile,
  onOpenPasswordModal,
  onShowToast
}) {
  const fileInputRef = useRef(null);

  // Inisialisasi state: Jika email masih menggunakan domain lama atau kosong, langsung set ke namatoko@gmail.com
  const initialStoreName = adminProfile?.namaToko || 'SI LAUNDRY Express & Clean';
  const generatedEmail = initialStoreName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com';

  const [formData, setFormData] = useState({
    ...adminProfile,
    namaToko: initialStoreName,
    email: adminProfile?.email && !adminProfile.email.includes('silaundry.co.id') ? adminProfile.email : generatedEmail,
    avatar: adminProfile?.avatar || null
  });

  const [isSaved, setIsSaved] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Sinkronkan formData jika adminProfile dari props diperbarui dari luar
  useEffect(() => {
    if (adminProfile) {
      setFormData(prev => ({
        ...prev,
        ...adminProfile,
        avatar: adminProfile.avatar ?? prev.avatar
      }));
    }
  }, [adminProfile]);

  // Fetch profil dari Supabase berdasarkan profileId yang tersimpan di localStorage
  useEffect(() => {
    const storedId = localStorage.getItem('profileId');
    console.log('profileId dari localStorage:', storedId);
    if (storedId) {
      setProfileId(storedId);
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', storedId)
          .single();
        if (error) {
          console.error('Gagal fetch profil:', error);
        } else if (data) {
          console.log('Profil dimuat dari Supabase:', data);
          const loadedAvatar = data.avatar_url || data.avatar || data.logo_url || localStorage.getItem('silaundry_avatar_' + storedId) || null;
          setFormData((prev) => ({
            ...prev,
            namaToko: data.nama_toko || prev.namaToko,
            namaAdmin: data.nama_admin || prev.namaAdmin,
            email: data.email || prev.email,
            whatsapp: data.no_whatsapp || prev.whatsapp,
            alamatToko: data.alamat || prev.alamatToko,
            jamOperasional: data.jam_operasional || prev.jamOperasional,
            avatar: loadedAvatar ?? prev.avatar,
          }));
        }
      };
      fetchProfile();
    } else {
      console.warn('profileId tidak ditemukan di localStorage. Update ke Supabase tidak akan berjalan.');
    }
  }, []);

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

  // Handler Upload Foto Profil / Logo Toko
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input file agar dapat memilih file yang sama jika diinginkan
    e.target.value = '';

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      if (onShowToast) {
        onShowToast('Format file tidak didukung. Harap pilih gambar (JPG, PNG, atau WEBP).', 'error');
      } else {
        alert('Format file tidak didukung. Harap pilih gambar (JPG, PNG, atau WEBP).');
      }
      return;
    }

    // Validasi ukuran file maksimal 2 MB
    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      if (onShowToast) {
        onShowToast('Ukuran foto terlalu besar. Maksimal ukuran file adalah 2 MB.', 'error');
      } else {
        alert('Ukuran foto terlalu besar. Maksimal ukuran file adalah 2 MB.');
      }
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const currentProfileId = profileId || localStorage.getItem('profileId');
      let avatarUrl = null;

      // 1. Coba upload ke Supabase Storage (bucket 'avatars' atau 'logos')
      if (currentProfileId) {
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${currentProfileId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        try {
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            avatarUrl = publicUrlData?.publicUrl;
          } else {
            console.warn('Upload bucket avatars gagal, mencoba bucket logos:', uploadErr);
            const { data: uploadLogos, error: logosErr } = await supabase.storage
              .from('logos')
              .upload(filePath, file, { upsert: true });

            if (!logosErr && uploadLogos) {
              const { data: logosUrlData } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath);
              avatarUrl = logosUrlData?.publicUrl;
            }
          }
        } catch (storageEx) {
          console.warn('Storage exception, menggunakan konversi data URL:', storageEx);
        }
      }

      // 2. Fallback jika bucket storage belum dibuat atau dibatasi: Konversi ke Base64 Data URL
      if (!avatarUrl) {
        avatarUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
      }

      // 3. Simpan URL avatar ke tabel profiles di Supabase
      if (currentProfileId && avatarUrl) {
        let { error: updateErr } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', currentProfileId);

        // Fallback jika nama kolom di database adalah 'avatar' atau 'logo_url'
        if (updateErr && updateErr.code === '42703') {
          let { error: err2 } = await supabase
            .from('profiles')
            .update({ avatar: avatarUrl })
            .eq('id', currentProfileId);
          if (err2 && err2.code === '42703') {
            await supabase
              .from('profiles')
              .update({ logo_url: avatarUrl })
              .eq('id', currentProfileId);
          }
        }

        localStorage.setItem('silaundry_avatar_' + currentProfileId, avatarUrl);
      }

      // 4. Perbarui state lokal dan sinkronkan ke parent context (App.jsx -> Header & Sidebar)
      const updated = {
        ...formData,
        avatar: avatarUrl
      };
      setFormData(updated);

      if (onUpdateProfile) {
        onUpdateProfile(updated);
      }

      if (onShowToast) {
        onShowToast('Foto profil / logo toko berhasil diperbarui!', 'success');
      }
    } catch (err) {
      console.error('Gagal mengunggah foto profil:', err);
      if (onShowToast) {
        onShowToast(`Gagal mengunggah foto: ${err.message || 'Terjadi kesalahan'}`, 'error');
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handler Hapus Foto Profil / Logo Toko
  const handleDeleteAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const currentProfileId = profileId || localStorage.getItem('profileId');

      if (currentProfileId) {
        // Update URL di database profiles menjadi null
        let { error: delErr } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', currentProfileId);

        if (delErr && delErr.code === '42703') {
          let { error: err2 } = await supabase
            .from('profiles')
            .update({ avatar: null })
            .eq('id', currentProfileId);
          if (err2 && err2.code === '42703') {
            await supabase
              .from('profiles')
              .update({ logo_url: null })
              .eq('id', currentProfileId);
          }
        }

        localStorage.removeItem('silaundry_avatar_' + currentProfileId);
      }

      // Update state lokal dan sinkronkan ke parent
      const updated = {
        ...formData,
        avatar: null
      };
      setFormData(updated);

      if (onUpdateProfile) {
        onUpdateProfile(updated);
      }

      if (onShowToast) {
        onShowToast('Foto profil berhasil dihapus, beralih ke inisial nama toko.', 'info');
      }
    } catch (err) {
      console.error('Gagal menghapus foto profil:', err);
      if (onShowToast) {
        onShowToast('Gagal menghapus foto profil.', 'error');
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentProfileId = profileId || localStorage.getItem('profileId');
    console.log('handleSubmit - profileId:', currentProfileId);

    if (currentProfileId) {
      const updatePayload = {
        nama_toko: formData.namaToko,
        nama_admin: formData.namaAdmin,
        no_whatsapp: formData.whatsapp,
        email: formData.email,
        alamat: formData.alamatToko,
        jam_operasional: formData.jamOperasional,
      };

      if (formData.avatar) {
        updatePayload.avatar_url = formData.avatar;
      }

      console.log('Update payload:', updatePayload);

      let { data: updatedData, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', currentProfileId)
        .select();

      // Fallback jika kolom avatar_url tidak ada saat simpan formulir
      if (error && error.code === '42703' && updatePayload.avatar_url) {
        delete updatePayload.avatar_url;
        const resRetry = await supabase
          .from('profiles')
          .update(updatePayload)
          .eq('id', currentProfileId)
          .select();
        updatedData = resRetry.data;
        error = resRetry.error;
      }

      if (error) {
        console.error('Gagal update profil:', error);
        alert(`Gagal menyimpan perubahan: ${error.message}`);
        return;
      }
      console.log('Profil berhasil diperbarui di Supabase:', updatedData);
    } else {
      console.warn('Tidak ada profileId, update Supabase dilewati.');
      alert('Perhatian: Profil tidak tersinkron dengan database. Silakan daftar ulang atau hubungi admin.');
    }

    onUpdateProfile(formData);
    setIsSaved(true);
    if (onShowToast) {
      onShowToast('Data profil admin dan gerai laundry berhasil diperbarui!');
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Ambil huruf pertama dari nama toko untuk inisial avatar (fallback ke nama admin jika kosong)
  const storeInitial = (formData.namaToko || formData.namaAdmin || 'S').trim().charAt(0).toUpperCase() || 'S';

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-[#101E2C] dark:text-white">Profil Administrator & Pengaturan Gerai</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Kelola identitas pemilik gerai, logo/foto profil toko, informasi kontak laundry, dan keamanan kata sandi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Security Overview */}
        <div className="space-y-6">
          {/* Profile Identity Card */}
          <div className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-6 text-center space-y-4">
            {/* Avatar / Foto Profil Toko */}
            <div className="relative w-24 h-24 mx-auto group">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.namaAdmin || 'Logo Toko'}
                  className="w-full h-full rounded-2xl object-cover ring-4 ring-[#008A7B]/20 shadow-sm"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#101E2C] to-[#182C3F] text-white flex items-center justify-center text-3xl font-black ring-4 ring-[#008A7B]/20 shadow-sm">
                  {storeInitial}
                </div>
              )}

              {/* Status Loading atau Tombol Kamera Cepat */}
              {isUploadingAvatar ? (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center text-white animate-fadeIn">
                  <Loader2 className="w-6 h-6 animate-spin text-[#00C4B4]" />
                  <span className="text-[10px] font-bold mt-1">Memproses...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={formData.avatar ? 'Ganti foto profil / logo' : 'Unggah foto profil / logo'}
                  className="absolute -bottom-1 -right-1 p-2 bg-[#008A7B] hover:bg-[#007063] text-white rounded-full ring-2 ring-white dark:ring-[#172A3B] shadow-md transition-all cursor-pointer group-hover:scale-105"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tombol Aksi Tambah / Ganti & Hapus Foto Profil */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#008A7B] hover:text-white dark:bg-slate-800 dark:hover:bg-[#008A7B] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{formData.avatar ? 'Ganti Foto' : 'Unggah Foto'}</span>
                </button>

                {formData.avatar && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={isUploadingAvatar}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all border border-rose-200/60 dark:border-rose-800/60 shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Hapus foto dan kembali ke inisial nama toko"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Format: JPG, PNG, WEBP (maks. 2 MB)</p>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-[#101E2C] dark:text-white">{formData.namaAdmin}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{formData.namaToko}</p>
            </div>

            {/* Account Status Badge */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{formData.statusAkun || 'Aktif & Terverifikasi'}</span>
              </span>
            </div>
          </div>

          {/* Security & Password Action Box */}
          <div className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#101E2C] dark:bg-slate-800 text-white flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-[#00C4B4]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#101E2C] dark:text-white">Keamanan Akun</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Kata sandi & autentikasi</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Disarankan untuk memperbarui kata sandi secara berkala guna melindungi data transaksi dan privasi pelanggan.
            </p>

            <button
              type="button"
              onClick={onOpenPasswordModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#101E2C] hover:bg-[#182C3F] dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#00C4B4] group-hover:scale-110 transition-transform" />
              <span>Ubah Kata Sandi</span>
            </button>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#172A3B] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-[#101E2C] dark:text-white">Informasi Profil & Gerai</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Informasi ini akan tercetak otomatis pada struk nota pelanggan</p>
              </div>
              {isSaved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Admin & Toko */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#008A7B]" />
                    Nama Administrator <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaAdmin}
                    onChange={(e) => setFormData({ ...formData, namaAdmin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#008A7B]" />
                    Nama Toko / Brand <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaToko}
                    onChange={handleStoreNameChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Email Resmi Gerai & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#008A7B]" />
                    Email Resmi Gerai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 dark:text-white bg-slate-100/70"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Otomatis sinkron dengan nama toko (namatoko@gmail.com).</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#008A7B]" />
                    No. WhatsApp Layanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Jam Operasional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#008A7B]" />
                  Jam Operasional Toko
                </label>
                <input
                  type="text"
                  value={formData.jamOperasional}
                  onChange={(e) => setFormData({ ...formData, jamOperasional: e.target.value })}
                  placeholder="Contoh: 08:00 - 21:00 WIB"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 dark:text-white"
                />
              </div>

              {/* Alamat Toko */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#008A7B]" />
                  Alamat Lengkap Gerai <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.alamatToko}
                  onChange={(e) => setFormData({ ...formData, alamatToko: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] font-semibold text-slate-800 dark:text-white leading-relaxed"
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
