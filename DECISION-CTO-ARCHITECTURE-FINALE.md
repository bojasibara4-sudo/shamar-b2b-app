# DÉCISION CTO — ARCHITECTURE FINALE SHAMAR B2B

**Date** : 2025-01-17  
**Basé sur** : AUDIT-TECHNIQUE-EXHAUSTIF.md  
**Validation** : Décision unique CTO

---

## 1. DÉCISION CTO UNIQUE

### Architecture cible : Route Groups App Router uniquement

**Justification technique** :
- Next.js 14 App Router privilégie les route groups pour l'organisation
- Élimine les conflits entre dossiers plats et route groups
- Unifie la protection d'authentification via middleware étendu
- Simplifie la maintenance et réduit la confusion

**Principe** : Toutes les routes métier dans des route groups, dossiers plats réservés aux routes techniques (`api/`, `auth/`).

---

## 2. ARCHITECTURE CIBLE FINALE

### 2.1 Structure app/ finale

```
app/
├── api/                    # API routes (UNIQUEMENT)
├── (public)/              # Routes publiques (route group)
│   ├── layout.tsx
│   ├── page.tsx           # Portail public (/)
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── onboarding/page.tsx
│   ├── airbnb/page.tsx
│   └── negociation/page.tsx
├── (protected)/           # Routes protégées (route group)
│   ├── layout.tsx         # Protection serveur
│   ├── dashboard/
│   │   ├── layout.tsx     # AuthGuard client
│   │   ├── page.tsx       # /dashboard
│   │   ├── buyer/
│   │   ├── seller/
│   │   └── admin/
│   ├── orders/page.tsx
│   ├── shops/page.tsx
│   ├── messages/page.tsx
│   ├── payments/page.tsx
│   ├── profile/page.tsx
│   ├── settings/page.tsx
│   └── vendor/page.tsx
├── (marketplace)/         # Marketplace (route group)
│   ├── layout.tsx
│   ├── b2b/page.tsx
│   ├── b2c/page.tsx
│   ├── cart/page.tsx
│   ├── international/page.tsx
│   ├── products/page.tsx
│   ├── shop/page.tsx
│   ├── sourcing/page.tsx
│   └── sourcing-chine/page.tsx
├── (admin)/              # Admin (route group)
│   ├── layout.tsx
│   ├── overview/page.tsx
│   └── users/page.tsx
├── (host)/               # Host/Tourisme (route group)
│   ├── layout.tsx
│   ├── host/page.tsx
│   ├── properties/page.tsx
│   └── reservations/page.tsx
├── (business)/           # Business (route group)
│   ├── layout.tsx
│   ├── documents/page.tsx
│   ├── onboarding/page.tsx
│   └── profile/page.tsx
├── (finance)/            # Finance (route group)
│   ├── layout.tsx
│   └── payments/page.tsx
├── (disputes)/           # Disputes (route group)
│   ├── layout.tsx
│   └── disputes/page.tsx
├── (negoce)/             # Négociation (route group)
│   ├── layout.tsx
│   ├── rfq/page.tsx
│   └── perplexity-assistant/page.tsx
├── (messaging)/          # Messaging (route group)
│   ├── layout.tsx
│   └── messages/page.tsx
├── layout.tsx            # Layout racine
├── page.tsx              # Redirige vers (public)/page.tsx ou supprimé si fusion
├── error.tsx
├── loading.tsx
├── not-found.tsx
└── globals.css
```

### 2.2 Suppressions obligatoires

#### Dossiers entiers à supprimer
1. `app/app/` - Routes redirect legacy (5 fichiers)
2. `app/auth/` - Doublon avec `(public)/auth/` (layout + login/register)
3. `app/dashboard/` - Doublon partiel avec `(protected)/dashboard/` (6 fichiers)
4. `app/admin/` - Doublon avec `(admin)/` (1 fichier)
5. `app/marketplace/` - Doublon avec `(marketplace)/` (2 fichiers)
6. `app/negociation/` - Doublon avec `(negoce)/perplexity-assistant/` (2 fichiers)
7. `app/host/` - Doublon avec `(host)/host/` (1 fichier)
8. `app/b2c/` - Dossier vide
9. `app/sourcing/` - Dossier vide
10. `app/profile/` - Dossier vide
11. `app/(public)/b2b/` - Dossier vide
12. `app/(public)/sourcing/` - Dossier vide
13. `app/(public)/international/` - Dossier vide
14. `app/(public)/products/` - À vérifier si vide ou redondant

