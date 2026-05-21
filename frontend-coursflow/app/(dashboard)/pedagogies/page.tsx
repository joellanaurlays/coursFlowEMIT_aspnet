"use client";

import { useState } from "react";
import Matiere from "./matiere";
import Cours from "./cours";
import Classe from "./classe";
import Filiere from "./filiere";
import Disponibilite from "./disponibilite";

const FILIERES = [
  { id: 1, nom: "Informatique (MISA)" },
  { id: 2, nom: "Électronique" }
];

const CLASSES = [
  { id: 1, nom: "L3 G1", filiereId: 1 },
  { id: 2, nom: "L3 G2", filiereId: 1 },
  { id: 3, nom: "M1 Unique", filiereId: 2 }
];

export default function PedagogiesPage() {
  const [ongletActif, setOngletActif] = useState<"matieres" | "cours" | "classes" | "filieres" | "dispos">("matieres");
  
  // États de filtrage globaux
  const [filiereSelectionnee, setFiliereSelectionnee] = useState(1);
  const [classeSelectionnee, setClasseSelectionnee] = useState("L3 G1");

  // Mode création d'un nouvel emploi du temps
  const [modeCreationEDT, setModeCreationEDT] = useState(false);

  const classesFiltrées = CLASSES.filter(c => c.filiereId === filiereSelectionnee);

  return (
    <div className="space-y-6">
      {/* --- EN-TÊTE --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 border-b border-muted/20 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Espace Pédagogique</h2>
          <p className="text-light/50 text-sm mt-1">
            {modeCreationEDT ? "Initialisation et configuration d'un nouveau planning" : "Planification globale, gestion des maquettes et des cours"}
          </p>
        </div>

        {/* Bouton Dynamique : Bascule entre le Formulaire et le Catalogue */}
        <button
          onClick={() => setModeCreationEDT(!modeCreationEDT)}
          className={`${
            modeCreationEDT ? "bg-purple border border-pink text-pink hover:bg-pink hover:text-black" : "bg-pink text-black hover:bg-white"
          } font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2 shrink-0`}
        >
          {modeCreationEDT ? " Retour au Catalogue" : " Nouveau Emploi du Temps"}
        </button>
      </div>

      {/* --- CONDITION : SOIT LE FORMULAIRE DE CRÉATION, SOIT LE CATALOGUE FILTRÉ --- */}
      {modeCreationEDT ? (
        /* --- BODY POUR AJOUTER UN NOUVEL EMPLOI DU TEMPS --- */
        <div className="bg-purple/20 border border-muted/20 p-6 rounded-2xl space-y-6 max-w-3xl animate-fadeIn">
          <div>
            <h3 className="text-xl font-bold text-pink">Créer une nouvelle session de planification</h3>
            <p className="text-xs text-light/50 mt-1">Configurez les paramètres généraux avant de générer ou de peupler la grille.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-light/80 font-medium">Nom de la période / Semestre</label>
              <input type="text" placeholder="Ex: Semestre 5 - 2026" className="bg-purple border border-muted/30 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink text-sm" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-light/80 font-medium">Année Universitaire cible</label>
              <select className="bg-purple border border-muted/30 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink text-sm">
                <option>2025-2026</option>
                <option>2026-2027</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-purple/40 border border-dashed border-pink/20 rounded-xl space-y-2">
            <h4 className="text-sm font-semibold text-white">Cibles de génération par défaut :</h4>
            <p className="text-xs text-light/60">Le système va préparer une grille vierge prête à recevoir les contraintes pour la filière et la classe sélectionnées dans vos filtres principaux.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModeCreationEDT(false)} className="px-4 py-2 text-sm text-light/60 hover:text-white">Annuler</button>
            <button onClick={() => { alert("Initialisation réussie !"); setModeCreationEDT(false); }} className="bg-pink text-black font-semibold px-5 py-2 rounded-xl text-sm hover:bg-white transition-colors">Confirmer & Initialiser</button>
          </div>
        </div>
      ) : (
        /* --- SYSTEME GENERAL DU CATALOGUE (AVEC FILTRES ALIGNÉS) --- */
        <div className="space-y-6">
          
          {/* BARRE DE FILTRES UNIFIÉE ET RACCOURCIS DE GESTION */}
          <div className="bg-purple/30 border border-muted/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* CÔTÉ GAUCHE : LES SECTEURS DE FILTRES */}
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

            {/* CÔTÉ DROIT : LES RACCOURCIS DE GESTION APERÇUS DANS TON IDÉE */}
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={() => setOngletActif("classes")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${ongletActif === "classes" ? "bg-pink text-black border-pink" : "border-muted/30 text-light hover:text-white hover:border-pink/50"}`}
              >
                 Config Classes
              </button>
              <button 
                onClick={() => setOngletActif("filieres")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${ongletActif === "filieres" ? "bg-pink text-black border-pink" : "border-muted/30 text-light hover:text-white hover:border-pink/50"}`}
              >
                 Config Filières
              </button>
            </div>
          </div>

          {/* BARRE DE NAVIGATION DES ONGLETS PRINCIPAUX */}
          <div className="flex flex-wrap gap-2 bg-purple/40 p-1.5 rounded-xl border border-muted/20 w-max">
            <button
              onClick={() => setOngletActif("matieres")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${ongletActif === "matieres" ? "bg-pink text-black font-semibold shadow" : "text-light/80 hover:text-white"}`}
            >
               Matières / Modules
            </button>
            <button
              onClick={() => setOngletActif("cours")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${ongletActif === "cours" ? "bg-pink text-black font-semibold shadow" : "text-light/80 hover:text-white"}`}
            >
               Sessions de Cours
            </button>
            <button
              onClick={() => setOngletActif("dispos")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${ongletActif === "dispos" ? "bg-pink text-black font-semibold shadow" : "text-light/80 hover:text-white"}`}
            >
               Contraintes Profs
            </button>
          </div>

          {/* ZONE D'AFFICHAGE DYNAMIQUE */}
          <div className="mt-4">
            {ongletActif === "matieres" && <Matiere filtreClasse={classeSelectionnee} />}
            {ongletActif === "cours" && <Cours filtreClasse={classeSelectionnee} />}
            {ongletActif === "classes" && <Classe />}
            {ongletActif === "filieres" && <Filiere />}
            {ongletActif === "dispos" && <Disponibilite />}
          </div>
        </div>
      )}
    </div>
  );
}