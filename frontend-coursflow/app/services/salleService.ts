import { api } from './api';
import { Salle, DisponibiliteSalle } from '../types';

interface CreateSalleData {
  nom: string;
  batiment?: string;
  capacite: number;
  type: string;
}

interface CreateDisponibiliteSalleData {
  jour: string;
  heureDebut: string;
  heureFin: string;
  type: string;
  dateDebut: string;
  dateFin: string;
}

export const salleService = {
  async getAll(): Promise<Salle[]> {
    return api.get<Salle[]>('/Salle');
  },

  async getById(id: number): Promise<Salle> {
    return api.get<Salle>(`/Salle/${id}`);
  },

  async create(data: CreateSalleData): Promise<Salle> {
    return api.post<Salle>('/Salle', data);
  },

  async update(id: number, data: Partial<CreateSalleData>): Promise<void> {
    return api.put(`/Salle/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/Salle/${id}`);
  },

  async getDisponibilites(salleId: number): Promise<DisponibiliteSalle[]> {
    return api.get<DisponibiliteSalle[]>(`/Salle/${salleId}/disponibilites`);
  },

  async createDisponibilite(salleId: number, data: CreateDisponibiliteSalleData): Promise<void> {
    return api.post(`/Salle/${salleId}/disponibilites`, data);
  },

  async deleteDisponibilite(id: number): Promise<void> {
    return api.delete(`/Salle/disponibilite/${id}`);
  },
};