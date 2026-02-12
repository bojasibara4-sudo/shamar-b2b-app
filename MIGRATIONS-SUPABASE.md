# MIGRATIONS SUPABASE — ORDRE D'EXÉCUTION

**Objectif :** Documenter l'ordre exact et les dépendances des migrations Supabase pour Shamar.

---

## Ordre d'exécution

| Ordre | Fichier | Tables / Contenu | Dépendances |
|-------|---------|------------------|-------------|
| 1 | `_archive/supabase-schema.sql` | users, products, orders, order_items, offers, messages | Aucune |
| 2 | `_archive/supabase-metier-migration.sql` | vendors, shops, documents, badges, vendor_badges, commissions, transactions | users |
| 3 | `_archive/supabase-phase7-8-9-production-migration.sql` | payments, payouts, deliveries, reviews, disputes | users, orders |
| 4 | `supabase-escrow-migration.sql` | escrows | orders, **payments** |
| 5 | `supabase-security-migration.sql` | security_logs | users |
| 6 | `supabase-host-migration.sql` | host_properties, host_bookings, host_reviews | users, escrows |
| 7 | `supabase-international-migration.sql` | international_offers, international_rfqs, international_contracts, international_shipments | users |

---

## Détail des dépendances

- **Escrows** : référence `payments(id)` via `payment_id`. La table `payments` doit exister avant l'exécution de la migration escrow.
- **Security_logs** : référence `users(id)` via `user_id`. La table `users` doit exister.
- **Shops** : référence `vendors(id)` via `vendor_id`. La migration métier crée vendors puis shops.
- **Documents** : référence `vendors(id)` via `vendor_id`.

---

## Conventions clés (vendor_id / seller_id)

| Table | Colonne | Référence | Signification |
|-------|---------|-----------|---------------|
| orders | seller_id | users(id) | ID utilisateur du vendeur |
| products | seller_id | users(id) | ID utilisateur du vendeur |
| shops | vendor_id | vendors(id) | ID du profil vendor |
| documents | vendor_id | vendors(id) | ID du profil vendor |
| payments | vendor_id | users(id) | ID utilisateur du vendeur |
| deliveries | vendor_id | users(id) | ID utilisateur du vendeur |
| reviews | vendor_id | users(id) | ID utilisateur du vendeur |
| escrows | seller_id | users(id) | ID utilisateur du vendeur |

---

## Migrations optionnelles

- `_archive/supabase-phase6-onboarding-migration.sql` : onboarding si utilisé
- `_archive/supabase-data-alignment.sql` : alignement de données
- `_archive/supabase-payments-schema.sql` : schéma payments alternatif

---

*Document généré pour alignement Supabase. Mise à jour : février 2026.*
