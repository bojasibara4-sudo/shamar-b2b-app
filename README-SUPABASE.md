# Configuration Supabase pour SHAMAR B2B

## Installation

Supabase est maintenant intégré dans le projet SHAMAR B2B. L'application fonctionne en mode **hybride** :
- Si les variables d'environnement Supabase sont configurées → utilise Supabase
- Sinon → utilise le système mock existant (pour le développement)

## Configuration

1. Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

2. Obtenez ces valeurs depuis votre projet Supabase :
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet
   - Allez dans Settings > API
   - Copiez l'URL du projet et la clé `anon` public

## Structure de la base de données Supabase

### Table `users`

Créez une table `users` dans Supabase avec la structure suivante :

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'seller', 'buyer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Authentification Supabase

L'authentification utilise le système Auth de Supabase :
- Les utilisateurs s'inscrivent via `auth.users` (géré par Supabase)
- Le profil utilisateur (rôle, etc.) est stocké dans la table `users`
- Le lien entre `auth.users` et `users` se fait via l'ID

## Fichiers modifiés/créés

- ✅ `lib/supabase.ts` - Client Supabase côté client
- ✅ `lib/supabase-server.ts` - Client Supabase côté serveur
- ✅ `app/api/auth/login/route.ts` - Route de login avec support Supabase
- ✅ `app/api/auth/logout/route.ts` - Route de logout avec support Supabase
- ✅ `lib/auth.tsx` - Mise à jour pour supporter Supabase et mock

## Fonctionnement

### Mode Supabase (production)
1. L'utilisateur se connecte avec email/password
2. Supabase Auth gère l'authentification
3. Le profil utilisateur est récupéré depuis la table `users`
4. Les tokens sont stockés dans des cookies sécurisés

### Mode Mock (développement)
1. Utilise les utilisateurs mock définis dans le code
2. Fonctionne sans configuration Supabase
3. Parfait pour le développement local

## Sécurité

- Les cookies sont `httpOnly` et `secure` en production
- Les tokens Supabase sont gérés automatiquement
- Le système de guards (`requireAuth`, `requireAdmin`, etc.) fonctionne avec les deux modes

## Prochaines étapes

1. Créer la table `users` dans Supabase
2. Configurer les variables d'environnement
3. Tester la connexion avec un utilisateur réel
4. Migrer les données mock vers Supabase si nécessaire

