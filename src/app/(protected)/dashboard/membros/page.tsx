'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Edit2,
  Trash2,
  Loader2
} from 'lucide-react';
import { MembroService } from '@/features/membros/services';
import { cn, formatDate } from '@/lib/utils';

export default function MembrosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: membros, isLoading, isError } = useQuery({
    queryKey: ['membros'],
    queryFn: MembroService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: MembroService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros'] });
    },
  });

  const filteredMembros = membros?.filter(membro => 
    membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membro.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">Gestão de Membros</h1>
          <p className="text-gray-500 mt-1">Gerencie os usuários e membros da biblioteca.</p>
        </div>
        <Link
          href="/dashboard/membros/novo"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-lilac text-white rounded-2xl font-bold hover:bg-brand-medium-blue transition-all shadow-lg shadow-brand-lilac/20"
        >
          <UserPlus size={20} />
          Cadastrar Membro
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all text-sm"
          />
        </div>
      </div>

      {/* Members List/Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-lilac mb-4" size={48} />
          <p className="text-gray-500 font-medium">Carregando membros...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-900 mb-2">Erro ao carregar membros</h3>
          <p className="text-red-600">Ocorreu um problema ao buscar os dados no servidor.</p>
        </div>
      ) : filteredMembros?.length === 0 ? (
        <div className="bg-gray-50 p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <UserPlus className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-brand-dark-blue mb-2">Nenhum membro encontrado</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Não encontramos nenhum resultado para sua busca.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Membro</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Data de Associação</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMembros?.map((membro) => (
                  <tr key={membro.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-lilac/10 text-brand-lilac flex items-center justify-center font-bold">
                          {membro.nome.charAt(0)}
                        </div>
                        <span className="font-bold text-brand-dark-blue">{membro.nome}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Mail size={16} />
                        {membro.email}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={16} />
                        {formatDate(membro.dataAssociacao)}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full",
                        membro.ativo 
                          ? "bg-green-50 text-green-600" 
                          : "bg-red-50 text-red-600"
                      )}>
                        {membro.ativo ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {membro.ativo ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/membros/${membro.id}/editar`}
                          className="p-2 text-gray-400 hover:text-brand-lilac hover:bg-white rounded-lg transition-all shadow-sm"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => deleteMutation.mutate(membro.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
             <span>Exibindo {filteredMembros?.length} de {membros?.length} membros</span>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-100 rounded-lg font-bold text-gray-400 cursor-not-allowed">Anterior</button>
                <button className="px-4 py-2 bg-white border border-gray-100 rounded-lg font-bold text-brand-dark-blue hover:bg-gray-50">Próxima</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
