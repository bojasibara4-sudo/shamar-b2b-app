# PLAN ARCHITECTURE MODULAIRE — SHAMAR B2B
## Reconstruction Complète Basée sur Spécification Fonctionnelle

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Reconstruire une application Next.js 14 cohérente avec architecture modulaire

---

## 1. ANALYSE SPÉCIFICATION FONCTIONNELLE

### Modules Identifiés dans `/_archive/audit/`

#### 1. MARKETPLACE
**Dossiers** :
- `shamar-marketplace/` (principal)
- `shamar-b2b-platform/`
- `shamar-b2b-super-app/`

**Fonctionnalités** :
- Vente produits B2B/B2C
- Catalogue produits
- Recherche produits
- Panier
- Boutiques (shops)

**Domaine** : `(marketplace)`

---

#### 2. BUSINESS HUB
**Dossiers** :
- `shamar-business-hub/`
- `shamar-corporate-buyer-dashboard/`
- `shamar-user-profile-hub/`
- `shamar-profile-dashboard/`

**Fonctionnalités** :
- Profils entreprise
- Documents d'entreprise
- Onboarding corporate
- Gestion profils

**Domaine** : `(business)`

---

#### 3. FINANCE & NÉGOCE
**Dossiers** :
- `negotiant-finance-hub/`
- `shamar-contracts-&-billing/`
- `shamar-négoce-*/`
- `shamar-negoce-*/`
- `shamar-negotiant-*/`

**Fonctionnalités** :
- Paiements
- Facturation
- Contrats
- Négociation matières premières
- RFQ (Request for Quotation)
- Historique négociations

**Domaine** : `(finance)` + routes négoce dans `(marketplace)`

---

#### 4. HOST / PARTENAIRES
**Dossiers** :
- `shamar-host-*/`
- `shamar-hosts---corporate-contracts/`

**Fonctionnalités** :
- Interface partenaires
- Calendrier réservations
- Contrats corporate
- Onboarding hosts

**Domaine** : `(host)`

---

#### 5. DISPUTES
**Dossiers** :
- `shamar-dispute-resolution/`

**Fonctionnalités** :
- Gestion litiges
- Résolution disputes
- Réclamations

**Domaine** : `(disputes)`

---

#### 6. DOCUMENTS & EXPORT
**Dossiers** :
- `shamar-dossiers-&-documents/`
- `shamar-export-documentation-vault/`

**Fonctionnalités** :
- Gestion documents
- Vault export
- Documentation

**Domaine** : Intégré dans `(business)` et `(finance)`

---

#### 7. ADMIN
**Dossiers** :
- `shamar-admin-dashboard/`

**Fonctionnalités** :
- Administration globale
- Analytics
- Gestion utilisateurs

**Domaine** : `(admin)`

---

#### 8. TOURISM
**Dossiers** :
- `shamar-tourism-*/`
- `shamar-tourisme-*/`

**Fonctionnalités** :
- Tourisme & business travel
- Réservations
- Détails propriétés

**Domaine** : Routes publiques (`/airbnb`, `/tourism`)

---

## 2. ARCHITECTURE CIBLE — ROUTE GROUPS

### Structure `/app` Modulaire

