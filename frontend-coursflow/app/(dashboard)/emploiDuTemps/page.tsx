"use client";

import { useState } from "react";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const CRENEAUX = ["08:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00"];

const FILIERES = [
  { id: 1, nom: "Informatique (MISA)" },
  { id: 2, nom: "Électronique" }
];

const CLASSES = [
  { id: 1, nom: "L3 G1", filiereId: 1 },
  { id: 2, nom: "L3 G2", filiereId: 1 },
  { id: 3, nom: "M1 Unique", filiereId: 2 }
];

const FAUX_COURS = [
  { classe: "L3 G1", jour: "Lundi", heure: "08:00 - 10:00", matiere: "C# Advanced", prof: "Mme. Ranja", salle: "Labo Info" },
  { classe: "L3 G1", jour: "Jeudi", heure: "10:00 - 12:00", matiere: "Algèbre Linéaire", prof: "Mme. Volana", salle: "Salle 102" },
  { classe: "L3 G2", jour: "Mardi", heure: "14:00 - 16:00", matiere: "Next.js / UI", prof: "M. Toky", salle: "Amphi A" },
];

export default function EmploiDuTempsUniquePage() {
  const [filiereSelectionnee, setFiliereSelectionnee] = useState(1);
  const [classeSelectionnee, setClasseSelectionnee] = useState("L3 G1");
  const [vueActive, setVueActive] = useState<"grille">("grille");

  const classesFiltrées = CLASSES.filter(c => c.filiereId === filiereSelectionnee);

  // Fonction pour déclencher l'impression native du navigateur
  const gererImpression = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-muted/20 gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-white">Emploi du Temps</h2>
          <p className="text-light/50 text-sm mt-1">Consultez l'EDT</p>
        </div>
      </div>

      {/* Titre minimaliste visible uniquement sur le papier imprimé */}
      <div className="hidden print:block text-black mb-4">
        <h1 className="text-2xl font-bold text-center">CoursFlow — Emploi du Temps</h1>
        <p className="text-center text-sm text-gray-600">Classe : {classeSelectionnee}</p>
      </div>

      {/* --- RENDER DYNAMIQUE DES SECTIONS --- */}
      {vueActive === "grille" && (
        <div className="space-y-6">
          {/* BARRE DE FILTRES ET BOUTON IMPRIMER */}
          <div className="bg-purple/30 border border-muted/20 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between print:hidden">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-pink font-medium">Filière :</span>
                <select 
                  value={filiereSelectionnee}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setFiliereSelectionnee(id);
                    const premiereClasse = CLASSES.find(c => c.filiereId === id);
                    if (premiereClasse) setClasseSelectionnee(premiereClasse.nom);
                  }}
                  className="bg-purple border border-muted/30 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink"
                >
                  {FILIERES.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-pink font-medium">Classe :</span>
                <select 
                  value={classeSelectionnee}
                  onChange={(e) => setClasseSelectionnee(e.target.value)}
                  className="bg-purple border border-muted/30 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink"
                >
                  {classesFiltrées.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                </select>
              </div>
            </div>

            {/* Bouton Imprimer */}
            <button
              onClick={gererImpression}
              className="bg-purple border border-pink text-pink hover:bg-pink hover:text-black font-semibold px-4 py-1.5 rounded-xl transition-all text-sm flex items-center gap-2 shadow-md"
            >
              🖨️ Imprimer
            </button>
          </div>

          {/* TABLEAU GRILLE (Optimisé pour écran sombre et papier blanc via print:) */}
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
                {CRENEAUX.map((creneau) => (
                  <tr key={creneau} className="border-b border-muted/10 hover:bg-black/10 transition-colors print:border-black">
                    <td className="p-4 bg-purple/30 font-medium text-light/70 text-sm border-r border-muted/10 text-center print:bg-gray-50 print:text-black print:border-r">
                      {creneau}
                    </td>
                    {JOURS.map((jour) => {
                      const cours = FAUX_COURS.find(c => c.classe === classeSelectionnee && c.jour === jour && c.heure === creneau);
                      return (
                        <td key={jour} className="p-2 h-28 border-r border-muted/10 w-44 print:border-r print:border-gray-300">
                          {cours ? (
                            <div className="h-full bg-purple border-l-4 border-pink p-3 rounded-xl flex flex-col justify-between shadow print:bg-gray-100 print:border-black print:text-black">
                              <div>
                                <p className="text-sm font-bold text-white leading-tight print:text-black">{cours.matiere}</p>
                                <p className="text-xs text-pink/80 mt-1 print:text-gray-700">{cours.prof}</p>
                              </div>
                              <div className="flex justify-end text-[11px]">
                                <span className="bg-black/40 px-1.5 py-0.5 rounded text-pink font-medium print:bg-gray-200 print:text-black">{cours.salle}</span>
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
        </div>
      )}
    </div>
  );
}