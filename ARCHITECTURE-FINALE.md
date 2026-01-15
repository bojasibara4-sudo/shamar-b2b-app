# ARCHITECTURE FINALE — SHAMAR B2B
## Structure Recommandée pour Croissance 2025+

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Base saine, maintenable, scalable

---

## 1. STRUCTURE RACINE

```
shamar-b2b-clean/
├── app/                    # Next.js App Router
├── components/             # Composants React réutilisables
├── lib/                    # Utilitaires et configurations
├── services/               # Logique métier backend
├── hooks/                  # Hooks React personnalisés
├── types/                  # Types TypeScript
├── public/                 # Assets statiques
├── scripts/                # Scripts utilitaires
├── _archive/               # Documentation et références
└── middleware.ts          # Next.js middleware
```

---

## 2. STRUCTURE `/app`

### Routes Publiques
```
app/
├── page.tsx                # Landing page
├── sourcing/               # Sourcing
├── b2b/                    # B2B Marketplace
├── international/          # Business International
├── sourcing-chine/         # Sourcing Chine
├── airbnb/                 # Tourisme & Airbnb
├── negociation/            # Négociation matières premières
├── products/               # Catalogue produits
├── panier/                 # Panier
├── parametres/             # Mon espace
└── auth/                   # Authentification
    ├── login/
    └── register/
```

### Routes Protégées
```
app/
└── (protected)/            # Route group (protection auth)
    ├── layout.tsx          # Layout avec protection
    ├── dashboard/          # Dashboard principal
    │   ├── buyer/          # Dashboard buyer
    │   ├── seller/         # Dashboard seller
    │   ├── admin/          # Dashboard admin
    │   └── shops/          # Boutiques
    ├── messages/           # Messages
    ├── orders/             # Commandes
    ├── payments/           # Paiements
    ├── profile/            # Profil
    ├── settings/           # Paramètres
    └── vendor/             # Espace vendeur
```

### API Routes
```
app/api/
├── auth/                   # Authentification
├── buyer/                  # Actions buyer
├── seller/                 # Actions seller
├── admin/                  # Actions admin
├── payments/               # Paiements
├── delivery/               # Livraisons
├── reviews/                # Avis
├── disputes/               # Litiges
├── messages/                # Messages
├── offers/                 # Offres
└── products/               # Produits (recherche)
```

---

## 3. STRUCTURE `/components`

### Organisation par Domaine
```
components/
├── buyer/                  # Composants buyer
├── seller/                 # Composants seller
├── admin/                  # Composants admin
├── dashboard/              # Composants dashboard
├── orders/                 # Composants commandes
├── products/               # Composants produits
├── checkout/               # Composants checkout
├── layout/                 # Composants layout
└── ui/                     # Composants UI réutilisables
```

### Composants Globaux
```
components/
├── GlobalHeaderWithAuth.tsx
├── GlobalUserMenu.tsx
├── AuthGuard.tsx
├── BuyerSidebar.tsx
├── SellerSidebar.tsx
├── AdminSidebar.tsx
└── LogoutButton.tsx
```

---

## 4. STRUCTURE `/lib`

### Clients Supabase (Recommandé)
```
lib/
└── supabase/
    ├── client.ts           # Client browser (SSR)
    └── server.ts           # Client serveur (SSR)
```

**Pattern recommandé** :
- Client browser : `import { createClient } from '@/lib/supabase/client'`
- Client serveur : `import { createClient } from '@/lib/supabase/server'`

### Auth & Guards
```
lib/
├── auth.tsx                # getCurrentUser()
├── auth-guard.ts           # Guards (requireAuth, requireRole, etc.)
├── permissions.ts          # Permissions par rôle
└── user-role.ts            # Utilitaires rôles
```

### Services Métier
```
lib/
└── (services métier dans /services/)
```

---

## 5. STRUCTURE `/services`

### Services Backend
```
services/
├── auth.service.ts
├── vendor.service.ts
├── badge.service.ts
├── commission.service.ts
├── document.service.ts
├── vendorStatus.service.ts
├── shop.service.ts
├── payment.service.ts
├── payout.service.ts
├── webhook.service.ts
├── delivery.service.ts
├── review.service.ts
├── dispute.service.ts
└── analytics.service.ts
```

**Principe** : Un service = une responsabilité métier

---

## 6. RÈGLES ARCHITECTURALES

### Séparation des Responsabilités

1. **page.tsx** (Server Component)
   - Récupération données (Supabase)
   - Vérification auth/role
   - Rendering composants clients

2. **Composants Clients** (`'use client'`)
   - Logique UI uniquement
   - États locaux (useState)
   - Appels API (fetch)
   - Interactions utilisateur

3. **Services** (`/services`)
   - Logique métier pure
   - Calculs
   - Validations
   - Transformations données

4. **API Routes** (`/app/api`)
   - Validation auth/role
   - Appel services métier
   - Retour JSON

### Source de Vérité Unique

- ✅ **Supabase** = Source unique de données
- ❌ **Aucun mock** en production
- ❌ **Aucune duplication** de clients Supabase

### Patterns Cohérents

1. **Auth** : `getCurrentUser()` depuis `lib/auth.tsx`
2. **Guards** : `requireAuth()`, `requireRole()`, etc. depuis `lib/auth-guard.ts`
3. **Supabase Client** : `createClient()` depuis `lib/supabase/*`
4. **Services** : Import depuis `/services/*.service.ts`

---

## 7. TODO POUR PRODUCTION

### Priorité 1 : Migration Mock Data
- [ ] Migrer `/api/buyer/products` vers Supabase
- [ ] Migrer `/api/admin/products` vers Supabase
- [ ] Migrer `/api/admin/orders` vers Supabase
- [ ] Migrer `/api/admin/orders/[id]/status` vers Supabase
- [ ] Migrer `/api/seller/commissions` vers Supabase
- [ ] Migrer `/api/admin/commissions` vers Supabase
- [ ] Migrer `/api/admin/users` vers Supabase
- [ ] Supprimer `lib/mock-data.ts` après migration complète

### Priorité 2 : Unification Supabase
- [ ] Migrer `hooks/useAuth.ts` vers `lib/supabase/client.ts`
- [ ] Migrer `app/products/*` vers `lib/supabase/client.ts`
- [ ] Migrer `app/(protected)/dashboard/shops/*` vers `lib/supabase/client.ts`
- [ ] Migrer `app/(protected)/dashboard/orders/*` vers `lib/supabase/client.ts`
- [ ] Supprimer `lib/supabaseClient.ts` après migration
- [ ] Vérifier et supprimer `lib/supabase.ts` si dupliqué
- [ ] Vérifier et supprimer `lib/supabase-server.ts` si redondant

### Priorité 3 : Documentation
- [ ] Documenter toutes les API routes
- [ ] Documenter les services métier
- [ ] Créer guide onboarding développeur

---

## 8. BASE SAINE POUR 2025+

### Points Forts
- ✅ Architecture Next.js 14 App Router propre
- ✅ Séparation claire des responsabilités
- ✅ Auth et rôles fonctionnels
- ✅ Produits seller CRUD complet (Supabase)
- ✅ Commandes buyer/seller fonctionnelles (Supabase)
- ✅ Dashboards connectés aux API réelles

### Améliorations Continues
- ⚠️ Migration mock data restants
- ⚠️ Unification clients Supabase
- ⚠️ Documentation complète

### Scalabilité
- ✅ Structure prête pour Orders / Payments / Disputes
- ✅ Services métier extensibles
- ✅ Patterns cohérents et maintenables

---

**ARCHITECTURE FINALE — BASE SAINE POUR CROISSANCE 2025+**
