import Link from 'next/link';
import { Library, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-gray-200/50 flex items-center justify-center mb-8 border border-gray-100">
        <Library className="text-brand-lilac" size={48} />
      </div>
      
      <h1 className="text-8xl font-black text-brand-dark-blue mb-4 tracking-tight">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Ops! Página não encontrada</h2>
      <p className="text-gray-500 max-w-md mb-12 leading-relaxed">
        Parece que o livro que você está procurando não está nesta prateleira. 
        Verifique se o endereço está correto ou volte para o início.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary-blue text-white rounded-2xl font-bold hover:bg-brand-medium-blue transition-all shadow-lg shadow-brand-primary-blue/20">
          <ArrowLeft size={20} /> Voltar ao Início
        </Link>
        <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-white hover:border-brand-primary-blue hover:text-brand-primary-blue transition-all">
          <Search size={20} /> Dashboard
        </Link>
      </div>

      <div className="mt-20 text-gray-400 flex items-center gap-2">
         <Library size={16} />
         <span className="text-xs font-bold uppercase tracking-widest">BiblioTech System</span>
      </div>
    </div>
  );
}
