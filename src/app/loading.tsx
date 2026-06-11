'use client'

import { Loader2, Library } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-pulse">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-gray-200/50 flex items-center justify-center mb-8 border border-gray-100">
        <Library className="text-brand-lilac" size={48} />
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-brand-primary-blue mb-4" size={48} />
        <h2 className="text-xl font-bold text-brand-dark-blue tracking-tight">Carregando QWA ESTUDOS...</h2>
        <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
          Aguarde um instante enquanto preparamos seu ambiente de leitura.
        </p>
      </div>

      <div className="mt-20 text-gray-200 flex items-center gap-2">
         <span className="text-xs font-bold uppercase tracking-widest">QWA ESTUDOS</span>
      </div>
    </div>
  );
}
