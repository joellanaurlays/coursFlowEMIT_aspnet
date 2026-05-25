"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    
    const menuItems = [
        { name: "Tableau de bord", path: "/" },
        { name: "Emploi du temps", path: "/emploiDuTemps" },
        { name: "Pédagogies", path: "/pedagogies" },
        { name: "Salles", path: "/salles" },
        { name: "Utilisateurs", path: "/utilisateurs" },
    ];

    return (
        // Le combo "flex flex-col h-screen justify-between" force le footer à se caler tout en bas
        <aside className="w-64 fixed inset-y-0 left-0 h-screen bg-purple border-r border-muted/30 p-6 flex flex-col justify-between">
            <div>
                {/* Logo et Titre */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-wider text-white">
                        Cours<span className="text-pink">Flow</span>
                    </h1>
                    <p className="text-xs text-pink/70 mt-1">Gestion Universitaire</p>
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                // "relative overflow-hidden" permet de positionner la ligne de soulignement proprement
                                className={`relative block px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                                    isActive
                                        ? "bg-black/40 text-white font-semibold"
                                        : "text-light/80 hover:bg-black/40 hover:text-white"
                                }`}
                            >
                                {item.name}
                                
                                {/* Barre de soulignement animée en bas de l'item actif */}
                                {isActive && (
                                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-pink rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Profil de l'utilisateur faisant office de Footer */}
            <footer className="border-t border-muted/30 pt-4 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink flex items-center justify-center text-black font-bold shrink-0">
                        U
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Utilisateur connecté</p>
                        <Link href="/login" className="text-xs text-pink hover:underline block mt-0.5">
                            Déconnexion
                        </Link>
                    </div>
                </div>
            </footer>
        </aside>
    );
}