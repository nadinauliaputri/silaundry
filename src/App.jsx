import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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

  // Dark mode state dengan persistensi localStorage & update class 'dark' di root HTML
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('silaundry_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('silaundry_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('silaundry_theme', 'light');
    }
  }, [isDarkMode]);

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

        if (currentUser && isMounted) {
          localStorage.setItem('profileId', userId);

          // Ambil profil admin dari Supabase profiles
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (profileData && isMounted) {
            setAdminProfile({
              namaToko: profileData.nama_toko || 'SI LAUNDRY',
              namaAdmin: profileData.nama_admin || 'Admin',
              email: profileData.email || currentUser.email,
              whatsapp: profileData.no_whatsapp || '',
              alamatToko: profileData.alamat || '',
              jamOperasional: profileData.jam_operasional || '',
            });
          } else if (isMounted) {
            setAdminProfile({
              namaToko: 'SI LAUNDRY',
              namaAdmin: currentUser.user_metadata?.namaAdmin || 'Admin',
              email: currentUser.email,
              whatsapp: '',
              alamatToko: '',
              jamOperasional: '',
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
        } else if (isMounted) {
          // Jika tidak ada session yang aktif, arahkan ke landing atau login/register
          const savedPage = localStorage.getItem('silaundry_active_page');
          if (savedPage === 'register' || savedPage === 'login') {
            setActivePage(savedPage);
          } else {
            setActivePage('landing');
          }
        }

        // Ambil data layanan khusus milik user yang sedang login
        let svcQuery = supabase.from('services').select('*').order('id', { ascending: true });
        if (userId) {
          svcQuery = svcQuery.eq('user_id', userId);
        }

        const { data: svcData, error: svcErr } = await svcQuery;
        if (!svcErr && svcData && isMounted) {
          setServicesList(svcData);
        }

        // Ambil data customers milik user yang sedang login
        let custQuery = supabase.from('customers').select('*');
        if (userId) {
          custQuery = custQuery.eq('user_id', userId);
        }
        const { data: custData, error: custErr } = await custQuery;
        if (!custErr && custData && isMounted) {
          setCustomers(custData);
        }

        // Ambil data transaksi milik user yang sedang login (filter by user_id)
        let trxQuery = supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        if (userId) {
          trxQuery = trxQuery.eq('user_id', userId);
        }
        const { data: trxData, error: trxErr } = await trxQuery;
        if (!trxErr && trxData && isMounted) {
          setTransactions(trxData);
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

    // Listener perubahan status autentikasi Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT') {
        setAdminProfile(null);
        localStorage.removeItem('profileId');
        localStorage.setItem('silaundry_active_page', 'landing');
        setActivePage('landing');
      } else if (event === 'SIGNED_IN' && session?.user) {
        localStorage.setItem('profileId', session.user.id);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Handle Logout — redirect to landing page
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('profileId');
    localStorage.setItem('silaundry_active_page', 'landing');
    setAdminProfile(null);
    setIsLogoutModalOpen(false);
    setIsMobileOpen(false);
    setActivePage('landing');
    showToast('Anda berhasil keluar dari akun admin.', 'success');
  };

  // Fungsi generator ID transaksi otomatis berurutan: TRX-1, TRX-2, dst.
  const generateSequentialId = () => {
    const existingIds = new Set(
      transactions.flatMap(t => [
        String(t.id || '').toUpperCase(),
        String(t.nota || '').toUpperCase()
      ])
    );

    let nextNum = transactions.length + 1;
    while (existingIds.has(`TRX-${nextNum}`)) {
      nextNum++;
    }
    return `TRX-${nextNum}`;
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

      // 1. Cek tabel customers berdasarkan nomor telepon
      let existingCust = null;

      for (const phone of phoneVariants) {
        if (existingCust) break;

        // Coba periksa di kolom no_telepon
        const { data: byNoTelp } = await supabase
          .from('customers')
          .select('*')
          .eq('no_telepon', phone)
          .maybeSingle();

        if (byNoTelp) {
          existingCust = byNoTelp;
          break;
        }

        // Coba periksa di kolom telepon
        const { data: byTelp } = await supabase
          .from('customers')
          .select('*')
          .eq('telepon', phone)
          .maybeSingle();

        if (byTelp) {
          existingCust = byTelp;
          break;
        }
      }

      // Cek juga di state customers lokal jika belum ketemu
      if (!existingCust && cleanPhoneDigits && customers.length > 0) {
        const foundInState = customers.find(c => {
          const cPhoneDigits = String(c.no_telepon || c.telepon || '').replace(/\D/g, '');
          if (!cPhoneDigits) return false;
          return (
            cPhoneDigits === cleanPhoneDigits ||
            (cPhoneDigits.length >= 8 && cleanPhoneDigits.endsWith(cPhoneDigits)) ||
            (cleanPhoneDigits.length >= 8 && cPhoneDigits.endsWith(cleanPhoneDigits))
          );
        });
        if (foundInState) existingCust = foundInState;
      }

      // 2. Jika no_telepon belum ada di tabel customers, simpan nama, no_telepon, dan alamat
      if (!existingCust && rawPhone) {
        const newCustomerData = {
          nama: newTrxData.pelanggan || 'Pelanggan Baru',
          no_telepon: rawPhone,
          alamat: newTrxData.alamat || 'Surabaya',
        };

        let { data: insertedCust, error: custInsertErr } = await supabase
          .from('customers')
          .insert([newCustomerData])
          .select()
          .maybeSingle();

        // Fallback jika database menggunakan nama kolom `telepon` (error code 42703 di PostgreSQL)
        if (custInsertErr && custInsertErr.code === '42703') {
          const fallbackData = {
            nama: newTrxData.pelanggan || 'Pelanggan Baru',
            telepon: rawPhone,
            alamat: newTrxData.alamat || 'Surabaya',
          };
          const { data: fallbackCust } = await supabase
            .from('customers')
            .insert([fallbackData])
            .select()
            .maybeSingle();
          insertedCust = fallbackCust;
        }

        if (insertedCust) {
          setCustomers(prev => [insertedCust, ...prev]);
        }
      }

      // 3. Ambil user_id aktif via supabase.auth.getUser()
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user ? user.id : (localStorage.getItem('profileId') || null);

      // Refresh data customers terbaru (filter hanya milik user ini)
      let refreshCustQuery = supabase.from('customers').select('*');
      if (userId) {
        refreshCustQuery = refreshCustQuery.eq('user_id', userId);
      }
      const { data: refreshedCust } = await refreshCustQuery;
      if (refreshedCust) setCustomers(refreshedCust);

      const generatedId = generateSequentialId();

      // Pastikan tanggalSelesai tidak bernilai NULL
      const tanggalSelesai = (newTrxData.tanggalSelesai && String(newTrxData.tanggalSelesai).trim() !== '')
        ? newTrxData.tanggalSelesai
        : (newTrxData.tanggalMasuk || new Date().toISOString().split('T')[0]);

      // 4. Setelah itu simpan transaksi ke tabel transactions
      const newTrx = {
        ...newTrxData,
        id: generatedId,
        nota: generatedId,
        user_id: userId,
        tanggalSelesai: tanggalSelesai,
      };

      const { data: insertedTrx, error: trxError } = await supabase
        .from('transactions')
        .insert([newTrx])
        .select()
        .single();
      if (trxError) throw trxError;

      // Refresh transaksi terbaru (filter hanya milik user yang sedang login)
      let refreshTrxQuery = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (userId) {
        refreshTrxQuery = refreshTrxQuery.eq('user_id', userId);
      }
      const { data: refreshedTx } = await refreshTrxQuery;
      if (refreshedTx) setTransactions(refreshedTx);

      showToast(`Pesanan nota ${insertedTrx.nota} (${insertedTrx.pelanggan}) berhasil ditambahkan!`);
      setSelectedReceiptTrx(insertedTrx);
    } catch (err) {
      console.error(err);
      showToast('Gagal menambahkan transaksi.', 'error');
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

              setAdminProfile({
                namaToko: profileData.nama_toko || 'SI LAUNDRY',
                namaAdmin: profileData.nama_admin || 'Admin',
                email: profileData.email || email,
                whatsapp: profileData.no_whatsapp || '',
                alamatToko: profileData.alamat || '',
                jamOperasional: profileData.jam_operasional || '',
              });

              // Fetch ulang services khusus user ini setelah login sukses
              const { data: userServices } = await supabase
                .from('services')
                .select('*')
                .eq('user_id', authUserId)
                .order('id', { ascending: true });

              if (userServices) {
                setServicesList(userServices);
              }

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
            // Ambil data services terbaru setelah register
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: userServices } = await supabase
                .from('services')
                .select('*')
                .eq('user_id', user.id);
              if (userServices) setServicesList(userServices);
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
            onShowToast={showToast}
          />
        );
      case 'profil':
        return (
          <ProfilAdmin
            adminProfile={adminProfile}
            onUpdateProfile={(updated) => setAdminProfile(updated)}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            onShowToast={showToast}
          />
        );
      default:
        return (
          <Dashboard
            transactions={transactions}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptTrx)}
        transaction={selectedReceiptTrx}
        onClose={() => setSelectedReceiptTrx(null)}
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