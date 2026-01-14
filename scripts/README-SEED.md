# Script de Seed SHAMAR B2B

## Installation

Installer la dépendance `tsx` pour exécuter TypeScript directement :

```bash
npm install --save-dev tsx
```

## Configuration

Assurez-vous que les variables d'environnement Supabase sont configurées dans `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Exécution

Lancer le seed :

```bash
npm run seed
```

## Données créées

- **20 utilisateurs** : 1 admin, 14 sellers, 5 buyers
- **80+ produits** répartis en :
  - Agro & Matières Premières (15+ produits)
  - Industrie & Équipements (15+ produits)
  - Électronique & High-Tech (15+ produits)
  - Mode & Textile (15+ produits)
  - Tourisme & Services (3 produits)
  - Import / Export (10+ produits)
- **Quelques commandes et offres** pour montrer l'activité

## Important : Création des utilisateurs auth

Le script tente de créer les utilisateurs dans `public.users`, mais ceux-ci doivent d'abord exister dans `auth.users`.

### Option 1 : Créer manuellement via Supabase Dashboard

1. Aller dans Authentication > Users
2. Créer chaque utilisateur avec :
   - Email : email depuis `scripts/seed-real-data.ts`
   - UUID : id depuis `scripts/seed-real-data.ts`
   - Password : définir un mot de passe temporaire

### Option 2 : Utiliser Supabase Admin API

Créer les utilisateurs via l'API Admin Supabase (nécessite service_role key).

## Après le seed

Les données seront visibles dans :
- `/b2b` - Liste des produits et vendeurs
- `/dashboard/admin` - Vue d'ensemble avec statistiques
- `/dashboard/seller` - Produits par vendeur
- `/dashboard/buyer` - Produits disponibles à l'achat
