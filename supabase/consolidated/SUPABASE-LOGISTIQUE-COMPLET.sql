-- ============================================
-- SUPABASE-LOGISTIQUE-COMPLET
-- Prérequis : SUPABASE-BASE.sql (users, orders)
-- Idempotent. Tables : logistics_providers, deliveries, delivery_incidents.
-- ============================================

CREATE TABLE IF NOT EXISTS public.logistics_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  description TEXT,
  price_per_kg DECIMAL(10, 2),
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  avg_days INTEGER,
  coverage_countries TEXT[],
  quality_rating DECIMAL(3, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_logistics_providers_slug ON public.logistics_providers(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logistics_providers_active ON public.logistics_providers(is_active);

CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL DEFAULT 'standard' CHECK (method IN ('standard', 'express', 'pickup')),
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'disputed')),
  tracking_code TEXT,
  tracking_url TEXT,
  carrier_name TEXT,
  carrier_id UUID REFERENCES public.logistics_providers(id) ON DELETE SET NULL,
  shipping_address TEXT,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  notes TEXT,
  status_steps JSONB DEFAULT '[]',
  proof_photo_url TEXT,
  proof_signature_url TEXT,
  proof_qr_scan_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_buyer_id ON public.deliveries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_vendor_id ON public.deliveries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_seller_id ON public.deliveries(seller_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);

CREATE OR REPLACE FUNCTION public.sync_delivery_seller_id()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.seller_id = COALESCE(NEW.seller_id, NEW.vendor_id);
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sync_delivery_seller_id_trigger ON public.deliveries;
CREATE TRIGGER sync_delivery_seller_id_trigger
  BEFORE INSERT OR UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.sync_delivery_seller_id();

CREATE TABLE IF NOT EXISTS public.delivery_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('delay', 'lost', 'damaged', 'wrong_item', 'other')),
  description TEXT,
  photo_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'escalated')),
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_delivery_incidents_delivery_id ON public.delivery_incidents(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_incidents_status ON public.delivery_incidents(status);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Deliveries buyer view" ON public.deliveries;
CREATE POLICY "Deliveries buyer view" ON public.deliveries FOR SELECT USING (buyer_id = auth.uid());
DROP POLICY IF EXISTS "Deliveries vendor view update" ON public.deliveries;
CREATE POLICY "Deliveries vendor view update" ON public.deliveries FOR ALL USING (vendor_id = auth.uid() OR seller_id = auth.uid());
DROP POLICY IF EXISTS "Deliveries buyer insert" ON public.deliveries;
CREATE POLICY "Deliveries buyer insert" ON public.deliveries FOR INSERT WITH CHECK (buyer_id = auth.uid());
DROP POLICY IF EXISTS "Admins manage deliveries" ON public.deliveries;
CREATE POLICY "Admins manage deliveries" ON public.deliveries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

ALTER TABLE public.logistics_providers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Logistics read all" ON public.logistics_providers;
CREATE POLICY "Logistics read all" ON public.logistics_providers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage logistics" ON public.logistics_providers;
CREATE POLICY "Admins manage logistics" ON public.logistics_providers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

ALTER TABLE public.delivery_incidents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Delivery incidents parties or admin" ON public.delivery_incidents;
CREATE POLICY "Delivery incidents parties or admin" ON public.delivery_incidents FOR SELECT USING (
  reported_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.deliveries d WHERE d.id = delivery_incidents.delivery_id AND (d.buyer_id = auth.uid() OR d.vendor_id = auth.uid() OR d.seller_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
DROP POLICY IF EXISTS "Delivery incidents report" ON public.delivery_incidents;
CREATE POLICY "Delivery incidents report" ON public.delivery_incidents FOR INSERT WITH CHECK (
  reported_by = auth.uid()
  AND EXISTS (SELECT 1 FROM public.deliveries d WHERE d.id = delivery_incidents.delivery_id AND (d.buyer_id = auth.uid() OR d.vendor_id = auth.uid() OR d.seller_id = auth.uid())));
DROP POLICY IF EXISTS "Admins manage delivery_incidents" ON public.delivery_incidents;
CREATE POLICY "Admins manage delivery_incidents" ON public.delivery_incidents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

DROP TRIGGER IF EXISTS update_deliveries_updated_at ON public.deliveries;
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_logistics_providers_updated_at ON public.logistics_providers;
CREATE TRIGGER update_logistics_providers_updated_at BEFORE UPDATE ON public.logistics_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_delivery_incidents_updated_at ON public.delivery_incidents;
CREATE TRIGGER update_delivery_incidents_updated_at BEFORE UPDATE ON public.delivery_incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
