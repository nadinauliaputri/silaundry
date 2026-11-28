import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ReceiptModal from './components/ReceiptModal';
import PasswordModal from './components/PasswordModal';
import NewTransactionModal from './components/NewTransactionModal';
import LogoutModal from './components/LogoutModal';
import TambahLayanan from './components/TambahLayanan';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RegisterToko from './pages/RegisterToko';
import Dashboard from './pages/Dashboard';
import Transaksi from './pages/Transaksi';
import Pelanggan from './pages/Pelanggan';
import Laporan from './pages/Laporan';
import Pendapatan from './pages/Pendapatan';
import ProfilAdmin from './pages/ProfilAdmin';

import { supabase } from './lib/supabaseClient';
import { WashingMachine, Shirt, CloudRain, Layers } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPage = localStorage.getItem('silaundry_active_page');
      if (savedPage) return savedPage;
    }
    return 'landing';
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [servicesList, setServicesList] = useState([]); // will be loaded from Supabase

  // Modals state
  const [selectedReceiptTrx, setSelectedReceiptTrx] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNewTrxModalOpen, setIsNewTrxModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Simpan status halaman yang sedang aktif (active tab/page) ke localStorage
  useEffect(() => {
    if (activePage && typeof window !== 'undefined') {
      localStorage.setItem('silaundry_active_page', activePage);
    }
  }, [activePage]);

  // Centralized dark mode from ThemeContext
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Helper untuk memuat data tenant/toko yang sedang aktif
  const loadTenantData = async (userId, isMountedRef = true) => {
    if (!userId) return;

    try {
      // 1. Ambil data layanan khusus milik user ini
      const { data: svcData, error: svcErr } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: true });
      if (!svcErr && svcData && isMountedRef) {
        setServicesList(svcData);
      }

      // 2. Ambil data customers
      let custQuery = supabase.from('customers').select('*');
      const { data: custData, error: custErr } = await custQuery;
      if (!custErr && custData && isMountedRef) {
        setCustomers(custData);
      }

      // 3. Ambil data transaksi khusus milik user ini
      const { data: trxData, error: trxErr } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!trxErr && trxData && isMountedRef) {
        setTransactions(trxData);
      }
    } catch (err) {
      console.error('Error fetching tenant data:', err);
    }
  };

  // Cek session login aktif via supabase.auth.getSession() & fetch initial data
  useEffect(() => {
    let isMounted = true;

    const initAuthAndData = async () => {
      try {
        setIsLoadingAuth(true);

        // Periksa status login user dari Supabase Auth via getSession()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error fetching session:', sessionError);
        }

        const currentUser = session?.user || null;
        const userId = currentUser ? currentUser.id : null;

        if (currentUser && userId && isMounted) {
          localStorage.setItem('profileId', userId);

          // Ambil profil admin dari Supabase profiles
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (profileData && isMounted) {
            const avatarUrl = profileData.avatar_url || profileData.avatar || profileData.logo_url || localStorage.getItem('silaundry_avatar_' + userId) || null;
            setAdminProfile({
              namaToko: profileData.nama_toko || 'SI LAUNDRY',
              namaAdmin: profileData.nama_admin || 'Admin',
              email: profileData.email || currentUser.email,
              whatsapp: profileData.no_whatsapp || '',
              alamatToko: profileData.alamat || '',
              jamOperasional: profileData.jam_operasional || '',
              avatar: avatarUrl,
            });
          } else if (isMounted) {
            const avatarUrl = localStorage.getItem('silaundry_avatar_' + userId) || null;
            setAdminProfile({
              namaToko: 'SI LAUNDRY',
              namaAdmin: currentUser.user_metadata?.namaAdmin || 'Admin',
              email: currentUser.email,
              whatsapp: '',
              alamatToko: '',
              jamOperasional: '',
              avatar: avatarUrl,
            });
          }

          // Pulihkan halaman aktif dari localStorage agar tetap di halaman terakhir saat di-refresh (F5)
          const savedPage = localStorage.getItem('silaundry_active_page');
          const authenticatedPages = ['dashboard', 'transaksi', 'pelanggan', 'laporan', 'pendapatan', 'profil'];
          if (savedPage && authenticatedPages.includes(savedPage)) {
            setActivePage(savedPage);
          } else {
            setActivePage('dashboard');
          }

          // Muat data khusus toko ini (layanan, pelanggan, transaksi)
          await loadTenantData(userId, isMounted);
        } else if (isMounted) {
          // Jika tidak ada user login: bersihkan seluruh state agar tidak ada data lintas toko yang bocor
          setAdminProfile(null);
          setServicesList([]);
          setCustomers([]);
          setTransactions([]);
          localStorage.removeItem('profileId');

          // Jika tidak ada session yang aktif, arahkan ke landing atau login/register
          const savedPage = localStorage.getItem('silaundry_active_page');
          if (savedPage === 'register' || savedPage === 'login') {
            setActivePage(savedPage);
          } else {
            setActivePage('landing');
          }
        }
      } catch (err) {
        console.error('Error initializing app state:', err);
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    initAuthAndData();

    // Supabase Realtime Channel untuk sinkronisasi otomatis tabel customers dan transactions
    const realtimeChannel = supabase
      .channel('app-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        async () => {
          const { data: updatedCust } = await supabase
            .from('customers')
            .select('*');
          if (updatedCust && isMounted) {
            setCustomers(updatedCust);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        async () => {
          const { data: { session } } = await supabase.auth.getSession();
          const uid = session?.user?.id || localStorage.getItem('profileId');
          if (!uid) return;
          const { data: updatedTrx } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false });
          if (updatedTrx && isMounted) {
            setTransactions(updatedTrx);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async () => {
          const { data: { session } } = await supabase.auth.getSession();
          const uid = session?.user?.id || localStorage.getItem('profileId');
          if (uid) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', uid)
              .maybeSingle();

            if (profileData && isMounted) {
              const avatarUrl = profileData.avatar_url || profileData.avatar || profileData.logo_url || (uid ? localStorage.getItem('silaundry_avatar_' + uid) : null) || null;
              setAdminProfile({
                namaToko: profileData.nama_toko || 'SI LAUNDRY',
                namaAdmin: profileData.nama_admin || 'Admin',
                email: profileData.email || session?.user?.email,
                whatsapp: profileData.no_whatsapp || '',
                alamatToko: profileData.alamat || '',
                jamOperasional: profileData.jam_operasional || '',
                avatar: avatarUrl,
              });
            }
          }
        }
      )
      .subscribe();

    // Listener perubahan status autentikasi Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT') {
        setAdminProfile(null);
        setServicesList([]);
        setCustomers([]);
        setTransactions([]);
        localStorage.removeItem('profileId');
        localStorage.setItem('silaundry_active_page', 'landing');
        setActivePage('landing');
      } else if (event === 'SIGNED_IN' && session?.user) {
        localStorage.setItem('profileId', session.user.id);
        await loadTenantData(session.user.id, isMounted);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    const duration = type === 'error' ? 6500 : 3500;
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Handle Logout — redirect to landing page
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('profileId');
    localStorage.setItem('silaundry_active_page', 'landing');
    setAdminProfile(null);
    setServicesList([]);
    setCustomers([]);
    setTransactions([]);
    setIsLogoutModalOpen(false);
    setIsMobileOpen(false);
    setActivePage('landing');
    showToast('Anda berhasil keluar dari akun admin.', 'success');
  };

  // Fungsi generator nomor nota urut khusus per akun toko (TRX-1, TRX-2, dst.)
  const generateNextNoNota = async (currentUserId) => {
    let maxNum = 0;
    const existingNumbers = new Set();
    const activeUserId = currentUserId || localStorage.getItem('profileId');

    // 1. Ambil data transaksi milik akun toko ini saja dari database
    try {
      let query = supabase.from('transactions').select('no_nota, id');
      if (activeUserId) {
        query = query.eq('user_id', activeUserId);
      }
      const { data: userTrx, error } = await query;

      if (!error && userTrx) {
        userTrx.forEach(row => {
          const candidates = [row.no_nota, row.id];
          candidates.forEach(cand => {
            if (cand) {
              const match = String(cand).trim().match(/^TRX-(\d+)$/i);
              if (match) {
                const num = parseInt(match[1], 10);
                existingNumbers.add(num);
                if (num > maxNum) maxNum = num;
              }
            }
          });
        });
      }
    } catch (e) {
      console.warn('Gagal cek nomor nota dari database:', e);
    }

    // 2. Cek juga dari state lokal transaksi saat ini (khusus user ini)
    transactions
      .filter(t => !activeUserId || !t.user_id || t.user_id === activeUserId)
      .forEach(t => {
        const candidates = [t.no_nota, t.id];
        candidates.forEach(cand => {
          if (cand) {
            const match = String(cand).trim().match(/^TRX-(\d+)$/i);
            if (match) {
              const num = parseInt(match[1], 10);
              existingNumbers.add(num);
              if (num > maxNum) maxNum = num;
            }
          }
        });
      });

    let nextNum = maxNum + 1;
    while (existingNumbers.has(nextNum)) {
      nextNum++;
    }
    return `TRX-${nextNum}`;
  };

  // Fungsi generator ID unik database (UUID global agar tidak pernah bentrok dengan primary key antar toko)
  const generateGlobalUniqueId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `TRX_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Add new transaction and persist to Supabase
  const handleCreateTransaction = async (newTrxData) => {
    try {
      const rawPhone = (newTrxData.telepon || '').trim();
      const cleanPhoneDigits = rawPhone.replace(/\D/g, '');
      const normalized08 = cleanPhoneDigits.startsWith('62')
        ? '0' + cleanPhoneDigits.slice(2)
        : cleanPhoneDigits;
      const normalized62 = cleanPhoneDigits.startsWith('0')
        ? '+62 ' + cleanPhoneDigits.slice(1)
        : (cleanPhoneDigits.startsWith('62') ? '+62 ' + cleanPhoneDigits.slice(2) : rawPhone);

      const phoneVariants = Array.from(new Set([rawPhone, normalized08, normalized62].filter(Boolean)));

      // 1. Ambil user_id aktif via getSession() atau getUser()
      const { data: { session } } = await supabase.auth.getSession();
      let userId = session?.user?.id || null;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || localStorage.getItem('profileId') || null;
      }

      // 2. Cek dan simpan/perbarui tabel customers
      // Kolom valid di tabel customers: id (int8 PK auto-increment), nama (text), no_telepon (text), alamat (text).
      // Catatan: TIDAK ADA kolom user_id di tabel customers, dan id diisi otomatis oleh database.
      const customerPhone = rawPhone || (phoneVariants.length > 0 ? phoneVariants[0] : '');
      const inputCustomerName = (newTrxData.pelanggan || '').trim();
      const inputAlamat = (newTrxData.alamat || '').trim() || 'Surabaya';

      try {
        let existingCust = null;

        // Cek berdasarkan nomor telepon terlebih dahulu
        for (const phone of phoneVariants) {
          if (!phone) continue;
          const { data: byPhone } = await supabase
            .from('customers')
            .select('*')
            .eq('no_telepon', phone)
            .maybeSingle();

          if (byPhone) {
            existingCust = byPhone;
            break;
          }
        }

        // Cek berdasarkan nama jika belum ditemukan
        if (!existingCust && inputCustomerName && inputCustomerName !== 'Pelanggan Baru') {
          const { data: byName } = await supabase
            .from('customers')
            .select('*')
            .eq('nama', inputCustomerName)
            .maybeSingle();
          if (byName) {
            existingCust = byName;
          }
        }

        if (existingCust) {
          // Update nama atau alamat jika ada perubahan
          const updates = {};
          if (inputCustomerName && inputCustomerName !== 'Pelanggan Baru' && (existingCust.nama || '').trim() !== inputCustomerName) {
            updates.nama = inputCustomerName;
          }
          if (inputAlamat && (existingCust.alamat || '').trim() !== inputAlamat) {
            updates.alamat = inputAlamat;
          }
          if (Object.keys(updates).length > 0) {
            await supabase
              .from('customers')
              .update(updates)
              .eq('id', existingCust.id);
          }
        } else if (customerPhone || inputCustomerName) {
          // Insert pelanggan baru (hanya nama, no_telepon, alamat)
          const newCustomerData = {
            nama: inputCustomerName || 'Pelanggan Baru',
            no_telepon: customerPhone || '-',
            alamat: inputAlamat,
          };

          const { error: insertCustErr } = await supabase
            .from('customers')
            .insert([newCustomerData]);

          if (insertCustErr) {
            console.warn('Gagal insert ke tabel customers:', insertCustErr.message);
          }
        }
      } catch (custErr) {
        console.warn('Proses customers di handleCreateTransaction:', custErr);
      }

      // Refresh state customers
      try {
        const { data: refreshedCust, error: refCustErr } = await supabase
          .from('customers')
          .select('*')
          .order('id', { ascending: false });
        if (!refCustErr && refreshedCust) {
          setCustomers(refreshedCust);
        }
      } catch (refErr) {
        console.warn('Catatan: refresh customers:', refErr);
      }

      const nextNoNota = await generateNextNoNota(userId);
      const globalId = generateGlobalUniqueId();

      // Pastikan tanggalMasuk dan tanggalSelesai terisi dan valid (format YYYY-MM-DD)
      const tanggalMasuk = (newTrxData.tanggalMasuk && String(newTrxData.tanggalMasuk).trim() !== '')
        ? newTrxData.tanggalMasuk
        : new Date().toISOString().split('T')[0];

      const tanggalSelesai = (newTrxData.tanggalSelesai && String(newTrxData.tanggalSelesai).trim() !== '')
        ? newTrxData.tanggalSelesai
        : tanggalMasuk;

      const beratQty = Number(newTrxData.beratQty) || 1;
      const rawHargaSatuan = Number(newTrxData.hargaSatuan) || Number(newTrxData.hargaPerKg) || (Number(newTrxData.total) / beratQty) || 0;
      const total = Number(newTrxData.total) || (rawHargaSatuan * beratQty);

      // Siapkan payload transaksi 100% sesuai skema tabel transactions Supabase:
      // Hanya kolom: id, no_nota, pelanggan, telepon, layanan, alamat, kategori, total, beratQty, unit, statusBayar, statusLaundry, tanggalMasuk, tanggalSelesai, user_id
      const trxPayload = {
        id: globalId,
        no_nota: nextNoNota,
        pelanggan: inputCustomerName || 'Pelanggan Baru',
        telepon: rawPhone || '08123456789',
        layanan: newTrxData.layanan || 'Cuci Reguler',
        alamat: (newTrxData.alamat || '').trim() || 'Surabaya',
        kategori: newTrxData.kategori || 'Kilogram (kg)',
        total: total,
        beratQty: beratQty,
        unit: newTrxData.unit || 'kg',
        statusBayar: newTrxData.statusBayar || 'Lunas',
        statusLaundry: newTrxData.statusLaundry || 'Baru Masuk',
        tanggalMasuk: tanggalMasuk,
        tanggalSelesai: tanggalSelesai,
        ...(userId ? { user_id: userId } : {})
      };

      let { data: resTrx, error: trxError } = await supabase
        .from('transactions')
        .insert([trxPayload])
        .select()
        .maybeSingle();

      if (trxError) {
        console.warn('Percobaan awal insert transactions menemui kendala:', trxError.message);
        // Fallback jika id auto-increment atau bigint (Error 22P02)
        if (trxError.code === '22P02' && trxPayload.id) {
          const retryPayload = { ...trxPayload };
          delete retryPayload.id;
          const { data: resRetry, error: errRetry } = await supabase
            .from('transactions')
            .insert([retryPayload])
            .select()
            .maybeSingle();
          if (!errRetry) {
            resTrx = resRetry;
            trxError = null;
          } else {
            trxError = errRetry;
          }
        }
      }

      if (trxError) {
        console.error('Error insert transaksi ke Supabase:', trxError);
        throw trxError;
      }

      // Pastikan objek data transaksi lengkap untuk tampilan di UI dan ReceiptModal
      const receiptTrx = {
        ...trxPayload,
        ...(resTrx || {}),
        id: (resTrx && resTrx.id) || trxPayload.id,
        no_nota: (resTrx && resTrx.no_nota) || trxPayload.no_nota,
        pelanggan: (resTrx && resTrx.pelanggan) || trxPayload.pelanggan,
        telepon: (resTrx && resTrx.telepon) || trxPayload.telepon,
        layanan: (resTrx && resTrx.layanan) || trxPayload.layanan,
        alamat: (resTrx && resTrx.alamat) || trxPayload.alamat,
        kategori: (resTrx && resTrx.kategori) || trxPayload.kategori,
        total: (resTrx && resTrx.total !== undefined) ? resTrx.total : trxPayload.total,
        beratQty: (resTrx && resTrx.beratQty !== undefined) ? resTrx.beratQty : trxPayload.beratQty,
        unit: (resTrx && resTrx.unit) || trxPayload.unit,
        statusBayar: (resTrx && resTrx.statusBayar) || trxPayload.statusBayar,
        statusLaundry: (resTrx && resTrx.statusLaundry) || trxPayload.statusLaundry,
        tanggalMasuk: (resTrx && resTrx.tanggalMasuk) || trxPayload.tanggalMasuk,
        tanggalSelesai: (resTrx && resTrx.tanggalSelesai) || trxPayload.tanggalSelesai,
      };

      // 1. Perbarui state transaksi langsung di React agar seketika muncul di halaman Transaksi
      setTransactions(prev => {
        const filtered = prev.filter(t => t.id !== receiptTrx.id && t.no_nota !== receiptTrx.no_nota);
        return [receiptTrx, ...filtered];
      });

      // 2. Sinkronkan dengan data database Supabase secara asynchronous di latar belakang
      (async () => {
        try {
          let refreshTrxQuery = supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });
          if (userId) {
            refreshTrxQuery = refreshTrxQuery.eq('user_id', userId);
          }
          const { data: refreshedTx } = await refreshTrxQuery;
          if (refreshedTx && refreshedTx.length > 0) {
            setTransactions(prev => {
              const map = new Map();
              refreshedTx.forEach(t => map.set(t.id || t.no_nota, t));
              if (!map.has(receiptTrx.id) && !map.has(receiptTrx.no_nota)) {
                map.set(receiptTrx.id, receiptTrx);
              }
              return Array.from(map.values());
            });
          }
        } catch (syncErr) {
          console.warn('Sync refresh transactions:', syncErr);
        }
      })();

      // 3. Tampilkan toast, tutup NewTransactionModal, dan langsung buka ReceiptModal
      showToast(`Pesanan nota ${receiptTrx.no_nota || receiptTrx.id} (${receiptTrx.pelanggan}) berhasil disimpan!`);
      setIsNewTrxModalOpen(false);
      setSelectedReceiptTrx(receiptTrx);
    } catch (err) {
      console.error('Detail error simpan transaksi:', err);
      const rawMsg = err?.message || err?.error_description || err?.details || err?.hint;
      const errorDetails = rawMsg
        ? (typeof rawMsg === 'string' ? rawMsg : JSON.stringify(rawMsg))
        : (typeof err === 'object' ? JSON.stringify(err) : String(err));
      showToast(`Gagal menambahkan transaksi: ${errorDetails}`, 'error');
      alert(`Gagal menyimpan transaksi ke database:\n${errorDetails}`);
      throw err;
    }
  };

  // Update transaction status laundry in Supabase
  const handleUpdateStatus = async (trxId, newStatus) => {
    try {
      const { error } = await supabase.from('transactions').update({ statusLaundry: newStatus }).eq('id', trxId);
      if (error) throw error;
      setTransactions(prev => prev.map(t => t.id === trxId ? { ...t, statusLaundry: newStatus } : t));
      showToast(`Status transaksi berhasil diubah menjadi "${newStatus}"`);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengubah status transaksi.', 'error');
    }
  };

  // Update transaction payment status in Supabase
  const handleUpdatePayment = async (trxId, newPaymentStatus) => {
    try {
      const { error } = await supabase.from('transactions').update({ statusBayar: newPaymentStatus }).eq('id', trxId);
      if (error) throw error;
      setTransactions(prev => prev.map(t => t.id === trxId ? { ...t, statusBayar: newPaymentStatus } : t));
      showToast(`Status pembayaran berhasil diubah menjadi "${newPaymentStatus}"`);
    } catch (err) {
      console.error(err);
      showToast('Gagal mengubah status pembayaran.', 'error');
    }
  };

  if (isLoadingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-[#0B131E] text-white' : 'bg-[#F5F7FA] text-slate-800'}`}>
        <div className="flex flex-col items-center gap-3 animate-fadeIn">
          <div className="w-10 h-10 border-4 border-[#008A7B]/20 border-t-[#008A7B] rounded-full animate-spin" />
          <p className="text-xs font-bold tracking-wider uppercase text-slate-400">Memuat SI LAUNDRY...</p>
        </div>
      </div>
    );
  }

  if (activePage === 'landing') {
    return (
      <>
        <LandingPage
          onEnterLogin={() => setActivePage('login')}
          onOpenRegister={() => setActivePage('register')}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  if (activePage === 'login') {
    return (
      <>
        <Login
          onBackToLanding={() => setActivePage('landing')}
          onLogin={async ({ email, password }) => {
            try {
              const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (authError || !authData?.user) {
                return { error: 'Email atau kata sandi salah. Silakan coba lagi.' };
              }

              const authUserId = authData.user.id;

              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUserId)
                .single();

              if (profileError || !profileData) {
                return { error: 'Akun ditemukan tapi profil toko tidak tersedia.' };
              }

              localStorage.setItem('profileId', authUserId);

              const avatarUrl = profileData.avatar_url || profileData.avatar || profileData.logo_url || localStorage.getItem('silaundry_avatar_' + authUserId) || null;
              setAdminProfile({
                namaToko: profileData.nama_toko || 'SI LAUNDRY',
                namaAdmin: profileData.nama_admin || 'Admin',
                email: profileData.email || email,
                whatsapp: profileData.no_whatsapp || '',
                alamatToko: profileData.alamat || '',
                jamOperasional: profileData.jam_operasional || '',
                avatar: avatarUrl,
              });

              // Muat ulang data tenant (layanan, pelanggan, transaksi) khusus akun yang login
              await loadTenantData(authUserId);

              setActivePage('dashboard');
              showToast(`Selamat datang kembali, ${profileData.nama_admin || 'Admin'}! 👋`);
              return {};
            } catch (err) {
              console.error('Login error:', err);
              return { error: 'Terjadi kesalahan saat login. Silakan coba lagi.' };
            }
          }}
          onOpenRegister={() => setActivePage('register')}
          adminProfile={adminProfile}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  if (activePage === 'register') {
    return (
      <>
        <RegisterToko
          onBackToLanding={() => setActivePage('landing')}
          onEnterDashboard={async () => {
            // Muat data tenant untuk akun baru
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await loadTenantData(user.id);
            }
            setActivePage('dashboard');
          }}
          onOpenLogin={() => setActivePage('login')}
          onRegisterSuccess={(newStoreData) => {
            setAdminProfile(prev => ({
              ...prev,
              namaToko: newStoreData.namaToko,
              namaAdmin: newStoreData.namaAdmin,
              email: newStoreData.email,
              whatsapp: newStoreData.whatsapp,
            }));
            showToast(`Toko "${newStoreData.namaToko}" berhasil didaftarkan! Selamat datang, ${newStoreData.namaAdmin}!`);
          }}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // Handlers Manajemen Layanan di Root Level
  const handleOpenAddService = () => {
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (savedData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user ? user.id : null;

      if (editingService) {
        const updates = {
          name: savedData.nama,
          price: Number(savedData.harga),
          unit: savedData.satuan,
          estimation: `Estimasi pengerjaan ${savedData.estimasi} hari`,
          status: savedData.status
        };
        const { error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', editingService.id);

        if (error) throw error;

        setServicesList(prev => prev.map(item => item.id === editingService.id ? { ...item, ...updates } : item));
        showToast(`Layanan "${savedData.nama}" berhasil diperbarui!`, 'success');
      } else {
        const lower = (savedData.nama || '').toLowerCase();
        let bg_color = 'bg-[#E6F8F5]';
        let text_color = 'text-[#008A7B]';

        if (lower.includes('setrika') || lower.includes('baju') || lower.includes('kaos')) {
          bg_color = 'bg-[#EFEBF8]';
          text_color = 'text-[#6C5CE7]';
        } else if (lower.includes('selimut') || lower.includes('bedcover') || lower.includes('sprei')) {
          bg_color = 'bg-[#FEF3E2]';
          text_color = 'text-[#D35400]';
        } else if (lower.includes('sepatu') || lower.includes('tas')) {
          bg_color = 'bg-[#E0F2FE]';
          text_color = 'text-[#0284C7]';
        }

        const newObj = {
          name: savedData.nama,
          estimation: `Estimasi pengerjaan ${savedData.estimasi} hari`,
          price: Number(savedData.harga),
          unit: savedData.satuan,
          status: savedData.status,
          bg_color,
          text_color,
          user_id: userId // Menyambungkan layanan ke user yang sedang login
        };

        const { data: inserted, error } = await supabase
          .from('services')
          .insert([newObj])
          .select()
          .single();

        if (error) throw error;

        setServicesList(prev => [...prev, inserted]);
        showToast(`Layanan "${savedData.nama}" berhasil ditambahkan ke katalog!`, 'success');
      }
    } catch (err) {
      console.error('Error saving service:', err);
      showToast('Gagal menyimpan layanan.', 'error');
    }
    setEditingService(null);
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = async (serviceObjOrId) => {
    const targetId = typeof serviceObjOrId === 'object' ? serviceObjOrId.id : serviceObjOrId;
    try {
      const { error } = await supabase.from('services').delete().eq('id', targetId);
      if (error) throw error;
      setServicesList(prev => prev.filter(item => item.id !== targetId));
      showToast('Layanan berhasil dihapus dari katalog!', 'success');
    } catch (err) {
      console.error('Error deleting service:', err);
      showToast('Gagal menghapus layanan.', 'error');
    }
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  // Render Dashboard Pages Content
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            adminProfile={adminProfile}
            onSelectReceipt={(trx) => setSelectedReceiptTrx(trx)}
            onOpenNewTransaction={() => setIsNewTrxModalOpen(true)}
            servicesList={servicesList}
            onOpenAddService={handleOpenAddService}
            onOpenEditService={handleOpenEditService}
          />
        );
      case 'transaksi':
        return (
          <Transaksi
            transactions={transactions}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePayment={handleUpdatePayment}
            onSelectReceipt={(trx) => setSelectedReceiptTrx(trx)}
            onOpenNewTransaction={() => setIsNewTrxModalOpen(true)}
          />
        );
      case 'pelanggan':
        return (
          <Pelanggan
            customers={customers}
            transactions={transactions}
            onSelectReceipt={(trx) => setSelectedReceiptTrx(trx)}
            onOpenNewTransaction={() => setIsNewTrxModalOpen(true)}
            onShowToast={showToast}
          />
        );
      case 'laporan':
        return (
          <Laporan
            transactions={transactions}
            onSelectReceipt={(trx) => setSelectedReceiptTrx(trx)}
            onShowToast={showToast}
          />
        );
      case 'pendapatan':
        return (
          <Pendapatan
            transactions={transactions}
            onShowToast={showToast}
          />
        );
      case 'profil':
        return (
          <ProfilAdmin
            adminProfile={adminProfile}
            onUpdateProfile={(updated) => setAdminProfile(prev => ({ ...prev, ...updated }))}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            onLogout={() => setIsLogoutModalOpen(true)}
            onShowToast={showToast}
          />
        );
      default:
        return (
          <Dashboard
            transactions={transactions}
            adminProfile={adminProfile}
            onSelectReceipt={(trx) => setSelectedReceiptTrx(trx)}
            onOpenNewTransaction={() => setIsNewTrxModalOpen(true)}
            servicesList={servicesList}
            onOpenAddService={handleOpenAddService}
            onOpenEditService={handleOpenEditService}
          />
        );
    }
  };

  // Hitung transaksi aktif (belum selesai) untuk badge sidebar
  const inProgressCount = transactions.filter(t => {
    const st = (t.statusLaundry || '').toLowerCase();
    return !st.includes('selesai');
  }).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0B131E] text-slate-100' : 'bg-[#F5F7FA] text-[#1E293B]'} flex relative transition-colors duration-300`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        adminProfile={adminProfile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        pendingCount={inProgressCount}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
        {/* Sticky Header */}
        <Header
          activePage={activePage}
          setIsMobileOpen={setIsMobileOpen}
          adminProfile={adminProfile}
          onOpenProfile={() => setActivePage('profil')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 sm:pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* Bottom Navigation Bar for Mobile / Tablet (< lg) */}
        <BottomNav
          activePage={activePage}
          setActivePage={setActivePage}
          pendingCount={inProgressCount}
        />
      </div>

      {/* Global Modals & Notifications */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptTrx)}
        transaction={selectedReceiptTrx}
        adminProfile={adminProfile}
        onClose={() => setSelectedReceiptTrx(null)}
        onShowToast={showToast}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordChanged={(msg) => showToast(msg, 'success')}
      />

      <NewTransactionModal
        isOpen={isNewTrxModalOpen}
        onClose={() => setIsNewTrxModalOpen(false)}
        onSave={handleCreateTransaction}
        servicesList={servicesList}
        transactionCount={transactions.length}
      />

      <TambahLayanan
        isOpen={isServiceModalOpen}
        initialData={editingService}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}