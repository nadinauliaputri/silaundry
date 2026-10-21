import React, { useState } from 'react';
import {
  Pencil,
  Plus,
  HelpCircle
} from 'lucide-react';
import { formatRupiah } from '../utils/helpers';
import TambahLayanan from '../components/TambahLayanan';

export default function Dashboard({
  transactions,
  onSelectReceipt,
  onOpenNewTransaction,
  servicesList: propServicesList,
  onOpenAddService,
  onOpenEditService
}) {
  const [localServicesList, setLocalServicesList] = useState([
    {
      id: 1,
      name: 'Cuci Kiloan',
      estimation: 'Estimasi pengerjaan 2 hari',
      days: 2,
      price: 7000,
      unit: 'Kilogram (kg)',
      status: 'Tersedia',
      bgColor: 'bg-[#E6F8F5]',
      textColor: 'text-[#008A7B]'
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
      textColor: 'text-[#6C5CE7]'
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
      textColor: 'text-[#D35400]'
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
      textColor: 'text-[#008A7B]'
    }
  ]);

  const rawServicesList = propServicesList || localServicesList;

  const servicesList = rawServicesList.map((service, index) => {
    const codeNumber = String(index + 1).padStart(2, '0');
    return {
      ...service,
      serviceCode: `LYN-${codeNumber}`
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleOpenAdd = () => {
    if (onOpenAddService) {
      onOpenAddService();
    } else {
      setEditingService(null);
      setIsModalOpen(true);
    }
  };

  const handleOpenEdit = (service) => {
    if (onOpenEditService) {
      onOpenEditService(service);
    } else {
      setEditingService(service);
      setIsModalOpen(true);
    }
  };

  const handleSaveService = (savedData) => {
    if (editingService) {
      setLocalServicesList(prev => prev.map(item => {
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
    } else {
      const newObj = {
        id: Date.now(),
        name: savedData.nama,
        estimation: `Estimasi pengerjaan ${savedData.estimasi} hari`,
        days: savedData.estimasi,
        price: savedData.harga,
        unit: savedData.satuan,
        status: savedData.status,
        bgColor: 'bg-[#E6F8F5]',
        textColor: 'text-[#008A7B]'
      };
      setLocalServicesList(prev => [...prev, newObj]);
    }
    setEditingService(null);
    setIsModalOpen(false);
  };

  const handleDeleteService = (serviceObjOrId) => {
    const targetId = typeof serviceObjOrId === 'object' ? serviceObjOrId.id : serviceObjOrId;
    setLocalServicesList(prev => prev.filter(item => item.id !== targetId));
    setIsModalOpen(false);
    setEditingService(null);
  };

  // Array variasi warna latar belakang khusus Dark Mode untuk tiap kartu
  const darkModeBgVariants = [
    'dark:bg-[#112E2B] dark:hover:bg-[#163B37]', // Nuansa hijau toska gelap
    'dark:bg-[#201C38] dark:hover:bg-[#2A244A]', // Nuansa ungu gelap
    'dark:bg-[#332214] dark:hover:bg-[#422C1A]', // Nuansa oranye/krem gelap
    'dark:bg-[#152B3C] dark:hover:bg-[#1C374D]'  // Nuansa biru gelap
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* 1. WELCOME BANNER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#00C4B4]">
            RUANG KERJA TOKO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#101E2C] dark:text-white tracking-tight mt-0.5">
            Selamat pagi, Admin.
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pilih layanan atau catat cucian pelanggan yang baru masuk.
          </p>
        </div>

        <button
          onClick={onOpenNewTransaction}
          className="px-4 py-2.5 rounded-xl bg-[#008A7B] hover:bg-[#007063] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Input cucian</span>
        </button>
      </div>

      {/* 2. KATALOG TOKO / LAYANAN LAUNDRY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#008A7B] dark:text-[#00C4B4]">
              KATALOG TOKO
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#101E2C] dark:text-white tracking-tight mt-0.5">
              Layanan laundry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Atur jenis layanan, harga, satuan, dan estimasi sesuai kebutuhan toko.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#172A3B] dark:hover:bg-[#1D354A] border border-slate-200 dark:border-slate-700 text-[#101E2C] dark:text-slate-200 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Tambah layanan</span>
          </button>
        </div>

        {/* 4 Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {servicesList.map((service, idx) => {
            const shortUnit = (service.unit || 'kg').includes('kg')
              ? 'kg'
              : (service.unit || '').includes('Item')
                ? 'item'
                : (service.unit || '').includes('Pasang')
                  ? 'pasang'
                  : 'meter';

            // Ambil variasi warna dark mode berdasarkan indeks kartu
            const darkBgClass = darkModeBgVariants[idx % darkModeBgVariants.length];

            return (
              <div
                key={service.id || idx}
                className={`rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between relative group ${service.bgColor || 'bg-[#E6F8F5]'
                  } ${darkBgClass}`}
              >
                {/* Top Row: Badge ID Layanan & Edit Button */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`px-3 py-1 rounded-xl bg-white/90 dark:bg-black/30 backdrop-blur-md ${service.textColor || 'text-[#008A7B]'} dark:text-[#00C4B4] font-extrabold text-xs tracking-wider shadow-xs border border-black/5 dark:border-white/10 select-none`}>
                    {service.serviceCode}
                  </div>

                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white dark:bg-black/30 dark:hover:bg-black/50 text-slate-600 dark:text-slate-200 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    title="Edit Layanan"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Middle info */}
                <div>
                  <h4 className="font-extrabold text-base text-[#101E2C] dark:text-white">
                    {service.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">
                    {service.estimation}
                  </p>
                </div>

                {/* Price & Status Row */}
                <div className="mt-6 pt-3.5 border-t border-black/5 dark:border-white/10 flex items-end justify-between">
                  <div>
                    <span className="text-base font-black text-[#101E2C] dark:text-white">
                      {formatRupiah(service.price)}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 ml-1">
                      / {shortUnit}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{service.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Help / Support Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => alert('Butuh bantuan? Silakan hubungi tim support SI LAUNDRY.')}
          className="w-10 h-10 rounded-full bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Bantuan"
        >
          <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-300" />
        </button>
      </div>

      {!onOpenAddService && (
        <TambahLayanan
          isOpen={isModalOpen}
          initialData={editingService}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}
          onSaveService={handleSaveService}
          onDeleteService={handleDeleteService}
        />
      )}
    </div>
  );
}