/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Etudiant from "./etudiant";
import Professeur from "./professeur";
import Responsable from "./responsable";

export default function UtilisateursPage() {
  const router = useRouter();
  const [roleActif, setRoleActif] = useState<"etudiants" | "professeurs" | "responsables">("etudiants");
  const [recherche, setRecherche] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleCreateUser = async () => {
    setIsCreating(true);
    
    if (roleActif === "etudiants") {
      router.push("/utilisateurs/etudiant/ajout");
    } else if (roleActif === "professeurs") {
      router.push("/utilisateurs/professeur/ajout");
    } else {
      // Pour les responsables, on peut ouvrir un modal ou rediriger
      const nomComplet = prompt("Nom complet du responsable");
      const email = prompt("Email");
      const password = prompt("Mot de passe temporaire");
      
      if (nomComplet && email && password) {
        const parts = nomComplet.trim().split(" ");
        const prenom = parts[0];
        const nom = parts.slice(1).join(" ") || prenom;
        
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/Auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              nom: nom,
              prenom: prenom,
              email: email,
              password: password,
              telephone: "",
              role: "RESPONSABLE",
            }),
          });
          
          if (!response.ok) throw new Error("Erreur lors de la création");
          alert("Compte responsable créé avec succès");
          setRefreshTrigger(prev => prev + 1);
        } catch (err) {
          alert("Erreur lors de la création");
        }
      }
    }
    
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* --- EN-TÊTE DE LA PAGE --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-4 border-b border-muted/20 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestion des Comptes</h2>
          <p className="text-light/50 text-sm mt-1">
            {roleActif === "etudiants" && "Registre des inscriptions et affectations des étudiants"}
            {roleActif === "professeurs" && "Gestion du corps enseignant et de leurs statuts"}
            {roleActif === "responsables" && "Droits d'accès du personnel administratif et chefs de mention"}
          </p>
        </div>

        {/* BOUTONS EN HAUT À DROITE POUR CHANGER DE VUE */}
        <div className="flex gap-2 bg-purple/40 p-1.5 rounded-xl border border-muted/20 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => { setRoleActif("etudiants"); setRecherche(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              roleActif === "etudiants" ? "bg-pink text-black shadow" : "text-light/80 hover:text-white"
            }`}
          >
            Étudiants
          </button>
          <button
            onClick={() => { setRoleActif("professeurs"); setRecherche(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              roleActif === "professeurs" ? "bg-pink text-black shadow" : "text-light/80 hover:text-white"
            }`}
          >
            Professeurs
          </button>
          <button
            onClick={() => { setRoleActif("responsables"); setRecherche(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              roleActif === "responsables" ? "bg-pink text-black shadow" : "text-light/80 hover:text-white"
            }`}
          >
            Responsables
          </button>
        </div>
      </div>

      {/* --- BARRE DE FILTRE DU BODY --- */}
      <div className="bg-purple/30 border border-muted/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder={`Rechercher un ${roleActif === "etudiants" ? "étudiant" : roleActif === "professeurs" ? "enseignant" : "responsable"}...`}
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="bg-purple border border-muted/30 text-white rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-pink w-full sm:w-72"
        />
        
        <button 
          onClick={handleCreateUser}
          disabled={isCreating}
          className="bg-purple border border-pink text-pink text-xs font-semibold px-4 py-2 rounded-xl hover:bg-pink hover:text-black transition-all w-full sm:w-auto disabled:opacity-50"
        >
          {isCreating ? "Création..." : `+ Créer un compte ${roleActif === "etudiants" ? "Étudiant" : roleActif === "professeurs" ? "Professeur" : "Admin"}`}
        </button>
      </div>

      {/* --- BODY DYNAMIQUE : AFFICHAGE DE LA LISTE SÉLECTIONNÉE --- */}
      <div className="mt-4 animate-fadeIn">
        {roleActif === "etudiants" && <Etudiant filtreRecherche={recherche} refreshTrigger={refreshTrigger} />}
        {roleActif === "professeurs" && <Professeur filtreRecherche={recherche} refreshTrigger={refreshTrigger} />}
        {roleActif === "responsables" && <Responsable filtreRecherche={recherche} refreshTrigger={refreshTrigger} />}
      </div>
    </div>
  );
}