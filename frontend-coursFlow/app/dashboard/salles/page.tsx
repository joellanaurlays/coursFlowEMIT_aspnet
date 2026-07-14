"use client";

import { useEffect, useState } from "react";
import AjouterSalleModal from "./ajout";
import { salleService } from "../../services/salleService";
import { Salle } from "../../types";

const TYPE_LABELS: Record<string, string> = {
  AMPHITHEATRE: "Amphithéâtre",
  SALLE_DE_CLASSE: "TD / Classique",
  LABORATOIRE: "Laboratoire",
  SALLE_INFO: "Salle Info",
  SALLE_TP: "TP Machine",
};

export default function SallesPage() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const charger = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await salleService.getAll();
      setSalles(data);
    } catch {
      setError("Impossible de charger les salles. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const sallesFiltrees = salles.filter((salle) => {
    const matchRecherche =
      salle.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      (salle.batiment?.toLowerCase().includes(recherche.toLowerCase()) ?? false);
    const matchType = filtreType === "Tous" || salle.type === filtreType;
    return matchRecherche && matchType;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette salle ?")) return;
    try {
      await salleService.delete(id);
      await charger();
    } catch {
      setError("Erreur lors de la suppression (la salle est peut-être utilisée par un cours).");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 border-b border-muted/20 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestion des Salles</h2>
          <p className="text-light/50 text-sm mt-1">Infrastructures, capacités d&apos;accueil et états de disponibilité</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink text-black font-bold px-5 py-2.5 rounded-xl hover:bg-white transition-all shadow-lg text-sm flex items-center gap-2"
        >
          Nouvelle Salle
        </button>
      </div>

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
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-light/50 font-mono">
          {sallesFiltrees.length} salle(s) trouvée(s)
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
              <th className="p-4">Nom de la Salle</th>
              <th className="p-4">Bâtiment / Emplacement</th>
              <th className="p-4">Capacité d&apos;accueil</th>
              <th className="p-4">Type de Salle</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-light/40 italic">Chargement...</td>
              </tr>
            ) : sallesFiltrees.length > 0 ? (
              sallesFiltrees.map((salle) => (
                <tr key={salle.idSalle} className="hover:bg-black/10 transition-colors">
                  <td className="p-4 font-bold text-white text-base">{salle.nom}</td>
                  <td className="p-4 text-light/70">{salle.batiment || "Non spécifié"}</td>
                  <td className="p-4 font-mono font-medium text-white">{salle.capacite} places</td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-purple/60 border border-muted/30 text-white">
                      {TYPE_LABELS[salle.type] || salle.type}
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
                    <button onClick={() => handleDelete(salle.idSalle)} className="text-red-400 hover:underline">Supprimer</button>
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

      <AjouterSalleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={charger}
      />
    </div>
  );
}
