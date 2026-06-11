import apiClient from '@/lib/api/client';
import { MembroRequest, MembroResponse } from '../types';

export const MembroService = {
  async getAll(): Promise<MembroResponse[]> {
    const response = await apiClient.get<MembroResponse[]>('/api/membros');
    return response.data;
  },

  async getById(id: number): Promise<MembroResponse> {
    const response = await apiClient.get<MembroResponse>(`/api/membros/${id}`);
    return response.data;
  },

  async create(data: MembroRequest): Promise<MembroResponse> {
    const response = await apiClient.post<MembroResponse>('/api/membros', data);
    return response.data;
  },

  async update(id: number, data: MembroRequest): Promise<MembroResponse> {
    const response = await apiClient.put<MembroResponse>(`/api/membros/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/membros/${id}`);
  },
};
