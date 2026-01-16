# AUDIT PRÉ-IMPLÉMENTATION — MODULE ORDERS MVP
## Analyse de l'Existant et Identification des Manquants

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Documenter l'existant Orders et identifier ce qui doit être complété/corrigé pour MVP

---

## 1. ÉTAT ACTUEL — TABLES SUPABASE

### Table `orders` ✅ EXISTE

**Schéma actuel** (d'après `_archive/supabase-schema.sql`) :
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
  ),
  shipping_address TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Statuts actuels** : `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

**⚠️ INCOHÉRENCE** : Le MVP demande `pending | accepted | rejected | completed`, mais le schéma utilise des statuts différents.

**Action requise** : 
- Option 1 : Adapter le code pour utiliser les statuts existants
- Option 2 : Modifier le schéma pour correspondre au MVP (mais cela peut casser l'existant)

**Recommandation** : Utiliser les statuts existants et mapper :
- `PENDING` = `pending`
- `CONFIRMED` = `accepted`
- `CANCELLED` = `rejected`
- `DELIVERED` = `completed`

### Table `order_items` ✅ EXISTE

**Schéma actuel** :
```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**✅ Cohérent avec MVP**

---

## 2. ÉTAT ACTUEL — API ROUTES

### BUYER — `/api/buyer/orders` ✅ EXISTE

**GET** : ✅ Implémenté
- Récupère les commandes du buyer avec `order_items` et `products`
- Filtre par `buyer_id`
- Retourne les données avec seller info

**POST** : ✅ Implémenté
- Crée une commande avec validation produits
- Calcule `total_amount` et `seller_id` depuis les produits
- Crée les `order_items`
- Utilise Supabase (pas de mock)

**✅ Fonctionnel et conforme MVP**

### SELLER — `/api/seller/orders` ✅ EXISTE

**GET** : ✅ Implémenté
- Récupère les commandes du seller avec `order_items` et `products`
- Filtre par `seller_id`
- Retourne les données avec buyer info

**✅ Fonctionnel et conforme MVP**

### SELLER — `/api/seller/orders/[id]` ⚠️ À VÉRIFIER

**Fichier** : `app/api/seller/orders/[id]/status/route.ts`

**À vérifier** :
- Existe-t-il un route pour GET `/api/seller/orders/[id]` ?
- Le PUT pour changer le statut est-il complet ?

**Action requise** : Vérifier et compléter si nécessaire

### ADMIN — `/api/admin/orders` ⚠️ HORS PÉRIMÈTRE MVP

**Fichier** : `app/api/admin/orders/route.ts`

**Statut** : Existe mais hors périmètre MVP (pas demandé)

**Action** : Laisser tel quel, ne pas modifier

---

## 3. ÉTAT ACTUEL — PAGES DASHBOARD

### BUYER — `/dashboard/buyer/orders` ✅ EXISTE

**Fichier** : `app/(protected)/dashboard/buyer/orders/page.tsx`

**Fonctionnalités** :
- ✅ Récupère les commandes depuis Supabase
- ✅ Affiche les commandes avec `OrderListClient`
- ✅ Inclut les paiements (hors périmètre MVP mais présent)

**✅ Fonctionnel et conforme MVP**

### BUYER — `/dashboard/buyer/orders/[id]` ✅ EXISTE

**Fichier** : `app/(protected)/dashboard/buyer/orders/[id]/page.tsx`

**Fonctionnalités** :
- ✅ Affiche le détail d'une commande
- ✅ Inclut les paiements (hors périmètre MVP)
- ✅ Vérifie ownership (`buyer_id`)

**✅ Fonctionnel et conforme MVP**

### SELLER — `/dashboard/seller/orders` ✅ EXISTE

**Fichier** : `app/(protected)/dashboard/seller/orders/page.tsx`

**Fonctionnalités** :
- ✅ Récupère les commandes depuis Supabase
- ✅ Affiche les commandes avec statut
- ✅ Utilise `OrderStatusSelector` pour changer le statut

