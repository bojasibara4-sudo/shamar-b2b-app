import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalHeader from "@/components/layout/GlobalHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SHAMAR B2B - Plateforme B2B Africaine",
  description: "Plateforme B2B conçue pour connecter, structurer et accélérer les échanges commerciaux en Afrique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalHeader />
        <main className="pb-16 md:pb-0">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
