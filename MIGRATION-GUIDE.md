# GUIDE D'EXÉCUTION - MIGRATION MÉTIER SHAMAR B2B

**Date** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Fichier SQL** : `supabase-metier-migration.sql`

---

## ⚠️ PRÉREQUIS

1. **Supabase configuré** : Votre projet Supabase doit être actif
2. **Schema de base exécuté** : `supabase-schema.sql` doit avoir été exécuté au préalable
3. **Accès admin** : Accès à l'éditeur SQL de Supabase

---

## 📋 ÉTAPES D'EXÉCUTION

### Étape 1 : Sauvegarder les données existantes (si nécessaire)

Si vous avez déjà des données dans la table `shops` avec `owner_id`, vous devrez les migrer vers `vendor_id`.

**⚠️ IMPORTANT** : Cette migration crée une nouvelle structure pour `shops`. Si vous avez déjà des shops existants :

1. Sauvegardez les données :
```sql
-- Dans l'éditeur SQL de Supabase, exécutez d'abord :
SELECT * FROM public.shops;
```

2. Notez les `owner_id` existants pour migration manuelle après.

---

### Étape 2 : Exécuter la migration SQL

1. **Ouvrir l'éditeur SQL** dans votre tableau de bord Supabase
2. **Créer une nouvelle requête**
3. **Copier-coller** le contenu de `supabase-metier-migration.sql`
4. **Exécuter** la requête

---

### Étape 3 : Vérifier l'exécution

Vérifiez que toutes les tables ont été créées :

```sql
-- Vérifier les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'vendors', 
  'shops', 
  'documents', 
  'badges', 
  'vendor_badges', 
  'commissions', 
  'transactions'
);

-- Vérifier les badges initiaux
SELECT * FROM public.badges;

-- Vérifier les commissions initiales
SELECT * FROM public.commissions;
```

---

### Étape 4 : Migration des données existantes (si applicable)

Si vous aviez des `shops` avec `owner_id`, vous devez :

1. **Créer des vendors** pour chaque seller existant :
```sql
-- Créer un vendor pour chaque user avec role='seller' qui n'en a pas encore
INSERT INTO public.vendors (user_id, status, level)
SELECT id, 'pending', 'bronze'
FROM public.users
WHERE role = 'seller'
AND id NOT IN (SELECT user_id FROM public.vendors);
```

2. **Migrer les shops** (si structure différente) :
   - Si vous aviez `shops.owner_id` → `shops.vendor_id`, vous devrez :
   ```sql
   -- Exemple (à adapter selon votre structure)
   UPDATE public.shops s
   SET vendor_id = v.id
   FROM public.vendors v
   WHERE v.user_id = s.owner_id; -- Si owner_id existe encore
   ```

---

### Étape 5 : Vérifier les RLS Policies

Vérifiez que les policies RLS sont actives :

```sql
-- Vérifier RLS activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'vendors', 
  'shops', 
  'documents', 
  'badges', 
  'vendor_badges', 
  'commissions', 
  'transactions'
);

-- Toutes doivent avoir rowsecurity = true
```

---

## ✅ VÉRIFICATIONS POST-MIGRATION

### 1. Structure des tables

Exécutez ces requêtes pour vérifier la structure :

```sql
-- Vendors
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'vendors' AND table_schema = 'public';

-- Shops
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'shops' AND table_schema = 'public';

-- Documents
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'documents' AND table_schema = 'public';

-- Badges
SELECT * FROM public.badges;
-- Doit retourner 5 badges : verified_seller, top_seller, fast_shipper, premium_partner, new_seller

-- Commissions
SELECT * FROM public.commissions;
-- Doit retourner 4 lignes : bronze 15%, silver 12%, gold 10%, premium 8%
```

### 2. Test de création (optionnel)

Testez la création d'un vendor (via l'application ou SQL) :

```sql
-- Exemple de test (remplacer USER_ID par un ID réel)
INSERT INTO public.vendors (user_id, status, level)
VALUES ('USER_ID', 'pending', 'bronze')
RETURNING *;
```

---

## 🔧 DÉPANNAGE

### Erreur : "relation already exists"

Si vous obtenez cette erreur, certaines tables existent déjà. Options :

1. **Supprimer les tables existantes** (⚠️ supprime les données) :
```sql
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.commissions CASCADE;
DROP TABLE IF EXISTS public.vendor_badges CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.shops CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
```

2. **Utiliser `CREATE TABLE IF NOT EXISTS`** (déjà inclus dans le script)

### Erreur : "permission denied"

Assurez-vous d'utiliser un compte avec les permissions appropriées dans Supabase.

### Erreur : "foreign key constraint"

Vérifiez que `supabase-schema.sql` a été exécuté au préalable (tables `users`, `orders` doivent exister).

---

## 📝 NOTES IMPORTANTES

1. **RLS activé** : Toutes les nouvelles tables ont RLS activé par défaut
2. **Badges initiaux** : 5 badges sont créés automatiquement
3. **Commissions** : Taux par défaut pour chaque niveau
4. **Shops** : Si vous aviez une table `shops` avec `owner_id`, migration manuelle requise

---

## ✅ VALIDATION FINALE

Après exécution, vous devriez avoir :

- ✅ 7 nouvelles tables créées
- ✅ RLS activé sur toutes les tables
- ✅ Policies RLS configurées
- ✅ 5 badges initiaux insérés
- ✅ 4 taux de commission initiaux insérés
- ✅ Triggers `updated_at` configurés

---

**Guide généré le** : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Fichier SQL** : `supabase-metier-migration.sql`
