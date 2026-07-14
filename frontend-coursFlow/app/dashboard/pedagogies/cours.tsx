"use client";

import { useEffect, useState } from "react";
import { matiereService } from "../../services/matiereService";
import { Cours as CoursType, Matiere as MatiereType } from "../../types";

interface ProfesseurLite {
  id: number; // correspond à Professeur.IdProf côté backend
  nom: string;
  prenom: string;
}

export default function Cours() {
  const [cours, setCours] = useState<CoursType[]>([]);
  const [matieres, setMatieres] = useState<MatiereType[]>([]);
  const [professeurs, setProfesseurs] = useState<ProfesseurLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [matiereId, setMatiereId] = useState<number | "">("");
  const [professeurId, setProfesseurId] = useState<number | "">("");
  const [typeCours, setTypeCours] = useState<"CM" | "TD" | "TP">("CM");
  const [anneeUniversitaire, setAnneeUniversitaire] = useState("2025-2026");
  const [semestre, setSemestre] = useState("S1");
  const [duree, setDuree] = useState(90);
  const [volumeHoraire, setVolumeHoraire] = useState(30);

  const charger = async () => {
    setLoading(true);
    setError("");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186/api";
      const [coursData, matieresData, profsRes] = await Promise.all([
        matiereService.getCours(),
        matiereService.getAll(),
        fetch(`${API_URL}/Professeur`, {
          headers: { Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}` },
        }),
      ]);
      setCours(coursData);
      setMatieres(matieresData);
      if (profsRes.ok) {
        const profsJson = await profsRes.json();
        setProfesseurs(profsJson.map((p: { id: number; nom: string; prenom: string }) => ({ id: p.id, nom: p.nom, prenom: p.prenom })));
      }
    } catch {
      setError("Impossible de charger les cours. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (matiereId === "" || professeurId === "") return;
    setSaving(true);
    try {
      await matiereService.createCours({
        anneeUniversitaire,
        semestre,
        typeCours,
        duree,
        volumeHoraire,
        matiereId: Number(matiereId),
        professeurId: Number(professeurId),
      });
      setShowForm(false);
      await charger();
    } catch {
      setError("Erreur lors de la création du cours.");
    } finally {
      setSaving(false);
    }
  };

  const peutCreer = matieres.length > 0 && professeurs.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Sessions de Cours</h3>
          <p className="text-xs text-light/50 mt-0.5">{cours.length} session(s) de cours enregistrée(s)</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={!peutCreer}
          className="bg-purple border border-pink text-pink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-pink hover:text-black transition-all disabled:opacity-40"
        >
          {showForm ? "Annuler" : "+ Assigner un cours"}
        </button>
      </div>

      {!peutCreer && !loading && (
        <p className="text-xs text-yellow-400">
          Il faut au moins une matière (onglet Matières) et un professeur (onglet Utilisateurs) pour créer un cours.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-purple/20 border border-muted/20 rounded-2xl p-4 space-y-3">
          <div className="flex gap-3">
            <select
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              value={matiereId}
              onChange={(e) => setMatiereId(Number(e.target.value))}
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map((m) => (
                <option key={m.idMatiere} value={m.idMatiere}>
                  {m.code} - {m.nom}
                </option>
              ))}
            </select>
            <select
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              value={professeurId}
              onChange={(e) => setProfesseurId(Number(e.target.value))}
            >
              <option value="">Sélectionner un professeur</option>
              {professeurs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.prenom} {p.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <select
              className="bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              value={typeCours}
              onChange={(e) => setTypeCours(e.target.value as "CM" | "TD" | "TP")}
            >
              <option value="CM">CM</option>
              <option value="TD">TD</option>
              <option value="TP">TP</option>
            </select>
            <input
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Année universitaire"
              value={anneeUniversitaire}
              onChange={(e) => setAnneeUniversitaire(e.target.value)}
            />
            <input
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Semestre"
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Durée d'une séance (min)"
              value={duree}
              onChange={(e) => setDuree(Number(e.target.value))}
            />
            <input
              type="number"
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Volume horaire total (h)"
              value={volumeHoraire}
              onChange={(e) => setVolumeHoraire(Number(e.target.value))}
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
              <th className="p-4">Matière</th>
              <th className="p-4">Enseignant</th>
              <th className="p-4">Format</th>
              <th className="p-4">Salle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-light/40 italic">
                  Chargement...
                </td>
              </tr>
            ) : cours.length > 0 ? (
              cours.map((c) => (
                <tr key={c.idCours} className="hover:bg-black/10 transition-colors">
                  <td className="p-4 font-semibold text-white">{c.matiereNom}</td>
                  <td className="p-4 text-light">{c.professeurNom}</td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-pink px-2 py-0.5 rounded bg-pink/10 border border-pink/20">
                      {c.typeCours}
                    </span>
                  </td>
                  <td className="p-4">{c.salleNom || "Non assignée"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-light/40 italic">
                  Aucun cours créé pour le moment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
