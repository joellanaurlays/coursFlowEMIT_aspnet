"use client";

interface AjouterSalleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AjouterSalleModal({ isOpen, onClose }: AjouterSalleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-purple/90 border border-muted/30 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6 relative text-white">
        
        {/* En-tête de la Modal */}
        <div>
          <h3 className="text-xl font-bold text-pink"> Ajouter une nouvelle salle</h3>
          <p className="text-xs text-light/50 mt-1">Déclarez une infrastructure disponible pour les algorithmes de placement.</p>
        </div>

        {/* Formulaire conforme au modèle C# */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-light/80 font-medium">Nom de la salle <span className="text-pink">*</span></label>
            <input 
              type="text" 
              maxLength={100} 
              placeholder="Ex: Salle 204, Amphi B..." 
              className="bg-purple border border-muted/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-light/80 font-medium">Bâtiment / Emplacement</label>
            <input 
              type="text" 
              maxLength={100} 
              placeholder="Ex: Bâtiment Central, Bloc de Droite..." 
              className="bg-purple border border-muted/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-light/80 font-medium">Capacité (Places) <span className="text-pink">*</span></label>
              <input 
                type="number" 
                min={1} 
                placeholder="Ex: 30" 
                className="bg-purple border border-muted/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-light/80 font-medium">Type de Salle <span className="text-pink">*</span></label>
              <select className="bg-purple border border-muted/30 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink">
                <option value="0">TD / Classique</option>
                <option value="1">Amphithéâtre</option>
                <option value="2">TP Machine</option>
                <option value="3">Laboratoire</option>
              </select>
            </div>
          </div>

          {/* Statut initial - Correspond à EstDisponible (Default = true) */}
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="estDisponible" 
              defaultChecked 
              className="w-4 h-4 rounded border-muted/30 bg-purple text-pink focus:ring-0 focus:ring-offset-0 accent-pink"
            />
            <label htmlFor="estDisponible" className="text-sm text-light/90 font-medium cursor-pointer">
              Rendre cette salle immédiatement opérationnelle
            </label>
          </div>
        </div>

        {/* Actions du bas */}
        <div className="flex justify-end gap-3 pt-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm text-light/60 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={() => { alert("Salle sauvegardée avec succès !"); onClose(); }} 
            className="bg-pink text-black font-semibold px-5 py-2 rounded-xl text-sm hover:bg-white transition-colors shadow-lg"
          >
            Enregistrer la salle
          </button>
        </div>
      </div>
    </div>
  );
}