#### Fichiers à supprimer
- `app/shop/[id]/page.tsx` - Fusionner avec `(marketplace)/shop/[id]/page.tsx` si existe
- `app/panier/page.tsx` - Vérifier si redondant avec `(marketplace)/cart/page.tsx`
- `app/parametres/page.tsx` - Fusionner avec `(protected)/settings/page.tsx`
- `app/page.tsx` - Si redondant avec `(public)/page.tsx`, supprimer après fusion

### 2.3 Conservations obligatoires

#### Route Groups (tous conservés)
- `(public)/` - Routes publiques
- `(protected)/` - Routes protégées
- `(marketplace)/` - Marketplace
- `(admin)/` - Admin
- `(host)/` - Host/Tourisme
- `(business)/` - Business
- `(finance)/` - Finance
- `(disputes)/` - Disputes
- `(negoce)/` - Négociation
- `(messaging)/` - Messaging

#### Dossiers techniques
- `app/api/` - Tous les fichiers API routes
- `app/(public)/auth/` - Authentification (canonique)

#### Layouts
- `app/layout.tsx` - Layout racine
- `app/(public)/layout.tsx` - Layout public
- `app/(protected)/layout.tsx` - Layout protégé
- Tous les layouts de route groups

### 2.4 Modifications obligatoires

#### Middleware (`middleware.ts`)
**Action** : Étendre le matcher pour couvrir toutes les routes protégées

**Avant** :
```typescript
matcher: ['/dashboard/:path*']
```

**Après** :
```typescript
matcher: [
  '/dashboard/:path*',
  '/admin/:path*',
  '/profile/:path*',
  '/settings/:path*',
  '/vendor/:path*',
  '/orders/:path*',
  '/payments/:path*',
  '/messages/:path*',
]
```

**Justification** : Protège toutes les routes protégées au niveau middleware, pas seulement dashboard.

#### Auth Guard (`lib/auth-guard.ts`)
**Action** : Corriger la redirection ligne 26

**Avant** :
```typescript
redirect('/app/dashboard');
```

**Après** :
```typescript
redirect('/dashboard');
```

**Justification** : Redirige vers la route finale, pas la route redirect.

#### Layouts auth
**Action** : Supprimer `app/auth/layout.tsx` et garder uniquement `app/(public)/auth/layout.tsx`

**Justification** : Élimine la duplication, une seule source de vérité.

---

## 3. LISTE EXACTE DES SUPPRESSIONS

### 3.1 Dossiers complets à supprimer (14)

1. `app/app/` (5 fichiers)
2. `app/auth/` (3 fichiers : layout + login + register)
3. `app/dashboard/` (6 fichiers)
4. `app/admin/` (1 fichier)
5. `app/marketplace/` (2 fichiers)
6. `app/negociation/` (2 fichiers)
7. `app/host/` (1 fichier)
8. `app/b2c/` (vide)
9. `app/sourcing/` (vide)
10. `app/profile/` (vide)
11. `app/(public)/b2b/` (vide)
12. `app/(public)/sourcing/` (vide)
13. `app/(public)/international/` (vide)
14. `app/(public)/products/` (à vérifier)

### 3.2 Fichiers individuels à supprimer (4)

1. `app/shop/[id]/page.tsx` (si fusionné avec marketplace)
2. `app/panier/page.tsx` (si redondant avec cart)
3. `app/parametres/page.tsx` (si fusionné avec settings)
4. `app/page.tsx` (si fusionné avec (public)/page.tsx)

**Total à supprimer** : 18 éléments (14 dossiers + 4 fichiers)

---

## 4. LISTE EXACTE DES CONSERVATIONS

### 4.1 Route Groups (10 groupes)
- `(public)/` - 7 pages
- `(protected)/` - 36 pages
- `(marketplace)/` - 9 pages
- `(admin)/` - 3 pages
- `(host)/` - 4 pages
- `(business)/` - 4 pages
- `(finance)/` - 2 pages
- `(disputes)/` - 2 pages
- `(negoce)/` - 2 pages
- `(messaging)/` - 1 page

### 4.2 Dossiers techniques
- `app/api/` - 49 fichiers API routes
- `app/(public)/auth/` - Authentification canonique

### 4.3 Layouts (18 fichiers)
- Tous les layouts de route groups
- Layout racine
- Layouts publics et protégés

**Total conservé** : ~120 pages + 49 API routes + 18 layouts

---

## 5. LISTE EXACTE DES MODIFICATIONS

### 5.1 Fichiers à modifier (2)

