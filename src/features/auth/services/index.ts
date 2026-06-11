import { AuthResponse, User } from '../types';
import { deleteCookie } from '@/lib/utils';

// Mock service for authentication
export const AuthService = {
  async login(email: string, senha: string): Promise<AuthResponse> {
    // Simulating API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@biblioteca.com' && senha === 'admin123') {
          resolve({
            user: {
              id: '1',
              nome: 'Administrador',
              email: 'admin@biblioteca.com',
              perfil: 'ADMIN',
            },
            token: 'mock-jwt-token-admin',
          });
        } else if (email === 'membro@biblioteca.com' && senha === 'membro123') {
          resolve({
            user: {
              id: '2',
              nome: 'Membro Teste',
              email: 'membro@biblioteca.com',
              perfil: 'MEMBRO',
            },
            token: 'mock-jwt-token-membro',
          });
        } else {
          reject(new Error('E-mail ou senha inválidos'));
        }
      }, 1000);
    });
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      deleteCookie('token');
      deleteCookie('user');
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setSession(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
};
