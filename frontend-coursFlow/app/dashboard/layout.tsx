import Sidebar from "./components/sidebar";
import type { Metadata } from 'next';
import "../globals.css";

export const metadata: Metadata = {
  title: 'CoursFlow - Gestion d\'Emploi du Temps',
  description: 'Application de gestion d\'emploi du temps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f081d]">
      {/* 1. La Sidebar à gauche - Largeur fixe */}
      <div className="w-64 shrink-0 border-r border-muted/10 bg-[#140c27]">
        <Sidebar />
      </div>

      {/* 2. Zone de contenu à droite - Prend tout le reste de l'espace */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
