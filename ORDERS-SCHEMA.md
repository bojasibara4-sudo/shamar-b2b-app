# SCHÉMA ORDERS — MODULE MVP
## Structure Supabase et Mapping Statuts

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Documenter le schéma Orders et le mapping des statuts

---

## 1. TABLE `orders`

### Structure Actuelle (Supabase)

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA' CHECK (currency IN ('FCFA', 'USD', 'EUR')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
  ),
  shipping_address TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Champs Minimum MVP

**Obligatoires** :
- ✅ `id` - UUID, clé primaire
- ✅ `buyer_id` - UUID, référence `users(id)`
- ✅ `seller_id` - UUID, référence `users(id)`
- ✅ `total_amount` - DECIMAL(10, 2)
- ✅ `currency` - TEXT, défaut 'FCFA'
- ✅ `status` - TEXT, défaut 'PENDING'
- ✅ `created_at` - TIMESTAMP

**Optionnels** (présents mais non utilisés en MVP) :
- `shipping_address` - TEXT
- `payment_method` - TEXT
- `payment_status` - TEXT
- `updated_at` - TIMESTAMP

**✅ Schéma conforme MVP**

---

## 2. TABLE `order_items`

### Structure Actuelle (Supabase)

```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Champs Minimum MVP

**Obligatoires** :
- ✅ `id` - UUID, clé primaire
- ✅ `order_id` - UUID, référence `orders(id)`
- ✅ `product_id` - UUID, référence `products(id)`
- ✅ `quantity` - INTEGER
- ✅ `price` - DECIMAL(10, 2)

**✅ Schéma conforme MVP**

---

## 3. MAPPING STATUTS MVP → SUPABASE

### Statuts Demandés MVP
- `pending` - Commande créée, en attente
- `accepted` - Commande acceptée par le seller
- `rejected` - Commande rejetée par le seller
- `completed` - Commande terminée

### Statuts Supabase Actuels
- `PENDING` - Commande créée, en attente
- `CONFIRMED` - Commande confirmée
- `PROCESSING` - Commande en traitement
- `SHIPPED` - Commande expédiée
- `DELIVERED` - Commande livrée
- `CANCELLED` - Commande annulée

### Mapping Recommandé

| MVP | Supabase | Description |
|-----|----------|-------------|
| `pending` | `PENDING` | Commande créée, en attente |
| `accepted` | `CONFIRMED` | Commande acceptée par le seller |
| `rejected` | `CANCELLED` | Commande rejetée/annulée |
| `completed` | `DELIVERED` | Commande terminée/livrée |

**Note** : Les statuts `PROCESSING` et `SHIPPED` sont disponibles pour évolution future mais non utilisés en MVP.

---

## 4. RÈGLES MÉTIER

### Création Commande (BUYER)

1. **Validation** :
   - Au moins un produit requis
   - Produits doivent exister et être actifs
   - Quantité >= `min_order_quantity` du produit
   - Stock disponible (si `stock_quantity` > 0)

2. **Calcul** :
   - `total_amount` = somme (produit.price × quantité) pour tous les produits
   - `seller_id` = `product.seller_id` (tous les produits doivent avoir le même seller_id)
   - `currency` = `product.currency` (tous les produits doivent avoir la même currency)

3. **Création** :
   - Créer `order` avec `status = 'PENDING'`
   - Créer `order_items` pour chaque produit

### Gestion Statut (SELLER)

1. **Statuts autorisés** :
   - `PENDING` → `CONFIRMED` (accepter)
   - `PENDING` → `CANCELLED` (rejeter)
   - `CONFIRMED` → `PROCESSING` (optionnel MVP)
   - `PROCESSING` → `SHIPPED` (optionnel MVP)
   - `SHIPPED` → `DELIVERED` (terminer)

2. **Validation** :
   - Seller doit être le propriétaire (`seller_id = user.id`)
   - Commande doit exister
   - Transition de statut valide

---

## 5. SÉCURITÉ (RLS)

### Policies Requises

**SELECT** :
- Buyer : voir ses commandes (`buyer_id = auth.uid()`)
- Seller : voir ses commandes (`seller_id = auth.uid()`)
- Admin : voir toutes les commandes

**INSERT** :
- Buyer : créer commande (`buyer_id = auth.uid()`)

**UPDATE** :
- Seller : modifier statut de ses commandes (`seller_id = auth.uid()`)
- Admin : modifier toutes les commandes

**DELETE** :
- Admin uniquement (ou désactiver DELETE)

---

## 6. INDEXES

### Indexes Existants

```sql
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
```

**✅ Indexes optimaux pour les requêtes MVP**

---

## 7. VALIDATION SCHÉMA

### Checklist

- [x] Table `orders` existe avec champs minimum
- [x] Table `order_items` existe avec champs minimum
- [x] Relations FK correctes
- [x] Statuts compatibles avec MVP (via mapping)
- [x] Indexes présents
- [x] RLS activé (à vérifier dans Supabase)

**✅ Schéma prêt pour MVP**

---

**SCHÉMA DOCUMENTÉ — PRÊT POUR IMPLÉMENTATION**
