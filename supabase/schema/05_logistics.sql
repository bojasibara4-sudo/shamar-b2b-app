-- ============================================
-- 05_logistics.sql — Livraisons, transporteurs, incidents
-- Dépend de : 01_users.sql, 03_orders.sql
-- Compatible delivery.service (vendor_id en insert, vendor_id/seller_id en select).
-- ============================================

-- --------------------------------------------
-- Table public.logistics_providers (transporteurs)
-- --------------------------------------------
CREATE TABLE public.logistics_providers (
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

COMMENT ON TABLE public.logistics_providers IS 'Transporteurs (DHL, FedEx, etc.)';

CREATE UNIQUE INDEX idx_logistics_providers_slug ON public.logistics_providers(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_logistics_providers_active ON public.logistics_providers(is_active);

-- --------------------------------------------
-- Table public.deliveries (livraisons par commande)
-- vendor_id = vendeur (insert app), seller_id = même sens (select .or)
-- Trigger 12_triggers.sql : seller_id = COALESCE(seller_id, vendor_id)
-- --------------------------------------------
CREATE TABLE public.deliveries (
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

COMMENT ON TABLE public.deliveries IS 'Livraisons (vendor_id/seller_id = vendeur)';

CREATE INDEX idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX idx_deliveries_buyer_id ON public.deliveries(buyer_id);
CREATE INDEX idx_deliveries_vendor_id ON public.deliveries(vendor_id);
CREATE INDEX idx_deliveries_seller_id ON public.deliveries(seller_id);
CREATE INDEX idx_deliveries_status ON public.deliveries(status);

-- --------------------------------------------
-- Table public.delivery_incidents (tickets incident livraison)
-- --------------------------------------------
CREATE TABLE public.delivery_incidents (
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

COMMENT ON TABLE public.delivery_incidents IS 'Incidents livraison (retard, perte, dommage, etc.)';

CREATE INDEX idx_delivery_incidents_delivery_id ON public.delivery_incidents(delivery_id);
CREATE INDEX idx_delivery_incidents_status ON public.delivery_incidents(status);
