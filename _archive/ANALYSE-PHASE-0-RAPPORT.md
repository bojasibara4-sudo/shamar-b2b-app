# RAPPORT D'ANALYSE - PHASE 0
## SHAMAR B2B - Finalisation Métier

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Analyser l'existant avant implémentation des fonctionnalités métier

---

## 📊 ÉTAT ACTUEL IDENTIFIÉ

### Tables Supabase Existantes (`supabase-schema.sql`)

✅ **Tables en production :**
- `users` - Utilisateurs avec rôles (buyer/seller/admin)
- `products` - Produits avec seller_id
- `offers` - Offres de négociation
- `orders` - Commandes avec statuts basiques
- `order_items` - Items des commandes
- `messages` - Messages entre utilisateurs
- `agents` - Agents admin

⚠️ **Tables utilisées dans le code mais absentes du schema SQL :**
- `shops` - Utilisée dans `app/dashboard/shops/page.tsx`, types définis dans `types/supabase.ts`
  - Structure actuelle : `id, name, description, owner_id, created_at, updated_at`
  - Nécessite : `vendor_id`, `category`, `is_verified`

❌ **Tables manquantes (à créer) :**
- `vendors` - Profils vendeurs avec niveaux (bronze/silver/gold/premium)
- `documents` - Documents légaux pour validation vendeurs
- `badges` - Badges disponibles
- `vendor_badges` - Attribution badges aux vendeurs
- `commissions` - Taux de commission par catégorie/niveau
- `transactions` - Transactions financières

---

## 🔍 ANALYSE DU CODE EXISTANT

### Services TypeScript (`services/`)

✅ **Services existants :**
- `auth.service.ts` - Authentification
- `product.service.ts` - Gestion produits
- `user.service.ts` - Gestion utilisateurs

⚠️ **Services mock (à remplacer) :**
- `lib/mock-data.ts` - Contient `commissionsDB` en mock
  - Utilisé par `/api/seller/commissions/route.ts`
  - Utilisé par `/api/admin/commissions/route.ts`

### API Routes Existantes

✅ **Routes fonctionnelles :**
- `/api/buyer/*` - Actions acheteurs
- `/api/seller/*` - Actions vendeurs
- `/api/admin/*` - Actions admin

⚠️ **Routes utilisant du mock :**
- `/api/seller/commissions` - Utilise `commissionsDB` (mock)
- `/api/admin/commissions` - Utilise `commissionsDB` (mock)

### Composants UI Existants

✅ **Dashboards :**
- `AdminDashboardClient.tsx`
- `SellerDashboardClient.tsx`
- `BuyerDashboardClient.tsx`

✅ **Composants produits :**
- `ProductsGrid.tsx`
- `ProductFormClient.tsx`

✅ **Composants commandes :**
- `OrderListClient.tsx`

⚠️ **Manques identifiés :**
- Aucun composant pour badges
- Aucun composant pour documents
- Aucun composant pour onboarding vendeur
- Aucun affichage de niveaux vendeurs

---

## 📋 PLAN D'IMPLÉMENTATION

### PHASE 1 - MODÈLES MÉTIER ✅

**Fichier créé :** `supabase-metier-migration.sql`

**Tables créées :**
1. ✅ `vendors` - Profils vendeurs avec niveaux
2. ✅ `shops` - Complétée avec vendor_id, category, is_verified
3. ✅ `documents` - Documents légaux
4. ✅ `badges` - Badges disponibles
5. ✅ `vendor_badges` - Attribution badges
6. ✅ `commissions` - Taux de commission
7. ✅ `transactions` - Transactions financières

**RLS Policies :**
- ✅ Toutes les tables ont des policies RLS strictes
- ✅ Vendeurs : leurs données uniquement
- ✅ Admins : accès complet
- ✅ Badges : visibles par tous, gestion admin uniquement

**Données initiales :**
- ✅ Badges de base insérés
- ✅ Taux de commission par défaut insérés

### PHASE 2 - RÈGLES MÉTIER (À FAIRE)

- [ ] Services TypeScript pour badges (attribution automatique)
- [ ] Services TypeScript pour niveaux vendeurs (calcul automatique)
- [ ] Services TypeScript pour commissions (calcul basé sur niveau/catégorie)
- [ ] Fonctions RPC Supabase pour attribution badges
- [ ] Fonctions RPC Supabase pour calcul niveaux

### PHASE 3 - FLUX MÉTIER CRITIQUE (À FAIRE)

- [ ] Finaliser flux commandes (statuts complets)
- [ ] Lien commande → transaction → commission
- [ ] Enrichir négociation avec historique

### PHASE 4 - SÉCURITÉ & RLS (EN COURS)

- ✅ RLS policies créées pour toutes les nouvelles tables
- ⚠️ À tester : Fonctions RPC pour mutations critiques

### PHASE 5 - UI (À FAIRE)

- [ ] Affichage badges dans UI
- [ ] Affichage niveaux vendeurs
- [ ] Composant onboarding vendeur
- [ ] Composant gestion documents

---

## ⚠️ POINTS D'ATTENTION

1. **Migration shops existante :**
   - La table `shops` est utilisée avec `owner_id` dans le code
   - La migration utilise `vendor_id`
   - **Nécessite migration de données** si des shops existent déjà

2. **Lien products ↔ shops :**
   - Actuellement : `products.seller_id` → `users.id`
   - Futur : `products` pourrait lier à `shops.id` OU garder `seller_id`
   - **Décision métier requise**

3. **Commissions mock :**
   - `lib/mock-data.ts` contient `commissionsDB`
   - **À remplacer** par vraies requêtes Supabase

4. **Vendors création :**
   - Un vendor doit être créé automatiquement quand un user avec role='seller' s'inscrit
   - **Trigger ou fonction nécessaire**

---

## ✅ PROCHAINE ÉTAPE

**PHASE 2 - RÈGLES MÉTIER**

1. Créer services TypeScript :
   - `services/vendor.service.ts`
   - `services/badge.service.ts`
   - `services/commission.service.ts`
   - `services/document.service.ts`

2. Créer fonctions RPC Supabase :
   - `calculate_vendor_level()`
   - `assign_badge_to_vendor()`
   - `calculate_commission()`

---

**Rapport généré le** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
