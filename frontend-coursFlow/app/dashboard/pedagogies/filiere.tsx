"use client";

import { useEffect, useState } from "react";
import { edtService } from "../../services/edtService";
import { Filiere as FiliereType } from "../../types";

export default function Filiere() {
  const [filieres, setFilieres] = useState<FiliereType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await edtService.getFilieres();
      setFilieres(data);
    } catch {
      setError("Impossible de charger les filières. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    setSaving(true);
    try {
      await edtService.createFiliere({ nom, description });
      setNom("");
      setDescription("");
      setShowForm(false);
      await charger();
    } catch {
      setError("Erreur lors de la création de la filière.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-purple/20 p-6 border border-muted/20 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-xl font-bold text-pink mb-1">Ressources Filières</h3>
          <p className="text-sm text-light/60">Configuration des mentions de l&apos;établissement.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-purple border border-pink text-pink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-pink hover:text-black transition-all"
        >
          {showForm ? "Annuler" : "+ Ajouter une filière"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-black/20 p-4 rounded-xl mb-4 space-y-3">
          <input
            className="w-full bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
            placeholder="Nom de la filière (ex: Génie Logiciel)"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <textarea
            className="w-full bg-black/30 border border-muted/20 rounded-lg p-2 text-sm text-white"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
      ) : filieres.length === 0 ? (
        <div className="text-sm text-light/60 p-4 bg-black/20 rounded-xl">
          Aucune filière enregistrée pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filieres.map((f) => (
            <div key={f.idFiliere} className="bg-black/20 p-4 rounded-xl border border-muted/10">
              <p className="text-white font-semibold">{f.nom}</p>
              <p className="text-light/50 text-xs mt-1">{f.description || "Aucune description"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
