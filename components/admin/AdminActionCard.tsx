import { ReactNode } from "react";

interface Props {
  title?: string;
  children?: ReactNode;
}

export default function AdminActionCard({ title, children }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {title && <h3 className="mb-2 font-semibold text-sm text-gray-700">{title}</h3>}
      {children}
    </div>
  );
}
