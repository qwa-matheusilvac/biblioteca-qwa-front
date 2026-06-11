'use client'

import React from 'react';
import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  AlertCircle,
  Loader2,
  ChevronRight,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LivroService } from '@/features/livros/services';
import { MembroService } from '@/features/membros/services';
import { EmprestimoService } from '@/features/emprestimos/services';
import { AuthService } from '@/features/auth/services';
import type { User } from '@/features/auth/types';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'indigo' | 'red';
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => {
  const colors = {
    blue: 'bg-blue-50 text-brand-primary-blue border-blue-100',
    purple: 'bg-purple-50 text-brand-lilac border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center border', colors[color])}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{label}</h3>
      <p className="text-3xl font-bold text-brand-dark-blue tracking-tight">{value}</p>
    </div>
  );
};

const isOverdueStatus = (status: string) => status === 'ATRASSADO' || status === 'ATRASADO';

const getActivityType = (status: string) => {
  if (status === 'DEVOLVIDO') return 'return';
  if (isOverdueStatus(status)) return 'overdue';
  return 'loan';
};

const getStatusStyles = (status: string) => {
  if (status === 'ATIVO') return 'bg-blue-50 text-blue-600';
  if (status === 'DEVOLVIDO') return 'bg-green-50 text-green-600';
  return 'bg-red-50 text-red-600';
};

const getAvatarStyles = (status: string) => {
  if (status === 'ATIVO') return 'bg-blue-500';
  if (status === 'DEVOLVIDO') return 'bg-green-500';
  return 'bg-red-500';
};