1. **`middleware.ts`** :
   - Étendre le matcher pour couvrir toutes les routes protégées
   - Ligne 49-51 : Remplacer le matcher actuel

2. **`lib/auth-guard.ts`** :
   - Corriger la redirection `/app/dashboard` → `/dashboard`
   - Ligne 26 : Remplacer `'/app/dashboard'` par `'/dashboard'`

### 5.2 Fichiers à fusionner (à vérifier)

1. `app/page.tsx` avec `app/(public)/page.tsx` (si contenu identique)
2. `app/panier/page.tsx` avec `app/(marketplace)/cart/page.tsx` (si redondant)
3. `app/parametres/page.tsx` avec `app/(protected)/settings/page.tsx` (si redondant)

---

## 6. ARCHITECTURE AUTHENTIFICATION FINALE

### 6.1 Système unique de protection

**Middleware** : Protection serveur de toutes les routes protégées
- Vérifie session Supabase
- Redirige vers `/auth/login` si non authentifié
- Matcher étendu pour couvrir toutes les routes protégées

**Layout (protected)** : Protection supplémentaire serveur
- Vérifie session + getCurrentUser
- Redirige si non authentifié
- Utilisé uniquement pour les routes dans `(protected)/`

**AuthGuard (client)** : Protection client pour composants
- Utilisé uniquement dans layouts client
- Vérifie authentification côté client
- Affiche messages de chargement/erreur

**Guards serveur** : Protection page par page
- `requireAuth()`, `requireAdmin()`, `requireSeller()`, `requireBuyer()`
- Utilisés dans pages serveur individuelles
- Redirige vers routes appropriées

**Justification** : Triple couche (Middleware + Layout + Guards) pour sécurité maximale, mais sans chevauchement inutile.

### 6.2 Clients Supabase (consolidation future)

**Clients conservés** (pour l'instant) :
- `lib/supabase/client.ts` - Client navigateur (SSR)
- `lib/supabase/server.ts` - Client serveur (SSR)
- `lib/supabase-server.ts` - Wrapper serveur avec try/catch

**Client à évaluer** :
- `lib/supabaseClient.ts` - Client alternatif (à vérifier usage)

**Action future** : Consolider en 2 clients maximum (client + server).

---

## 7. RÉSULTAT ATTENDU

### 7.1 Architecture finale
- ✅ Route Groups uniquement pour routes métier
- ✅ Dossiers plats réservés aux routes techniques
- ✅ Middleware étendu protège toutes les routes protégées
- ✅ Redirections cohérentes (pas de `/app/dashboard`)
- ✅ Aucune duplication de routes

### 7.2 Statistiques attendues
- **Routes supprimées** : ~18 éléments (14 dossiers + 4 fichiers)
- **Routes conservées** : ~120 pages + 49 API routes
- **Layouts** : 18 (pas de duplication auth)
- **Clients Supabase** : 3 (consolidation future recommandée)
- **Protection auth** : 4 systèmes (middleware + layout + guard + guards serveur)

---

## 8. COMPATIBILITÉ VERCEL

### 8.1 Build requis
- Next.js 14.2.35 (App Router)
- TypeScript strict
- ESLint activé
- Variables d'environnement Supabase

### 8.2 Vérifications post-modification
1. `npm run build` doit réussir
2. Toutes les routes doivent être accessibles
3. Aucune page blanche
4. Redirections fonctionnelles
5. Auth fonctionnelle sur toutes les routes protégées

---

## 9. PLAN D'EXÉCUTION

### Phase 1 : Suppressions
1. Supprimer les 14 dossiers listés
2. Supprimer les 4 fichiers individuels listés

### Phase 2 : Modifications
1. Modifier `middleware.ts` (matcher étendu)
2. Modifier `lib/auth-guard.ts` (redirection corrigée)

### Phase 3 : Vérifications
1. Build local (`npm run build`)
2. Test routes principales
3. Test authentification
4. Test redirections

### Phase 4 : Validation
1. Aucune erreur build
2. Toutes les routes accessibles
3. Aucune page blanche
4. Auth fonctionnelle

---

## 10. CONCLUSION CTO

**Décision** : Architecture Route Groups App Router uniquement avec middleware étendu.

**Bénéfices** :
- Élimine tous les conflits de routes
- Unifie la protection d'authentification
- Simplifie la maintenance
- Compatible Vercel + Supabase + Next.js 14

**Risques** :
- Aucun risque critique identifié
- Suppressions réversibles via Git
- Tests post-modification obligatoires

**Production ready** : Oui, après exécution et validation.

---

**FIN DE LA DÉCISION CTO**