```
app/
├── (public)/              # Routes publiques
│   ├── layout.tsx        # Layout public (header, footer)
│   ├── page.tsx          # Landing page
│   ├── sourcing/         # Sourcing
│   ├── b2b/              # B2B Marketplace (public)
│   ├── international/     # Business International
│   ├── sourcing-chine/   # Sourcing Chine
│   ├── airbnb/           # Tourisme & Airbnb
│   ├── negociation/      # Négociation matières premières
│   ├── products/         # Catalogue produits (public)
│   └── auth/             # Authentification
│       ├── login/
│       └── register/
│
├── (marketplace)/        # Marketplace B2B/B2C
│   ├── layout.tsx        # Layout marketplace
│   ├── shop/             # Boutiques
│   ├── cart/             # Panier
│   └── search/           # Recherche produits
│
├── (business)/           # Business Hub
│   ├── layout.tsx        # Layout business
│   ├── profile/          # Profils entreprise
│   ├── documents/        # Documents d'entreprise
│   └── onboarding/       # Onboarding corporate
│
├── (dashboard)/          # Dashboard principal
│   ├── layout.tsx        # Layout dashboard (auth required)
│   ├── page.tsx          # Dashboard (redirection par rôle)
│   ├── buyer/            # Dashboard buyer
│   ├── seller/           # Dashboard seller
│   └── shops/            # Gestion boutiques
│
├── (finance)/            # Finance & Paiements
│   ├── layout.tsx        # Layout finance
│   ├── payments/         # Paiements
│   ├── billing/          # Facturation
│   ├── contracts/        # Contrats
│   └── negoce/           # Négociation (RFQ, historique)
│
├── (admin)/              # Administration
│   ├── layout.tsx        # Layout admin (admin only)
│   ├── page.tsx          # Dashboard admin
│   ├── users/            # Gestion utilisateurs
│   ├── analytics/        # Analytics
│   └── settings/         # Paramètres admin
│
├── (host)/               # Interface Partenaires
│   ├── layout.tsx        # Layout host
│   ├── page.tsx          # Dashboard host
│   ├── calendar/         # Calendrier réservations
│   └── contracts/        # Contrats corporate
│
└── (disputes)/           # Litiges & Réclamations
    ├── layout.tsx        # Layout disputes
    ├── page.tsx          # Liste disputes
    └── [id]/             # Détail dispute
```

---

## 3. MAPPING MODULES → DOMAINES

### Marketplace
- **Routes** : `/shop/*`, `/cart`, `/search`
- **Pages publiques** : `/products`, `/b2b`
- **Dashboard** : `/dashboard/seller/products`, `/dashboard/buyer/products`

### Business
- **Routes** : `/profile`, `/documents`, `/onboarding`
- **Dashboard** : `/dashboard/buyer/profile`, `/dashboard/seller/onboarding`

### Finance
- **Routes** : `/payments`, `/billing`, `/contracts`, `/negoce`
- **Dashboard** : `/dashboard/buyer/payments`, `/dashboard/seller/earnings`

### Host
- **Routes** : `/host/*`
- **Dashboard** : `/dashboard/host/*`

### Disputes
- **Routes** : `/disputes/*`
- **Dashboard** : `/dashboard/buyer/disputes`, `/dashboard/seller/disputes`

### Admin
- **Routes** : `/admin/*`
- **Dashboard** : `/dashboard/admin/*`

---

## 4. PLAN D'IMPLÉMENTATION

### Phase 1 : Structure Route Groups
1. Créer route groups `(public)`, `(marketplace)`, `(business)`, `(dashboard)`, `(finance)`, `(admin)`, `(host)`, `(disputes)`
2. Créer layouts pour chaque groupe
3. Migrer routes existantes vers groupes appropriés

### Phase 2 : Pages Minimum Viables
1. Générer pages MVP pour chaque domaine
2. Utiliser composants existants quand possible
3. Créer composants manquants si nécessaire

### Phase 3 : Nettoyage
1. Supprimer routes orphelines
2. Supprimer composants non utilisés
3. Supprimer fichiers morts

### Phase 4 : Validation
1. Vérifier build Next.js
2. Vérifier cohérence routes
3. Vérifier auth/guards

---

## 5. RÈGLES STRICTES

### Ne PAS
- ❌ Copier code depuis `_archive/audit/`
- ❌ Déplacer `node_modules`, `.env`
- ❌ Créer du code temporaire
- ❌ Laisser des TODO flous

### DOIT
- ✅ Générer code neuf, propre
- ✅ Utiliser Next.js 14 App Router
- ✅ TypeScript strict
- ✅ Supabase comme backend
- ✅ Architecture modulaire claire

---

**PLAN CRÉÉ — PRÊT POUR IMPLÉMENTATION**
