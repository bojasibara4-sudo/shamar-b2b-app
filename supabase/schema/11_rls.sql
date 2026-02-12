-- ============================================
-- 11_rls.sql — RLS (Row Level Security) pour toutes les tables
-- Dépend de : 01 à 10. Exécuter après création des tables.
-- ============================================

-- Helper : admin check (réutilisé dans les policies)
-- On suppose que public.users.id = auth.uid() et public.users.role = 'admin'

-- --------------------------------------------
-- public.users
-- --------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own row" ON public.users;
CREATE POLICY "Users can read own row" ON public.users FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own row" ON public.users;
CREATE POLICY "Users can update own row" ON public.users FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
CREATE POLICY "Admins can manage all users" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Service role / insert profil après signup : policy INSERT pour authenticated (ou via service role)
DROP POLICY IF EXISTS "Users can insert own row" ON public.users;
CREATE POLICY "Users can insert own row" ON public.users FOR INSERT WITH CHECK (id = auth.uid());

-- --------------------------------------------
-- public.vendors
-- --------------------------------------------
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vendors read own" ON public.vendors;
CREATE POLICY "Vendors read own" ON public.vendors FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Vendors update own" ON public.vendors;
CREATE POLICY "Vendors update own" ON public.vendors FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Vendors insert own" ON public.vendors;
CREATE POLICY "Vendors insert own" ON public.vendors FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage vendors" ON public.vendors;
CREATE POLICY "Admins manage vendors" ON public.vendors FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.shops
-- --------------------------------------------
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shops read all" ON public.shops;
CREATE POLICY "Shops read all" ON public.shops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Shop vendor manage own" ON public.shops;
CREATE POLICY "Shop vendor manage own" ON public.shops FOR ALL USING (vendor_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage shops" ON public.shops;
CREATE POLICY "Admins manage shops" ON public.shops FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.products
-- --------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products read all" ON public.products;
CREATE POLICY "Products read all" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Seller manage own products" ON public.products;
CREATE POLICY "Seller manage own products" ON public.products FOR ALL USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.badges (lecture publique)
-- --------------------------------------------
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Badges read all" ON public.badges;
CREATE POLICY "Badges read all" ON public.badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage badges" ON public.badges;
CREATE POLICY "Admins manage badges" ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.vendor_badges
-- --------------------------------------------
ALTER TABLE public.vendor_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vendor badges read all" ON public.vendor_badges;
CREATE POLICY "Vendor badges read all" ON public.vendor_badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage vendor_badges" ON public.vendor_badges;
CREATE POLICY "Admins manage vendor_badges" ON public.vendor_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.favorites
-- --------------------------------------------
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Favorites own" ON public.favorites;
CREATE POLICY "Favorites own" ON public.favorites FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Favorites insert own" ON public.favorites;
CREATE POLICY "Favorites insert own" ON public.favorites FOR INSERT WITH CHECK (user_id = auth.uid());

-- --------------------------------------------
-- public.orders
-- --------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Orders buyer or seller" ON public.orders;
CREATE POLICY "Orders buyer or seller" ON public.orders FOR SELECT USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Orders buyer insert" ON public.orders;
CREATE POLICY "Orders buyer insert" ON public.orders FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Orders seller update" ON public.orders;
CREATE POLICY "Orders seller update" ON public.orders FOR UPDATE USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.order_items
-- --------------------------------------------
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Order items via order" ON public.order_items;
CREATE POLICY "Order items via order" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid()))
);

