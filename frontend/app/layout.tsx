import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const fontSans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fontDisplay = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "SiteManager - Gestion et pilotage de chantier",
  description: "Interface web de gestion et pilotage : donnees centralisees, tableaux de bord analytiques, reporting automatise et tracabilite complete.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
