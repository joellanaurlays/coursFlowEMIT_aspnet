"use client";

import { useState } from "react";
import Matiere from "./matiere";
import Cours from "./cours";
import Classe from "./classe";
import Filiere from "./filiere";
import Disponibilite from "./disponibilite";

// NOTE: Cette page contenait auparavant des tableaux FILIERES/CLASSES codés
// en dur et un filtre "classeSelectionnee" qui ne correspondait à aucune
// donnée réelle (Matiere et Cours n'ont d'ailleurs aucun lien direct avec
// une Classe côté backend). Le filtre a été retiré : chaque onglet charge
// désormais ses propres données réelles depuis l'API.
export default function PedagogiesPage() {
  const [ongletActif, setOngletActif] = useState<"matieres" | "cours" | "classes" | "filieres" | "dispos">("matieres");

  const onglets: { key: typeof ongletActif; label: string }[] = [
    { key: "matieres", label: "Matières / Modules" },
    { key: "cours", label: "Sessions de Cours" },
    { key: "classes", label: "Classes" },
    { key: "filieres", label: "Filières" },
    { key: "dispos", label: "Contraintes Profs" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 border-b border-muted/20 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Espace Pédagogique</h2>
          <p className="text-light/50 text-sm mt-1">Gestion des filières, classes, matières et sessions de cours.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-purple/40 p-1.5 rounded-xl border border-muted/20 w-max">
        {onglets.map((o) => (
          <button
            key={o.key}
            onClick={() => setOngletActif(o.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              ongletActif === o.key ? "bg-pink text-black font-semibold shadow" : "text-light/80 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {ongletActif === "matieres" && <Matiere />}
        {ongletActif === "cours" && <Cours />}
        {ongletActif === "classes" && <Classe />}
        {ongletActif === "filieres" && <Filiere />}
        {ongletActif === "dispos" && <Disponibilite />}
      </div>
    </div>
  );
}
