import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "SiteManager — Gestion et pilotage de chantier",
  description: "Interface web de gestion et pilotage : données centralisées, tableaux de bord analytiques, reporting automatisé et traçabilité complète.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={font.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}