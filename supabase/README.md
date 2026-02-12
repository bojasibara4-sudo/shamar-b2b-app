# Supabase — Shamar

Connexion au projet Supabase et scripts SQL.

---

## 1. Connexion (variables d’environnement)

L’app utilise **deux variables obligatoires** (à mettre dans `.env.local` à la racine du projet) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_jwt
```

**Où les trouver :**  
Supabase Dashboard → **Project Settings** → **API** :  
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`  
- **Project API keys** → **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Après avoir créé `.env.local` (ou mis à jour `.env`), redémarrer le serveur Next.js.

---

## 2. Vérifier la connexion

- **Dans le navigateur :** ouvrir  
  `http://localhost:3000/api/supabase-check`  
  → Réponse `{ "connected": true }` si la connexion et l’accès à la table `public.users` sont OK.
- En cas d’erreur, le JSON indique `connected: false` et un message (variables manquantes, table absente, etc.).

---

## 2b. Admin et Supabase

Tout le module **admin** (routes `/admin/login`, `/admin/overview`, etc.) est branché sur Supabase :

- **Auth :** connexion admin via Supabase Auth (OTP) ; le rôle est lu dans la table **`users`** (colonne `role`).
- **Protection :** `requireAdmin()` utilise la session Supabase + `users.role = 'admin'`.
- **Données :** le contenu du tableau de bord admin (utilisateurs, litiges, finance, sécurité, etc.) lit/écrit les tables Supabase via le client serveur.

**Pour que l’admin fonctionne :** en plus des variables d’env, il faut la table **`public.users`** avec au moins `id`, `email`, `role`, et **au moins un utilisateur** avec `role = 'admin'` (son `id` doit correspondre à un utilisateur créé dans Supabase Auth).

Détail des routes et écrans admin : voir **`INVENTAIRE-ADMIN-COMPLET-FEV2026.md`** (section « Admin et Supabase »).

---

## 3. Lier le projet (CLI Supabase, optionnel)

Pour utiliser `supabase db push`, migrations ou types :

```bash
npx supabase login
npx supabase link --project-ref VOTRE_PROJECT_REF
```

`VOTRE_PROJECT_REF` est dans l’URL du projet : `https://VOTRE_PROJECT_REF.supabase.co`.

---

## 4. Scripts SQL (migrations)

Dossier dédié aux migrations SQL. À exécuter dans **Supabase Dashboard → SQL Editor** (ou via CLI si lié).

**Ordre recommandé :**

1. **finance.sql** — Paiements, payouts, escrows, commissions, transactions + RLS + triggers  
   *(Prérequis : tables `public.users` et `public.orders` existent.)*

Les fichiers à la racine (`SUPABASE-FINANCE-COMPLET.sql`, `supabase-kyc-geo-migration.sql`, etc.) restent disponibles ; ce dossier est la version organisée pour le suivi des migrations.
