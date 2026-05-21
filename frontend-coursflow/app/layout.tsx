import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoursFlow",
  description: "Système de gestion d'emploi du temps",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-purple-dark text-white">
        {children}
      </body>
    </html>
  );
}
