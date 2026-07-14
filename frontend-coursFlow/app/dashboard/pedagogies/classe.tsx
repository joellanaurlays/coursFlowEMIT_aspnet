"use client";

import { useEffect, useState } from "react";
import { edtService } from "../../services/edtService";
import { Classe as ClasseType, Filiere as FiliereType } from "../../types";

export default function Classe() {
  const [classes, setClasses] = useState<ClasseType[]>([]);
  const [filieres, setFilieres] = useState<FiliereType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [groupe, setGroupe] = useState("");
  const [idFiliere, setIdFiliere] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    setLoading(true);
    setError("");
    try {
      const [c, f] = await Promise.all([edtService.getClasses(), edtService.getFilieres()]);
      setClasses(c);
      setFilieres(f);
      if (f.length > 0 && idFiliere === "") setIdFiliere(f[0].idFiliere);
    } catch {
      setError("Impossible de charger les classes. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !niveau.trim() || idFiliere === "") return;
    setSaving(true);
    try {
      await edtService.createClasse({ nom, niveau, groupe, idFiliere: Number(idFiliere) });
      setNom("");
      setNiveau("");
      setGroupe("");
      setShowForm(false);
      await charger();
    } catch {
      setError("Erreur lors de la création de la classe.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-purple/20 p-6 border border-muted/20 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-xl font-bold text-pink mb-1">Ressources Classes</h3>
          <p className="text-sm text-light/60">Ajout et liaison des groupes d&apos;étudiants.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={filieres.length === 0}
          className="bg-purple border border-pink text-pink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-pink hover:text-black transition-all disabled:opacity-40"
        >
          {showForm ? "Annuler" : "+ Ajouter une classe"}
        </button>
      </div>

      {filieres.length === 0 && !loading && (
        <p className="text-xs text-yellow-400 mb-3">
          Créez d&apos;abord une filière (onglet Filières) avant de pouvoir ajouter une classe.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-black/20 p-4 rounded-xl mb-4 space-y-3">
          <input
            className="w-full bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
            placeholder="Nom de la classe (ex: L3 Info G1)"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <div className="flex gap-3">
            <input
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Niveau (ex: L3)"
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              required
            />
            <input
              className="flex-1 bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
              placeholder="Groupe (ex: G1)"
              value={groupe}
              onChange={(e) => setGroupe(e.target.value)}
            />
          </div>
          <select
            className="w-full bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
            value={idFiliere}
            onChange={(e) => setIdFiliere(Number(e.target.value))}
          >
            {filieres.map((f) => (
              <option key={f.idFiliere} value={f.idFiliere}>
                {f.nom}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="bg-pink text-black text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      )}

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {loading ? (
        <p className="text-light/50 text-sm">Chargement...</p>
      ) : classes.length === 0 ? (
        <div className="text-sm text-light/60 p-4 bg-black/20 rounded-xl">
          Aucune classe enregistrée pour le moment.
        </div>
      ) : (
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="text-white font-semibold border-b border-muted/30">
              <th className="p-3">Nom</th>
              <th className="p-3">Niveau</th>
              <th className="p-3">Groupe</th>
              <th className="p-3">Filière</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-light/80">
            {classes.map((c) => (
              <tr key={c.idClasse}>
                <td className="p-3 font-semibold text-white">{c.nom}</td>
                <td className="p-3">{c.niveau}</td>
                <td className="p-3">{c.groupe}</td>
                <td className="p-3">{c.nomFiliere || c.filiere?.nom || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
