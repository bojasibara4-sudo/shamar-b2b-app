-- ============================================
-- 12_triggers.sql — Fonction updated_at + triggers
-- Dépend de : 01 à 11. Exécuter en dernier.
-- ============================================

-- --------------------------------------------
-- Fonction : mise à jour automatique de updated_at
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger: met à jour updated_at à chaque UPDATE';

-- --------------------------------------------
-- Trigger : deliveries.seller_id = COALESCE(seller_id, vendor_id)
-- Compatible delivery.service (insert vendor_id, select .or(vendor_id, seller_id))
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_delivery_seller_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.seller_id = COALESCE(NEW.seller_id, NEW.vendor_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_delivery_seller_id_trigger ON public.deliveries;
CREATE TRIGGER sync_delivery_seller_id_trigger
  BEFORE INSERT OR UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.sync_delivery_seller_id();

-- Sync payments: vendor_id/vendor_amount depuis seller_id/seller_amount (compat app)
CREATE OR REPLACE FUNCTION public.sync_payments_vendor()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.vendor_id = COALESCE(NEW.vendor_id, NEW.seller_id);
  NEW.vendor_amount = COALESCE(NEW.vendor_amount, NEW.seller_amount);
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sync_payments_vendor_trigger ON public.payments;
CREATE TRIGGER sync_payments_vendor_trigger
  BEFORE INSERT OR UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.sync_payments_vendor();

-- Sync payouts: vendor_id depuis seller_id (compat app)
CREATE OR REPLACE FUNCTION public.sync_payouts_vendor()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.vendor_id = COALESCE(NEW.vendor_id, NEW.seller_id);
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sync_payouts_vendor_trigger ON public.payouts;
CREATE TRIGGER sync_payouts_vendor_trigger
  BEFORE INSERT OR UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.sync_payouts_vendor();

-- --------------------------------------------
-- Triggers updated_at (tables avec colonne updated_at)
-- --------------------------------------------
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vendors_updated_at ON public.vendors;
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_shops_updated_at ON public.shops;
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_badges_updated_at ON public.badges;
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON public.badges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payouts_updated_at ON public.payouts;
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_escrows_updated_at ON public.escrows;
CREATE TRIGGER update_escrows_updated_at BEFORE UPDATE ON public.escrows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_commissions_updated_at ON public.commissions;
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_providers_updated_at ON public.logistics_providers;
CREATE TRIGGER update_logistics_providers_updated_at BEFORE UPDATE ON public.logistics_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_deliveries_updated_at ON public.deliveries;
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_incidents_updated_at ON public.delivery_incidents;
CREATE TRIGGER update_delivery_incidents_updated_at BEFORE UPDATE ON public.delivery_incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_disputes_updated_at ON public.disputes;
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_security_alerts_updated_at ON public.security_alerts;
CREATE TRIGGER update_security_alerts_updated_at BEFORE UPDATE ON public.security_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_risk_scores_updated_at ON public.risk_scores;
CREATE TRIGGER update_risk_scores_updated_at BEFORE UPDATE ON public.risk_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
