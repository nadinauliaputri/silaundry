import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl animate-bounce-short">
      {getIcon()}
      <div className="text-xs font-semibold text-slate-800 pr-2">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="w-5 h-5 text-slate-400 hover:text-slate-600 rounded flex items-center justify-center transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
