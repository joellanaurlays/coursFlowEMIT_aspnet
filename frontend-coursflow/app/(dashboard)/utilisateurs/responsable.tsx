"use client";

interface UtilisateurProps {
  filtreRecherche: string;
}

const FAUX_RESPONSABLES = [
  { id: 1, nom: "M. ANDRY", role: "Chef de Mention Informatique", niveau: "Super Admin" },
  { id: 2, nom: "Mme. LALA", role: "Responsable Scolarité", niveau: "Admin Logistique" },
];

export default function Responsable({ filtreRecherche }: UtilisateurProps) {
  const responsablesFiltrés = FAUX_RESPONSABLES.filter((resp) =>
    resp.nom.toLowerCase().includes(filtreRecherche.toLowerCase()) ||
    resp.role.toLowerCase().includes(filtreRecherche.toLowerCase())
  );

  return (
    <div className="bg-purple/20 border border-muted/20 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple border-b border-muted/30 text-white font-semibold text-sm">
            <th className="p-4">Nom de l'Administrateur</th>
            <th className="p-4">Rôle / Fonction</th>
            <th className="p-4">Niveau d'Accès</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/10 text-light/80 text-sm">
          {responsablesFiltrés.length > 0 ? (
            responsablesFiltrés.map((resp) => (
              <tr key={resp.id} className="hover:bg-black/10 transition-colors">
                <td className="p-4 font-semibold text-white">{resp.nom}</td>
                <td className="p-4 text-light/80">{resp.role}</td>
                <td className="p-4">
                  <span className="text-xs font-medium text-pink px-2 py-0.5 rounded bg-pink/10 border border-pink/20">
                    {resp.niveau}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button className="text-light/50 hover:text-white transition-colors">Droits</button>
                  <button className="text-red-400 hover:underline">Révoquer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-8 text-center text-light/40 italic">
                Aucun responsable ne correspond.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}