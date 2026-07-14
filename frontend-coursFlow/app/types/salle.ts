export interface Salle {
  idSalle: number;
  nom: string;
  batiment?: string;
  capacite: number;
  type: 'AMPHITHEATRE' | 'SALLE_DE_CLASSE' | 'LABORATOIRE' | 'SALLE_INFO' | 'SALLE_TP';
  estDisponible: boolean;
}

export interface DisponibiliteSalle {
  idDispoSalle: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  type: 'DISPONIBLE' | 'INDISPONIBLE';
  dateDebut: string;
  dateFin: string;
  salleId: number;
  salle?: Salle;
}