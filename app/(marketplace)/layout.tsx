export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Nav globale fournie par MetierShell dans layout racine
  // Les thèmes spécifiques sont appliqués dans les layouts enfants (b2b, b2c, etc.)
  return <>{children}</>;
}
