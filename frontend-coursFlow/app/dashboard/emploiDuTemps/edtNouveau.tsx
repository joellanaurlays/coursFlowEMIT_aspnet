"use client";

import { useEffect, useState } from "react";
import { edtService } from "../../services/edtService";
import { matiereService } from "../../services/matiereService";
import { Classe, Cours } from "../../types";

const JOURS = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];

interface EdtNouveauProps {
  classes: Classe[];
  classeParDefaut?: number;
  onCree: () => void;
  onAnnuler: () => void;
}

// Ce composant était un fichier totalement vide dans le projet d'origine :
// il était référencé nulle part et il était donc impossible de créer un
// créneau d'emploi du temps depuis l'interface.
export default function EdtNouveau({ classes, classeParDefaut, onCree, onAnnuler }: EdtNouveauProps) {
  const [coursDisponibles, setCoursDisponibles] = useState<Cours[]>([]);
  const [classeId, setClasseId] = useState<number | "">(classeParDefaut ?? "");
  const [coursId, setCoursId] = useState<number | "">("");
  const [jour, setJour] = useState("LUNDI");
  const [heureDebut, setHeureDebut] = useState("08:00");
  const [heureFin, setHeureFin] = useState("10:00");
  const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
  const [dateFin, setDateFin] = useState(() => {
    const dans4Mois = new Date();
    dans4Mois.setMonth(dans4Mois.getMonth() + 4);
    return dans4Mois.toISOString().slice(0, 10);
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    matiereService.getCours().then(setCoursDisponibles).catch(() => setError("Impossible de charger la liste des cours."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (classeId === "" || coursId === "") {
      setError("Veuillez sélectionner une classe et un cours.");
      return;
    }
    setSaving(true);
    try {
      await edtService.create({
        jour,
        heureDebut,
        heureFin,
        dateDebut,
        dateFin,
        coursId: Number(coursId),
        classeId: Number(classeId),
      });
      onCree();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Erreur lors de la création du créneau (vérifiez qu'il n'y a pas de conflit d'horaire).");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-purple/20 border border-muted/20 p-6 rounded-2xl space-y-6 max-w-3xl animate-fadeIn"
    >
      <div>
        <h3 className="text-xl font-bold text-pink">Créer un nouveau créneau d&apos;emploi du temps</h3>
        <p className="text-xs text-light/50 mt-1">
          Le créneau sera automatiquement rejeté par le serveur en cas de conflit (même classe, même professeur ou même salle déjà occupés).
        </p>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-light/80 font-medium">Classe</label>
          <select
            className="bg-purple border border-muted/30 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink"
            value={classeId}
            onChange={(e) => setClasseId(Number(e.target.value))}
          >
            <option value="">Sélectionner une classe</option>
            {classes.map((c) => (
              <option key={c.idClasse} value={c.idClasse}>{c.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-light/80 font-medium">Cours</label>
          <select
            className="bg-purple border border-muted/30 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink"
            value={coursId}
            onChange={(e) => setCoursId(Number(e.target.value))}
          >
            <option value="">Sélectionner un cours</option>
            {coursDisponibles.map((c) => (
              <option key={c.idCours} value={c.idCours}>
                {c.matiereNom} ({c.typeCours}) - {c.professeurNom}
              </option>
            ))}
          </select>
          {coursDisponibles.length === 0 && (
            <p className="text-xs text-yellow-400">
              Aucun cours disponible. Créez-en un depuis l&apos;onglet &quot;Sessions de Cours&quot; de l&apos;espace Pédagogique.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-light/80 font-medium">Jour</label>
          <select
            className="bg-purple border border-muted/30 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink"
            value={jour}
            onChange={(e) => setJour(e.target.value)}
          >
            {JOURS.map((j) => (
              <option key={j} value={j}>{j.charAt(0) + j.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-light/80 font-medium">Créneau horaire</label>
          <div className="flex gap-2">
            <input type="time" className="w-1/2 bg-purple border border-muted/30 text-white rounded-xl px-3 py-2.5 text-sm" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} />
            <input type="time" className="w-1/2 bg-purple border border-muted/30 text-white rounded-xl px-3 py-2.5 text-sm" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-light/80 font-medium">Valable à partir du</label>
          <input type="date" className="bg-purple border border-muted/30 text-white rounded-xl px-4 py-2.5 text-sm" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-light/80 font-medium">Jusqu&apos;au</label>
          <input type="date" className="bg-purple border border-muted/30 text-white rounded-xl px-4 py-2.5 text-sm" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onAnnuler} className="px-4 py-2 text-sm text-light/60 hover:text-white">
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-pink text-black font-semibold px-5 py-2 rounded-xl text-sm hover:bg-white transition-colors disabled:opacity-50"
        >
          {saving ? "Création..." : "Créer le créneau"}
        </button>
      </div>
    </form>
  );
}
