'use client'

import { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-red-50/30 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-3xl shadow-xl shadow-red-200/50 flex items-center justify-center mb-8 border border-red-200">
        <AlertCircle className="text-red-500" size={48} />
      </div>
      
      <h1 className="text-4xl font-black text-red-900 mb-4 tracking-tight">Ops! Algo deu errado</h1>
      <h2 className="text-xl font-bold text-red-700 mb-6">Encontramos um problema técnico inesperado</h2>
      <p className="text-red-600 max-w-md mb-12 leading-relaxed opacity-80">
        Isso pode ser causado por uma falha temporária no servidor ou na conexão. 
        Tente atualizar a página ou volte mais tarde.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => reset()}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
        >
          <RotateCcw size={20} /> Tentar Novamente
        </button>
        <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border-2 border-red-200 text-red-600 rounded-2xl font-bold hover:bg-white transition-all">
          <Home size={20} /> Ir para Início
        </Link>
      </div>

      <div className="mt-20 text-red-200 flex items-center gap-2">
         <span className="text-xs font-bold uppercase tracking-widest">BiblioTech System Diagnostic</span>
      </div>
    </div>
  );
}
