'use client'

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  ArrowRight,
  BookMarked,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  MousePointer2,
  Globe,
  Settings,
  Loader2,
  XCircle
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LivroService } from '@/features/livros/services';

export default function LandingPage() {
  const { data: livros, isLoading, isError } = useQuery({
    queryKey: ['livros-destaque'],
    queryFn: LivroService.getAll,
  });

  const solutions = [
    {
      category: "BUSCA",
      title: "Busca de Livros",
      description: "Encontre livros rapidamente por título, autor ou categoria dentro do acervo da empresa.",
      icon: <TrendingUp size={18} />,
      color: "bg-red-50 text-red-500"
    },
    {
      category: "ACERVO",
      title: "Gestão de Acervo",
      description: "Visualize todos os livros disponíveis e acompanhe a organização do acervo de forma simples.",
      icon: <Cpu size={18} />,
      color: "bg-purple-50 text-brand-lilac"
    },
    {
      category: "EMPRÉSTIMOS",
      title: "Empréstimos Ágeis",
      description: "Solicite e gerencie seus empréstimos de forma rápida e prática, sem burocracia.",
      icon: <Layers size={18} />,
      color: "bg-indigo-50 text-indigo-500",
      active: true
    },
    {
      category: "ACESSO",
      title: "Acesso ao Acervo",
      description: "Consulte os livros disponíveis a qualquer momento e encontre sua próxima leitura.",
      icon: <Sparkles size={18} />,
      color: "bg-orange-50 text-orange-500"
    },
    {
      category: "EXPERIÊNCIA",
      title: "Experiência do Leitor",
      description: "Interface simples e intuitiva para facilitar sua jornada e incentivar a leitura.",
      icon: <MousePointer2 size={18} />,
      color: "bg-blue-50 text-blue-500"
    },
    {
      category: "USUÁRIO",
      title: "Área do Usuário",
      description: "Acompanhe seus empréstimos, histórico de leitura e informações pessoais.",
      icon: <Globe size={18} />,
      color: "bg-cyan-50 text-cyan-500"
    },
    {
      category: "RECOMENDAÇÕES",
      title: "Sugestões de Leitura",
      description: "Descubra novos livros com base nos seus interesses e hábitos de leitura.",
      icon: <Settings size={18} />,
      color: "bg-yellow-50 text-yellow-500"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="w-full !pt-48 !pb-32 bg-gradient-to-b from-brand-dark-blue to-[#1a1f6d] text-white relative overflow-hidden">
        <div className="container !mx-auto !px-6 relative z-10 !max-w-[1440px]">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black leading-tight !mb-8">
              O conhecimento começa com um <span className="text-brand-lilac underline decoration-brand-lilac/30 underline-offset-8">livro</span>.
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-medium">
              Descubra novos títulos, compartilhe conhecimento e aproveite o acervo da empresa de forma simples e prática.
            </p>


            <div className="flex flex-wrap gap-6">
              <Link href="/livros" className="flex items-center justify-center gap-3 !px-10 !py-5 bg-brand-lilac text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-brand-lilac/30">
                Explorar Acervo <ArrowRight size={22} />
              </Link>
              <Link href="#destaques" className="flex items-center justify-center !px-10 !py-5 border-2 border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/5 transition-all backdrop-blur-sm">
                Destaques
              </Link>
            </div>
          </div>

          {/* Hero Decorative Elements */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-10 hidden lg:block pointer-events-none">
            <BookOpen size={700} strokeWidth={0.5} className="rotate-12 translate-x-1/4" />
          </div>
        </div>
      </section>

      {/* Featured Section (Carousel Style) */}
      <section id="destaques" className="w-full !py-32 bg-white overflow-hidden">
        <div className="container mx-auto !px-6 max-w-[1440px]">
          <div className="flex flex-col md:flex-row items-end justify-between !mb-20 gap-8">
            <div>
              <span className="text-brand-lilac font-black uppercase tracking-[0.2em] text-xs !mb-4 block">DESTAQUES</span>
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark-blue tracking-tight">Recém Chegados</h2>
            </div>
            <Link href="/livros" className="!px-8 !py-4 bg-brand-dark-blue text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-brand-primary-blue transition-all shadow-xl shadow-brand-dark-blue/20">
              Ver tudo <ArrowRight size={20} />
            </Link>
          </div>

          <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide -mx-6 px-6 min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader2 className="animate-spin text-brand-lilac mb-6" size={48} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando novidades...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center w-full py-20 bg-red-50 rounded-[2.5rem] border border-red-100">
                <XCircle className="text-red-500 mb-4" size={40} />
                <p className="text-red-600 font-bold">Erro ao carregar livros</p>
              </div>
            ) : livros && livros.length > 0 ? (
              livros.slice(0, 10).map((livro) => (
                <Link href={`/livros/${livro.id}`} key={livro.id} className="group cursor-pointer min-w-[280px] max-w-[280px] flex flex-col">
                  <div className="aspect-[3/4] w-full bg-[#f8f9ff] rounded-[2.5rem] !mb-6 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:-translate-y-3 transition-all duration-500 relative border border-gray-100 flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-blue/90 via-brand-dark-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <span className="w-full !py-4 bg-white text-brand-dark-blue font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl text-center">
                        Ver detalhes
                      </span>
                    </div>
                    <div className="text-gray-200 group-hover:scale-110 group-hover:text-brand-lilac/20 transition-all duration-500">
                      <BookMarked size={80} strokeWidth={1} />
                    </div>
                    {livro.disponivel ? (
                      <div className="absolute top-6 right-6 px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-full shadow-lg">
                        DISPONÍVEL
                      </div>
                    ) : (<div className="absolute top-6 right-6 px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg">
                      INDISPONÍVEL
                    </div>)}
                  </div>
                  <div className="flex flex-col h-20 !px-2">
                    <h4 className="font-black text-brand-dark-blue text-lg line-clamp-2 !mb-1 leading-tight">{livro.titulo}</h4>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-auto truncate">{livro.autor}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-20">
                <p className="text-gray-400 font-medium">Nenhum livro disponível no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      {/* <section className="w-full !py-40 bg-brand-primary-blue relative overflow-hidden">
        <div className="container mx-auto !px-6 text-center relative z-10 max-w-[1440px]">
          <h2 className="text-5xl md:text-7xl font-black text-white !mb-10 tracking-tight leading-none">Pronto para começar<br/>sua jornada?</h2>
          <p className="text-xl text-white/70 !mb-16 max-w-2xl !mx-auto leading-relaxed font-medium">
            Junte-se a milhares de leitores e tenha acesso a um acervo infinito na palma da sua mão.
          </p>
          <Link href="/login" className="inline-block !px-14 !py-6 bg-white text-brand-primary-blue rounded-[2.5rem] font-black text-xl hover:scale-110 transition-all shadow-2xl shadow-black/20">
            Criar minha conta gratuita
          </Link>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <Library size={500} className="absolute -left-32 -top-32" strokeWidth={0.5} />
           <Library size={400} className="absolute -right-20 -bottom-20" strokeWidth={0.5} />
        </div>
      </section> */}

      <PublicFooter />
    </div>
  );
}
