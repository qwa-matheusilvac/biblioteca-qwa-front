import apiClient from '@/lib/api/client';
import { LivroRequest, LivroResponse } from '../types';

export const LivroService = {
  async getAll(): Promise<LivroResponse[]> {
    const response = await apiClient.get<LivroResponse[]>('/api/livros');
    return response.data;
  },

  async getById(id: number): Promise<LivroResponse> {
    const response = await apiClient.get<LivroResponse>(`/api/livros/${id}`);
    return response.data;
  },

  async create(data: LivroRequest): Promise<LivroResponse> {
    const response = await apiClient.post<LivroResponse>('/api/livros', data);
    return response.data;
  },

  async update(id: number, data: LivroRequest): Promise<LivroResponse> {
    const response = await apiClient.put<LivroResponse>(`/api/livros/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/livros/${id}`);
  },
};
