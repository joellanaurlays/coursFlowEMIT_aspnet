/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UtilisateurProps {
  filtreRecherche: string;
  refreshTrigger?: number;
}

interface EtudiantData {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  filiere?: string;
  classe?: string;
  niveau?: string;
  groupe?: string;
  isActive: boolean;
}

export default function Etudiant({ filtreRecherche, refreshTrigger = 0 }: UtilisateurProps) {
  const [etudiants, setEtudiants] = useState<EtudiantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186/api";

  const fetchEtudiants = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/Etudiant`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Erreur lors du chargement des étudiants");
      }

      const data = await response.json();
      setEtudiants(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEtudiants();
  }, [refreshTrigger]);

  // Filtrage en temps réel selon la recherche (Nom ou Matricule)
  const etudiantsFiltrés = etudiants.filter((etudiant) =>
    etudiant.nom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    etudiant.prenom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    etudiant.matricule.toLowerCase().includes(filtreRecherche.toLowerCase())
  );

  const handleDesinscrire = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir désinscrire cet étudiant ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/Etudiant/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");
      
      alert("Étudiant désinscrit avec succès");
      fetchEtudiants();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-purple/20 border border-muted/20 rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink mx-auto"></div>
        <p className="text-light/50 mt-2">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-purple/20 border border-muted/20 rounded-2xl p-8 text-center">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={fetchEtudiants}
          className="mt-4 text-pink hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
            <th className="p-4">Matricule</th>
            <th className="p-4">Nom & Prénoms</th>
            <th className="p-4">Mentions / Filière</th>
            <th className="p-4">Classe & Groupe</th>
            <th className="p-4">Statut</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
          {etudiantsFiltrés.length > 0 ? (
            etudiantsFiltrés.map((etudiant) => (
              <tr key={etudiant.id} className="hover:bg-black/10 transition-colors">
                <td className="p-4 font-mono text-pink font-medium">{etudiant.matricule}</td>
                <td className="p-4 font-semibold text-white">{etudiant.prenom} {etudiant.nom}</td>
                <td className="p-4 text-light/70">{etudiant.filiere || "-"}</td>
                <td className="p-4">
                  <span className="bg-purple/60 px-2 py-1 rounded-lg text-xs text-white border border-muted/20">
                    {etudiant.classe || `${etudiant.niveau || ""} ${etudiant.groupe || ""}`}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    etudiant.isActive 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {etudiant.isActive ? "Inscrit" : "En attente"}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button 
                    onClick={() => router.push(`/utilisateurs/etudiant/${etudiant.id}`)}
                    className="text-light/50 hover:text-white transition-colors"
                  >
                    Dossier
                  </button>
                  <button 
                    onClick={() => handleDesinscrire(etudiant.id)}
                    className="text-red-400 hover:underline"
                  >
                    Désinscrire
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center text-light/40 italic">
                Aucun étudiant ne correspond à vos critères.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}