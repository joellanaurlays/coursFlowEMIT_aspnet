"use client";

import { useState } from "react";

export default function AuthPage() {
  // Mode actif : 'login' ou 'register'
  const [mode, setMode] = useState<"login" | "register">("login");

  // États du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [roleSOUHAITE, setRoleSouhaite] = useState("0"); // 0: Étudiant, 1: Professeur

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      alert(`Connexion en cours pour : ${email}`);
      // Appeler ici ton API ASP.NET Core : /api/auth/login
    } else {
      alert(`Inscription de ${nomComplet} (${email}) en tant que ${roleSOUHAITE === "0" ? "Étudiant" : "Enseignant"}`);
      // Appeler ici ton API ASP.NET Core : /api/auth/register
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fadeIn">
      {/* --- CARTE D'AUTHENTIFICATION --- */}
      <div className="bg-purple/20 border border-muted/20 w-full max-w-md rounded-2xl p-8 backdrop-blur-md shadow-2xl space-y-6 relative">
        
        {/* LOGO / TITRE */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cours<span className="text-pink">Flow</span>
          </h1>
          <p className="text-xs text-light/50">
            {mode === "login" 
              ? "Accédez à votre espace de planification pédagogique" 
              : "Créez votre compte pour rejoindre la plateforme"}
          </p>
        </div>

        {/* --- FORMULAIRE --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CHAMP : NOM COMPLET (Uniquement en mode Register) */}
          {mode === "register" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-xs text-light/80 font-medium">Nom complet</label>
              <input
                type="text"
                required
                placeholder="Ex: RALAIVAO Jean"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                className="bg-purple border border-muted/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink transition-colors placeholder:text-light/20"
              />
            </div>
          )}

          {/* CHAMP : EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-light/80 font-medium">Adresse Email</label>
            <input
              type="email"
              required
              placeholder="votre-adresse@emit.mg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-purple border border-muted/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink transition-colors placeholder:text-light/20"
            />
          </div>

          {/* CHAMP : TYPE DE COMPTE (Uniquement en mode Register) */}
          {mode === "register" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-xs text-light/80 font-medium">Vous êtes ?</label>
              <select
                value={roleSOUHAITE}
                onChange={(e) => setRoleSouhaite(e.target.value)}
                className="bg-purple border border-muted/30 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink transition-colors"
              >
                <option value="0"> Étudiant(e)</option>
                <option value="1"> Enseignant / Professeur</option>
              </select>
            </div>
          )}

          {/* CHAMP : MOT DE PASSE */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-light/80 font-medium">Mot de passe</label>
              {mode === "login" && (
                <a href="#" className="text-xs text-pink/70 hover:text-pink hover:underline transition-colors">
                  Oublié ?
                </a>
              )}
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-purple border border-muted/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink transition-colors placeholder:text-light/20"
            />
          </div>

          {/* BOUTON DE SOUMISSION DYNAMIQUE */}
          <button
            type="submit"
            className="w-full bg-pink text-black font-bold py-3 rounded-xl text-sm hover:bg-white transition-all shadow-lg mt-2 cursor-pointer"
          >
            {mode === "login" ? " Se connecter" : " Créer mon compte"}
          </button>
        </form>

        {/* --- PIED DE CARTE : SWITCH DE MODE --- */}
        <div className="pt-4 border-t border-muted/10 text-center text-xs text-light/60">
          {mode === "login" ? (
            <p>
              Nouveau ?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-pink font-semibold hover:underline cursor-pointer"
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-pink font-semibold hover:underline cursor-pointer"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}