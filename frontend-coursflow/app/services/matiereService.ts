import { api } from './api';
import { Matiere, Cours } from '../types';

interface CreateMatiereData {
  code: string;
  nom: string;
  description?: string;
  credits: number;
  volumeHoraireGlobal: number;
  preRequisIds?: number[];
}

interface CreateCoursData {
  anneeUniversitaire: string;
  semestre: string;
  typeCours: string;
  duree: number;
  volumeHoraire: number;
  matiereId: number;
  professeurId: number;
  salleId?: number;
}

export const matiereService = {
  async getAll(): Promise<Matiere[]> {
    return api.get<Matiere[]>('/Matiere');
  },

  async getById(id: number): Promise<Matiere> {
    return api.get<Matiere>(`/Matiere/${id}`);
  },

  async create(data: CreateMatiereData): Promise<Matiere> {
    return api.post<Matiere>('/Matiere', data);
  },

  async update(id: number, data: Partial<CreateMatiereData>): Promise<void> {
    return api.put(`/Matiere/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/Matiere/${id}`);
  },

  async getByFiliere(filiereId: number): Promise<Matiere[]> {
    return api.get<Matiere[]>(`/Matiere/filiere/${filiereId}`);
  },

  // Cours
  async getCours(): Promise<Cours[]> {
    return api.get<Cours[]>('/Cours');
  },

  async getCoursById(id: number): Promise<Cours> {
    return api.get<Cours>(`/Cours/${id}`);
  },

  async createCours(data: CreateCoursData): Promise<Cours> {
    return api.post<Cours>('/Cours', data);
  },

  async updateCours(id: number, data: Partial<CreateCoursData>): Promise<void> {
    return api.put(`/Cours/${id}`, data);
  },

  async deleteCours(id: number): Promise<void> {
    return api.delete(`/Cours/${id}`);
  },
};