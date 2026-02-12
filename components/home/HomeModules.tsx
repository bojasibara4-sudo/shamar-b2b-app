"use client";

import { useRouter } from "next/navigation";

const modules = [
  { label: "Marketplace", path: "/marketplace", color: "bg-blue-600 hover:bg-blue-700" },
  { label: "B2B", path: "/b2b", color: "bg-indigo-600 hover:bg-indigo-700" },
  { label: "B2C", path: "/b2c", color: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "International", path: "/international", color: "bg-purple-600 hover:bg-purple-700" },
  { label: "Sourcing Chine", path: "/china", color: "bg-orange-600 hover:bg-orange-700" },
  { label: "Airbnb / Locations", path: "/host", color: "bg-pink-600 hover:bg-pink-700" },
  { label: "Matières Premières", path: "/negociation", color: "bg-amber-700 hover:bg-amber-800" },
];

export default function HomeModules() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-16">
      <h1 className="text-3xl font-bold mb-12 text-gray-900">
        Bienvenue sur l’écosystème SHAMAR
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((m) => (
          <button
            key={m.label}
            onClick={() => router.push(m.path)}
            className={`
              ${m.color}
              text-white
              rounded-xl
              p-8
              text-left
              font-semibold
              shadow-lg
              transition
              hover:scale-[1.03]
            `}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}