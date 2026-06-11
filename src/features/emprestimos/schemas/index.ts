import { z } from 'zod';

const requiredNumber = (message: string) =>
  z.preprocess(
    (value) => (value === '' || value === null || value === undefined || Number.isNaN(value) ? undefined : value),
    z.number().refine((value) => value > 0, message)
  );

export const emprestimoSchema = z.object({
  livroId: requiredNumber('Selecione um livro'),
  membroId: requiredNumber('Selecione um membro'),
  diasEmprestimo: requiredNumber('Informe a quantidade de dias').refine(
    (value) => value >= 1,
    'O empréstimo deve ser de no mínimo 1 dia'
  ),
});

export type EmprestimoFormInput = z.input<typeof emprestimoSchema>;
export type EmprestimoFormData = z.output<typeof emprestimoSchema>;