DROP POLICY IF EXISTS "Order items insert via order" ON public.order_items;
CREATE POLICY "Order items insert via order" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins manage order_items" ON public.order_items;
CREATE POLICY "Admins manage order_items" ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.reviews
-- --------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews read published" ON public.reviews;
CREATE POLICY "Reviews read published" ON public.reviews FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Buyers read own reviews" ON public.reviews;
CREATE POLICY "Buyers read own reviews" ON public.reviews FOR SELECT USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Sellers read own reviews" ON public.reviews;
CREATE POLICY "Sellers read own reviews" ON public.reviews FOR SELECT USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Buyers create reviews" ON public.reviews;
CREATE POLICY "Buyers create reviews" ON public.reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.payments
-- --------------------------------------------
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payments buyer or vendor" ON public.payments;
CREATE POLICY "Payments buyer or vendor" ON public.payments FOR SELECT USING (
  buyer_id = auth.uid() OR vendor_id = auth.uid() OR seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Payments insert buyer" ON public.payments;
CREATE POLICY "Payments insert buyer" ON public.payments FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Payments update" ON public.payments;
CREATE POLICY "Payments update" ON public.payments FOR UPDATE USING (
  buyer_id = auth.uid() OR vendor_id = auth.uid() OR seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.payouts
-- --------------------------------------------
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payouts vendor own" ON public.payouts;
CREATE POLICY "Payouts vendor own" ON public.payouts FOR SELECT USING (vendor_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY IF EXISTS "Payouts insert vendor" ON public.payouts;
CREATE POLICY "Payouts insert vendor" ON public.payouts FOR INSERT WITH CHECK (vendor_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage payouts" ON public.payouts;
CREATE POLICY "Admins manage payouts" ON public.payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.escrows
-- --------------------------------------------
ALTER TABLE public.escrows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Escrows buyer or seller" ON public.escrows;
CREATE POLICY "Escrows buyer or seller" ON public.escrows FOR SELECT USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Escrows update buyer or seller" ON public.escrows;
CREATE POLICY "Escrows update buyer or seller" ON public.escrows FOR UPDATE USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins manage escrows" ON public.escrows;
CREATE POLICY "Admins manage escrows" ON public.escrows FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.commissions (lecture publique / admin)
-- --------------------------------------------
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Commissions read all" ON public.commissions;
CREATE POLICY "Commissions read all" ON public.commissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage commissions" ON public.commissions;
CREATE POLICY "Admins manage commissions" ON public.commissions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.transactions
-- --------------------------------------------
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Transactions via order" ON public.transactions;
CREATE POLICY "Transactions via order" ON public.transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = transactions.order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid()))
);

DROP POLICY IF EXISTS "Admins manage transactions" ON public.transactions;
CREATE POLICY "Admins manage transactions" ON public.transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.logistics_providers (lecture publique)
-- --------------------------------------------
ALTER TABLE public.logistics_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Logistics read all" ON public.logistics_providers;
CREATE POLICY "Logistics read all" ON public.logistics_providers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage logistics" ON public.logistics_providers;
CREATE POLICY "Admins manage logistics" ON public.logistics_providers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.deliveries
-- --------------------------------------------
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deliveries buyer view" ON public.deliveries;
CREATE POLICY "Deliveries buyer view" ON public.deliveries FOR SELECT USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Deliveries vendor view update" ON public.deliveries;
CREATE POLICY "Deliveries vendor view update" ON public.deliveries FOR ALL USING (
  vendor_id = auth.uid() OR seller_id = auth.uid()
);

DROP POLICY IF EXISTS "Deliveries buyer insert" ON public.deliveries;
CREATE POLICY "Deliveries buyer insert" ON public.deliveries FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage deliveries" ON public.deliveries;
CREATE POLICY "Admins manage deliveries" ON public.deliveries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.delivery_incidents
-- --------------------------------------------
ALTER TABLE public.delivery_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Delivery incidents parties or admin" ON public.delivery_incidents;
CREATE POLICY "Delivery incidents parties or admin" ON public.delivery_incidents FOR SELECT USING (
  reported_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.deliveries d
    WHERE d.id = delivery_incidents.delivery_id AND (d.buyer_id = auth.uid() OR d.vendor_id = auth.uid() OR d.seller_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

DROP POLICY IF EXISTS "Delivery incidents report" ON public.delivery_incidents;
CREATE POLICY "Delivery incidents report" ON public.delivery_incidents FOR INSERT WITH CHECK (
  reported_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.deliveries d
    WHERE d.id = delivery_incidents.delivery_id AND (d.buyer_id = auth.uid() OR d.vendor_id = auth.uid() OR d.seller_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins manage delivery_incidents" ON public.delivery_incidents;
CREATE POLICY "Admins manage delivery_incidents" ON public.delivery_incidents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.disputes
-- --------------------------------------------
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Disputes parties view" ON public.disputes;
CREATE POLICY "Disputes parties view" ON public.disputes FOR SELECT USING (
  raised_by = auth.uid() OR against_user = auth.uid()
);

DROP POLICY IF EXISTS "Disputes create" ON public.disputes;
CREATE POLICY "Disputes create" ON public.disputes FOR INSERT WITH CHECK (raised_by = auth.uid());

DROP POLICY IF EXISTS "Admins manage disputes" ON public.disputes;
CREATE POLICY "Admins manage disputes" ON public.disputes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.dispute_messages
-- --------------------------------------------
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dispute messages parties" ON public.dispute_messages;
CREATE POLICY "Dispute messages parties" ON public.dispute_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_messages.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid()))
);

DROP POLICY IF EXISTS "Dispute messages insert" ON public.dispute_messages;
CREATE POLICY "Dispute messages insert" ON public.dispute_messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_messages.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid()))
);

