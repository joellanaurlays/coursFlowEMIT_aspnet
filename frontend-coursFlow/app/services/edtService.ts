import { api } from './api';
import { 
  EmploiDuTemps, 
  CreateEmploiDuTempsRequest, 
  Disponibilite, 
  Classe, 
  Filiere 
} from '../types';

interface CreateClasseData {
  nom: string;
  niveau: string;
  groupe?: string;
  idFiliere: number;
}

interface CreateFiliereData {
  nom: string;
  description?: string;
}

interface CreateDisponibiliteData {
  jour: string;
  heureDebut: string;
  heureFin: string;
  type: string;
}

export const edtService = {
  // Emploi du temps
  async getByClasse(classeId: number, semaine?: string): Promise<EmploiDuTemps[]> {
    return api.get<EmploiDuTemps[]>(`/EmploiDuTemps/classe/${classeId}`, { semaine });
  },

  async getByProfesseur(professeurId: number, semaine?: string): Promise<EmploiDuTemps[]> {
    return api.get<EmploiDuTemps[]>(`/EmploiDuTemps/professeur/${professeurId}`, { semaine });
  },

  async getBySalle(salleId: number, semaine?: string): Promise<EmploiDuTemps[]> {
    return api.get<EmploiDuTemps[]>(`/EmploiDuTemps/salle/${salleId}`, { semaine });
  },

  async create(data: CreateEmploiDuTempsRequest): Promise<EmploiDuTemps> {
    return api.post<EmploiDuTemps>('/EmploiDuTemps', data);
  },

  async update(id: number, data: CreateEmploiDuTempsRequest): Promise<void> {
    return api.put(`/EmploiDuTemps/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/EmploiDuTemps/${id}`);
  },

  async verifierConflit(data: CreateEmploiDuTempsRequest): Promise<boolean> {
    // Convertir l'objet en Record<string, string | number | boolean | undefined>
    const params: Record<string, string | number | boolean | undefined> = {
        jour: data.jour,
        heureDebut: data.heureDebut,
        heureFin: data.heureFin,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
        coursId: data.coursId,
        classeId: data.classeId,
    };
    const result = await api.get<{ hasConflict: boolean }>('/EmploiDuTemps/verifier-conflit', params);
    return result.hasConflict;
    },

  async exporterPDF(classeId: number, periode: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/EmploiDuTemps/exporter/${classeId}?periode=${periode}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.blob();
  },

  // Classes
  async getClasses(): Promise<Classe[]> {
    return api.get<Classe[]>('/Classe');
  },

  async getClasseById(id: number): Promise<Classe> {
    return api.get<Classe>(`/Classe/${id}`);
  },

  async createClasse(data: CreateClasseData): Promise<Classe> {
    return api.post<Classe>('/Classe', data);
  },

  async updateClasse(id: number, data: Partial<CreateClasseData>): Promise<void> {
    return api.put(`/Classe/${id}`, data);
  },

  async deleteClasse(id: number): Promise<void> {
    return api.delete(`/Classe/${id}`);
  },

  // Filières
  async getFilieres(): Promise<Filiere[]> {
    return api.get<Filiere[]>('/Filiere');
  },

  async getFiliereById(id: number): Promise<Filiere> {
    return api.get<Filiere>(`/Filiere/${id}`);
  },

  async createFiliere(data: CreateFiliereData): Promise<Filiere> {
    return api.post<Filiere>('/Filiere', data);
  },

  async updateFiliere(id: number, data: Partial<CreateFiliereData>): Promise<void> {
    return api.put(`/Filiere/${id}`, data);
  },

  async deleteFiliere(id: number): Promise<void> {
    return api.delete(`/Filiere/${id}`);
  },

  // Disponibilités
  async getDisponibilitesByProfesseur(professeurId: number): Promise<Disponibilite[]> {
    return api.get<Disponibilite[]>(`/Disponibilite/professeur/${professeurId}`);
  },

  async createDisponibilite(professeurId: number, data: CreateDisponibiliteData): Promise<void> {
    return api.post(`/Disponibilite?profId=${professeurId}`, data);
  },

  async deleteDisponibilite(id: number): Promise<void> {
    return api.delete(`/Disponibilite/${id}`);
  },
};