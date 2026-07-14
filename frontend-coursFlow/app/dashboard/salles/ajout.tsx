"use client";

import { useState } from "react";
import { salleService } from "../../services/salleService";

interface AjouterSalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AjouterSalleModal({ isOpen, onClose, onCreated }: AjouterSalleModalProps) {
  const [nom, setNom] = useState("");
  const [batiment, setBatiment] = useState("");
  const [capacite, setCapacite] = useState(30);
  const [type, setType] = useState("SALLE_DE_CLASSE");
  const [estDisponible, setEstDisponible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!nom.trim() || capacite <= 0) {
      setError("Le nom et une capacité valide sont requis.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await salleService.create({ nom, batiment: batiment || undefined, capacite, type, estDisponible });
      setNom("");
      setBatiment("");
      setCapacite(30);
      setType("SALLE_DE_CLASSE");
      setEstDisponible(true);
      onCreated();
      onClose();
    } catch {
      setError("Erreur lors de la création de la salle.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-purple/90 border border-muted/30 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6 relative text-white">
        <div>
          <h3 className="text-xl font-bold text-pink">Ajouter une nouvelle salle</h3>
          <p className="text-xs text-light/50 mt-1">Déclarez une infrastructure disponible pour les algorithmes de placement.</p>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-2">{error}</p>}

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-light/80 font-medium">Nom de la salle <span className="text-pink">*</span></label>
            <input
              type="text"
              maxLength={100}
              placeholder="Ex: Salle 204, Amphi B..."
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="bg-purple border border-muted/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-light/80 font-medium">Bâtiment / Emplacement</label>
            <input
              type="text"
              maxLength={100}
              placeholder="Ex: Bâtiment Central, Bloc de Droite..."
              value={batiment}
              onChange={(e) => setBatiment(e.target.value)}
              className="bg-purple border border-muted/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-light/80 font-medium">Capacité (Places) <span className="text-pink">*</span></label>
              <input
                type="number"
                min={1}
                placeholder="Ex: 30"
                value={capacite}
                onChange={(e) => setCapacite(Number(e.target.value))}
                className="bg-purple border border-muted/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-light/80 font-medium">Type de Salle <span className="text-pink">*</span></label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-purple border border-muted/30 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink"
              >
                <option value="SALLE_DE_CLASSE">TD / Classique</option>
                <option value="AMPHITHEATRE">Amphithéâtre</option>
                <option value="SALLE_INFO">Salle Info</option>
                <option value="SALLE_TP">TP Machine</option>
                <option value="LABORATOIRE">Laboratoire</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="estDisponible"
              checked={estDisponible}
              onChange={(e) => setEstDisponible(e.target.checked)}
              className="w-4 h-4 rounded border-muted/30 bg-purple text-pink focus:ring-0 focus:ring-offset-0 accent-pink"
            />
            <label htmlFor="estDisponible" className="text-sm text-light/90 font-medium cursor-pointer">
              Rendre cette salle immédiatement opérationnelle
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-light/60 hover:text-white transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-pink text-black font-semibold px-5 py-2 rounded-xl text-sm hover:bg-white transition-colors shadow-lg disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer la salle"}
          </button>
        </div>
      </div>
    </div>
  );
}
