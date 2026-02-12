import HostLayoutClient from '@/components/host/HostLayoutClient';

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-host app-bg">
      <HostLayoutClient>{children}</HostLayoutClient>
    </div>
  );
}
