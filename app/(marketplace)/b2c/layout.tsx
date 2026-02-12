export default function B2CLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-b2c app-bg">
      {children}
    </div>
  );
}
