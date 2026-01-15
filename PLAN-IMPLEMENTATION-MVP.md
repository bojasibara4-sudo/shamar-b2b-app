# PLAN D'IMPLÉMENTATION MVP — SHAMAR B2B
## Transformation des Écrans AI Studio en Fonctionnalités Réelles

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Implémenter les écrans critiques en MVP fonctionnel

---

## ÉTAPE 1 — INTERPRÉTATION DES ÉCRANS AI STUDIO

### Écrans Critiques Identifiés (Priorité 1)

#### 1. AUTHENTIFICATION PAR RÔLE ✅ (Déjà implémenté)
- **Route** : `/auth/login`, `/auth/register`
- **Statut** : ✅ Fonctionnel
- **Actions** : Login, Register, Redirection selon rôle
- **Dépendances** : Supabase Auth

#### 2. DASHBOARDS PAR RÔLE ⚠️ (Partiellement implémenté)
- **Routes** : 
  - `/dashboard/buyer` - ✅ Structure existe, composant `BuyerDashboardClient`
  - `/dashboard/seller` - ✅ Structure existe, composant `SellerDashboardClient`
  - `/dashboard/admin` - ✅ Structure existe, composant `AdminDashboardClient`
- **Statut** : ⚠️ Composants clients existent mais doivent être enrichis avec données réelles
- **Actions nécessaires** : 
  - Connecter les composants aux API réelles
  - Afficher statistiques réelles depuis Supabase
  - Implémenter actions rapides (créer produit, voir commandes, etc.)

#### 3. PRODUITS SELLER ⚠️ (Partiellement implémenté)
- **Route** : `/dashboard/seller/products`
- **API** : ✅ `/api/seller/products` (GET, POST)
- **Statut** : ⚠️ Page existe, doit être connectée aux API réelles
- **Actions nécessaires** :
  - Formulaire création produit fonctionnel
  - Liste produits seller avec données réelles
  - Édition produit (`/dashboard/seller/products/[id]`)

#### 4. COMMANDES BUYER ↔ SELLER ⚠️ (Partiellement implémenté)
- **Routes Buyer** :
  - `/dashboard/buyer/orders` - ✅ Structure existe
  - `/dashboard/buyer/orders/[id]` - ✅ Structure existe
- **Routes Seller** :
  - `/dashboard/seller/orders` - ✅ Structure existe
- **API** : ✅ `/api/buyer/orders`, `/api/seller/orders`
- **Statut** : ⚠️ Pages existent, doivent afficher données réelles
- **Actions nécessaires** :
  - Liste commandes avec données Supabase
  - Détail commande avec items
  - Changement statut commande (seller)

#### 5. PAIEMENT MVP ⚠️ (Structure existe, à compléter)
- **Route** : `/payments`
- **API** : ✅ `/api/payments/create`, `/api/stripe/create-payment-intent`
- **Statut** : ⚠️ Structure existe, doit être fonctionnelle
- **Actions nécessaires** :
  - Interface paiement pour buyer
  - Intégration Stripe ou simulation propre
  - Confirmation paiement

---

## ÉTAPE 2 — PLAN D'IMPLÉMENTATION MVP

### Phase 1 : Enrichir les Dashboards (Priorité 1)

**Objectif** : Rendre les dashboards fonctionnels avec données réelles

#### Dashboard Buyer
- [ ] Connecter `BuyerDashboardClient` à `/api/buyer/stats`
- [ ] Afficher statistiques réelles (commandes, montant dépensé)
- [ ] Actions rapides fonctionnelles (voir produits, voir commandes)
- [ ] Activité récente (dernières commandes)

#### Dashboard Seller
- [ ] Connecter `SellerDashboardClient` à `/api/seller/stats`
- [ ] Afficher statistiques réelles (ventes, produits actifs, revenus)
- [ ] Actions rapides fonctionnelles (créer produit, voir commandes)
- [ ] Activité récente (dernières commandes reçues)

#### Dashboard Admin
- [ ] Connecter `AdminDashboardClient` à `/api/admin/stats`
- [ ] Afficher statistiques globales (utilisateurs, produits, commandes)
- [ ] Actions rapides fonctionnelles (gérer utilisateurs, voir commandes)

### Phase 2 : Produits Seller (Priorité 1)

**Objectif** : Permettre au seller de créer et gérer ses produits

#### Page Liste Produits
- [ ] Afficher produits seller depuis `/api/seller/products`
- [ ] Bouton "Ajouter produit" fonctionnel
- [ ] Actions : Éditer, Supprimer, Activer/Désactiver

#### Page Création Produit
- [ ] Formulaire complet (nom, description, prix, catégorie, image)
- [ ] Upload image (Supabase Storage)
- [ ] Validation côté client et serveur
- [ ] Redirection vers liste après création

