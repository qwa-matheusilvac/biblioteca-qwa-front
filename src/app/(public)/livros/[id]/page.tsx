'use client'

import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BookMarked, 
  ArrowLeft, 
  User, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Info,
  Library
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LivroService } from '@/features/livros/services';
import Link from 'next/link';

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = use(params);

  const { data: livro, isLoading, isError } = useQuery({
    queryKey: ['livro', id],
    queryFn: () => LivroService.getById(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-lilac mb-6" size={64} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Carregando detalhes...</p>
      </div>
    );
  }

  if (isError || !livro) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="text-red-500 mb-6" size={64} />
        <h3 className="text-2xl font-black text-brand-dark-blue mb-2">Livro não encontrado</h3>
        <p className="text-gray-500 mb-8">O título solicitado pode ter sido removido ou o ID é inválido.</p>
        <Link href="/livros" className="px-8 py-4 bg-brand-primary-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-primary-blue/20">
          Voltar ao Acervo
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-32 pb-32">
        <div className="container mx-auto px-6 max-w-[1200px]">
          {/* Back Button */}
          <Link href="/livros" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-primary-blue font-bold mb-12 transition-colors group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={18} />
            </div>
            Voltar ao Acervo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Book Cover */}
            <div className="lg:col-span-5">
              <div className="aspect-[3/4] bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-gray-100 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-lilac/5 to-transparent"></div>
                <BookMarked size={160} className="text-gray-100 group-hover:scale-110 transition-transform duration-700" strokeWidth={0.5} />
                
                {livro.disponivel && (
                  <div className="absolute top-10 right-10 px-6 py-2 bg-green-500 text-white text-xs font-black rounded-full shadow-xl">
                    DISPONÍVEL AGORA
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="mb-10">
                <span className="text-brand-lilac font-black text-xs tracking-[0.3em] uppercase mb-6 block">
                  DETALHES DO TÍTULO
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-brand-dark-blue mb-6 tracking-tight leading-tight">
                  {livro.titulo}
                </h1>
                <div className="flex items-center gap-4 text-gray-500 font-bold uppercase tracking-widest text-sm">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <User size={16} className="text-brand-lilac" />
                   </div>
                   {livro.autor}
                </div>
              </div>

              <div className="space-y-8 mb-12">                

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-brand-primary-blue rounded-2xl flex items-center justify-center">
                         <Library size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ISBN</p>
                         <p className="font-black text-brand-dark-blue">{livro.isbn}</p>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 text-brand-lilac rounded-2xl flex items-center justify-center">
                         <ShieldCheck size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CATEGORIA</p>
                         <p className="font-black text-brand-dark-blue">Programação</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link 
                  href={`/emprestimos/novo?bookId=${livro.id}`}
                  className={`flex-1 w-full flex items-center justify-center gap-3 px-10 py-6 bg-brand-primary-blue text-white rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-brand-primary-blue/30 ${!livro.disponivel && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                >
                  {livro.disponivel ? (
                    <>Fazer Empréstimo <ArrowLeft className="rotate-180" size={24} /></>
                  ) : (
                    <>Indisponível</>
                  )}
                </Link>
                
                <button className="px-8 py-6 border-2 border-gray-200 text-gray-400 rounded-[2rem] font-black hover:bg-white hover:text-brand-dark-blue hover:border-brand-dark-blue transition-all">
                   Salvar na Lista
                </button>
              </div>

              {!livro.disponivel && (
                <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center gap-4 text-red-600">
                   <Info size={24} />
                   <p className="font-bold text-sm">Este livro já está em uso por outro membro. Você pode ser notificado quando ele retornar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
