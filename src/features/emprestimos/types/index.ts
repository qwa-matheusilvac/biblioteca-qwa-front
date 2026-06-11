export type EmprestimoStatus = 'ATIVO' | 'DEVOLVIDO' | 'ATRASSADO';

export interface EmprestimoRequest {
  livroId: number;
  membroId: number;
  diasEmprestimo: number;
}

export interface EmprestimoResponse {
  id: number;
  livroId: number;
  tituloLivro: string;
  membroId: number;
  nomeMembro: string;
  dataEmprestimo: string; // ISO date
  dataVencimento: string; // ISO date
  dataDevolucao: string | null; // ISO date or null
  status: EmprestimoStatus;
}
