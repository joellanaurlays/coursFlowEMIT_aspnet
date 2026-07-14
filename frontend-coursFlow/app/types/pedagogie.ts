export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: 'ADMIN' | 'RESPONSABLE' | 'PROFESSEUR' | 'ETUDIANT';
  isActive: boolean;
}

export interface Matiere {
  idMatiere: number;
  code: string;
  nom: string;
  description?: string;
  credits: number;
  volumeHoraireGlobal: number;
  preRequisIds?: number[];
  preRequis?: Matiere[];
}

export interface Classe {
  idClasse: number;
  nom: string;
  niveau: string;
  groupe: string;
  idFiliere: number;
  nomFiliere?: string;
  filiere?: Filiere;
}

export interface Filiere {
  idFiliere: number;
  nom: string;
  description: string;
  classes?: Classe[];
}

export interface Cours {
  idCours: number;
  anneeUniversitaire: string;
  semestre: string;
  typeCours: 'CM' | 'TD' | 'TP';
  duree: number;
  volumeHoraire: number;
  matiereNom: string;
  professeurNom: string;
  salleNom?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export interface CreateUtilisateurRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  role: string;
}

export interface UpdateUtilisateurRequest {
  nom?: string;
  prenom?: string;
  telephone?: string;
  isActive?: boolean;
}