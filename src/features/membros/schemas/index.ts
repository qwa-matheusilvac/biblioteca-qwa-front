import { z } from 'zod';

export const membroSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
});

export type MembroFormData = z.infer<typeof membroSchema>;
