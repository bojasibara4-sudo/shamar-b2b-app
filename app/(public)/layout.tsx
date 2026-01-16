import type { Metadata } from "next";
import GlobalHeaderWithAuth from "@/components/GlobalHeaderWithAuth";
import BottomNavigation from "@/components/layout/BottomNavigation";

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
      <GlobalHeaderWithAuth />
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNavigation />
    </>
  );
}
