'use client'

import Link from 'next/link';
import { Library } from 'lucide-react';

export function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark-blue/80 backdrop-blur-xs  h-20 flex items-center w-full mb-5">
      <div className="container mx-auto px-6 flex items-center justify-between w-full max-w-[1440px]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary-blue/20">
            <Library size={24} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">QWA ESTUDOS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/livros" className="text-sm font-bold text-white hover:text-brand-primary-white transition-colors">Biblioteca</Link>          
          <Link href="/login" className="px-8 py-2.5 bg-brand-primary-blue text-white rounded-full text-sm font-bold hover:bg-brand-medium-blue transition-all shadow-xl shadow-brand-primary-blue/30">
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}
