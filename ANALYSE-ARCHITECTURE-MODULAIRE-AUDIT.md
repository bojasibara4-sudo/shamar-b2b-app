# ANALYSE ARCHITECTURE MODULAIRE - AUDIT COMPLET
## SHAMAR B2B - Mapping Audit → Domaines Applicatifs

**Date** : 2025-01-27  
**Mission** : Analyser `/_archive/audit` et proposer architecture cible modulaire  
**Statut** : ✅ ANALYSE COMPLÈTE

---

## 1. DOMAINES FONCTIONNELS IDENTIFIÉS

### Domaines Principaux (8 domaines)

1. **PUBLIC** - Landing, authentification, pages publiques
2. **MARKETPLACE** - Vente, produits, fournisseurs, sourcing, catalogue
3. **BUSINESS** - Entreprises, documents, profils, onboarding
4. **DASHBOARD** - Vue centrale B2B (buyer, seller, admin dashboards)
5. **FINANCE** - Paiements, facturation, commissions, payouts, transactions
6. **ADMIN** - Administration, validation, monitoring, compliance
7. **HOST** - Partenaires/hosts (Airbnb, hébergement, réservations)
8. **DISPUTES** - Litiges & réclamations, médiation

### Domaines Secondaires (2 domaines)

9. **NÉGOCE** - Négociation matières premières, RFQ, historique négociation
10. **MESSAGING** - Messages sécurisés, centre de messagerie

---

## 2. MAPPING AUDIT → DOMAINE APPLICATIF

### DOMAINE : PUBLIC

**Dossiers audit :**
- `shamar-onboarding/` → Onboarding public (inscription)
- `shamar-user-hub/` → Hub utilisateur (profil public)
- `shamar-user-profile-hub/` → Profil utilisateur public

**Fonctionnalités identifiées :**
- Landing page
- Authentification (login/register)
- Onboarding initial
- Profil utilisateur public

