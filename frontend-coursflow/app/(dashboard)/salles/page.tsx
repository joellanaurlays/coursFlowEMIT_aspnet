"use client";

import { useState } from "react";
import AjouterSalleModal from "./ajout";

// Simulation de l'enum C# TypeSalle
const FAUSSES_SALLES = [
  { id: 1, nom: "Amphi A", batiment: "Bloc Principal", capacite: 150, type: "Amphithéâtre", estDisponible: true },
  { id: 2, nom: "Salle 102", batiment: "Bâtiment B", capacite: 40, type: "TD / Classique", estDisponible: true },
  { id: 3, nom: "Labo Info 1", batiment: "Extension L3", capacite: 25, type: "TP Machine", estDisponible: true },
  { id: 4, nom: "Salle C4", batiment: "Bâtiment B", capacite: 30, type: "TD / Classique", estDisponible: false },
];

export default function SallesPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrage des salles en temps réel
  const sallesFiltrées = FAUSSES_SALLES.filter(salle => {
    const matchRecherche = salle.nom.toLowerCase().includes(recherche.toLowerCase()) || 
                           (salle.batiment?.toLowerCase().includes(recherche.toLowerCase()) ?? false);
    const matchType = filtreType === "Tous" || salle.type === filtreType;
    return matchRecherche && matchType;
  });

  return (
    <div className="space-y-6">
      {/* --- EN-TÊTE --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 border-b border-muted/20 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestion des Salles</h2>
          <p className="text-light/50 text-sm mt-1">Infrastructures, capacités d'accueil et états de disponibilité</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink text-black font-bold px-5 py-2.5 rounded-xl hover:bg-white transition-all shadow-lg text-sm flex items-center gap-2"
        >
           Nouvelle Salle
        </button>
      </div>

      {/* --- BARRE DE RECHERCHE ET FILTRES --- */}
      <div className="bg-purple/30 border border-muted/20 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher une salle, un bâtiment..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="bg-purple border border-muted/30 text-white rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-pink w-full md:w-64"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-pink font-medium">Type :</span>
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="bg-purple border border-muted/30 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink"
            >
              <option value="Tous">Tous les types</option>
              <option value="Amphithéâtre">Amphithéâtre</option>
              <option value="TD / Classique">TD / Classique</option>
              <option value="TP Machine">TP Machine</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-light/50 font-mono">
          {sallesFiltrées.length} salle(s) trouvée(s)
        </div>
      </div>

      {/* --- CATALOGUE DES SALLES --- */}
      <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
              <th className="p-4">Nom de la Salle</th>
              <th className="p-4">Bâtiment / Emplacement</th>
              <th className="p-4">Capacité d'accueil</th>
              <th className="p-4">Type de Salle</th>
              <th className="p-4">Statut Opérationnel</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
            {sallesFiltrées.length > 0 ? (
              sallesFiltrées.map((salle) => (
                <tr key={salle.id} className="hover:bg-black/10 transition-colors">
                  <td className="p-4 font-bold text-white text-base">{salle.nom}</td>
                  <td className="p-4 text-light/70">{salle.batiment || "Non spécifié"}</td>
                  <td className="p-4 font-mono font-medium text-white">
                    👤 {salle.capacite} places
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-purple/60 border border-muted/30 text-white">
                      {salle.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      salle.estDisponible ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${salle.estDisponible ? "bg-green-400" : "bg-red-400"}`} />
                      {salle.estDisponible ? "Opérationnelle" : "Maintenance / Bloquée"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button className="text-light/50 hover:text-white transition-colors">Éditer</button>
                    <button className="text-red-400 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-light/40 italic">
                  Aucune salle ne correspond à vos critères de recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FORMULAIRE MODAL D'AJOUT --- */}
      <AjouterSalleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}