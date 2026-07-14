/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UtilisateurProps {
  filtreRecherche: string;
  refreshTrigger?: number;
}

interface ProfesseurData {
  idProf: number;
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  grade: string;
  specialite: string;
  isActive: boolean;
}

export default function Professeur({ filtreRecherche, refreshTrigger = 0 }: UtilisateurProps) {
  const [professeurs, setProfesseurs] = useState<ProfesseurData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186/api";

  const fetchProfesseurs = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/Professeur`, {
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
        throw new Error("Erreur lors du chargement des professeurs");
      }

      const data = await response.json();
      setProfesseurs(data);
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
    fetchProfesseurs();
  }, [refreshTrigger]);

  // Filtrage par nom ou spécialité
  const professeursFiltrés = professeurs.filter((prof) =>
    prof.utilisateur.nom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    prof.utilisateur.prenom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    prof.specialite.toLowerCase().includes(filtreRecherche.toLowerCase())
  );

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
        <button onClick={fetchProfesseurs} className="mt-4 text-pink hover:underline">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
            <th className="p-4">Nom de l'Enseignant</th>
            <th className="p-4">Statut</th>
            <th className="p-4">Spécialité Principale</th>
            <th className="p-4">Contact Email</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
          {professeursFiltrés.length > 0 ? (
            professeursFiltrés.map((prof) => (
              <tr key={prof.idProf} className="hover:bg-black/10 transition-colors">
                <td className="p-4 font-semibold text-white">
                  {prof.utilisateur.prenom} {prof.utilisateur.nom}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    prof.grade === "Permanent" || prof.grade?.includes("Permanent")
                      ? "bg-purple text-pink border border-pink/30" 
                      : "bg-purple/40 text-light/70 border border-muted/20"
                  }`}>
                    {prof.grade || "Vacataire"}
                  </span>
                </td>
                <td className="p-4 text-light/90">{prof.specialite}</td>
                <td className="p-4 font-mono text-xs text-light/50">{prof.utilisateur.email}</td>
                <td className="p-4 text-right space-x-3">
                  <button 
                    onClick={() => router.push(`/utilisateurs/professeur/${prof.idProf}/disponibilites`)}
                    className="text-light/50 hover:text-white transition-colors"
                  >
                    Dispos
                  </button>
                  <button 
                    onClick={() => router.push(`/utilisateurs/professeur/${prof.idProf}/editer`)}
                    className="text-light/50 hover:text-white transition-colors"
                  >
                    Éditer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-8 text-center text-light/40 italic">
                Aucun enseignant trouvé pour cette recherche.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}