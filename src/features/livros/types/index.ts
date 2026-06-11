export interface LivroRequest {
  titulo: string;
  autor: string;
  isbn: string;
}

export interface LivroResponse {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  disponivel: boolean;
}
