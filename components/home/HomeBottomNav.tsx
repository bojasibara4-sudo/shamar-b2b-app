"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingCart, MessageCircle, Heart, User } from "lucide-react";

export default function HomeBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { icon: Home, path: "/", label: "Accueil" },
    { icon: ShoppingCart, path: "/cart", label: "Panier" },
    { icon: MessageCircle, path: "/messages", label: "Messages" },
    { icon: Heart, path: "/dashboard/buyer/favorites", label: "Favoris" },
    { icon: User, path: "/profile", label: "Pour moi" },
  ];

  return (
    <nav className="border-t border-brand-gris-clair bg-white p-2 flex justify-around w-full">
      {items.map((item, i) => {
        const Icon = item.icon;
        const active = item.path === '/profile'
          ? pathname === '/profile' || pathname.startsWith('/profile/')
          : item.path === '/profile/favorites'
            ? pathname === '/profile/favorites'
            : pathname === item.path;

        return (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors min-w-[4rem] ${
              active ? "text-brand-vert" : "text-brand-anthracite/60"
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
