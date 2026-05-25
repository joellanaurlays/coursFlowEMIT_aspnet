"use client";

interface UtilisateurProps {
  filtreRecherche: string;
}

// Données fictives calquées sur ton architecture (Filières et Groupes de l'EMIT)
const FAUX_ETUDIANTS = [
  { id: 1, matricule: "2401-MISA", nom: "RALAIVAO Jean", filiere: "Informatique (MISA)", classe: "L3 G1", statut: "Inscrit" },
  { id: 2, matricule: "2402-MISA", nom: "RASOA Marie Lou", filiere: "Informatique (MISA)", classe: "L3 G1", statut: "Inscrit" },
  { id: 3, matricule: "2405-ELEC", nom: "ANDRIA Guillaume", filiere: "Électronique", classe: "M1 Unique", statut: "En attente" },
  { id: 4, matricule: "2412-MISA", nom: "RANDRIA Toky", filiere: "Informatique (MISA)", classe: "L3 G2", statut: "Inscrit" },
];

export default function Etudiant({ filtreRecherche }: UtilisateurProps) {
  // Filtrage en temps réel selon la recherche (Nom ou Matricule)
  const etudiantsFiltrés = FAUX_ETUDIANTS.filter((etudiant) =>
    etudiant.nom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    etudiant.matricule.toLowerCase().includes(filtreRecherche.toLowerCase())
  );

  return (
    <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
            <th className="p-4">Matricule</th>
            <th className="p-4">Nom & Prénoms</th>
            <th className="p-4">Mentions / Filière</th>
            <th className="p-4">Classe & Groupe</th>
            <th className="p-4">Statut</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
          {etudiantsFiltrés.length > 0 ? (
            etudiantsFiltrés.map((etudiant) => (
              <tr key={etudiant.id} className="hover:bg-black/10 transition-colors">
                {/* Matricule style Code/Mono */}
                <td className="p-4 font-mono text-pink font-medium">{etudiant.matricule}</td>
                
                {/* Nom complet */}
                <td className="p-4 font-semibold text-white">{etudiant.nom}</td>
                
                {/* Filière */}
                <td className="p-4 text-light/70">{etudiant.filiere}</td>
                
                {/* Badge de Classe */}
                <td className="p-4">
                  <span className="bg-purple/60 px-2 py-1 rounded-lg text-xs text-white border border-muted/20">
                    {etudiant.classe}
                  </span>
                </td>
                
                {/* Statut d'inscription */}
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    etudiant.statut === "Inscrit" 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {etudiant.statut}
                  </span>
                </td>
                
                {/* Boutons d'action */}
                <td className="p-4 text-right space-x-3">
                  <button className="text-light/50 hover:text-white transition-colors">Dossier</button>
                  <button className="text-red-400 hover:underline">Désinscrire</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center text-light/40 italic">
                Aucun étudiant ne correspond à vos critères.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}