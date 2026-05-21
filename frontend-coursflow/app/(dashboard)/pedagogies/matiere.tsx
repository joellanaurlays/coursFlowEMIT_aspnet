"use client";

// Déclaration du contrat TypeScript pour la prop reçue
interface MatiereProps {
  filtreClasse: string;
}

const FAUSSES_MATIERES = [
  { id: 1, code: "INF301", nom: "Programmation Avancée C#", credits: 5, volume: "40h", classeCible: "L3 G1" },
  { id: 2, code: "MATH302", nom: "Algèbre Linéaire & Formes Quadratiques", credits: 4, volume: "36h", classeCible: "L3 G1" },
  { id: 3, code: "WEB305", nom: "Architecture d'Applications Next.js", credits: 5, volume: "30h", classeCible: "L3 G2" },
];

export default function Matiere({ filtreClasse }: MatiereProps) {
  // Tri des matières selon la classe sélectionnée dans le filtre global
  const matieresFiltrees = FAUSSES_MATIERES.filter(mat => mat.classeCible === filtreClasse);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Catalogue des Matières</h3>
          <p className="text-xs text-light/50 mt-0.5">Affichage des modules pour la classe : <span className="text-pink font-medium">{filtreClasse}</span></p>
        </div>
        <button className="bg-purple border border-pink text-pink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-pink hover:text-black transition-all">
          + Ajouter une matière
        </button>
      </div>

      <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
              <th className="p-4">Code</th>
              <th className="p-4">Intitulé de la Matière</th>
              <th className="p-4">Crédits (UE)</th>
              <th className="p-4">Volume Horaire</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
            {matieresFiltrees.length > 0 ? (
              matieresFiltrees.map((mat) => (
                <tr key={mat.id} className="hover:bg-black/10 transition-colors">
                  <td className="p-4 font-mono text-pink font-medium">{mat.code}</td>
                  <td className="p-4 font-semibold text-white">{mat.nom}</td>
                  <td className="p-4">{mat.credits} ECTS</td>
                  <td className="p-4">{mat.volume}</td>
                  <td className="p-4 text-right space-x-3">
                    <button className="text-light/50 hover:text-white transition-colors">Éditer</button>
                    <button className="text-red-400 hover:underline">Retirer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-light/40 italic">
                  Aucune matière enregistrée pour la classe {filtreClasse}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}