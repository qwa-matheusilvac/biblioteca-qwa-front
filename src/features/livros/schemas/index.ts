import { z } from 'zod';

export const livroSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  autor: z.string().min(3, 'O autor deve ter pelo menos 3 caracteres'),
  isbn: z.string().min(10, 'O ISBN deve ter pelo menos 10 caracteres'),
});

export type LivroFormData = z.infer<typeof livroSchema>;
