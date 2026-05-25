"use client";

interface UtilisateurProps {
  filtreRecherche: string;
}

const FAUX_PROFESSEURS = [
  { id: 1, nom: "Mme. RANJA", statut: "Permanent", specialite: "Génie Logiciel & C#", email: "ranja@emit.mg" },
  { id: 2, nom: "Mme. VOLANA", statut: "Permanent", specialite: "Mathématiques & Algèbre", email: "volana@emit.mg" },
  { id: 3, nom: "M. TOKY", statut: "Vacataire", specialite: "Développement Web & Next.js", email: "toky@emit.mg" },
];

export default function Professeur({ filtreRecherche }: UtilisateurProps) {
  // Filtrage par nom ou spécialité
  const professeursFiltrés = FAUX_PROFESSEURS.filter((prof) =>
    prof.nom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    prof.specialite.toLowerCase().includes(filtreRecherche.toLowerCase())
  );

  return (
    <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
            <th className="p-4">Nom de l'Enseignant</th>
            <th className="p-4">Statut</th>
            <th className="p-4">Spécialité Principale</th>
            <th className="p-4">Contact Email</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
          {professeursFiltrés.length > 0 ? (
            professeursFiltrés.map((prof) => (
              <tr key={prof.id} className="hover:bg-black/10 transition-colors">
                <td className="p-4 font-semibold text-white">{prof.nom}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    prof.statut === "Permanent" 
                      ? "bg-purple text-pink border border-pink/30" 
                      : "bg-purple/40 text-light/70 border border-muted/20"
                  }`}>
                    {prof.statut}
                  </span>
                </td>
                <td className="p-4 text-light/90">{prof.specialite}</td>
                <td className="p-4 font-mono text-xs text-light/50">{prof.email}</td>
                <td className="p-4 text-right space-x-3">
                  <button className="text-light/50 hover:text-white transition-colors">Dispos</button>
                  <button className="text-light/50 hover:text-white transition-colors">Éditer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-8 text-center text-light/40 italic">
                Aucun enseignant trouvé pour cette recherche.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}