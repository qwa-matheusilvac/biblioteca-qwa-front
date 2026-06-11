'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  ArrowLeftRight, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical,
  BookOpen,
  User,
  Loader2,
  XCircle,
  Filter,
  Check
} from 'lucide-react';
import { EmprestimoService } from '@/features/emprestimos/services';
import { cn, formatDate } from '@/lib/utils';

export default function EmprestimosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: emprestimos, isLoading, isError } = useQuery({
    queryKey: ['emprestimos'],
    queryFn: EmprestimoService.getAll,
  });

  const returnMutation = useMutation({
    mutationFn: EmprestimoService.registrarDevolucao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprestimos'] });
    },
  });

  const filteredEmprestimos = emprestimos?.filter(emp => 
    emp.tituloLivro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.nomeMembro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div>
          <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">Gestão de Empréstimos</h1>
          <p className="text-gray-500 mt-1">Acompanhe e registre a movimentação de livros.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar por livro ou membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">
            <Filter size={18} />
            Filtros
          </button>
          <select className="flex-1 md:flex-none px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-gray-600 font-bold text-sm outline-none focus:border-indigo-600 transition-all">
            <option>Todos os status</option>
            <option>Ativos</option>
            <option>Devolvidos</option>
            <option>Atrasados</option>
          </select>
        </div>
      </div>

      {/* Loans List/Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Carregando empréstimos...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-900 mb-2">Erro ao carregar empréstimos</h3>
          <p className="text-red-600">Não foi possível recuperar os dados de empréstimos.</p>
        </div>
      ) : filteredEmprestimos?.length === 0 ? (
        <div className="bg-gray-50 p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ArrowLeftRight className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Nenhum empréstimo encontrado</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Não há registros que correspondam aos filtros aplicados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Livro</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Membro</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Datas</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmprestimos?.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary-blue flex items-center justify-center">
                          <BookOpen size={18} />
                        </div>
                        <span className="font-bold text-brand-dark-blue">{emp.tituloLivro}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <User size={16} className="text-gray-400" />
                        {emp.nomeMembro}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} className="text-blue-400" />
                          Empréstimo: <span className="font-bold">{formatDate(emp.dataEmprestimo)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={14} className="text-orange-400" />
                          Vencimento: <span className="font-bold">{formatDate(emp.dataVencimento)}</span>
                        </div>
                        {emp.dataDevolucao && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle2 size={14} className="text-green-400" />
                            Devolução: <span className="font-bold">{formatDate(emp.dataDevolucao)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full",
                        emp.status === 'ATIVO' ? "bg-blue-50 text-blue-600" : 
                        emp.status === 'DEVOLVIDO' ? "bg-green-50 text-green-600" : 
                        "bg-red-50 text-red-600"
                      )}>
                        {emp.status === 'ATIVO' ? <Clock size={12} /> : 
                         emp.status === 'DEVOLVIDO' ? <CheckCircle2 size={12} /> : 
                         <AlertCircle size={12} />}
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {emp.status === 'ATIVO' && (
                        <button 
                          onClick={() => returnMutation.mutate(emp.id)}
                          className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors flex items-center gap-2 ml-auto"
                        >
                          <Check size={14} /> Registrar Devolução
                        </button>
                      )}
                      {emp.status !== 'ATIVO' && (
                        <button className="p-2 text-gray-400 hover:text-brand-dark-blue hover:bg-white rounded-lg transition-all shadow-sm opacity-0 group-hover:opacity-100">
                           <MoreVertical size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
