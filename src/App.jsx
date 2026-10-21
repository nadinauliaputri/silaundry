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

import { initialTransactions, initialCustomers, initialProfile } from './data/mockData';
import { WashingMachine, Shirt, CloudRain, Layers } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [customers, setCustomers] = useState(initialCustomers);
  const [adminProfile, setAdminProfile] = useState(initialProfile);

  // Modals state
  const [selectedReceiptTrx, setSelectedReceiptTrx] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNewTrxModalOpen, setIsNewTrxModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // State Manajemen Layanan di Root Level
  const [servicesList, setServicesList] = useState([
    {
      id: 1,
      name: 'Cuci Kiloan',
      estimation: 'Estimasi pengerjaan 2 hari',
      days: 2,
      price: 7000,
      unit: 'Kilogram (kg)',
      status: 'Tersedia',
      bgColor: 'bg-[#E6F8F5]',
      textColor: 'text-[#008A7B]',
      icon: WashingMachine
    },
    {
      id: 2,
      name: 'Cuci Setrika',
      estimation: 'Estimasi pengerjaan 3 hari',
      days: 3,
      price: 10000,
      unit: 'Kilogram (kg)',
      status: 'Tersedia',
      bgColor: 'bg-[#EFEBF8]',
      textColor: 'text-[#6C5CE7]',
      icon: Shirt
    },
    {
      id: 3,
      name: 'Cuci Selimut',
      estimation: 'Estimasi pengerjaan 3 hari',
      days: 3,
      price: 35000,
      unit: 'Item / Pcs',
      status: 'Tersedia',
      bgColor: 'bg-[#FEF3E2]',
      textColor: 'text-[#D35400]',
      icon: CloudRain
    },
    {
      id: 4,
      name: 'Cuci Sepatu',
      estimation: 'Estimasi pengerjaan 3 hari',
      days: 3,
      price: 75000,
      unit: 'Pasang',
      status: 'Tersedia',
      bgColor: 'bg-[#E6F8F5]',
      textColor: 'text-[#008A7B]',
      icon: Layers
    }
  ]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

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
  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setIsMobileOpen(false);
    setActivePage('landing');
    showToast('Anda berhasil keluar dari akun admin.', 'success');
  };

  // Fungsi generator ID Nota otomatis: SL-01, SL-02, dst., otomatis jadi 3 digit (SL-100) saat >= 100
  const generateNotaId = () => {
    const nextNum = transactions.length + 1;
    const formattedNum = nextNum < 100 ? String(nextNum).padStart(2, '0') : String(nextNum);
    return `SL-${formattedNum}`;
  };

  // Add new transaction
  const handleCreateTransaction = (newTrxData) => {
    const generatedNota = generateNotaId();
    const newTrx = {
      ...newTrxData,
      id: Date.now(),
      nota: generatedNota,
    };

    setTransactions(prev => [newTrx, ...prev]);

    setCustomers(prev => {
      const existingCust = prev.find(c => c.nama.toLowerCase() === newTrx.pelanggan.toLowerCase());
      if (existingCust) {
        return prev.map(c => {
          if (c.nama.toLowerCase() === newTrx.pelanggan.toLowerCase()) {
            return {
              ...c,
              totalTransaksi: c.totalTransaksi + 1,
              totalPengeluaran: c.totalPengeluaran + newTrx.total,
              terakhirLaundry: 'Hari ini',
              riwayat: [
                { nota: newTrx.nota, tanggal: 'Hari ini', total: newTrx.total, status: newTrx.statusLaundry },
                ...c.riwayat
              ]
            };
          }
          return c;
        });
      } else {
        const newCustomerObj = {
          id: `CUST-00${prev.length + 1}`,
          nama: newTrx.pelanggan,
          telepon: newTrx.telepon,
          alamat: newTrx.alamat || 'Surabaya',
          totalTransaksi: 1,
          totalPengeluaran: newTrx.total,
          terakhirLaundry: 'Hari ini',
          kategoriFavorit: newTrx.layanan,
          statusMember: 'Pelanggan Baru',
          riwayat: [
            { nota: newTrx.nota, tanggal: 'Hari ini', total: newTrx.total, status: newTrx.statusLaundry }
          ]
        };
        return [newCustomerObj, ...prev];
      }
    });

    showToast(`Pesanan nota ${newTrx.nota} (${newTrx.pelanggan}) berhasil ditambahkan!`);
    setSelectedReceiptTrx(newTrx);
  };

  // Update transaction status laundry
  const handleUpdateStatus = (trxId, newStatus) => {
    setTransactions(prev =>
      prev.map(t => t.id === trxId ? { ...t, statusLaundry: newStatus } : t)
    );
    showToast(`Status transaksi berhasil diubah menjadi "${newStatus}"`);
  };

  // Update transaction payment status (Lunas / Belum Bayar)
  const handleUpdatePayment = (trxId, newPaymentStatus) => {
    setTransactions(prev =>
      prev.map(t => t.id === trxId ? { ...t, statusBayar: newPaymentStatus } : t)
    );
    showToast(`Status pembayaran berhasil diubah menjadi "${newPaymentStatus}"`);
  };

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
          onLogin={() => {
            setActivePage('dashboard');
            showToast(`Selamat datang kembali, ${adminProfile.namaAdmin}!`);
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
          onEnterDashboard={() => setActivePage('dashboard')}
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

  const handleSaveService = (savedData) => {
    if (editingService) {
      setServicesList(prev => prev.map(item => {
        if (item.id === editingService.id) {
          return {
            ...item,
            name: savedData.nama,
            price: savedData.harga,
            unit: savedData.satuan,
            estimation: `Estimasi pengerjaan ${savedData.estimasi} hari`,
            days: savedData.estimasi,
            status: savedData.status
          };
        }
        return item;
      }));
      showToast(`Layanan "${savedData.nama}" berhasil diperbarui!`, 'success');
    } else {
      const lower = (savedData.nama || '').toLowerCase();
      let icon = WashingMachine;
      let bgColor = 'bg-[#E6F8F5]';
      let textColor = 'text-[#008A7B]';

      if (lower.includes('setrika') || lower.includes('baju') || lower.includes('kaos')) {
        icon = Shirt;
        bgColor = 'bg-[#EFEBF8]';
        textColor = 'text-[#6C5CE7]';
      } else if (lower.includes('selimut') || lower.includes('bedcover') || lower.includes('sprei') || lower.includes('gorden')) {
        icon = CloudRain;
        bgColor = 'bg-[#FEF3E2]';
        textColor = 'text-[#D35400]';
      } else if (lower.includes('sepatu') || lower.includes('tas') || lower.includes('helm') || lower.includes('karpet')) {
        icon = Layers;
        bgColor = 'bg-[#E0F2FE]';
        textColor = 'text-[#0284C7]';
      }

      const newObj = {
        id: Date.now(),
        name: savedData.nama,
        estimation: `Estimasi pengerjaan ${savedData.estimasi} hari`,
        days: savedData.estimasi,
        price: savedData.harga,
        unit: savedData.satuan,
        status: savedData.status,
        bgColor,
        textColor,
        icon
      };
      setServicesList(prev => [...prev, newObj]);
      showToast(`Layanan "${savedData.nama}" berhasil ditambahkan ke katalog!`, 'success');
    }
    setEditingService(null);
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (serviceObjOrId) => {
    const targetId = typeof serviceObjOrId === 'object' ? serviceObjOrId.id : serviceObjOrId;
    setServicesList(prev => prev.filter(item => item.id !== targetId));
    setIsServiceModalOpen(false);
    setEditingService(null);
    showToast('Layanan berhasil dihapus dari katalog!', 'success');
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

  const inProgressCount = transactions.filter(t => t.statusLaundry === 'Dalam pengerjaan').length;

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