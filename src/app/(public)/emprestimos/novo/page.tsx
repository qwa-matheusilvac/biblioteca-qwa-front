'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import {
   ArrowLeft,
   Calendar,
   BookMarked,
   User,
   ShieldCheck,
   Loader2,
   CheckCircle2,
   Clock,
   ArrowRight,
   XCircle
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { EmprestimoService } from '@/features/emprestimos/services';
import { LivroService } from '@/features/livros/services';
import { MembroService } from '@/features/membros/services';
import { emprestimoSchema, EmprestimoFormData } from '@/features/emprestimos/schemas';
import Link from 'next/link';

interface ApiErrorResponse {
   error?: string;
   message?: string;
   timestamp?: string;
   status?: number;
}

function NovoEmprestimoContent() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const bookId = searchParams.get('bookId');
   const [success, setSuccess] = useState(false);

   const { data: livro, isLoading: loadingLivro } = useQuery({
      queryKey: ['livro', bookId],
      queryFn: () => LivroService.getById(Number(bookId)),
      enabled: !!bookId,
   });

   const { data: membros, isLoading: loadingMembros } = useQuery({
      queryKey: ['membros'],
      queryFn: MembroService.getAll,
   });

   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm<EmprestimoFormData>({
      resolver: zodResolver(emprestimoSchema),
      defaultValues: {
         livroId: bookId ? Number(bookId) : undefined,
         diasEmprestimo: 7
      }
   });

   useEffect(() => {
      if (bookId) setValue('livroId', Number(bookId));
   }, [bookId, setValue]);

   const mutation = useMutation({
      mutationFn: EmprestimoService.create,
      onSuccess: () => {
         setSuccess(true);
      },
   });

   const apiErrorMessage =
      (mutation.error as AxiosError<ApiErrorResponse> | null)?.response?.data?.message ||
      'Ocorreu um erro ao processar o empréstimo. Tente novamente.';

   const onSubmit = (data: EmprestimoFormData) => {
      mutation.mutate(data);
   };

   if (success) {
      return (
         <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
            <PublicHeader />
            <main className="flex-1 flex items-center justify-center p-6">
               <div className="max-w-xl w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-50 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-500/10">
                     <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-brand-dark-blue mb-4 leading-tight">Empréstimo Realizado!</h2>
                  <p className="text-gray-500 text-lg mb-12 font-medium">Seu empréstimo foi confirmado. Você já pode retirar o livro na biblioteca.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Link href="/dashboard" className="flex-1 px-8 py-5 bg-brand-primary-blue text-white rounded-2xl font-black shadow-xl shadow-brand-primary-blue/20 flex items-center justify-center gap-2">
                        Ir para Dashboard <ArrowRight size={20} />
                     </Link>
                     <Link href="/livros" className="flex-1 px-8 py-5 bg-white text-gray-500 border border-gray-100 rounded-2xl font-black hover:bg-gray-50 transition-all text-center">
                        Ver outros livros
                     </Link>
                  </div>
               </div>
            </main>
            <PublicFooter />
         </div>
      );
   }

   return (
      <div className="w-full min-h-screen bg-[#f8f9ff] flex flex-col">
         <PublicHeader />
         <main className="flex-1 pt-32 pb-32">
            <div className="container mx-auto px-6 max-w-[1000px]">
               <Link href={`/livros/${bookId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-primary-blue font-bold mb-12 transition-colors group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                     <ArrowLeft size={18} />
                  </div>
                  Voltar para Detalhes
               </Link>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* Left Side: Summary */}
                  <div className="lg:col-span-5">
                     <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 sticky top-32">
                        <h3 className="text-[10px] font-black tracking-[0.3em] text-brand-lilac uppercase mb-10">Resumo da Reserva</h3>

                        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-50">
                           <div className="w-20 h-24 bg-[#f8f9ff] rounded-2xl flex items-center justify-center border border-gray-50 shrink-0">
                              <BookMarked size={32} className="text-gray-300" />
                           </div>
                           <div>
                              <p className="font-black text-brand-dark-blue text-lg line-clamp-2 mb-1">{livro?.titulo || 'Carregando...'}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{livro?.autor}</p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="flex items-center gap-4 text-gray-500 font-medium">
                              <Clock size={18} className="text-brand-lilac" />
                              <p className="text-sm">Prazo sugerido: <span className="font-black text-brand-dark-blue">7 dias</span></p>
                           </div>
                           <div className="flex items-center gap-4 text-gray-500 font-medium">
                              <ShieldCheck size={18} className="text-green-500" />
                              <p className="text-sm">Devolução gratuita até o prazo</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right Side: Form */}
                  <div className="lg:col-span-7">
                     <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary-blue to-brand-lilac"></div>

                        <div className="mb-12">
                           <h2 className="text-3xl font-black text-brand-dark-blue mb-2">Confirmar Empréstimo</h2>
                           <p className="text-gray-400 font-medium">Preencha os dados abaixo para finalizar sua reserva.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                           {/* Member Selection */}
                           <div>
                              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Selecione o Membro</label>
                              <div className="relative">
                                 <select
                                    {...register('membroId', { valueAsNumber: true })}
                                    className="w-full px-6 py-4 bg-[#f8f9ff] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-brand-primary-blue transition-all font-bold text-brand-dark-blue appearance-none"
                                 >
                                    <option value="">Selecione seu nome...</option>
                                    {membros?.map(m => (
                                       <option key={m.id} value={m.id}>{m.nome}</option>
                                    ))}
                                 </select>
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <User size={18} className="text-gray-300" />
                                 </div>
                              </div>
                              {errors.membroId && <p className="mt-2 text-xs text-red-500 font-bold">{errors.membroId.message}</p>}
                           </div>

                           {/* Loan Days */}
                           <div>
                              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Período de Empréstimo (Dias)</label>
                              <div className="relative">
                                 <input
                                    type="number"
                                    {...register('diasEmprestimo', { valueAsNumber: true })}
                                    className="w-full px-6 py-4 bg-[#f8f9ff] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-brand-primary-blue transition-all font-bold text-brand-dark-blue"
                                    placeholder="Ex: 7"
                                 />
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Calendar size={18} className="text-gray-300" />
                                 </div>
                              </div>
                              {errors.diasEmprestimo && <p className="mt-2 text-xs text-red-500 font-bold">{errors.diasEmprestimo.message}</p>}
                           </div>

                           <button
                              type="submit"
                              disabled={mutation.isPending}
                              className="w-full py-6 bg-brand-primary-blue text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] transition-all shadow-2xl shadow-brand-primary-blue/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                           >
                              {mutation.isPending ? (
                                 <Loader2 className="animate-spin" size={24} />
                              ) : (
                                 <>Confirmar Empréstimo <ArrowRight size={24} /></>
                              )}
                           </button>

                           {mutation.isError && (
                              <div className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-100 flex items-center gap-3">
                                 <XCircle size={18} />
                                 <p className="text-xs font-bold">{apiErrorMessage}</p>
                              </div>
                           )}
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </main>
         <PublicFooter />
      </div>
   );
}

export default function NovoEmprestimoPublicPage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary-blue" size={48} /></div>}>
         <NovoEmprestimoContent />
      </Suspense>
   );
}