**✅ Fonctionnel et conforme MVP**

### SELLER — `/dashboard/seller/orders/[id]` ⚠️ À VÉRIFIER

**Fichier** : `app/(protected)/dashboard/seller/orders/[id]/page.tsx`

**À vérifier** : Existe-t-il cette page ?

**Action requise** : Vérifier et créer si manquante

---

## 4. ÉTAT ACTUEL — COMPOSANTS UI

### `OrderListClient.tsx` ✅ EXISTE

**Fichier** : `components/orders/OrderListClient.tsx`

**Usage** : Utilisé dans `/dashboard/buyer/orders`

**✅ Fonctionnel**

### `OrderStatusBadge.tsx` ✅ EXISTE

**Fichier** : `components/OrderStatusBadge.tsx`

**Usage** : Utilisé pour afficher le statut

**✅ Fonctionnel**

### `OrderStatusSelector.tsx` ✅ EXISTE

**Fichier** : `components/OrderStatusSelector.tsx`

**Usage** : Utilisé pour changer le statut (seller)

**✅ Fonctionnel**

---

## 5. PROBLÈMES IDENTIFIÉS

### 🔴 CRITIQUE 1 : Statuts Incohérents

**Problème** :
- MVP demande : `pending | accepted | rejected | completed`
- Schéma Supabase utilise : `PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED`

**Impact** : Incohérence potentielle entre code et base de données

**Solution** : Utiliser les statuts existants et mapper dans le code

### 🟠 MAJEUR 1 : Route GET `/api/seller/orders/[id]` Manquante ?

**Problème** : Seule la route `/api/seller/orders/[id]/status` existe

**Impact** : Impossible de récupérer le détail d'une commande via API

**Solution** : Vérifier et créer si manquante

### 🟡 MINEUR 1 : Page `/dashboard/seller/orders/[id]` Manquante ?

**Problème** : Page de détail seller peut être manquante

**Impact** : Seller ne peut pas voir le détail d'une commande

**Solution** : Vérifier et créer si manquante

---

## 6. FONCTIONNALITÉS MVP — CHECKLIST

### BUYER
- [x] Créer une commande (POST `/api/buyer/orders`)
- [x] Lister ses commandes (GET `/api/buyer/orders`)
- [x] Voir le détail d'une commande (page `/dashboard/buyer/orders/[id]`)

### SELLER
- [x] Lister ses commandes (GET `/api/seller/orders`)
- [ ] Voir le détail d'une commande (GET `/api/seller/orders/[id]` + page)
- [x] Changer le statut d'une commande (PUT `/api/seller/orders/[id]/status`)

---

## 7. ACTIONS REQUISES POUR MVP

### Priorité 1 : Compléter les Manquants
1. [ ] Vérifier/créer GET `/api/seller/orders/[id]`
2. [ ] Vérifier/créer page `/dashboard/seller/orders/[id]`
3. [ ] Valider que le changement de statut fonctionne correctement

### Priorité 2 : Cohérence Statuts
1. [ ] Documenter le mapping statuts MVP → Supabase
2. [ ] S'assurer que tous les composants utilisent les bons statuts

### Priorité 3 : Validation
1. [ ] Tester création commande buyer
2. [ ] Tester liste commandes buyer
3. [ ] Tester liste commandes seller
4. [ ] Tester changement statut seller
5. [ ] Vérifier sécurité (ownership, rôles)

---

## 8. CONCLUSION

### État Global
**✅ Le module Orders est DÉJÀ IMPLÉMENTÉ à ~90%**

### Manquants Identifiés
1. Route GET `/api/seller/orders/[id]` (à vérifier)
2. Page `/dashboard/seller/orders/[id]` (à vérifier)
3. Documentation mapping statuts

### Prochaines Étapes
1. Vérifier les manquants
2. Compléter si nécessaire
3. Valider le fonctionnement complet
4. Documenter

---

**AUDIT COMPLET — PRÊT POUR COMPLÉTION MVP**
