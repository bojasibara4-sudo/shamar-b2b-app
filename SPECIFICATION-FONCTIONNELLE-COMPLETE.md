# SPÉCIFICATION FONCTIONNELLE COMPLÈTE — SHAMAR B2B
## Synthèse des Modules Fonctionnels Identifiés

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Source** : Analyse `/_archive/audit/` et fichiers d'audit

---

## 1. DOMAINES FONCTIONNELS IDENTIFIÉS

### (public) — Routes Publiques
**Fonctionnalités** :
- Landing page
- Sourcing (accueil)
- B2B/B2C Marketplace (public)
- International business
- Sourcing Chine
- Airbnb & Tourisme
- Négociation matières premières
- Catalogue produits (public)
- Authentification (login/register)

**Routes** :
- `/` - Landing
- `/sourcing` - Sourcing principal
- `/b2b` - Marketplace B2B
- `/international` - Business international
- `/sourcing-chine` - Sourcing Chine
- `/airbnb` - Tourisme & Airbnb
- `/negociation` - Négociation matières premières
- `/products` - Catalogue produits
- `/products/[id]` - Détail produit
- `/auth/login` - Connexion
- `/auth/register` - Inscription

---

### (marketplace) — Marketplace B2B/B2C
**Fonctionnalités** :
- Boutiques (shops)
- Panier
- Recherche produits
- Filtres produits
- Comparaison produits

**Routes** :
- `/shop` - Liste boutiques
- `/shop/[id]` - Détail boutique
- `/cart` - Panier
- `/search` - Recherche produits

**Dashboard** :
- `/dashboard/seller/products` - Gestion produits
- `/dashboard/buyer/products` - Catalogue buyer

---

### (business) — Business Hub
**Fonctionnalités** :
- Profils entreprise
- Documents d'entreprise
- Onboarding corporate
- Gestion profils utilisateurs
- Dossiers & documents
- Export documentation vault

**Routes** :
- `/profile` - Profil utilisateur
- `/profile/company` - Profil entreprise
- `/documents` - Documents d'entreprise
- `/onboarding` - Onboarding corporate

**Dashboard** :
- `/dashboard/buyer/profile` - Profil buyer
- `/dashboard/seller/onboarding` - Onboarding seller
- `/dashboard/seller/documents` - Documents seller

---

### (dashboard) — Dashboard Principal
**Fonctionnalités** :
- Dashboard buyer
- Dashboard seller
- Dashboard admin
- Gestion boutiques
- Vue d'ensemble commandes
- Analytics basiques

**Routes** :
- `/dashboard` - Redirection par rôle
- `/dashboard/buyer` - Dashboard buyer
- `/dashboard/seller` - Dashboard seller
- `/dashboard/admin` - Dashboard admin
- `/dashboard/shops` - Gestion boutiques

---

### (finance) — Finance & Paiements
**Fonctionnalités** :
- Paiements (Stripe, Mobile Money)
- Facturation
- Contrats
- Négociation (RFQ, historique)
- Commissions
- Payouts vendeurs
- Transactions

**Routes** :
- `/payments` - Paiements
- `/billing` - Facturation
- `/contracts` - Contrats
- `/negoce` - Négociation
- `/negoce/rfq` - Request for Quotation
- `/negoce/history` - Historique négociations

**Dashboard** :
- `/dashboard/buyer/payments` - Paiements buyer
- `/dashboard/seller/earnings` - Revenus seller
- `/dashboard/seller/commissions` - Commissions seller
- `/dashboard/seller/payouts` - Payouts seller

---

### (admin) — Administration
**Fonctionnalités** :
- Gestion utilisateurs
- Gestion produits
- Gestion commandes
- Analytics globales
- Gestion agents
- Paramètres admin

**Routes** :
- `/admin` - Dashboard admin
- `/admin/users` - Gestion utilisateurs
- `/admin/products` - Gestion produits
- `/admin/orders` - Gestion commandes
- `/admin/analytics` - Analytics
- `/admin/agents` - Gestion agents
- `/admin/settings` - Paramètres

---

### (host) — Interface Partenaires
**Fonctionnalités** :
- Dashboard host
- Calendrier réservations
- Contrats corporate
- Onboarding hosts
- Gestion propriétés

**Routes** :
- `/host` - Dashboard host
- `/host/calendar` - Calendrier réservations
- `/host/contracts` - Contrats corporate
- `/host/onboarding` - Onboarding host
- `/host/properties` - Gestion propriétés

---

### (disputes) — Litiges & Réclamations
**Fonctionnalités** :
- Liste disputes
- Détail dispute
- Création dispute
- Résolution dispute
- Historique disputes

**Routes** :
- `/disputes` - Liste disputes
- `/disputes/[id]` - Détail dispute
- `/disputes/create` - Créer dispute

**Dashboard** :
- `/dashboard/buyer/disputes` - Disputes buyer
- `/dashboard/seller/disputes` - Disputes seller
- `/dashboard/admin/disputes` - Gestion disputes admin

---

## 2. MAPPING MODULES AUDIT → DOMAINES

### Marketplace
- `shamar-marketplace/` → `(marketplace)` + routes publiques
- `shamar-b2b-platform/` → `(marketplace)`
- `shamar-b2b-super-app/` → `(marketplace)` + `(dashboard)`

### Business
- `shamar-business-hub/` → `(business)`
- `shamar-corporate-buyer-dashboard/` → `(business)` + `(dashboard)`
- `shamar-user-profile-hub/` → `(business)`
- `shamar-profile-dashboard/` → `(business)` + `(dashboard)`
- `shamar-dossiers-&-documents/` → `(business)`
- `shamar-export-documentation-vault/` → `(business)`

### Finance
- `negotiant-finance-hub/` → `(finance)`
- `shamar-contracts-&-billing/` → `(finance)`
- `shamar-négoce-*/` → `(finance)` + `(marketplace)/negoce`
- `shamar-negoce-*/` → `(finance)` + `(marketplace)/negoce`
- `shamar-negotiant-*/` → `(finance)` + `(business)`

### Host
- `shamar-host-*/` → `(host)`
- `shamar-hosts---corporate-contracts/` → `(host)` + `(finance)`

### Disputes
- `shamar-dispute-resolution/` → `(disputes)`

### Admin
- `shamar-admin-dashboard/` → `(admin)`

### Tourism
- `shamar-tourism-*/` → Routes publiques (`/airbnb`, `/tourism`)

---

## 3. ARCHITECTURE MODULAIRE CIBLE

### Route Groups Next.js 14

```
app/
├── (public)/              # Routes publiques
├── (marketplace)/         # Marketplace B2B/B2C
├── (business)/            # Business Hub
├── (dashboard)/           # Dashboard principal
├── (finance)/             # Finance & Paiements
├── (admin)/               # Administration
├── (host)/                # Interface Partenaires
└── (disputes)/            # Litiges & Réclamations
```

### Layouts par Domaine

Chaque route group a son propre `layout.tsx` avec :
- Navigation spécifique au domaine
- Protection auth si nécessaire
- Styles cohérents

---

## 4. RÈGLES D'IMPLÉMENTATION

### Ne PAS
- ❌ Copier code depuis `_archive/audit/`
- ❌ Créer du code temporaire
- ❌ Laisser des TODO flous

### DOIT
- ✅ Générer code neuf, propre
- ✅ Next.js 14 App Router
- ✅ TypeScript strict
- ✅ Supabase comme backend
- ✅ Architecture modulaire claire

---

**SPÉCIFICATION COMPLÈTE — PRÊT POUR IMPLÉMENTATION**
