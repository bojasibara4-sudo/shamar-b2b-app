"use client";

import { Search, Camera } from "lucide-react";

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-gris-clair p-3">

      <div className="flex items-center gap-2">

        <div className="font-bold text-lg text-brand-vert">
          SHAMAR
        </div>

        <div className="flex-1 flex items-center bg-brand-gris-clair rounded-xl px-3 py-2">
          <Search size={18} />
          <input
            placeholder="Rechercher produits, fournisseurs..."
            className="bg-transparent outline-none ml-2 w-full"
          />
        </div>

        <Camera size={20} />

      </div>

    </header>
  );
}
