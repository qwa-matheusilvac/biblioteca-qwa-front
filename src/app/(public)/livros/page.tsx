'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  BookMarked, 
  ArrowRight,
  Loader2,
  XCircle,
  LayoutGrid,
  List
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LivroService } from '@/features/livros/services';
import Link from 'next/link';

export default function LivrosListingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: livros, isLoading, isError, refetch } = useQuery({
    queryKey: ['livros'],
    queryFn: LivroService.getAll,
  });

  const categories = ['Todas', 'Ficção', 'Tecnologia', 'História', 'Ciência', 'Artes'];

  const filteredLivros = useMemo(() => livros?.filter(livro => {
    const matchesSearch = livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livro.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || true; // Categoria ainda não está no DTO real
    return matchesSearch && matchesCategory;
  }) ?? [], [livros, searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredLivros.length / ITEMS_PER_PAGE));

  const paginatedLivros = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLivros.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLivros, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, viewMode]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-[1440px]">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark-blue mb-4 tracking-tight">Nossa <span className="text-brand-lilac">Biblioteca</span></h1>
            <p className="text-gray-500 max-w-2xl font-medium">Explore títulos disponíveis para empréstimo imediato.</p>
          </div>

          {/* Filters & Search Bar */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full group">
                <span className="absolute inset-y-0 left-6 flex items-center text-gray-400 group-focus-within:text-brand-lilac transition-colors">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Pesquisar por título, autor ou ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-4 bg-[#f8f9ff] border border-transparent rounded-2xl outline-none focus:bg-white focus:border-brand-lilac transition-all font-medium text-brand-dark-blue"
                />
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto">
                {/* <div className="flex bg-[#f8f9ff] p-1.5 rounded-2xl border border-gray-100">
                  {categories.slice(0, 3).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        selectedCategory === cat 
                        ? "bg-white text-brand-lilac shadow-md" 
                        : "text-gray-400 hover:text-brand-dark-blue"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div> */}

                <div className="h-10 w-px bg-gray-100 hidden lg:block mx-2"></div>

                <div className="flex bg-[#f8f9ff] p-1.5 rounded-2xl border border-gray-100">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? "bg-white text-brand-lilac shadow-md" : "text-gray-400"}`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? "bg-white text-brand-lilac shadow-md" : "text-gray-400"}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-brand-lilac mb-6" size={64} />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Carregando acervo...</p>
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-12 rounded-[2.5rem] border border-red-100 text-center max-w-2xl mx-auto">
              <XCircle className="text-red-500 mx-auto mb-6" size={64} />
              <h3 className="text-2xl font-black text-red-900 mb-2">Erro ao carregar livros</h3>
              <p className="text-red-600 font-medium mb-8">Não foi possível conectar ao servidor. Verifique sua conexão.</p>
              <button 
                onClick={() => refetch()}
                className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredLivros.length === 0 ? (
            <div className="bg-white p-32 rounded-[3rem] text-center shadow-sm border border-gray-50">
              <div className="w-24 h-24 bg-[#f8f9ff] rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="text-gray-200" size={48} />
              </div>
              <h3 className="text-2xl font-black text-brand-dark-blue mb-4">Nenhum livro encontrado</h3>
              <p className="text-gray-400 max-w-sm mx-auto font-medium">Tente buscar por outros termos ou limpe os filtros aplicados.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10" 
              : "flex flex-col gap-6"
            }>
              {paginatedLivros.map((livro) => (
                <Link 
                  href={`/livros/${livro.id}`} 
                  key={livro.id} 
                  className={`group bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 ${
                    viewMode === 'list' ? "flex items-center p-4 pr-10" : "flex flex-col"
                  }`}
                >
                  <div className={viewMode === 'grid' 
                    ? "aspect-[3/4] bg-[#f8f9ff] relative flex items-center justify-center border-b border-gray-50" 
                    : "w-40 h-52 bg-[#f8f9ff] rounded-2xl flex items-center justify-center shrink-0"
                  }>
                    <div className="text-gray-200 group-hover:scale-110 group-hover:text-brand-lilac/20 transition-all duration-500">
                      <BookMarked size={viewMode === 'grid' ? 80 : 48} strokeWidth={1} />
                    </div>
                    {livro.disponivel ? (
                      <div className="absolute top-6 right-6 px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-full shadow-lg">
                        DISPONÍVEL
                      </div>
                    ) : (<div className="absolute top-6 right-6 px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg">
                      INDISPONÍVEL
                    </div>)}
                  </div>
                  
                  <div className={`p-8 flex-1 ${viewMode === 'list' ? "pl-10" : ""}`}>
                    <div className="mb-6">
                      <span className="text-brand-lilac font-black text-[10px] tracking-[0.2em] uppercase mb-2 block">
                        LITERATURA
                      </span>
                      <h4 className="font-black text-brand-dark-blue text-xl group-hover:text-brand-primary-blue transition-colors line-clamp-2">
                        {livro.titulo}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest truncate max-w-[150px]">
                        {livro.autor}
                      </p>
                      <div className="w-10 h-10 bg-[#f8f9ff] rounded-full flex items-center justify-center text-brand-primary-blue group-hover:bg-brand-primary-blue group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && filteredLivros.length > 0 && (
            <div className="mt-20 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="px-8 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-brand-dark-blue hover:bg-gray-50 transition-all disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Anterior
              </button>
              <div className="flex gap-2">
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? 'w-12 h-12 bg-brand-primary-blue text-white rounded-2xl font-black shadow-lg shadow-brand-primary-blue/20'
                        : 'w-12 h-12 bg-white text-brand-dark-blue rounded-2xl font-black hover:bg-gray-50 transition-all border border-gray-100'
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="px-8 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-brand-dark-blue hover:bg-gray-50 transition-all disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
