'use client'

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Loader2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { EmprestimoService } from '@/features/emprestimos/services';
import { AuthService } from '@/features/auth/services';
import { User } from '@/features/auth/types';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function MeusEmprestimosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [useFallbackId, setUseFallbackId] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const membroId = (user && !useFallbackId) ? Number(user.id) : 1;

  const { data: emprestimos, isLoading, isError, refetch } = useQuery({
    queryKey: ['meus-emprestimos', membroId],
    queryFn: () => EmprestimoService.getByMembro(membroId),
  });

  // Lógica para buscar ID 1 se o usuário atual não tiver nada
  useEffect(() => {
    if (!isLoading && !isError && emprestimos?.length === 0 && membroId !== 1 && !useFallbackId) {
      setUseFallbackId(true);
    }
  }, [emprestimos, isLoading, isError, membroId, useFallbackId]);

  // Se a busca pelo usuário logado retornar vazio, podemos sugerir o ID 1
  const showFallbackOption = !isLoading && user && !useFallbackId && emprestimos?.length === 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">Meus Empréstimos</h1>
          <p className="text-gray-500 mt-1">
            {membroId === 1 && user?.id !== '1' ? (
              <span className="text-amber-600 font-bold">Visualizando dados de teste (Membro ID: 1). </span>
            ) : user ? (
              `Bem-vindo, ${user.nome}. `
            ) : (
              'Carregando usuário... '
            )}
            Acompanhe seus livros retirados e prazos de devolução.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {membroId === 1 && user && user.id !== '1' && (
            <button 
              onClick={() => setUseFallbackId(false)}
              className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all"
            >
              Voltar para meu ID
            </button>
          )}
          <button 
            onClick={() => refetch()}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-primary-blue hover:shadow-sm transition-all"
            title="Atualizar dados"
          >
            <Loader2 className={cn(isLoading && "animate-spin")} size={20} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-blue-50 text-brand-primary-blue rounded-2xl flex items-center justify-center">
               <BookOpen size={24} />
             </div>
             <div>
               <p className="text-gray-500 text-sm font-medium">Total de Livros</p>
               <p className="text-2xl font-bold text-brand-dark-blue">{emprestimos?.length || 0}</p>
             </div>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
               <CheckCircle2 size={24} />
             </div>
             <div>
               <p className="text-gray-500 text-sm font-medium">Devolvidos</p>
               <p className="text-2xl font-bold text-brand-dark-blue">
                 {emprestimos?.filter(e => e.status === 'DEVOLVIDO').length || 0}
               </p>
             </div>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
               <AlertCircle size={24} />
             </div>
             <div>
               <p className="text-gray-500 text-sm font-medium">Atrasados/Pendentes</p>
               <p className="text-2xl font-bold text-brand-dark-blue">
                 {emprestimos?.filter(e => e.status !== 'DEVOLVIDO').length || 0}
               </p>
             </div>
           </div>
        </div>
      </div>

      {/* Loans Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-lilac mb-4" size={48} />
          <p className="text-gray-500 font-medium">Carregando seus empréstimos...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600">Ocorreu um problema ao buscar seus empréstimos.</p>
        </div>
      ) : emprestimos?.length === 0 ? (
        <div className="bg-gray-50 p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BookOpen className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Você ainda não retirou livros</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            {showFallbackOption 
              ? "Não encontramos nenhum registro no seu nome. Deseja visualizar os dados do Membro 1 para teste?" 
              : "Explore nosso catálogo e encontre sua próxima leitura favorita hoje mesmo."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {showFallbackOption && (
              <button 
                onClick={() => setUseFallbackId(true)}
                className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all flex items-center gap-2"
              >
                Testar com ID 1
              </button>
            )}
            <Link href="/livros" className="px-8 py-4 bg-brand-primary-blue text-white rounded-2xl font-bold hover:bg-brand-medium-blue transition-all flex items-center gap-2">
              Explorar Acervo <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {emprestimos?.map((emp) => (
            <div key={emp.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex">
              <div className="w-32 bg-gray-50 flex items-center justify-center text-gray-300 border-r border-gray-100">
                <BookOpen size={40} />
              </div>
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                   <h3 className="font-bold text-brand-dark-blue text-lg line-clamp-1">{emp.tituloLivro}</h3>
                   <span className={cn(
                     "text-[10px] font-bold px-2 py-0.5 rounded-full",
                     emp.status === 'ATIVO' ? "bg-blue-50 text-blue-600" : 
                     emp.status === 'DEVOLVIDO' ? "bg-green-50 text-green-600" : 
                     "bg-red-50 text-red-600"
                   )}>
                     {emp.status}
                   </span>
                </div>
                
                <div className="space-y-2 mb-6">
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} className="text-blue-400" />
                      Retirado em: <span className="font-bold">{formatDate(emp.dataEmprestimo)}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} className="text-orange-400" />
                      Devolver até: <span className="font-bold">{formatDate(emp.dataVencimento)}</span>
                   </div>
                </div>

                {emp.status === 'ATIVO' && (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3">
                     <AlertCircle size={16} className="text-blue-500" />
                     <p className="text-[10px] text-blue-700 font-medium">Lembre-se de devolver no prazo para evitar multas.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
