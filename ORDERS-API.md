# API ORDERS — MODULE MVP
## Documentation des Routes API

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Objectif** : Documenter toutes les routes API Orders pour le MVP

---

## 1. BUYER — Routes API

### POST `/api/buyer/orders`

**Description** : Créer une nouvelle commande

**Auth** : Requis (buyer uniquement)

**Body** :
```json
{
  "products": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

**Validation** :
- Au moins un produit requis
- Produits doivent exister et être actifs
- Quantité >= `min_order_quantity`
- Tous les produits doivent provenir du même vendeur
- Stock disponible (si `stock_quantity` > 0)

**Réponse Succès** (201) :
```json
{
  "order": {
    "id": "uuid",
    "buyer_id": "uuid",
    "seller_id": "uuid",
    "total_amount": 1000.00,
    "currency": "FCFA",
    "status": "PENDING",
    "created_at": "2024-01-01T00:00:00Z",
    "order_items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "quantity": 2,
        "price": 500.00,
        "product": { ... }
      }
    ]
  }
}
```

**Erreurs** :
- `401` : Non authentifié
- `403` : Accès refusé (pas buyer)
- `400` : Validation échouée
- `404` : Produit non trouvé
- `500` : Erreur serveur

**✅ Implémenté et fonctionnel**

---

### GET `/api/buyer/orders`

**Description** : Lister les commandes de l'acheteur

**Auth** : Requis (buyer uniquement)

**Query Params** : Aucun

**Réponse Succès** (200) :
```json
{
  "orders": [
    {
      "id": "uuid",
      "buyer_id": "uuid",
      "seller_id": "uuid",
      "total_amount": 1000.00,
      "currency": "FCFA",
      "status": "PENDING",
      "created_at": "2024-01-01T00:00:00Z",
      "order_items": [
        {
          "id": "uuid",
          "product_id": "uuid",
          "quantity": 2,
          "price": 500.00,
          "product": {
            "id": "uuid",
            "name": "Produit",
            "description": "...",
            "price": 500.00
          }
        }
      ],
      "seller": {
        "email": "seller@example.com",
        "full_name": "Vendeur",
        "company_name": "Entreprise"
      }
    }
  ]
}
```

**Erreurs** :
- `401` : Non authentifié
- `403` : Accès refusé (pas buyer)
- `500` : Erreur serveur

**✅ Implémenté et fonctionnel**

---

## 2. SELLER — Routes API

### GET `/api/seller/orders`

**Description** : Lister les commandes reçues par le vendeur

**Auth** : Requis (seller uniquement)

**Query Params** : Aucun

**Réponse Succès** (200) :
```json
{
  "orders": [
    {
      "id": "uuid",
      "buyer_id": "uuid",
      "seller_id": "uuid",
      "total_amount": 1000.00,
      "currency": "FCFA",
      "status": "PENDING",
      "created_at": "2024-01-01T00:00:00Z",
      "order_items": [
        {
          "id": "uuid",
          "product_id": "uuid",
          "quantity": 2,
          "price": 500.00,
          "product": {
            "id": "uuid",
            "name": "Produit",
            "price": 500.00,
            "currency": "FCFA",
            "category": "..."
          }
        }
      ],
      "buyer": {
        "email": "buyer@example.com",
        "full_name": "Acheteur",
        "company_name": "Entreprise"
      }
    }
  ]
}
```

**Erreurs** :
- `401` : Non authentifié
- `403` : Accès refusé (pas seller)
- `500` : Erreur serveur

**✅ Implémenté et fonctionnel**

---

### GET `/api/seller/orders/[id]`

**Description** : Récupérer le détail d'une commande

**Auth** : Requis (seller uniquement)

**Params** :
- `id` : UUID de la commande

**Réponse Succès** (200) :
```json
{
  "order": {
    "id": "uuid",
    "buyer_id": "uuid",
    "seller_id": "uuid",
    "total_amount": 1000.00,
    "currency": "FCFA",
    "status": "PENDING",
    "shipping_address": "...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "order_items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "quantity": 2,
        "price": 500.00,
        "product": {
          "id": "uuid",
          "name": "Produit",
          "description": "...",
          "price": 500.00,
          "currency": "FCFA",
          "image_url": "..."
        }
      }
    ],
    "buyer": {
      "id": "uuid",
      "email": "buyer@example.com",
      "full_name": "Acheteur",
      "company_name": "Entreprise",
      "phone": "..."
    }
  }
}
```

**Erreurs** :
- `401` : Non authentifié
- `403` : Accès refusé (pas seller ou commande n'appartient pas au seller)
- `404` : Commande non trouvée
- `500` : Erreur serveur

**✅ Implémenté (nouveau)**

---

### PUT `/api/seller/orders/[id]/status`

**Description** : Changer le statut d'une commande

**Auth** : Requis (seller uniquement)

**Params** :
- `id` : UUID de la commande

**Body** :
```json
{
  "status": "CONFIRMED"
}
```

**Statuts valides** :
- `PENDING`
- `CONFIRMED`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Validation** :
- Commande doit exister
- Commande doit appartenir au seller (`seller_id = user.id`)
- Statut doit être valide

**Réponse Succès** (200) :
```json
{
  "order": {
    "id": "uuid",
    "status": "CONFIRMED",
    "updated_at": "2024-01-01T00:00:00Z",
    ...
  }
}
```

**Erreurs** :
- `401` : Non authentifié
- `403` : Accès refusé (pas seller ou commande n'appartient pas au seller)
- `400` : Statut invalide
- `404` : Commande non trouvée
- `500` : Erreur serveur

**✅ Implémenté et fonctionnel**

---

## 3. SÉCURITÉ

### Vérifications Obligatoires

**Toutes les routes** :
1. ✅ Auth requise (`getCurrentUser()`)
2. ✅ Rôle requis (buyer ou seller selon route)
3. ✅ Ownership vérifié (buyer_id ou seller_id = user.id)
4. ✅ Validation données (400 si invalide)
5. ✅ 404 si ressource inexistante

### RLS Supabase

Les policies RLS doivent être configurées dans Supabase pour :
- Buyer : voir uniquement ses commandes (`buyer_id = auth.uid()`)
- Seller : voir uniquement ses commandes (`seller_id = auth.uid()`)
- Admin : voir toutes les commandes

---

## 4. VALIDATION API

### Checklist

- [x] POST `/api/buyer/orders` - Créer commande
- [x] GET `/api/buyer/orders` - Lister commandes buyer
- [x] GET `/api/seller/orders` - Lister commandes seller
- [x] GET `/api/seller/orders/[id]` - Détail commande seller
- [x] PUT `/api/seller/orders/[id]/status` - Changer statut
- [x] Sécurité (auth, rôle, ownership)
- [x] Validation données
- [x] Gestion erreurs

**✅ Toutes les routes MVP implémentées**

---

**API DOCUMENTÉE — PRÊT POUR VALIDATION**
