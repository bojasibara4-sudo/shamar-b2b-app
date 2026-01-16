# PAGES ORDERS — MODULE MVP
## Documentation des Pages Dashboard

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Documenter toutes les pages Orders pour le MVP

---

## 1. BUYER — Pages Dashboard

### `/dashboard/buyer/orders`

**Fichier** : `app/(protected)/dashboard/buyer/orders/page.tsx`

**Description** : Liste des commandes de l'acheteur

**Auth** : Requis (buyer uniquement via `requireBuyer()`)

**Fonctionnalités** :
- ✅ Récupère les commandes depuis Supabase
- ✅ Affiche les commandes avec `OrderListClient`
- ✅ Inclut les informations seller
- ✅ Inclut les paiements (hors périmètre MVP mais présent)

**Composants utilisés** :
- `OrderListClient` - Liste des commandes
- `LogoutButton` - Bouton déconnexion

**Données affichées** :
- ID commande
- Statut
- Total
- Date création
- Seller info
- Paiements (optionnel)

**✅ Implémenté et fonctionnel**

---

### `/dashboard/buyer/orders/[id]`

**Fichier** : `app/(protected)/dashboard/buyer/orders/[id]/page.tsx`

**Description** : Détail d'une commande (buyer)

**Auth** : Requis (buyer uniquement via `requireBuyer()`)

**Fonctionnalités** :
- ✅ Affiche le détail complet d'une commande
- ✅ Vérifie ownership (`buyer_id = user.id`)
- ✅ Affiche les produits commandés
- ✅ Affiche les informations seller
- ✅ Affiche les paiements (hors périmètre MVP)
- ✅ Bouton paiement si non payé (hors périmètre MVP)

**Composants utilisés** :
- `OrderStatusBadge` - Badge statut
- `PayButton` - Bouton paiement (hors MVP)
- `LogoutButton` - Bouton déconnexion

**Données affichées** :
- ID commande
- Statut
- Produits (avec images, quantités, prix)
- Total
- Informations seller
- Adresse de livraison (si présente)
- Dates (création, modification)
- Paiements (optionnel)

**✅ Implémenté et fonctionnel**

---

## 2. SELLER — Pages Dashboard

### `/dashboard/seller/orders`

**Fichier** : `app/(protected)/dashboard/seller/orders/page.tsx`

**Description** : Liste des commandes reçues par le vendeur

**Auth** : Requis (seller uniquement via `requireSeller()`)

**Fonctionnalités** :
- ✅ Récupère les commandes depuis Supabase
- ✅ Filtre par `seller_id`
- ✅ Affiche les commandes avec statut
- ✅ Permet de changer le statut via `OrderStatusSelector`

**Composants utilisés** :
- `OrderStatusBadge` - Badge statut
- `OrderStatusSelector` - Sélecteur statut
- `LogoutButton` - Bouton déconnexion

**Données affichées** :
- ID commande
- Statut (avec possibilité de changement)
- Total
- Date création
- Buyer info
- Produits commandés

**✅ Implémenté et fonctionnel**

---

### `/dashboard/seller/orders/[id]`

**Fichier** : `app/(protected)/dashboard/seller/orders/[id]/page.tsx`

**Description** : Détail d'une commande (seller)

**Auth** : Requis (seller uniquement via `requireSeller()`)

**Fonctionnalités** :
- ✅ Affiche le détail complet d'une commande
- ✅ Vérifie ownership (`seller_id = user.id`)
- ✅ Affiche les produits commandés (avec images)
- ✅ Affiche les informations buyer
- ✅ Permet de changer le statut via `OrderStatusSelector`

**Composants utilisés** :
- `OrderStatusBadge` - Badge statut
- `OrderStatusSelector` - Sélecteur statut
- `LogoutButton` - Bouton déconnexion

**Données affichées** :
- ID commande
- Statut (avec possibilité de changement)
- Produits (avec images, quantités, prix)
- Total
- Informations buyer (nom, email, téléphone)
- Adresse de livraison (si présente)
- Dates (création, modification)

**✅ Implémenté (nouveau)**

---

## 3. ARCHITECTURE PAGES

### Structure

```
app/(protected)/
├── dashboard/
│   ├── buyer/
│   │   └── orders/
│   │       ├── page.tsx          # Liste commandes buyer
│   │       └── [id]/
│   │           └── page.tsx      # Détail commande buyer
│   └── seller/
│       └── orders/
│           ├── page.tsx          # Liste commandes seller
│           └── [id]/
│               └── page.tsx      # Détail commande seller
```

### Protection

**Toutes les pages** :
- ✅ Protégées par `requireBuyer()` ou `requireSeller()`
- ✅ Vérification ownership dans les pages de détail
- ✅ Redirection si non autorisé

### Data Fetching

**Pattern utilisé** :
- Server Components (async/await)
- Supabase directement dans les pages
- Pas de client-side data fetching pour les données initiales

**✅ Architecture cohérente avec le reste du projet**

---

## 4. COMPOSANTS UI UTILISÉS

### `OrderListClient.tsx`

**Usage** : Liste des commandes (buyer)

**Props** :
- `orders` : Array<Order>
- `basePath` : string (optionnel)

**✅ Fonctionnel**

### `OrderStatusBadge.tsx`

**Usage** : Affichage du statut d'une commande

**Props** :
- `status` : string

**✅ Fonctionnel**

### `OrderStatusSelector.tsx`

**Usage** : Changer le statut d'une commande (seller)

**Props** :
- `orderId` : string
- `currentStatus` : string

**Fonctionnalités** :
- ✅ Détecte automatiquement la route (seller ou admin)
- ✅ Appelle la bonne API route
- ✅ Rafraîchit la page après changement

**✅ Fonctionnel**

---

## 5. VALIDATION PAGES

### Checklist

- [x] `/dashboard/buyer/orders` - Liste commandes buyer
- [x] `/dashboard/buyer/orders/[id]` - Détail commande buyer
- [x] `/dashboard/seller/orders` - Liste commandes seller
- [x] `/dashboard/seller/orders/[id]` - Détail commande seller
- [x] Protection auth/role
- [x] Vérification ownership
- [x] Affichage données correct
- [x] Changement statut fonctionnel

**✅ Toutes les pages MVP implémentées**

---

**PAGES DOCUMENTÉES — PRÊT POUR VALIDATION**
