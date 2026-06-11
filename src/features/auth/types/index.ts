export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'MEMBRO';
}

export interface AuthResponse {
  user: User;
  token: string;
}