export default function DashboardPage() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setUser(AuthService.getCurrentUser());
  }, []);

  const isAdmin = user?.perfil === 'ADMIN';
  const isMember = user?.perfil === 'MEMBRO';
  const membroId = user ? Number(user.id) : undefined;

  const [livrosQuery, membrosQuery, emprestimosAtivosQuery, emprestimosQuery, meusEmprestimosQuery, meuPerfilQuery] = useQueries({
    queries: [
      { queryKey: ['livros'], queryFn: LivroService.getAll },
      { queryKey: ['membros'], queryFn: MembroService.getAll, enabled: isAdmin },
      { queryKey: ['emprestimos-ativos'], queryFn: EmprestimoService.getAtivos, enabled: isAdmin },
      { queryKey: ['emprestimos'], queryFn: EmprestimoService.getAll, enabled: isAdmin },
      {
        queryKey: ['meus-emprestimos-dashboard', membroId],
        queryFn: () => EmprestimoService.getByMembro(membroId!),
        enabled: isMember && !!membroId,
      },
      {
        queryKey: ['meu-perfil-dashboard', membroId],
        queryFn: () => MembroService.getById(membroId!),
        enabled: isMember && !!membroId,
      },
    ],
  });

  const livros = livrosQuery.data ?? [];
  const membros = membrosQuery.data ?? [];
  const emprestimosAtivos = emprestimosAtivosQuery.data ?? [];
  const emprestimosGlobais = emprestimosQuery.data ?? [];
  const meusEmprestimos = meusEmprestimosQuery.data ?? [];
  const meuPerfil = meuPerfilQuery.data;

  const emprestimosFonte = isAdmin ? emprestimosGlobais : meusEmprestimos;
  const emprestimosAtrasados = emprestimosFonte.filter((emprestimo) => isOverdueStatus(emprestimo.status));
  const emprestimosAtivosMembro = meusEmprestimos.filter((emprestimo) => emprestimo.status === 'ATIVO');

  const stats = isAdmin
    ? [
        { label: 'Total de Livros', value: livros.length, icon: <BookOpen size={24} />, color: 'blue' as const },
        { label: 'Total de Membros', value: membros.length, icon: <Users size={24} />, color: 'purple' as const },
        { label: 'Empréstimos Ativos', value: emprestimosAtivos.length, icon: <ArrowLeftRight size={24} />, color: 'indigo' as const },
        { label: 'Livros Atrasados', value: emprestimosAtrasados.length, icon: <AlertCircle size={24} />, color: 'red' as const },
      ]
    : [
        { label: 'Total de Livros', value: livros.length, icon: <BookOpen size={24} />, color: 'blue' as const },
        { label: 'Meus Empréstimos Ativos', value: emprestimosAtivosMembro.length, icon: <ArrowLeftRight size={24} />, color: 'indigo' as const },
        { label: 'Livros Atrasados', value: emprestimosAtrasados.length, icon: <AlertCircle size={24} />, color: 'red' as const },
        { label: 'Meu Perfil', value: meuPerfil?.ativo ? 'Ativo' : user ? 'Disponivel' : '-', icon: <UserCircle size={24} />, color: 'purple' as const },
      ];

  const recentActivities = [...emprestimosFonte]
    .sort((a, b) => new Date(b.dataEmprestimo).getTime() - new Date(a.dataEmprestimo).getTime())
    .slice(0, 5)
    .map((emprestimo) => ({
      id: emprestimo.id,
      user: isAdmin ? emprestimo.nomeMembro : (meuPerfil?.nome || user?.nome || emprestimo.nomeMembro),
      book: emprestimo.tituloLivro,
      date: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(emprestimo.dataEmprestimo)),
      status: emprestimo.status,
      type: getActivityType(emprestimo.status),
    }));

  const isLoading = !user || livrosQuery.isLoading || (isAdmin
    ? membrosQuery.isLoading || emprestimosAtivosQuery.isLoading || emprestimosQuery.isLoading
    : meusEmprestimosQuery.isLoading || meuPerfilQuery.isLoading);

  const isError = livrosQuery.isError || (isAdmin
    ? membrosQuery.isError || emprestimosAtivosQuery.isError || emprestimosQuery.isError
    : meusEmprestimosQuery.isError);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {isAdmin
            ? 'Resumo em tempo real com base nos dados globais da biblioteca.'
            : `Bem-vindo, ${user?.nome || 'membro'}. Aqui voce acompanha somente suas informacoes.`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-brand-primary-blue mb-4" size={40} />
          <p className="text-gray-500 font-medium">Carregando indicadores do dashboard...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
          <h3 className="text-xl font-bold text-red-900 mb-2">Erro ao carregar indicadores</h3>
          <p className="text-red-600">Nao foi possivel buscar os dados reais do dashboard.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-brand-dark-blue">
                  {isAdmin ? 'Atividades Recentes' : 'Minhas Atividades Recentes'}
                </h2>
                <Link
                  href={isAdmin ? '/dashboard/emprestimos' : '/dashboard/perfil'}
                  className="text-brand-primary-blue text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  {isAdmin ? 'Ver tudo' : 'Ver perfil'} <ChevronRight size={16} />
                </Link>
              </div>

              <div className="space-y-6">
                {recentActivities.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-gray-50 text-gray-300 flex items-center justify-center mx-auto mb-4">
                      <ArrowLeftRight size={28} />
                    </div>
                    <h3 className="font-bold text-brand-dark-blue mb-2">
                      {isAdmin ? 'Sem atividades recentes' : 'Voce ainda nao possui atividades recentes'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isAdmin
                        ? 'Os emprestimos aparecerao aqui conforme forem registrados.'
                        : 'Seus emprestimos e devolucoes aparecerao aqui conforme forem registrados.'}
                    </p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-colors -mx-2">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn('w-12 h-12 rounded-full flex items-center justify-center font-bold text-white', getAvatarStyles(activity.status))}
                        >
                          {activity.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark-blue">{activity.user}</p>
                          <p className="text-sm text-gray-500">
                            {activity.type === 'loan' ? 'Retirou' : activity.type === 'return' ? 'Devolveu' : 'Atrasou'}:
                            <span className="font-medium ml-1">{activity.book}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 mb-1">{activity.date}</p>
                        <span
                          className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getStatusStyles(activity.status))}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-brand-dark-blue mb-6">
                {isAdmin ? 'Resumo Rapido' : 'Meu Resumo'}
              </h2>
              <div className="space-y-5">
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                  <p className="text-sm font-medium text-gray-500 mb-1">Livros disponiveis</p>
                  <p className="text-2xl font-bold text-brand-primary-blue">
                    {livros.filter((livro) => livro.disponivel).length}
                  </p>
                </div>
                {isAdmin ? (
                  <>
                    <div className="rounded-2xl bg-purple-50 border border-purple-100 p-5">
                      <p className="text-sm font-medium text-gray-500 mb-1">Membros cadastrados</p>
                      <p className="text-2xl font-bold text-brand-lilac">{membros.length}</p>
                    </div>
                    <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
                      <p className="text-sm font-medium text-gray-500 mb-1">Pendencias de devolucao</p>
                      <p className="text-2xl font-bold text-red-600">{emprestimosAtrasados.length}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl bg-purple-50 border border-purple-100 p-5">
                      <p className="text-sm font-medium text-gray-500 mb-1">Meu e-mail</p>
                      <p className="text-base font-bold text-brand-lilac break-all">{meuPerfil?.email || user?.email}</p>
                    </div>
                    <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
                      <p className="text-sm font-medium text-gray-500 mb-1">Pendencias de devolucao</p>
                      <p className="text-2xl font-bold text-red-600">{emprestimosAtrasados.length}</p>
                    </div>
                    <Link
                      href="/dashboard/perfil"
                      className="block rounded-2xl bg-gray-900 text-white p-5 hover:bg-black transition-colors"
                    >
                      <p className="text-sm text-white/70 mb-1">Perfil do membro</p>
                      <p className="text-lg font-bold">Ver minhas informacoes</p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
