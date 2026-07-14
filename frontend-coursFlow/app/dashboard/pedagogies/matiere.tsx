"use client";

import { useEffect, useState } from "react";
import { matiereService } from "../../services/matiereService";
import { Matiere as MatiereType } from "../../types";

export default function Matiere() {
  const [matieres, setMatieres] = useState<MatiereType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [nom, setNom] = useState("");
  const [credits, setCredits] = useState(3);
  const [volumeHoraireGlobal, setVolumeHoraireGlobal] = useState(30);
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await matiereService.getAll();
      setMatieres(data);
    } catch {
      setError("Impossible de charger les matières. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !nom.trim()) return;
    setSaving(true);
    try {
      await matiereService.create({ code, nom, credits, volumeHoraireGlobal });
      setCode("");
      setNom("");
      setCredits(3);
      setVolumeHoraireGlobal(30);
      setShowForm(false);
      await charger();
    } catch {
      setError("Erreur lors de la création de la matière (le code existe peut-être déjà).");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Catalogue des Matières</h3>
          <p className="text-xs text-light/50 mt-0.5">{matieres.length} matière(s) enregistrée(s)</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-purple border border-pink text-pink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-pink hover:text-black transition-all"
        >
          {showForm ? "Annuler" : "+ Ajouter une matière"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-purple/20 border border-muted/20 rounded-2xl p-4 space-y-3">
          <div className="flex gap-3">
            <input
              className="w-1/3 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Code (ex: INF301)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Intitulé de la matière"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              min={1}
              className="w-1/2 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Crédits ECTS"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
            />
            <input
              type="number"
              min={1}
              className="w-1/2 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Volume horaire (h)"
              value={volumeHoraireGlobal}
              onChange={(e) => setVolumeHoraireGlobal(Number(e.target.value))}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-pink text-black text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
              <th className="p-4">Code</th>
              <th className="p-4">Intitulé de la Matière</th>
              <th className="p-4">Crédits (UE)</th>
              <th className="p-4">Volume Horaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-light/40 italic">
                  Chargement...
                </td>
              </tr>
            ) : matieres.length > 0 ? (
              matieres.map((mat) => (
                <tr key={mat.idMatiere} className="hover:bg-black/10 transition-colors">
                  <td className="p-4 font-mono text-pink font-medium">{mat.code}</td>
                  <td className="p-4 font-semibold text-white">{mat.nom}</td>
                  <td className="p-4">{mat.credits} ECTS</td>
                  <td className="p-4">{mat.volumeHoraireGlobal}h</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-light/40 italic">
                  Aucune matière enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
