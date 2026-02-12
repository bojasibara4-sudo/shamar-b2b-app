-- ============================================
-- 10_indexes.sql — Index supplémentaires (performance)
-- Dépend de : 01 à 09 (tables déjà créées avec index de base)
-- ============================================

-- Commandes : recherche par acheteur + statut, par vendeur + date
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status ON public.orders(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_seller_created ON public.orders(seller_id, created_at DESC);

-- Paiements : par commande et statut
CREATE INDEX IF NOT EXISTS idx_payments_order_status ON public.payments(order_id, status);

-- Livraisons : par vendeur et statut
CREATE INDEX IF NOT EXISTS idx_deliveries_vendor_status ON public.deliveries(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_deliveries_buyer_status ON public.deliveries(buyer_id, status);

-- Litiges : par ordre et statut
CREATE INDEX IF NOT EXISTS idx_disputes_order_status ON public.disputes(order_id, status);

-- Messages : conversation (expéditeur + destinataire)
CREATE INDEX IF NOT EXISTS idx_messages_recipient_created ON public.messages(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_created ON public.messages(sender_id, created_at DESC);

-- Notifications : non lues par user
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Logs sécurité : par type et date
CREATE INDEX IF NOT EXISTS idx_security_logs_type_created ON public.security_logs(event_type, created_at DESC);
