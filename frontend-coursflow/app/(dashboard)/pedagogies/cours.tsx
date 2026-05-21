"use client";

// Déclaration du contrat TypeScript pour la prop reçue
interface CoursProps {
  filtreClasse: string;
}

const FAUX_COURS_LISTE = [
  { id: 1, matiere: "Programmation Avancée C#", codeMatiere: "INF301", prof: "Mme. Ranja", classe: "L3 G1", type: "CM / TP" },
  { id: 2, matiere: "Algèbre Linéaire", codeMatiere: "MATH302", prof: "Mme. Volana", classe: "L3 G1", type: "CM" },
  { id: 3, matiere: "Architecture Next.js", codeMatiere: "WEB305", prof: "M. Toky", classe: "L3 G2", type: "TP" },
];

export default function Cours({ filtreClasse }: CoursProps) {
  // Tri des sessions de cours selon la classe sélectionnée dans le filtre global
  const coursFiltrés = FAUX_COURS_LISTE.filter(c => c.classe === filtreClasse);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Sessions de Cours Assignées</h3>
          <p className="text-xs text-light/50 mt-0.5">Planification active pour la classe : <span className="text-pink font-medium">{filtreClasse}</span></p>
        </div>
        <button className="bg-purple border border-pink text-pink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-pink hover:text-black transition-all">
          + Assigner un cours
        </button>
      </div>

      <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
              <th className="p-4">Matière</th>
              <th className="p-4">Enseignant</th>
              <th className="p-4">Classe / Groupe</th>
              <th className="p-4">Format</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
            {coursFiltrés.length > 0 ? (
              coursFiltrés.map((c) => (
                <tr key={c.id} className="hover:bg-black/10 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white">{c.matiere}</div>
                    <div className="text-xs text-pink/70 font-mono">{c.codeMatiere}</div>
                  </td>
                  <td className="p-4 text-light">{c.prof}</td>
                  <td className="p-4">
                    <span className="bg-purple/60 px-2 py-1 rounded-lg text-xs text-white border border-muted/20">
                      {c.classe}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-pink px-2 py-0.5 rounded bg-pink/10 border border-pink/20">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button className="text-light/50 hover:text-white transition-colors">Modifier</button>
                    <button className="text-red-400 hover:underline">Désassigner</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-light/40 italic">
                  Aucune session planifiée pour la classe {filtreClasse}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}