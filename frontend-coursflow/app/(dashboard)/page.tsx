export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Tableau de bord</h2>
        <p className="text-muted mt-1">Bienvenue sur CoursFlow</p>
      </div>

      {/* statistique */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-purple/40 border border-muted/20 p-6 rounded-2xl">
          <p className="text-sm text-pink font-medium">Salles Occupées</p>
          <p className="text-3xl font-bold text-white mt-2">12 / 24</p>
        </div>
        
        <div className="bg-purple/40 border border-muted/20 p-6 rounded-2xl">
          <p className="text-sm text-pink font-medium">Cours aujourd'hui</p>
          <p className="text-3xl font-bold text-white mt-2">8 Séances</p>
        </div>

        <div className="bg-purple/40 border border-muted/20 p-6 rounded-2xl">
          <p className="text-sm text-pink font-medium">Professeurs Actifs</p>
          <p className="text-3xl font-bold text-white mt-2">15</p>
        </div>

        <div className="bg-purple/40 border border-muted/20 p-6 rounded-2xl">
          <p className="text-sm text-pink font-medium">Alertes Conflits</p>
          <p className="text-3xl font-bold text-red-400 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
