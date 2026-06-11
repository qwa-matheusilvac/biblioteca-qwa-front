import apiClient from '@/lib/api/client';
import { EmprestimoRequest, EmprestimoResponse } from '../types';

export const EmprestimoService = {
  async getAll(): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get<EmprestimoResponse[]>('/api/emprestimos');
    return response.data;
  },

  async getById(id: number): Promise<EmprestimoResponse> {
    const response = await apiClient.get<EmprestimoResponse>(`/api/emprestimos/${id}`);
    return response.data;
  },

  async create(data: EmprestimoRequest): Promise<EmprestimoResponse> {
    const response = await apiClient.post<EmprestimoResponse>('/api/emprestimos', data);
    return response.data;
  },

  async registrarDevolucao(id: number): Promise<void> {
    await apiClient.post(`/api/emprestimos/${id}/devolucao`);
  },

  async getByMembro(membroId: number): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get<EmprestimoResponse[]>(`/api/emprestimos/membro/${membroId}`);
    return response.data;
  },

  async getAtivos(): Promise<EmprestimoResponse[]> {
    const response = await apiClient.get<EmprestimoResponse[]>('/api/emprestimos/ativos');
    return response.data;
  },
};
