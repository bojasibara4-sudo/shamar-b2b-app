# Schéma Supabase — Exécution sur base vide

Ces fichiers SQL sont **complets et autonomes**. À exécuter dans l’ordre dans le **SQL Editor** Supabase (base vide).

## Ordre d’exécution

| Fichier | Contenu |
|--------|---------|
| `01_users.sql` | Table `users` |
| `02_marketplace.sql` | `vendors`, `shops`, `products`, `badges`, `vendor_badges`, `favorites` |
| `03_orders.sql` | `orders`, `order_items`, `reviews` |
| `04_payments_escrow.sql` | `payments`, `payouts`, `escrows`, `commissions`, `transactions` |
| `05_logistics.sql` | `logistics_providers`, `deliveries`, `delivery_incidents` |
| `06_disputes.sql` | `disputes`, `dispute_messages`, `dispute_evidence` |
| `07_admin.sql` | `reports` |
| `08_security.sql` | `security_logs`, `security_alerts`, `risk_scores`, `documents` |
| `09_notifications.sql` | `messages`, `notifications` |
| `10_indexes.sql` | Index supplémentaires |
| `11_rls.sql` | RLS (Row Level Security) sur toutes les tables |
| `12_triggers.sql` | Fonction `update_updated_at`, sync vendor_id/seller_id, triggers updated_at |

## Règles

- **Aucun ALTER TABLE** : tout est en CREATE TABLE / INDEX / POLICY / FUNCTION / TRIGGER.
- **Base vide** : chaque fichier suppose que les tables des fichiers précédents existent.
- **Compatibilité app** : `payments`/`payouts`/`deliveries` acceptent `seller_id` ou `vendor_id` ; des triggers (fichier 12) synchronisent les colonnes.

## Après exécution

- Créer les profils `public.users` à la suite de `auth.users` (trigger ou Edge Function selon votre flux).
- Les tables Host / International / Negoce (`host_properties`, `international_offers`, etc.) ne sont pas incluses ici ; les ajouter si besoin dans des fichiers dédiés.
