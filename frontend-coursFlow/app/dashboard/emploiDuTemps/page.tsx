"use client";

import { useEffect, useState } from "react";
import { edtService } from "../../services/edtService";
import { Classe, Filiere, EmploiDuTemps } from "../../types";
import EdtNouveau from "./edtNouveau";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default function EmploiDuTempsUniquePage() {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [filiereSelectionnee, setFiliereSelectionnee] = useState<number | "">("");
  const [classeSelectionnee, setClasseSelectionnee] = useState<number | "">("");
  const [emplois, setEmplois] = useState<EmploiDuTemps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNouveau, setShowNouveau] = useState(false);

  const classesFiltrees = classes.filter((c) => c.idFiliere === filiereSelectionnee);

  const chargerReferentiel = async () => {
    setLoading(true);
    setError("");
    try {
      const [f, c] = await Promise.all([edtService.getFilieres(), edtService.getClasses()]);
      setFilieres(f);
      setClasses(c);
      if (f.length > 0) setFiliereSelectionnee(f[0].idFiliere);
      const premiereClasse = c.find((cl) => cl.idFiliere === f[0]?.idFiliere);
      if (premiereClasse) setClasseSelectionnee(premiereClasse.idClasse);
    } catch {
      setError("Impossible de charger les filières/classes. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerReferentiel();
  }, []);

  const chargerEmplois = async () => {
    if (classeSelectionnee === "") return;
    try {
      const data = await edtService.getByClasse(Number(classeSelectionnee));
      setEmplois(data);
    } catch {
      setError("Impossible de charger l'emploi du temps de cette classe.");
    }
  };

  useEffect(() => {
    chargerEmplois();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classeSelectionnee]);

  const gererImpression = () => {
    if (typeof window !== "undefined") window.print();
  };

  const gererExportPDF = async () => {
    if (classeSelectionnee === "") return;
    try {
      const blob = await edtService.exporterPDF(Number(classeSelectionnee), "semaine-en-cours");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EDT_Classe_${classeSelectionnee}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Erreur lors de l'export PDF.");
    }
  };

  // Regroupe les créneaux horaires distincts réellement planifiés pour
  // cette classe (le backend n'impose pas de grille fixe de créneaux).
  const creneaux = Array.from(
    new Set(emplois.map((e) => `${e.heureDebut} - ${e.heureFin}`))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-muted/20 gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-white">Emploi du Temps</h2>
          <p className="text-light/50 text-sm mt-1">Consultez et planifiez l&apos;EDT par classe</p>
        </div>
        <button
          onClick={() => setShowNouveau((v) => !v)}
          className="bg-pink text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg text-sm hover:bg-white"
        >
          {showNouveau ? "Retour à la grille" : "+ Nouveau créneau"}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm print:hidden">{error}</p>}

      {showNouveau ? (
        <EdtNouveau
          classes={classes}
          classeParDefaut={classeSelectionnee === "" ? undefined : Number(classeSelectionnee)}
          onCree={() => {
            setShowNouveau(false);
            chargerEmplois();
          }}
          onAnnuler={() => setShowNouveau(false)}
        />
      ) : (
        <div className="space-y-6">
          <div className="hidden print:block text-black mb-4">
            <h1 className="text-2xl font-bold text-center">CoursFlow — Emploi du Temps</h1>
          </div>

          <div className="bg-purple/30 border border-muted/20 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between print:hidden">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-pink font-medium">Filière :</span>
                <select
                  value={filiereSelectionnee}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setFiliereSelectionnee(id);
                    const premiereClasse = classes.find((c) => c.idFiliere === id);
                    setClasseSelectionnee(premiereClasse ? premiereClasse.idClasse : "");
                  }}
                  className="bg-purple border border-muted/30 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink"
                >
                  {filieres.map((f) => (
                    <option key={f.idFiliere} value={f.idFiliere}>{f.nom}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-pink font-medium">Classe :</span>
                <select
                  value={classeSelectionnee}
                  onChange={(e) => setClasseSelectionnee(Number(e.target.value))}
                  className="bg-purple border border-muted/30 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink"
                >
                  {classesFiltrees.map((c) => (
                    <option key={c.idClasse} value={c.idClasse}>{c.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={gererExportPDF} className="bg-purple border border-pink text-pink hover:bg-pink hover:text-black font-semibold px-4 py-1.5 rounded-xl transition-all text-sm">
                Export PDF
              </button>
              <button onClick={gererImpression} className="bg-purple border border-pink text-pink hover:bg-pink hover:text-black font-semibold px-4 py-1.5 rounded-xl transition-all text-sm">
                Imprimer
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-light/50 text-sm">Chargement...</p>
          ) : filieres.length === 0 ? (
            <div className="text-sm text-light/60 p-6 bg-black/20 rounded-xl">
              Aucune filière/classe créée. Rendez-vous dans l&apos;espace Pédagogique pour en créer.
            </div>
          ) : creneaux.length === 0 ? (
            <div className="text-sm text-light/60 p-6 bg-black/20 rounded-xl">
              Aucun cours planifié pour cette classe pour le moment. Cliquez sur &quot;+ Nouveau créneau&quot; pour en ajouter un.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-muted/20 bg-purple/10 backdrop-blur-sm print:border-black print:bg-white print:text-black">
              <table className="w-full border-collapse text-left print:text-black">
                <thead>
                  <tr className="bg-purple border-b border-muted/30 print:bg-gray-100 print:border-black">
                    <th className="p-4 text-pink font-semibold w-32 print:text-black print:border-b">Heures</th>
                    {JOURS.map((jour) => (
                      <th key={jour} className="p-4 text-white font-semibold text-center print:text-black print:border-b">{jour}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creneaux.map((creneau) => (
                    <tr key={creneau} className="border-b border-muted/10 hover:bg-black/10 transition-colors print:border-black">
                      <td className="p-4 bg-purple/30 font-medium text-light/70 text-sm border-r border-muted/10 text-center print:bg-gray-50 print:text-black print:border-r">
                        {creneau}
                      </td>
                      {JOURS.map((jour) => {
                        const e = emplois.find(
                          (x) => x.jour.toUpperCase() === jour.toUpperCase() && `${x.heureDebut} - ${x.heureFin}` === creneau
                        );
                        return (
                          <td key={jour} className="p-2 h-28 border-r border-muted/10 w-44 print:border-r print:border-gray-300">
                            {e ? (
                              <div className="h-full bg-purple border-l-4 border-pink p-3 rounded-xl flex flex-col justify-between shadow print:bg-gray-100 print:border-black print:text-black">
                                <div>
                                  <p className="text-sm font-bold text-white leading-tight print:text-black">{e.cours?.matiereNom}</p>
                                  <p className="text-xs text-pink/80 mt-1 print:text-gray-700">{e.cours?.professeurNom}</p>
                                </div>
                                <div className="flex justify-end text-[11px]">
                                  <span className="bg-black/40 px-1.5 py-0.5 rounded text-pink font-medium print:bg-gray-200 print:text-black">
                                    {e.cours?.salleNom || "Salle N/A"}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full rounded-xl border border-dashed border-muted/10 hover:border-pink/10 transition-colors print:border-none" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
