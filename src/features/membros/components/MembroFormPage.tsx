'use client'

import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Mail, Save, UserPlus, XCircle } from 'lucide-react';
import { MembroService } from '@/features/membros/services';
import { membroSchema, type MembroFormData } from '@/features/membros/schemas';

interface ApiErrorResponse {
  error?: string;
  message?: string;
  timestamp?: string;
  status?: number;
}

interface MembroFormPageProps {
  mode: 'create' | 'edit';
  membroId?: number;
}

export function MembroFormPage({ mode, membroId }: MembroFormPageProps) {
  const isEdit = mode === 'edit';
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MembroFormData>({
    resolver: zodResolver(membroSchema),
    defaultValues: {
      nome: '',
      email: '',
    },
  });

  const {
    data: membro,
    isLoading: isMembroLoading,
    isError: isMembroError,
  } = useQuery({
    queryKey: ['membro', membroId],
    queryFn: () => MembroService.getById(membroId!),
    enabled: isEdit && !!membroId,
  });

  useEffect(() => {
    if (membro) {
      reset({
        nome: membro.nome,
        email: membro.email,
      });
    }
  }, [membro, reset]);

  const createMutation = useMutation({
    mutationFn: MembroService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros'] });
      router.push('/dashboard/membros');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: MembroFormData) => MembroService.update(membroId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros'] });
      queryClient.invalidateQueries({ queryKey: ['membro', membroId] });
      router.push('/dashboard/membros');
    },
  });

  const activeMutation = isEdit ? updateMutation : createMutation;
  const apiErrorMessage =
    (activeMutation.error as AxiosError<ApiErrorResponse> | null)?.response?.data?.message ||
    `Nao foi possivel ${isEdit ? 'atualizar' : 'cadastrar'} o membro. Tente novamente.`;

  const onSubmit = (data: MembroFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
      return;
    }

    createMutation.mutate(data);
  };

  if (isEdit && isMembroLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin text-brand-lilac mb-4" size={40} />
        <p className="text-gray-500 font-medium">Carregando dados do membro...</p>
      </div>
    );
  }

  if (isEdit && isMembroError) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/membros"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-lilac transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para gestao de membros
        </Link>

        <div className="p-6 rounded-3xl border border-red-100 bg-red-50 text-red-600 flex items-center gap-3">
          <XCircle size={20} />
          <p className="font-bold">Nao foi possivel carregar os dados do membro para edicao.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/membros"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-lilac transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para gestao de membros
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 text-brand-lilac flex items-center justify-center shrink-0">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">
              {isEdit ? 'Editar Membro' : 'Cadastrar Membro'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEdit
                ? 'Atualize os dados do membro selecionado e salve as alteracoes.'
                : 'Preencha os dados abaixo para adicionar um novo membro a biblioteca.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-dark-blue mb-2">Nome</label>
              <div className="relative">
                <input
                  {...register('nome')}
                  type="text"
                  placeholder="Ex: Maria Silva"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all"
                />
              </div>
              {errors.nome && (
                <p className="mt-2 text-xs font-bold text-red-500">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark-blue mb-2">E-mail</label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Ex: maria@email.com"
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all"
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-300 pointer-events-none">
                  <Mail size={18} />
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-bold text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {activeMutation.isError && (
            <div className="p-4 rounded-2xl border border-red-100 bg-red-50 text-red-600 flex items-center gap-3">
              <XCircle size={18} />
              <p className="text-sm font-bold">{apiErrorMessage}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              href="/dashboard/membros"
              className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={activeMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-lilac text-white rounded-2xl font-bold hover:bg-brand-medium-blue transition-all shadow-lg shadow-brand-lilac/20 disabled:opacity-60"
            >
              {activeMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEdit ? 'Salvar Alteracoes' : 'Salvar Membro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
