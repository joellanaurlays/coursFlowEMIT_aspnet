"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Définir le type pour l'erreur
interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function AuthPage() {
  const router = useRouter();
  
  // Mode actif : 'login' ou 'register'
  const [mode, setMode] = useState<"login" | "register">("login");

  // États du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [roleSOUHAITE, setRoleSouhaite] = useState("0"); // 0: Étudiant, 1: Professeur
  
  // États pour les messages d'erreur et chargement
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Extraire prénom et nom à partir du nom complet
  const extractPrenomNom = (nomComplet: string) => {
    const parts = nomComplet.trim().split(" ");
    if (parts.length === 1) {
      return { prenom: parts[0], nom: parts[0] };
    }
    const prenom = parts[0];
    const nom = parts.slice(1).join(" ");
    return { prenom, nom };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186/api";

    try {
      if (mode === "login") {
        // ========== CONNEXION ==========
        const response = await fetch(`${API_URL}/Auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erreur de connexion");
        }

        // Stocker le token et les infos utilisateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          id: data.userId,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          role: data.role,
        }));

        // Redirection vers le tableau de bord.
        // NOTE: les routes "/dashboard/admin", "/dashboard/responsable", etc.
        // n'existent pas dans l'application (le groupe de routes "(dashboard)"
        // ne préfixe pas l'URL) : ces redirections menaient systématiquement
        // à une page 404 après connexion. La page d'accueil du tableau de
        // bord se trouve simplement à "/".
        router.push("/");
      } 
      else {
        // ========== INSCRIPTION ==========
        const { prenom, nom } = extractPrenomNom(nomComplet);
        const role = roleSOUHAITE === "0" ? "ETUDIANT" : "PROFESSEUR";

        const registerData = {
          nom: nom,
          prenom: prenom,
          email: email,
          password: password,
          telephone: "",
          role: role,
        };

        const response = await fetch(`${API_URL}/Auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de l'inscription");
        }

        // Inscription réussie, passer en mode login
        alert("Compte créé avec succès ! Veuillez vous connecter.");
        setMode("login");
        setEmail("");
        setPassword("");
        setNomComplet("");
        setRoleSouhaite("0");
      }
    } catch (err: unknown) {
      // Typage correct de l'erreur sans 'any'
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fadeIn">
      {/* --- CARTE D'AUTHENTIFICATION --- */}
      <div className="bg-purple/20 border border-muted/20 w-full max-w-md rounded-2xl p-8 backdrop-blur-md shadow-2xl space-y-6 relative">
        
        {/* AFFICHAGE DES ERREURS */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

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
            disabled={isLoading}
            className="w-full bg-pink text-black font-bold py-3 rounded-xl text-sm hover:bg-white transition-all shadow-lg mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Chargement..." : (mode === "login" ? " Se connecter" : " Créer mon compte")}
          </button>
        </form>

        {/* --- PIED DE CARTE : SWITCH DE MODE --- */}
        <div className="pt-4 border-t border-muted/10 text-center text-xs text-light/60">
          {mode === "login" ? (
            <p>
              Nouveau ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
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
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
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