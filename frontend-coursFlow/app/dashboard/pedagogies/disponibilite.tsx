"use client";

import { useEffect, useState } from "react";
import { edtService } from "../../services/edtService";
import { Disponibilite as DispoType } from "../../types";

interface ProfesseurLite {
  id: number;
  nom: string;
  prenom: string;
}

const JOURS = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];

export default function Disponibilite() {
  const [professeurs, setProfesseurs] = useState<ProfesseurLite[]>([]);
  const [professeurId, setProfesseurId] = useState<number | "">("");
  const [dispos, setDispos] = useState<DispoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [jour, setJour] = useState("LUNDI");
  const [heureDebut, setHeureDebut] = useState("08:00");
  const [heureFin, setHeureFin] = useState("10:00");
  const [type, setType] = useState<"DISPONIBLE" | "INDISPONIBLE">("DISPONIBLE");

  const chargerProfs = async () => {
    setLoading(true);
    setError("");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186/api";
      const res = await fetch(`${API_URL}/Professeur`, {
        headers: { Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}` },
      });
      if (res.ok) {
        const json = await res.json();
        const profs = json.map((p: { id: number; nom: string; prenom: string }) => ({ id: p.id, nom: p.nom, prenom: p.prenom }));
        setProfesseurs(profs);
        if (profs.length > 0) setProfesseurId(profs[0].id);
      }
    } catch {
      setError("Impossible de charger la liste des professeurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerProfs();
  }, []);

  useEffect(() => {
    if (professeurId === "") return;
    edtService
      .getDisponibilitesByProfesseur(Number(professeurId))
      .then(setDispos)
      .catch(() => setError("Impossible de charger les disponibilités."));
  }, [professeurId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (professeurId === "") return;
    setSaving(true);
    try {
      await edtService.createDisponibilite(Number(professeurId), { jour, heureDebut, heureFin, type });
      setShowForm(false);
      const updated = await edtService.getDisponibilitesByProfesseur(Number(professeurId));
      setDispos(updated);
    } catch {
      setError("Erreur lors de la création de la disponibilité.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-purple/20 p-6 border border-muted/20 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-xl font-bold text-pink mb-1">Disponibilités Enseignants</h3>
          <p className="text-sm text-light/60">Contraintes horaires des professeurs.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={professeurs.length === 0}
          className="bg-purple border border-pink text-pink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-pink hover:text-black transition-all disabled:opacity-40"
        >
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {loading ? (
        <p className="text-light/50 text-sm">Chargement...</p>
      ) : professeurs.length === 0 ? (
        <div className="text-sm text-light/60 p-4 bg-black/20 rounded-xl">
          Aucun professeur enregistré. Ajoutez-en un depuis l&apos;onglet Utilisateurs.
        </div>
      ) : (
        <>
          <select
            className="bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white mb-4"
            value={professeurId}
            onChange={(e) => setProfesseurId(Number(e.target.value))}
          >
            {professeurs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.prenom} {p.nom}
              </option>
            ))}
          </select>

          {showForm && (
            <form onSubmit={handleCreate} className="bg-black/20 p-4 rounded-xl mb-4 space-y-3">
              <div className="flex gap-3">
                <select className="bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white" value={jour} onChange={(e) => setJour(e.target.value)}>
                  {JOURS.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <input type="time" className="bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} />
                <input type="time" className="bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} />
                <select className="bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white" value={type} onChange={(e) => setType(e.target.value as "DISPONIBLE" | "INDISPONIBLE")}>
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="INDISPONIBLE">Indisponible</option>
                </select>
              </div>
              <button type="submit" disabled={saving} className="bg-pink text-black text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          )}

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dispos.length === 0 ? (
              <p className="text-light/40 text-sm italic col-span-full">Aucune disponibilité renseignée.</p>
            ) : (
              dispos.map((d) => (
                <div key={d.idDispo} className="bg-black/20 p-3 rounded-xl border border-muted/10 text-sm">
                  <p className="text-white font-semibold">{d.jour}</p>
                  <p className="text-light/60 text-xs">{d.heureDebut} - {d.heureFin}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${d.type === "DISPONIBLE" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {d.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
