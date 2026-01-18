import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SHAMAR B2B - Plateforme B2B Africaine",
  description: "Plateforme B2B conçue pour connecter, structurer et accélérer les échanges commerciaux en Afrique",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
