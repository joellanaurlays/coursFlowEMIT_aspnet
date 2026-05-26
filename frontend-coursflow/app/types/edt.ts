export interface EmploiDuTemps {
  idEmploi: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  dateDebut: string;
  dateFin: string;
  coursId: number;
  classeId: number;
  cours?: CoursInfo;
  classe?: ClasseInfo;
}

export interface CoursInfo {
  idCours: number;
  matiereNom: string;
  matiereCode: string;
  professeurNom: string;
  typeCours: string;
  salleNom?: string;
  duree: number;
}

export interface ClasseInfo {
  idClasse: number;
  nom: string;
  niveau: string;
  groupe: string;
  filiereNom: string;
}

export interface Disponibilite {
  idDispo: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  type: 'DISPONIBLE' | 'INDISPONIBLE';
  professeurId: number;
  professeurNom: string;
}

export interface CreateEmploiDuTempsRequest {
  jour: string;
  heureDebut: string;
  heureFin: string;
  dateDebut: string;
  dateFin: string;
  coursId: number;
  classeId: number;
}