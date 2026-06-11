'use client'

import Link from 'next/link';
import { Library } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="w-full bg-brand-dark-blue text-white py-24 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-6 w-full max-w-[1440px]">
       
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-lilac rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-lilac/20">
                <Library size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">QWA ESTUDOS</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm font-medium">
              Seu acesso rápido e simples ao conhecimento através dos livros.
            </p>
          </div>
                   
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-bold tracking-widest uppercase">
          <p>© 2026 QWA Soluções. Todos os direitos reservados.</p>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
      </div>
      </div>
    </footer>
  );
}