**Routes cibles :**
- `/` - Landing
- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/auth/onboarding` - Onboarding initial

---

### DOMAINE : MARKETPLACE

**Dossiers audit :**
- `shamar-marketplace/` (principal) → Marketplace principal
- `shamar-marketplace - Copie/` → Variante marketplace
- `shamar-marketplace (1)/` à `(2)/` → Copies marketplace
- `copy-of-shamar-marketplace/` → Copie marketplace
- `Marketplace-shamar--main/` → Marketplace main
- `shamar-sourcing-china---quotation-detail/` → Sourcing Chine
- `shamar-negoce-rfq-portal/` → Portail RFQ

**Fonctionnalités identifiées :**
- Home/Sourcing (vue d'accueil sourcing)
- Shops (boutiques B2B/B2C/International)
- Products (catalogue produits)
- Cart (panier)
- Sourcing Chine (sourcing spécifique Chine)
- RFQ Portal (demandes de devis)

**Routes cibles :**
- `/marketplace/sourcing` - Vue sourcing principal
- `/marketplace/b2b` - Marketplace B2B
- `/marketplace/b2c` - Marketplace B2C
- `/marketplace/international` - Marketplace international
- `/marketplace/sourcing-chine` - Sourcing Chine
- `/marketplace/shop` - Boutiques
- `/marketplace/products` - Catalogue produits
- `/marketplace/cart` - Panier
- `/marketplace/rfq` - Portail RFQ

---

### DOMAINE : BUSINESS

**Dossiers audit :**
- `shamar-business-hub/` (principal) → Hub business
- `shamar-business-hub - Copie/` → Variante business hub
- `shamar-business-hub - Copie (2)/` → Copie business hub
- `shamar-profile-dashboard/` (x5 copies) → Dashboard profil
- `shamar-corporate-buyer-dashboard/` → Dashboard acheteur corporate
- `shamar-dossiers-&-documents/` → Dossiers & documents
- `shamar-export-documentation-vault/` → Vault documentation export

**Fonctionnalités identifiées :**
- Profil entreprise
- Documents légaux
- Onboarding vendeur
- Profil corporate buyer
- Vault documentation
- Compliance

**Routes cibles :**
- `/business/profile` - Profil entreprise
- `/business/documents` - Documents légaux
- `/business/onboarding` - Onboarding vendeur
- `/business/compliance` - Compliance
- `/business/vault` - Vault documentation

---

### DOMAINE : DASHBOARD

**Dossiers audit :**
- `shamar-corporate-buyer-dashboard/` → Dashboard buyer
- `shamar-negoce-seller-dashboard/` → Dashboard seller négoce
- `shamar-negoce-seller-dashboard - Copie/` → Copie dashboard seller
- `shamar-admin-dashboard/` → Dashboard admin
- `shamar-pricing-pro/` → Pricing pro

**Fonctionnalités identifiées :**
- Dashboard buyer (vue acheteur)
- Dashboard seller (vue vendeur)
- Dashboard admin (vue admin)
- Overview, analytics, stats
- Product catalog management
- RFQ inbox

**Routes cibles :**
- `/dashboard/buyer` - Dashboard acheteur
- `/dashboard/seller` - Dashboard vendeur
- `/dashboard/admin` - Dashboard admin
- `/dashboard/buyer/products` - Produits buyer
- `/dashboard/buyer/orders` - Commandes buyer
- `/dashboard/seller/products` - Produits seller
- `/dashboard/seller/orders` - Commandes seller
- `/dashboard/seller/analytics` - Analytics seller
- `/dashboard/admin/overview` - Vue admin
- `/dashboard/admin/users` - Gestion utilisateurs

---

### DOMAINE : FINANCE

**Dossiers audit :**
- `negotiant-finance-hub/` (principal) → Hub finance négociant
- `negotiant-finance-hub - Copie/` → Copie finance hub
- `negotiant-finance-hub - Copie (2)/` → Copie finance hub
- `shamar-contracts-&-billing/` → Contrats & facturation

**Fonctionnalités identifiées :**
- Paiements
- Transactions
- Commissions
- Payouts
- Facturation
- Contrats
- Earnings charts
- Stats financières

**Routes cibles :**
- `/finance/payments` - Paiements
- `/finance/transactions` - Transactions
- `/finance/commissions` - Commissions
- `/finance/payouts` - Payouts
- `/finance/invoicing` - Facturation
- `/finance/contracts` - Contrats

---

### DOMAINE : ADMIN

**Dossiers audit :**
- `shamar-admin-dashboard/` → Dashboard admin principal

**Fonctionnalités identifiées :**
- Overview admin
- User management
- Booking management
- RFQ management
- Dispute management
- Compliance
- Validation documents/boutiques

**Routes cibles :**
- `/admin/overview` - Vue globale
- `/admin/users` - Gestion utilisateurs
- `/admin/bookings` - Gestion réservations
- `/admin/rfq` - Gestion RFQ
- `/admin/disputes` - Gestion litiges
- `/admin/compliance` - Compliance
- `/admin/validation` - Validation documents/boutiques

---

### DOMAINE : HOST

**Dossiers audit :**
- `shamar-host-dashboard/` → Dashboard host principal
- `shamar-host-interface/` → Interface host
- `shamar-host-onboarding/` → Onboarding host
- `shamar-host-calendar/` → Calendrier host
- `shamar-hosts---corporate-contracts/` → Contrats corporate hosts
- `shamar-tourism-&-business/` → Tourisme & business
- `shamar-tourism-&-business-travel/` → Tourisme & business travel
- `shamar-tourisme-&-business-travel/` → Tourisme & business travel
- `shamar-tourism---property-detail/` → Détail propriété tourisme

**Fonctionnalités identifiées :**
- Dashboard host
- Propriétés
- Réservations
- Paiements host
- Calendrier
- Onboarding host
- Contrats corporate

**Routes cibles :**
- `/host/dashboard` - Dashboard host
- `/host/properties` - Propriétés
- `/host/reservations` - Réservations
- `/host/payments` - Paiements host
- `/host/calendar` - Calendrier
- `/host/onboarding` - Onboarding host
- `/host/contracts` - Contrats corporate

---

### DOMAINE : DISPUTES

**Dossiers audit :**
- `shamar-dispute-resolution (1)/` → Résolution litiges principal

**Fonctionnalités identifiées :**
- Liste litiges
- Détail litige
- Médiation
- Preuves
- Messages litige
- Statut litige

**Routes cibles :**
- `/disputes` - Liste litiges
- `/disputes/[id]` - Détail litige
- `/disputes/[id]/mediation` - Médiation
- `/disputes/[id]/evidence` - Preuves
- `/disputes/[id]/messages` - Messages litige

---

### DOMAINE : NÉGOCE

**Dossiers audit :**
- `shamar-négoce---b2b-commodities/` → Négoce B2B commodities
- `shamar-négoce---b2b-commodities - Copie/` → Copie négoce
- `shamar-négoce---negotiant-contracts-management/` → Gestion contrats négociant
- `shamar-négoce---negotiant-profile/` → Profil négociant
- `shamar-négoce---negotiation-history/` → Historique négociation
- `shamar-négoce-logistics-hub/` → Hub logistique négoce
- `shamar-negotiant-onboarding/` → Onboarding négociant
- `shamar-negotiant-onboarding - Copie/` → Copie onboarding
- `shamar-negotiant-storefront/` → Storefront négociant

**Fonctionnalités identifiées :**
- Négociation matières premières
- Contrats négociant
- Profil négociant
- Historique négociation
- Logistique négoce
- Onboarding négociant
- Storefront négociant
- RFQ (demandes de devis)

**Routes cibles :**
- `/negoce` - Vue négoce principal
- `/negoce/contracts` - Contrats négociant
- `/negoce/profile` - Profil négociant
- `/negoce/history` - Historique négociation
- `/negoce/logistics` - Logistique négoce
- `/negoce/onboarding` - Onboarding négociant
- `/negoce/storefront` - Storefront négociant
- `/negoce/rfq` - RFQ négoce

**Note** : Le module `/negociation/perplexity-assistant` existant doit être intégré ici.

---

### DOMAINE : MESSAGING

**Dossiers audit :**
- `shamar-secure-messaging-center/` (principal) → Centre messagerie sécurisée
- `shamar-secure-messaging-center - Copie/` → Copie messagerie

**Fonctionnalités identifiées :**
- Centre de messagerie
- Messages sécurisés
- Conversations

**Routes cibles :**
- `/messages` - Centre messagerie
- `/messages/[id]` - Conversation détaillée

---

## 3. ARCHITECTURE CIBLE (ARBORESCENCE APP/)

```
/app
├── (public)                    # DOMAINE PUBLIC
│   ├── layout.tsx
│   ├── page.tsx                # Landing
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── onboarding/
│   └── about/
│
├── (marketplace)               # DOMAINE MARKETPLACE
│   ├── layout.tsx
│   ├── sourcing/
│   │   └── page.tsx
│   ├── b2b/
│   │   └── page.tsx
│   ├── b2c/
│   │   └── page.tsx
│   ├── international/
│   │   └── page.tsx
│   ├── sourcing-chine/
│   │   └── page.tsx
│   ├── shop/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── cart/
│   │   └── page.tsx
│   └── rfq/
│       └── page.tsx
│
├── (business)                  # DOMAINE BUSINESS
│   ├── layout.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── documents/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── onboarding/
│   │   └── page.tsx
│   ├── compliance/
│   │   └── page.tsx
│   └── vault/
│       └── page.tsx
│
├── (dashboard)                # DOMAINE DASHBOARD
│   ├── layout.tsx
│   ├── buyer/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── orders/
│   │   └── analytics/
│   ├── seller/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── orders/
│   │   ├── analytics/
│   │   └── onboarding/
│   └── admin/
│       ├── page.tsx
│       ├── users/
│       ├── overview/
│       ├── bookings/
│       ├── rfq/
│       └── validation/
│
├── (finance)                  # DOMAINE FINANCE
│   ├── layout.tsx
│   ├── payments/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── transactions/
│   │   └── page.tsx
│   ├── commissions/
│   │   └── page.tsx
│   ├── payouts/
│   │   └── page.tsx
│   ├── invoicing/
│   │   └── page.tsx
│   └── contracts/
│       └── page.tsx
│
├── (admin)                    # DOMAINE ADMIN
│   ├── layout.tsx
│   ├── overview/
│   │   └── page.tsx
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── bookings/
│   │   └── page.tsx
│   ├── rfq/
│   │   └── page.tsx
│   ├── disputes/
│   │   └── page.tsx
│   ├── compliance/
│   │   └── page.tsx
│   └── validation/
│       └── page.tsx
│
├── (host)                     # DOMAINE HOST
│   ├── layout.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── properties/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── reservations/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── payments/
│   │   └── page.tsx
│   ├── calendar/
│   │   └── page.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   └── contracts/
│       └── page.tsx
│
├── (disputes)                 # DOMAINE DISPUTES
│   ├── layout.tsx
│   ├── page.tsx               # Liste litiges
│   └── [id]/
│       ├── page.tsx           # Détail litige
│       ├── mediation/
│       ├── evidence/
│       └── messages/
│
├── (negoce)                   # DOMAINE NÉGOCE
│   ├── layout.tsx
│   ├── page.tsx               # Vue négoce principal
│   ├── contracts/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── history/
│   │   └── page.tsx
│   ├── logistics/
│   │   └── page.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   ├── storefront/
│   │   └── page.tsx
│   ├── rfq/
│   │   └── page.tsx
│   └── perplexity-assistant/  # Intégration assistant IA
│       └── page.tsx
│
├── (messaging)                # DOMAINE MESSAGING
│   ├── layout.tsx
│   ├── page.tsx               # Centre messagerie
│   └── [id]/
│       └── page.tsx           # Conversation
│
├── api/                       # Routes API (inchangées)
│   ├── auth/
│   ├── buyer/
│   ├── seller/
│   ├── admin/
│   ├── payments/
│   └── ...
│
└── layout.tsx                 # Layout racine
```

---

## 4. À RÉINTÉGRER DEPUIS L'ARCHIVE

### Fonctionnalités à réintégrer (par domaine)

#### PUBLIC
- ✅ Landing page (déjà existante, à améliorer)
- ✅ Auth (déjà existante, à valider)
- ⚠️ Onboarding initial (à créer depuis `shamar-onboarding/`)

#### MARKETPLACE
- ⚠️ Vue Sourcing (`Home.tsx` depuis `shamar-marketplace/`)
- ⚠️ Vue Shops B2B/B2C/International (`Shops.tsx` depuis `shamar-marketplace/`)
- ⚠️ Vue Airbnb (`AirbnbView.tsx` depuis `shamar-marketplace/`)
- ⚠️ Vue Matières Premières (`MatierePremiere.tsx` depuis `shamar-marketplace/`)
- ⚠️ Vue Cart (`Cart.tsx` depuis `shamar-marketplace/`)
- ⚠️ Vue Products (`Products.tsx` depuis `shamar-marketplace/`)
- ⚠️ Sourcing Chine (depuis `shamar-sourcing-china---quotation-detail/`)
- ⚠️ RFQ Portal (depuis `shamar-negoce-rfq-portal/`)

#### BUSINESS
- ⚠️ Profil entreprise (depuis `shamar-profile-dashboard/`)
- ⚠️ Documents légaux (déjà partiellement implémenté, à compléter)
- ⚠️ Onboarding vendeur (déjà partiellement implémenté, à compléter)
- ⚠️ Compliance (depuis `shamar-corporate-buyer-dashboard/`)
- ⚠️ Vault documentation (depuis `shamar-export-documentation-vault/`)

#### DASHBOARD
- ✅ Dashboard buyer (déjà existant, à valider)
- ✅ Dashboard seller (déjà existant, à valider)
- ✅ Dashboard admin (déjà existant, à valider)
- ⚠️ Analytics seller (déjà partiellement implémenté, à compléter)
- ⚠️ RFQ Inbox (depuis `shamar-negoce-seller-dashboard/`)

#### FINANCE
- ⚠️ Hub finance (depuis `negotiant-finance-hub/`)
- ⚠️ Earnings charts (depuis `negotiant-finance-hub/`)
- ⚠️ Stats financières (depuis `negotiant-finance-hub/`)
- ⚠️ Contrats & facturation (depuis `shamar-contracts-&-billing/`)

#### ADMIN
- ⚠️ Overview admin (depuis `shamar-admin-dashboard/`)
- ⚠️ User management (depuis `shamar-admin-dashboard/`)
- ⚠️ Booking management (depuis `shamar-admin-dashboard/`)
- ⚠️ RFQ management (depuis `shamar-admin-dashboard/`)
- ⚠️ Dispute management (depuis `shamar-admin-dashboard/`)
- ⚠️ Compliance (depuis `shamar-admin-dashboard/`)

#### HOST
- ⚠️ Dashboard host (depuis `shamar-host-dashboard/`)
- ⚠️ Propriétés (depuis `shamar-host-dashboard/`)
- ⚠️ Réservations (depuis `shamar-host-dashboard/`)
- ⚠️ Paiements host (depuis `shamar-host-dashboard/`)
- ⚠️ Calendrier (depuis `shamar-host-calendar/`)
- ⚠️ Onboarding host (depuis `shamar-host-onboarding/`)
- ⚠️ Contrats corporate (depuis `shamar-hosts---corporate-contracts/`)

#### DISPUTES
- ⚠️ Liste litiges (depuis `shamar-dispute-resolution (1)/`)
- ⚠️ Détail litige (depuis `shamar-dispute-resolution (1)/`)
- ⚠️ Médiation (depuis `shamar-dispute-resolution (1)/`)
- ⚠️ Preuves (depuis `shamar-dispute-resolution (1)/`)
- ⚠️ Messages litige (depuis `shamar-dispute-resolution (1)/`)

#### NÉGOCE
- ⚠️ Vue négoce principal (depuis `shamar-négoce---b2b-commodities/`)
- ⚠️ Contrats négociant (depuis `shamar-négoce---negotiant-contracts-management/`)
- ⚠️ Profil négociant (depuis `shamar-négoce---negotiant-profile/`)
- ⚠️ Historique négociation (depuis `shamar-négoce---negotiation-history/`)
- ⚠️ Logistique négoce (depuis `shamar-négoce-logistics-hub/`)
- ⚠️ Onboarding négociant (depuis `shamar-negotiant-onboarding/`)
- ⚠️ Storefront négociant (depuis `shamar-negotiant-storefront/`)
- ✅ Assistant Perplexity (déjà existant `/negociation/perplexity-assistant/`, à déplacer)

#### MESSAGING
- ⚠️ Centre messagerie (depuis `shamar-secure-messaging-center/`)
- ✅ Messages buyer/seller (déjà partiellement implémenté, à compléter)

---

## 5. À LAISSER ARCHIVÉ

### Dossiers à conserver en archive (non réintégrés)

#### Copies et duplications
- Toutes les copies (`- Copie/`, `(1)/`, `(2)/`, etc.) → **ARCHIVÉ**
  - Ces copies sont des variantes ou doublons
  - Fonctionnalités déjà extraites dans le mapping principal

#### Dossiers techniques/configuration
- `DownloaderStore/` → **ARCHIVÉ** (outil technique)
- `PHXDownloads/` → **ARCHIVÉ** (téléchargements temporaires)

#### Dossiers partiels/incomplets
- Dossiers avec seulement des fichiers de configuration (package.json, tsconfig.json) sans views/composants fonctionnels → **ARCHIVÉ**

#### Dossiers de référence
- Dossiers utilisés uniquement comme référence de design/structure → **ARCHIVÉ**
  - À consulter si besoin, mais pas à réintégrer directement

---

## 6. RÉSUMÉ EXÉCUTIF

### Domaines identifiés : **10 domaines**
1. Public
2. Marketplace
3. Business
4. Dashboard
5. Finance
6. Admin
7. Host
8. Disputes
9. Négoce
10. Messaging

### Dossiers audit analysés : **~60+ dossiers**

### Fonctionnalités à réintégrer : **~50+ fonctionnalités**

### Architecture cible : **8 route groups Next.js 14**

### Priorités de réintégration :

**PRIORITÉ HAUTE (MVP Production) :**
1. Marketplace (sourcing, shops, products, cart)
2. Dashboard (buyer, seller, admin)
3. Business (onboarding, documents)
4. Finance (paiements, transactions)

**PRIORITÉ MOYENNE (Fonctionnalités avancées) :**
5. Admin (validation, monitoring)
6. Disputes (résolution litiges)
7. Négoce (négociation, RFQ)
8. Messaging (centre messagerie)

**PRIORITÉ BASSE (Extensions futures) :**
9. Host (Airbnb, hébergement)
10. Business avancé (compliance, vault)

---

## 7. RECOMMANDATIONS

### Phase 1 - Structure de base
1. Créer les 8 route groups principaux avec layouts
2. Migrer les fonctionnalités existantes vers les bons domaines
3. Nettoyer les routes orphelines

### Phase 2 - Réintégration Marketplace
1. Réintégrer les vues marketplace (Home, Shops, Products, Cart)
2. Connecter au backend Supabase existant
3. Valider le flux complet

### Phase 3 - Réintégration Business & Finance
1. Compléter onboarding vendeur
2. Réintégrer hub finance
3. Connecter paiements réels

### Phase 4 - Réintégration Domaines Avancés
1. Admin (validation, monitoring)
2. Disputes (résolution)
3. Négoce (RFQ, contrats)
4. Messaging (centre complet)

### Phase 5 - Extensions
1. Host (Airbnb)
2. Business avancé (compliance, vault)

---

**Rapport généré le** : 2025-01-27  
**Auteur** : CTO / Head of Product - SHAMAR B2B  
**Statut** : ✅ ANALYSE COMPLÈTE - PRÊT POUR IMPLÉMENTATION
