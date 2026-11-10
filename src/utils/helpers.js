// Helper functions for SI LAUNDRY

export const formatRupiah = (number) => {
  if (number === undefined || number === null) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

export const formatShortDate = (dateString) => {
  if (!dateString || dateString === '-') return '-';
  try {
    const normalized = String(dateString).replace('T', ' ');
    const parts = normalized.split(' ');
    const datePart = parts[0];
    const timePart = parts[1] ? parts[1].slice(0, 5) : '';

    const [year, month, day] = datePart.split('-');
    if (!year || !month || !day) return dateString;

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex] || month;

    const formattedDate = `${parseInt(day, 10)} ${monthName} ${year}`;
    return timePart ? `${formattedDate} (${timePart})` : formattedDate;
  } catch {
    return dateString;
  }
};

export const getEstimatedCompletion = (trx) => {
  if (!trx) return '-';
  if (trx.tanggalSelesai) return trx.tanggalSelesai;
  if (trx.estimasiSelesai) return trx.estimasiSelesai;
  if (trx.tanggalKeluar) return trx.tanggalKeluar;
  if (trx.tanggalMasuk) {
    try {
      const cleanDate = String(trx.tanggalMasuk).split(' ')[0].split('T')[0];
      const d = new Date(cleanDate);
      if (!isNaN(d.getTime())) {
        d.setDate(d.getDate() + 2);
        return d.toISOString().split('T')[0];
      }
    } catch {}
  }
  return '-';
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Sudah selesai":
    case "Selesai":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-600/20";
    case "Dalam pengerjaan":
    case "Proses":
      return "bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-600/20";
    case "Siap diambil":
      return "bg-teal-50 text-teal-800 border-teal-200/80 ring-1 ring-teal-600/20";
    case "Baru":
      return "bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-600/20";
    case "Dibatalkan":
      return "bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-600/20";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export const getPaymentBadgeClass = (status) => {
  switch (status) {
    case "Lunas":
      return "bg-emerald-100/70 text-emerald-800 border-emerald-300";
    case "Belum Bayar":
    case "Belum Lunas":
      return "bg-amber-100/70 text-amber-800 border-amber-300";
    default:
      return "bg-slate-100 text-slate-700 border-slate-300";
  }
};

export const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date
          ? cell.toLocaleString()
          : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
