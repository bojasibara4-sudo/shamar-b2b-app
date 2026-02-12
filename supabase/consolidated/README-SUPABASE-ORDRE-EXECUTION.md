# SQL Supabase — Ordre d’exécution (consolidé)

**Source unique :** tous les scripts à exécuter sont dans ce dossier. Aucun doublon de table, fonction, trigger ou policy.

## Ordre obligatoire

Exécuter dans le **SQL Editor** Supabase, **un fichier après l’autre**, dans cet ordre :

| # | Fichier | Contenu |
|---|---------|---------|
| 1 | **SUPABASE-BASE.sql** | users, vendors, shops, products, badges, vendor_badges, favorites, orders, order_items, reviews, messages, notifications + fonction `update_updated_at` + index + RLS + policies + triggers |
| 2 | **SUPABASE-MARKETPLACE-COMPLET.sql** | Colonnes produits/shops, product_reviews, product_rfqs, **offers** + RLS + triggers |
| 3 | **SUPABASE-FINANCE-COMPLET.sql** | payments, payouts, escrows, commissions, transactions + RLS + triggers |
| 4 | **SUPABASE-LOGISTIQUE-COMPLET.sql** | logistics_providers, deliveries, delivery_incidents + sync_delivery_seller_id + RLS + triggers |
| 5 | **SUPABASE-LITIGE-COMPLET.sql** | disputes, dispute_messages, dispute_evidence + RLS + triggers |
| 6 | **SUPABASE-SECURITY-COMPLET.sql** | reports, security_logs, security_alerts, risk_scores, documents, sanctions + RLS + triggers |
| 7 | **SUPABASE-ROLES-OWNER-EXEC.sql** | (optionnel) Étend `users.role` pour owner_root, owner_exec, admin_staff (super-administration hiérarchique) |

## Règles

- **Base vide** : exécuter d’abord SUPABASE-BASE.sql sur une base sans tables `public.*`.
- **Idempotence** : chaque script utilise `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`, `CREATE OR REPLACE FUNCTION`. On peut relancer un script sans erreur (pas de doublon d’objet).
- **Un seul exemplaire** : chaque table, fonction, trigger et policy n’existe que dans un seul fichier.

## Après exécution

- Créer les lignes `public.users` à la suite de `auth.users` (trigger ou Edge Function selon votre flux).
- Créer le bucket Storage **vendor-documents** si utilisé par l’app.

## Fichiers supprimés / dépréciés

Les anciens fichiers suivants ne doivent plus être utilisés (remplacés par ce dossier) :

- `supabase/schema/01_users.sql` … `12_triggers.sql`
- `supabase-*-migration.sql` (host, negoce, international, security, escrow, marketplace, kyc-geo)
- `supabase-offers-marketplace.sql`
- `supabase/finance.sql`
- Les COMPLET à la racine peuvent être conservés en backup ; la référence est ce dossier.

Voir **RAPPORT-CONSOLIDATION-SQL-FEV2026.md** à la racine pour la liste détaillée des suppressions et fusions.
