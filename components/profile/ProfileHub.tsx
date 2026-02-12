'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  Package,
  FileText,
  MessageSquare,
  AlertTriangle,
  Truck,
  MapPin,
  FileCheck,
  CreditCard,
  Wallet,
  History,
  Store,
  User,
  Shield,
  Bell,
  Globe,
  HelpCircle,
  Headphones,
  LogOut,
  BadgeCheck,
  Repeat,
  ShoppingCart,
  Banknote,
  Award,
  Heart,
} from 'lucide-react';

const sectionStyle = "bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft overflow-hidden";
const itemStyle = "flex items-center gap-4 p-shamar-16 hover:bg-gray-50 transition-colors";
const linkStyle = "flex items-center gap-4 w-full text-left";

import type { AppRole } from '@/services/auth.service';

interface ProfileHubProps {
  user: { id: string; email: string; role: AppRole };
  profile?: { full_name?: string; phone?: string; country?: string; city?: string; kyc_status?: string } | null;
}

export default function ProfileHub({ user, profile }: ProfileHubProps) {
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Utilisateur';
  const roleLabel = user.role === 'seller' ? 'Vendeur' : user.role === 'admin' ? 'Admin' : 'Acheteur';

  return (
    <div className="max-w-4xl mx-auto space-y-shamar-24">
      {/* En-tête hub — centre de pilotage personnel */}
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 md:p-shamar-32">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand-vert/20 flex items-center justify-center text-brand-vert text-2xl font-bold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-shamar-h1 md:text-2xl font-bold text-gray-900 tracking-tight">
              Pour <span className="text-primary-600">moi</span>
            </h1>
            <p className="text-gray-700 font-medium mt-0.5 text-shamar-body">{displayName}</p>
            <p className="text-gray-500 text-shamar-small mt-0.5">{user.email}</p>
            {profile?.phone && <p className="text-gray-500 text-shamar-small">{profile.phone}</p>}
            {(profile?.country || profile?.city) && (
              <p className="text-gray-500 text-shamar-small">{[profile.country, profile.city].filter(Boolean).join(', ')}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-shamar-small font-medium rounded-shamar-sm capitalize">{roleLabel}</span>
              {(() => {
                const kyc = profile?.kyc_status;
                const kycLabels: Record<string, { label: string; className: string }> = {
                  verified: { label: 'KYC validé', className: 'bg-emerald-100 text-emerald-700' },
                  pending: { label: 'KYC en attente', className: 'bg-amber-100 text-amber-700' },
                  rejected: { label: 'KYC refusé', className: 'bg-red-100 text-red-700' },
                };
                const kycInfo = kyc && kycLabels[kyc];
                if (kycInfo) return <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${kycInfo.className}`}>{kycInfo.label}</span>;
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-shamar-small font-medium rounded-shamar-sm">Non vérifié</span>;
              })()}
            </div>
            <Link href="/profile/roles" className="inline-flex items-center gap-2 mt-4 text-shamar-small font-medium text-primary-600 hover:underline">
              <Repeat size={16} /> Basculer rôle
            </Link>
          </div>
        </div>
        <p className="text-gray-500 text-shamar-small mt-4 border-t border-gray-200 pt-4">
          Centre de pilotage personnel — Compte, business, finances, sécurité, opérations
        </p>
      </div>

      {/* 1. Identité / KYC / Sécurité */}
      <section className={sectionStyle}>
        <h2 className="p-shamar-16 border-b border-gray-200 font-semibold text-shamar-h4 text-gray-900">Identité & Sécurité</h2>
        <div className="divide-y divide-slate-50">
          <Link href="/profile/info" className={`${itemStyle} ${linkStyle}`}>
            <User size={20} className="text-brand-vert" />
            <span>Infos personnelles</span>
          </Link>
          <Link href="/profile/kyc" className={`${itemStyle} ${linkStyle}`}>
            <BadgeCheck size={20} className="text-brand-vert" />
            <span>Vérification identité (KYC)</span>
          </Link>
          <Link href="/profile/security" className={`${itemStyle} ${linkStyle}`}>
            <Shield size={20} className="text-brand-vert" />
            <span>Sécurité & sessions</span>
          </Link>
        </div>
      </section>

      {/* 2. Rôles */}
      <section className={sectionStyle}>
        <h2 className="p-shamar-16 border-b border-gray-200 font-semibold text-shamar-h4 text-gray-900">Rôle</h2>
        <Link href="/profile/roles" className={`${itemStyle} ${linkStyle}`}>
          <Repeat size={20} className="text-brand-vert" />
          <span>Basculer Acheteur / Vendeur / Pro</span>
        </Link>
      </section>

      {/* 3. Boutique (vendeur) + 4. Achats + 5. Panier */}
      <section className={sectionStyle}>
        <h2 className="p-shamar-16 border-b border-gray-200 font-semibold text-shamar-h4 text-gray-900">Activité</h2>
        <div className="divide-y divide-slate-50">
          <Link href="/profile/orders" className={`${itemStyle} ${linkStyle}`}>
            <Package size={20} className="text-brand-vert" />
            <span>Mes commandes</span>
          </Link>
          <Link href="/profile/cart" className={`${itemStyle} ${linkStyle}`}>
            <ShoppingCart size={20} className="text-brand-vert" />
            <span>Panier</span>
          </Link>
          <Link href="/profile/favorites" className={`${itemStyle} ${linkStyle}`}>
            <Heart size={20} className="text-brand-vert" />
            <span>Favoris</span>
          </Link>
          {(user.role === 'seller' || user.role === 'admin') && (
            <>
              <Link href="/profile/shop" className={`${itemStyle} ${linkStyle}`}>
                <Store size={20} className="text-brand-vert" />
                <span>Ma boutique</span>
              </Link>
              <Link href="/profile/shop/orders" className={`${itemStyle} ${linkStyle}`}>
                <Package size={20} className="text-brand-vert" />
                <span>Commandes reçues</span>
              </Link>
              <Link href="/profile/shop/earnings" className={`${itemStyle} ${linkStyle}`}>
                <Banknote size={20} className="text-brand-vert" />
                <span>Revenus</span>
              </Link>
              <Link href="/profile/products" className={`${itemStyle} ${linkStyle}`}>
                <FileText size={20} className="text-brand-vert" />
                <span>Mes produits</span>
              </Link>
              <Link href="/profile/analytics" className={`${itemStyle} ${linkStyle}`}>
                <History size={20} className="text-brand-vert" />
                <span>Analytics vendeur</span>
              </Link>
            </>
          )}
          {user.role !== 'seller' && user.role !== 'admin' && (
            <Link href="/dashboard/onboarding-vendeur" className={`${itemStyle} ${linkStyle}`}>
              <Store size={20} className="text-brand-vert" />
              <span className="text-brand-or font-medium">Devenir vendeur</span>
            </Link>
          )}
        </div>
      </section>

      {/* 6. Finances / Wallet */}
      <section className={sectionStyle}>
        <h2 className="p-shamar-16 border-b border-gray-200 font-semibold text-shamar-h4 text-gray-900">Finances</h2>
        <div className="divide-y divide-slate-50">
          <Link href="/profile/wallet" className={`${itemStyle} ${linkStyle}`}>
            <Wallet size={20} className="text-brand-vert" />
            <span>Wallet & solde</span>
          </Link>
          <Link href="/profile/wallet/history" className={`${itemStyle} ${linkStyle}`}>
            <History size={20} className="text-brand-vert" />
            <span>Historique transactions</span>
          </Link>
          <Link href="/profile/wallet/methods" className={`${itemStyle} ${linkStyle}`}>
            <CreditCard size={20} className="text-brand-vert" />
            <span>Moyens de paiement</span>
          </Link>
          <Link href="/profile/payments" className={`${itemStyle} ${linkStyle}`}>
            <CreditCard size={20} className="text-brand-vert" />
            <span>Paiements & factures</span>
          </Link>
          {(user.role === 'seller' || user.role === 'admin') && (
            <>
              <Link href="/profile/commissions" className={`${itemStyle} ${linkStyle}`}>
                <Banknote size={20} className="text-brand-vert" />
                <span>Commissions</span>
              </Link>
              <Link href="/profile/payouts" className={`${itemStyle} ${linkStyle}`}>
                <History size={20} className="text-brand-vert" />
                <span>Retraits</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* 7. Litiges + 8. Logistique + 9. Badges */}
      <section className={sectionStyle}>
        <h2 className="p-shamar-16 border-b border-gray-200 font-semibold text-shamar-h4 text-gray-900">Litiges, livraisons & badges</h2>
        <div className="divide-y divide-slate-50">
          <Link href="/profile/disputes" className={`${itemStyle} ${linkStyle}`}>
            <AlertTriangle size={20} className="text-brand-vert" />
            <span>Litiges</span>
          </Link>
          <Link href="/profile/deliveries" className={`${itemStyle} ${linkStyle}`}>
            <Truck size={20} className="text-brand-vert" />
            <span>Livraisons & suivi</span>
          </Link>
          <Link href="/profile/addresses" className={`${itemStyle} ${linkStyle}`}>
            <MapPin size={20} className="text-brand-vert" />
            <span>Adresses</span>
          </Link>
          <Link href="/profile/badges" className={`${itemStyle} ${linkStyle}`}>
            <Award size={20} className="text-brand-vert" />
            <span>Badges & confiance</span>
          </Link>
        </div>
      </section>

      {/* 10. Paramètres + Support + Déconnexion */}
      <section className={sectionStyle}>
        <h2 className="p-shamar-16 border-b border-gray-200 font-semibold text-shamar-h4 text-gray-900">Paramètres & Support</h2>
        <div className="divide-y divide-slate-50">
          <Link href="/profile/settings" className={`${itemStyle} ${linkStyle}`}>
            <Globe size={20} className="text-brand-vert" />
            <span>Paramètres (langue, notifications, thème)</span>
          </Link>
          <Link href="/profile/edit" className={`${itemStyle} ${linkStyle}`}>
            <User size={20} className="text-brand-vert" />
            <span>Modifier mon compte</span>
          </Link>
          <Link href="/settings/notifications" className={`${itemStyle} ${linkStyle}`}>
            <Bell size={20} className="text-brand-vert" />
            <span>Notifications</span>
          </Link>
          <Link href="/aide" className={`${itemStyle} ${linkStyle}`}>
            <HelpCircle size={20} className="text-brand-vert" />
            <span>Centre d&apos;aide</span>
          </Link>
          <Link href="/messages" className={`${itemStyle} ${linkStyle}`}>
            <Headphones size={20} className="text-brand-vert" />
            <span>Support</span>
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/auth/login';
            }}
            className={`${itemStyle} ${linkStyle} text-red-600 hover:bg-red-50 w-full`}
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </section>
    </div>
  );
}