#### Page Édition Produit
- [ ] Charger données produit depuis API
- [ ] Formulaire pré-rempli
- [ ] Mise à jour via API
- [ ] Gestion erreurs

### Phase 3 : Commandes Buyer ↔ Seller (Priorité 1)

**Objectif** : Flux commande complet fonctionnel

#### Buyer : Liste Commandes
- [ ] Afficher commandes depuis `/api/buyer/orders`
- [ ] Filtrage par statut
- [ ] Affichage statut avec badges
- [ ] Lien vers détail commande

#### Buyer : Détail Commande
- [ ] Afficher détails commande depuis API
- [ ] Liste items avec produits
- [ ] Informations seller
- [ ] Bouton paiement si non payé

#### Seller : Liste Commandes
- [ ] Afficher commandes depuis `/api/seller/orders`
- [ ] Filtrage par statut
- [ ] Actions : Accepter, Refuser, Marquer expédié
- [ ] Affichage commissions

#### Seller : Détail Commande
- [ ] Afficher détails commande
- [ ] Informations buyer
- [ ] Changer statut commande
- [ ] Créer livraison (si PHASE 8 implémentée)

### Phase 4 : Paiement MVP (Priorité 2)

**Objectif** : Permettre paiement commande (simulation ou Stripe)

#### Page Paiement
- [ ] Afficher détails commande à payer
- [ ] Montant total, commission, montant net
- [ ] Choix méthode paiement (Stripe ou Mobile Money)
- [ ] Traitement paiement via API
- [ ] Confirmation paiement
- [ ] Redirection vers commande

---

## ÉTAPE 3 — STRUCTURE DE CODE

### Séparation UI / Métier / Data

```
components/
├── buyer/
│   ├── BuyerDashboardClient.tsx      # Dashboard buyer (client)
│   ├── OrderList.tsx                 # Liste commandes buyer
│   ├── OrderDetails.tsx              # Détail commande buyer
│   └── Checkout.tsx                  # Paiement buyer
├── seller/
│   ├── SellerDashboardClient.tsx     # Dashboard seller (client)
│   ├── ProductList.tsx               # Liste produits seller
│   ├── ProductForm.tsx               # Formulaire produit
│   ├── OrderList.tsx                 # Liste commandes seller
│   └── OrderDetails.tsx              # Détail commande seller
└── admin/
    └── AdminDashboardClient.tsx      # Dashboard admin (client)

app/
├── (protected)/
│   ├── dashboard/
│   │   ├── buyer/
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx          # Liste commandes (server)
│   │   │   │   └── [id]/page.tsx     # Détail commande (server)
│   │   │   └── products/page.tsx     # Produits buyer
│   │   ├── seller/
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Liste produits (server)
│   │   │   │   └── [id]/page.tsx     # Édition produit (server)
│   │   │   └── orders/
│   │   │       ├── page.tsx          # Liste commandes (server)
│   │   │       └── [id]/page.tsx     # Détail commande (server)
│   │   └── admin/
│   └── payments/
│       └── page.tsx                  # Paiement (server)
```

### Règles de Code

1. **page.tsx** : Server Component uniquement
   - Récupération données (Supabase)
   - Vérification auth/role
   - Rendering composants clients

2. **Composants Clients** : Logique UI uniquement
   - États locaux (useState)
   - Appels API (fetch)
   - Interactions utilisateur

3. **Services** : Logique métier
   - Calculs
   - Validations
   - Transformations données

---

## ÉTAPE 4 — CHECKLIST VALIDATION

### Avant Commit

- [ ] Build passe (`npm run build`)
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs ESLint critiques
- [ ] Routes testées manuellement
- [ ] Données affichées correctement
- [ ] Actions fonctionnelles (créer, éditer, supprimer)

### Avant Push

- [ ] Commit message clair et explicite
- [ ] Pas de code commenté/debug
- [ ] Pas de console.log en production
- [ ] Variables d'environnement documentées

### Avant Déploiement Vercel

- [ ] Build Vercel passe
- [ ] Routes critiques accessibles
- [ ] Auth fonctionne en production
- [ ] Rôles fonctionnent en production
- [ ] Pas d'erreurs runtime

---

## PROCHAINES ÉTAPES

1. **Implémenter Phase 1** : Enrichir dashboards avec données réelles
2. **Implémenter Phase 2** : Produits seller fonctionnels
3. **Implémenter Phase 3** : Commandes buyer ↔ seller fonctionnelles
4. **Implémenter Phase 4** : Paiement MVP
5. **Tests & Validation** : Tester chaque flux de bout en bout
6. **Commit & Push** : Commiter proprement chaque phase
7. **Déploiement Vercel** : Vérifier déploiement production

---

**Ce plan sera exécuté étape par étape, avec validation à chaque phase.**
