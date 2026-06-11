'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Filter,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { LivroService } from '@/features/livros/services';
import { cn } from '@/lib/utils';

export default function LivrosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: livros, isLoading, isError, refetch } = useQuery({
    queryKey: ['livros'],
    queryFn: LivroService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: LivroService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
    },
  });

  const filteredLivros = livros?.filter(livro => 
    livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livro.isbn.includes(searchTerm)
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">Acervo de Livros</h1>
          <p className="text-gray-500 mt-1">Gerencie os títulos disponíveis na biblioteca.</p>
        </div>
        <Link
          href="/dashboard/livros/novo"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary-blue text-white rounded-2xl font-bold hover:bg-brand-medium-blue transition-all shadow-lg shadow-brand-primary-blue/20"
        >
          <Plus size={20} />
          Cadastrar Livro
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar por título, autor ou ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-brand-primary-blue focus:ring-1 focus:ring-brand-primary-blue transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">
            <Filter size={18} />
            Filtros
          </button>
          <select className="flex-1 md:flex-none px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-gray-600 font-bold text-sm outline-none focus:border-brand-primary-blue transition-all">
            <option>Todos os status</option>
            <option>Disponível</option>
            <option>Emprestado</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-primary-blue mb-4" size={48} />
          <p className="text-gray-500 font-medium">Carregando acervo...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-900 mb-2">Erro ao carregar livros</h3>
          <p className="text-red-600 mb-6">Ocorreu um problema ao buscar os dados no servidor. Tente novamente mais tarde.</p>
          <button 
            onClick={() => refetch()}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            Tentar Novamente
          </button>
        </div>
      ) : filteredLivros?.length === 0 ? (
        <div className="bg-gray-50 p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BookOpen className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Nenhum livro encontrado</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Não encontramos nenhum resultado para sua busca. Tente outros termos ou cadastre um novo livro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredLivros?.map((livro) => (
            <div key={livro.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
              <div className="aspect-[3/2] bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 transition-colors">
                <BookOpen size={64} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-brand-dark-blue text-lg leading-tight line-clamp-2">{livro.titulo}</h3>
                  <div className="relative">
                    <button className="text-gray-400 hover:text-brand-dark-blue p-1 rounded-lg hover:bg-gray-100 transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{livro.autor}</p>
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                  <span className={cn(
                    "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full",
                    livro.disponivel 
                      ? "bg-green-50 text-green-600" 
                      : "bg-red-50 text-red-600"
                  )}>
                    {livro.disponivel ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {livro.disponivel ? 'Disponível' : 'Emprestado'}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ISBN: {livro.isbn}</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/dashboard/livros/${livro.id}/editar`}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50"
                  >
                    <Edit2 size={16} /> Editar
                  </Link>
                  <button 
                    onClick={() => deleteMutation.mutate(livro.id)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-50 text-sm font-bold text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
