'use client'

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Mail, ShieldCheck, UserCircle } from 'lucide-react';
import { AuthService } from '@/features/auth/services';
import type { User } from '@/features/auth/types';
import { MembroService } from '@/features/membros/services';
import { formatDate } from '@/lib/utils';

export default function PerfilPage() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setUser(AuthService.getCurrentUser());
  }, []);

  const membroId = user ? Number(user.id) : undefined;

  const { data: membro } = useQuery({
    queryKey: ['meu-perfil', membroId],
    queryFn: () => MembroService.getById(membroId!),
    enabled: !!membroId && user?.perfil === 'MEMBRO',
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary-blue transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">Meu Perfil</h1>
          <p className="text-gray-500 mt-1">Consulte suas informacoes cadastrais e status na biblioteca.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:col-span-2">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 text-brand-lilac flex items-center justify-center">
              <UserCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-dark-blue">{membro?.nome || user?.nome || 'Membro'}</h2>
              <p className="text-sm font-bold text-brand-lilac uppercase tracking-widest mt-1">
                {user?.perfil || 'MEMBRO'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <Mail size={18} />
                <span className="text-sm font-medium">E-mail</span>
              </div>
              <p className="font-bold text-brand-dark-blue break-all">{membro?.email || user?.email || '-'}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <ShieldCheck size={18} />
                <span className="text-sm font-medium">Status</span>
              </div>
              <p className="font-bold text-brand-dark-blue">
                {typeof membro?.ativo === 'boolean' ? (membro.ativo ? 'Ativo' : 'Inativo') : 'Disponivel'}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 md:col-span-2">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <Calendar size={18} />
                <span className="text-sm font-medium">Data de associacao</span>
              </div>
              <p className="font-bold text-brand-dark-blue">
                {membro?.dataAssociacao ? formatDate(membro.dataAssociacao) : 'Nao informada'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Acoes</h2>
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block rounded-2xl border border-gray-100 p-5 hover:bg-gray-50 transition-colors"
            >
              <p className="font-bold text-brand-dark-blue">Voltar ao dashboard</p>
              <p className="text-sm text-gray-500 mt-1">Veja seus indicadores e atividades recentes.</p>
            </Link>
            <Link
              href="/livros"
              className="block rounded-2xl border border-gray-100 p-5 hover:bg-gray-50 transition-colors"
            >
              <p className="font-bold text-brand-dark-blue">Explorar acervo</p>
              <p className="text-sm text-gray-500 mt-1">Consulte livros disponiveis para emprestimo.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
