/* eslint-disable react/no-unescaped-entities */
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

interface ResponsableData {
  idResp: number;
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  role?: string;
}

export default function Responsable({ filtreRecherche, refreshTrigger = 0 }: UtilisateurProps) {
  const [responsables, setResponsables] = useState<ResponsableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchResponsables = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/Utilisateur/role/RESPONSABLE`, {
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
        throw new Error("Erreur lors du chargement des responsables");
      }

      const data = await response.json();
      setResponsables(data);
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
    fetchResponsables();
  }, [refreshTrigger]);

  const responsablesFiltrés = responsables.filter((resp) =>
    resp.utilisateur.nom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    resp.utilisateur.prenom.toLowerCase().includes(filtreRecherche.toLowerCase())
  );

  const handleRevoquer = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir révoquer cet utilisateur ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/Utilisateur/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la révocation");
      
      alert("Utilisateur révoqué avec succès");
      fetchResponsables();
    } catch (err) {
      alert("Erreur lors de la révocation");
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
        <button onClick={fetchResponsables} className="mt-4 text-pink hover:underline">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
            <th className="p-4">Nom de l'Administrateur</th>
            <th className="p-4">Rôle / Fonction</th>
            <th className="p-4">Niveau d'Accès</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
          {responsablesFiltrés.length > 0 ? (
            responsablesFiltrés.map((resp) => (
              <tr key={resp.idResp} className="hover:bg-black/10 transition-colors">
                <td className="p-4 font-semibold text-white">
                  {resp.utilisateur.prenom} {resp.utilisateur.nom}
                </td>
                <td className="p-4 text-light/80">Responsable Pédagogique</td>
                <td className="p-4">
                  <span className="text-xs font-medium text-pink px-2 py-0.5 rounded bg-pink/10 border border-pink/20">
                    Accès restreint
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button className="text-light/50 hover:text-white transition-colors">Droits</button>
                  <button 
                    onClick={() => handleRevoquer(resp.utilisateur.id)}
                    className="text-red-400 hover:underline"
                  >
                    Révoquer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-8 text-center text-light/40 italic">
                Aucun responsable ne correspond.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}