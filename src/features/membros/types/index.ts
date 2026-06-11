export interface MembroRequest {
  nome: string;
  email: string;
}

export interface MembroResponse {
  id: number;
  nome: string;
  email: string;
  dataAssociacao: string; // ISO date
  ativo: boolean;
}