-- --------------------------------------------
-- public.dispute_evidence
-- --------------------------------------------
ALTER TABLE public.dispute_evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dispute evidence parties" ON public.dispute_evidence;
CREATE POLICY "Dispute evidence parties" ON public.dispute_evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_evidence.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid()))
);

DROP POLICY IF EXISTS "Dispute evidence insert" ON public.dispute_evidence;
CREATE POLICY "Dispute evidence insert" ON public.dispute_evidence FOR INSERT WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_evidence.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid()))
);

-- --------------------------------------------
-- public.reports
-- --------------------------------------------
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reports reporter view" ON public.reports;
CREATE POLICY "Reports reporter view" ON public.reports FOR SELECT USING (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Reports insert" ON public.reports;
CREATE POLICY "Reports insert" ON public.reports FOR INSERT WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage reports" ON public.reports;
CREATE POLICY "Admins manage reports" ON public.reports FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.security_logs
-- --------------------------------------------
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Security logs admin" ON public.security_logs;
CREATE POLICY "Security logs admin" ON public.security_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

DROP POLICY IF EXISTS "Security logs insert" ON public.security_logs;
CREATE POLICY "Security logs insert" ON public.security_logs FOR INSERT WITH CHECK (true);

-- --------------------------------------------
-- public.security_alerts
-- --------------------------------------------
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Security alerts admin" ON public.security_alerts;
CREATE POLICY "Security alerts admin" ON public.security_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.risk_scores
-- --------------------------------------------
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Risk scores own" ON public.risk_scores;
CREATE POLICY "Risk scores own" ON public.risk_scores FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage risk_scores" ON public.risk_scores;
CREATE POLICY "Admins manage risk_scores" ON public.risk_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.documents
-- --------------------------------------------
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Documents vendor own" ON public.documents;
CREATE POLICY "Documents vendor own" ON public.documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vendors v WHERE v.id = documents.vendor_id AND v.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins manage documents" ON public.documents;
CREATE POLICY "Admins manage documents" ON public.documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- --------------------------------------------
-- public.messages
-- --------------------------------------------
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages sender or recipient" ON public.messages;
CREATE POLICY "Messages sender or recipient" ON public.messages FOR ALL USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);

DROP POLICY IF EXISTS "Messages insert sender" ON public.messages;
CREATE POLICY "Messages insert sender" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- --------------------------------------------
-- public.notifications
-- --------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications own" ON public.notifications;
CREATE POLICY "Notifications own" ON public.notifications FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Notifications insert" ON public.notifications;
CREATE POLICY "Notifications insert" ON public.notifications FOR INSERT WITH CHECK (user_id = auth.uid());
