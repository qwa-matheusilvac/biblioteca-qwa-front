import { z } from 'zod';

export const emprestimoSchema = z.object({
  livroId: z.number({ required_error: 'Selecione um livro' }),
  membroId: z.number({ required_error: 'Selecione um membro' }),
  diasEmprestimo: z.number({ required_error: 'Informe a quantidade de dias' }).min(1, 'O empréstimo deve ser de no mínimo 1 dia'),
});

export type EmprestimoFormData = z.infer<typeof emprestimoSchema>;
