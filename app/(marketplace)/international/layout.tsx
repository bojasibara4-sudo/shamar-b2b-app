export default function InternationalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-international app-bg">
      {children}
    </div>
  );
}
