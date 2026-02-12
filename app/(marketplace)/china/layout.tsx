export default function ChinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-china-dashboard app-bg">
      {children}
    </div>
  );
}
