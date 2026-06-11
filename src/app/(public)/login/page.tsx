'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Library, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthService } from '@/features/auth/services';
import { setCookie } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(data.email, data.senha);
      AuthService.setSession(response.token, response.user);
      
      // Em um app real, o middleware verificaria o cookie. 
      // Como estamos mockando, vamos setar um cookie temporário para o middleware funcionar
      setCookie('token', response.token);
      
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Library className="text-brand-lilac" size={40} />
            <span className="text-3xl font-bold text-brand-dark-blue tracking-tight">QWA ESTUDOS</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h2>
          <p className="text-gray-500 mt-2">Acesse sua conta para gerenciar seus livros</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
              <input
                {...register('email')}
                type="email"
                placeholder="exemplo@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-primary-blue focus:ring-1 focus:ring-brand-primary-blue transition-all"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <input
                  {...register('senha')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-primary-blue focus:ring-1 focus:ring-brand-primary-blue transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.senha.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-primary-blue focus:ring-brand-primary-blue" />
                <span className="text-sm text-gray-600">Lembrar de mim</span>
              </label>
              <Link href="#" className="text-sm font-bold text-brand-primary-blue hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-primary-blue text-white rounded-xl font-bold text-lg hover:bg-brand-medium-blue transition-all shadow-lg shadow-brand-primary-blue/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link href="#" className="font-bold text-brand-lilac hover:underline">
                Solicite seu acesso
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
