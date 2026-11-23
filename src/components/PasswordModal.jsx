import React, { useState, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function PasswordModal({ isOpen, onClose, onPasswordChanged }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  // Status validasi real-time
  const isLengthValid = newPassword.length >= 6;
  const isConfirmMatching = confirmPassword.length > 0 && confirmPassword === newPassword;
  const isFormValid = currentPassword.trim() !== '' && isLengthValid && isConfirmMatching;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Kata sandi saat ini wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Ambil session user aktif
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;

      if (!session || !userEmail) {
        throw new Error('Sesi autentikasi tidak ditemukan. Silakan login kembali.');
      }

      // 2. Verifikasi kata sandi lama terlebih dahulu dengan signInWithPassword
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (verifyError) {
        throw new Error('Kata sandi saat ini salah. Pastikan Anda memasukkan kata sandi yang benar.');
      }

      // 3. Perbarui kata sandi baru di Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw new Error(updateError.message || 'Gagal memperbarui kata sandi di sistem.');
      }

      // 4. Sukses: tampilkan status dan pemicu update real-time
      setIsSuccess(true);
      if (onPasswordChanged) {
        onPasswordChanged('Kata sandi berhasil diperbarui!');
      }

      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err) {
      console.error('Gagal memperbarui kata sandi:', err);
      setError(err.message || 'Terjadi kesalahan saat memperbarui kata sandi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101E2C]/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#172A3B] rounded-2xl shadow-modal border border-slate-100 dark:border-slate-700 overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#101E2C] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008A7B]/20 border border-[#008A7B]/40 flex items-center justify-center text-[#00C4B4]">
              <Lock className="w-5 h-5 text-[#00C4B4]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Ubah Kata Sandi</h3>
              <p className="text-xs text-slate-300">Perbarui kata sandi akun administrator Anda</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Berhasil Diperbarui!</h4>
            <p className="text-sm text-slate-500 dark:text-slate-300">Kata sandi akun admin Anda telah berhasil diganti dan dapat langsung digunakan.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Kata Sandi Saat Ini <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#112232] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A7B]/20 focus:border-[#008A7B] pr-10 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Minimal 6 karakter"
                  className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#112232] border text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 pr-10 transition-all font-medium ${
                    newPassword.length > 0
                      ? isLengthValid
                        ? 'border-emerald-300 dark:border-emerald-700 focus:ring-emerald-500/20 focus:border-emerald-500'
                        : 'border-amber-300 dark:border-amber-700 focus:ring-amber-500/20 focus:border-amber-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-[#008A7B]/20 focus:border-[#008A7B]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Indikator Validasi Real-time: Panjang Password */}
              {newPassword.length > 0 ? (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] animate-fadeIn">
                  {isLengthValid ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      Panjang kata sandi memenuhi syarat ({newPassword.length} karakter)
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Kurang {6 - newPassword.length} karakter lagi (minimal 6 karakter)
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                  Minimal 6 karakter kombinasi huruf, angka, atau simbol.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ulangi kata sandi baru"
                  className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#112232] border text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 pr-10 transition-all font-medium ${
                    confirmPassword.length > 0
                      ? isConfirmMatching
                        ? 'border-emerald-300 dark:border-emerald-700 focus:ring-emerald-500/20 focus:border-emerald-500'
                        : 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-[#008A7B]/20 focus:border-[#008A7B]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Indikator Validasi Real-time: Kecocokan Konfirmasi */}
              {confirmPassword.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] animate-fadeIn">
                  {isConfirmMatching ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      Konfirmasi kata sandi cocok
                    </span>
                  ) : (
                    <span className="text-rose-500 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Konfirmasi kata sandi belum cocok
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Security Tip */}
            <div className="p-3 bg-[#E6F8F5] dark:bg-[#008A7B]/15 border border-[#008A7B]/20 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#008A7B] dark:text-[#00C4B4] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Sesi login aktif Anda akan langsung diperbarui secara otomatis tanpa perlu login ulang atau me-refresh halaman.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#008A7B] hover:bg-[#007568] rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memperbarui...</span>
                  </>
                ) : (
                  <span>Perbarui Kata Sandi</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
