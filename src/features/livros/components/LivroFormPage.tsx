'use client'

import { useEffect } from 'react';
import type { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, BookText, Loader2, Save, XCircle } from 'lucide-react';
import { LivroService } from '@/features/livros/services';
import { livroSchema, type LivroFormData } from '@/features/livros/schemas';

interface ApiErrorResponse {
  error?: string;
  message?: string;
  timestamp?: string;
  status?: number;
}

interface LivroFormPageProps {
  mode: 'create' | 'edit';
  livroId?: number;
}

export function LivroFormPage({ mode, livroId }: LivroFormPageProps) {
  const isEdit = mode === 'edit';
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LivroFormData>({
    resolver: zodResolver(livroSchema),
    defaultValues: {
      titulo: '',
      autor: '',
      isbn: '',
    },
  });

  const {
    data: livro,
    isLoading: isLivroLoading,
    isError: isLivroError,
  } = useQuery({
    queryKey: ['livro', livroId],
    queryFn: () => LivroService.getById(livroId!),
    enabled: isEdit && !!livroId,
  });

  useEffect(() => {
    if (livro) {
      reset({
        titulo: livro.titulo,
        autor: livro.autor,
        isbn: livro.isbn,
      });
    }
  }, [livro, reset]);

  const createMutation = useMutation({
    mutationFn: LivroService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      router.push('/dashboard/livros');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: LivroFormData) => LivroService.update(livroId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      queryClient.invalidateQueries({ queryKey: ['livro', livroId] });
      router.push('/dashboard/livros');
    },
  });

  const activeMutation = isEdit ? updateMutation : createMutation;
  const apiErrorMessage =
    (activeMutation.error as AxiosError<ApiErrorResponse> | null)?.response?.data?.message ||
    `Nao foi possivel ${isEdit ? 'atualizar' : 'cadastrar'} o livro. Tente novamente.`;

  const onSubmit = (data: LivroFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
      return;
    }

    createMutation.mutate(data);
  };

  if (isEdit && isLivroLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin text-brand-primary-blue mb-4" size={40} />
        <p className="text-gray-500 font-medium">Carregando dados do livro...</p>
      </div>
    );
  }

  if (isEdit && isLivroError) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/livros"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary-blue transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para gestao de livros
        </Link>

        <div className="p-6 rounded-3xl border border-red-100 bg-red-50 text-red-600 flex items-center gap-3">
          <XCircle size={20} />
          <p className="font-bold">Nao foi possivel carregar os dados do livro para edicao.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/livros"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary-blue transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para gestao de livros
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-primary-blue flex items-center justify-center shrink-0">
            <BookText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-dark-blue tracking-tight">
              {isEdit ? 'Editar Livro' : 'Cadastrar Livro'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEdit
                ? 'Atualize os dados do livro selecionado e salve as alteracoes.'
                : 'Preencha os dados abaixo para adicionar um novo livro ao acervo.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-dark-blue mb-2">Titulo</label>
              <input
                {...register('titulo')}
                type="text"
                placeholder="Ex: Clean Code"
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-brand-primary-blue focus:ring-1 focus:ring-brand-primary-blue transition-all"
              />
              {errors.titulo && (
                <p className="mt-2 text-xs font-bold text-red-500">{errors.titulo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark-blue mb-2">Autor</label>
              <input
                {...register('autor')}
                type="text"
                placeholder="Ex: Robert C. Martin"
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-brand-primary-blue focus:ring-1 focus:ring-brand-primary-blue transition-all"
              />
              {errors.autor && (
                <p className="mt-2 text-xs font-bold text-red-500">{errors.autor.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark-blue mb-2">ISBN</label>
              <input
                {...register('isbn')}
                type="text"
                placeholder="Ex: 9780132350884"
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-brand-primary-blue focus:ring-1 focus:ring-brand-primary-blue transition-all"
              />
              {errors.isbn && (
                <p className="mt-2 text-xs font-bold text-red-500">{errors.isbn.message}</p>
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
              href="/dashboard/livros"
              className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={activeMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary-blue text-white rounded-2xl font-bold hover:bg-brand-medium-blue transition-all shadow-lg shadow-brand-primary-blue/20 disabled:opacity-60"
            >
              {activeMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEdit ? 'Salvar Alteracoes' : 'Salvar Livro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
