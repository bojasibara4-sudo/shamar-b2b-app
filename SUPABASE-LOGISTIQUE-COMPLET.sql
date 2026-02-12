-- =========================================
-- SUPABASE LOGISTIQUE COMPLET
-- Transporteurs, incidents, timeline, preuves
-- À exécuter après SUPABASE-LIVRAISONS-DISPUTES (table deliveries existe).
-- =========================================

-- =========================================
-- 1. LOGISTICS_PROVIDERS (transporteurs) — créé en premier pour FK
-- =========================================
CREATE TABLE IF NOT EXISTS public.logistics_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  logo_url TEXT,
  description TEXT,
  price_per_kg DECIMAL(10, 2),
  base_price DECIMAL(10, 2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  avg_days INTEGER,
  coverage_countries TEXT[],
  quality_rating DECIMAL(3, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_logistics_providers_slug ON public.logistics_providers(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logistics_providers_active ON public.logistics_providers(is_active);

-- Données de base (exemples)
INSERT INTO public.logistics_providers (name, slug, description, base_price, currency, avg_days, quality_rating)
VALUES
  ('DHL Express', 'dhl', 'Livraison express internationale', 15000, 'FCFA', 3, 4.5),
  ('FedEx', 'fedex', 'Transport express', 12000, 'FCFA', 4, 4.2),
  ('Livraison locale Shamar', 'shamar-local', 'Réseau partenaires locaux', 3000, 'FCFA', 5, 4.0)
ON CONFLICT (slug) DO NOTHING;

-- Colonnes optionnelles sur deliveries (si pas déjà présentes)
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS carrier_id UUID REFERENCES public.logistics_providers(id);
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS carrier_name TEXT;
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS status_steps JSONB DEFAULT '[]';
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS proof_photo_url TEXT;
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS proof_signature_url TEXT;
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS proof_qr_scan_at TIMESTAMP WITH TIME ZONE;
-- Compatibilité: certaines migrations utilisent vendor_id, le schéma standard utilise seller_id
ALTER TABLE public.deliveries ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.users(id);
-- Remplir seller_id depuis vendor_id si une colonne vendor_id existe (à exécuter manuellement si besoin)
-- UPDATE public.deliveries SET seller_id = vendor_id WHERE seller_id IS NULL AND vendor_id IS NOT NULL;

-- =========================================
-- 2. DELIVERY_INCIDENTS (tickets incidents)
-- =========================================
CREATE TABLE IF NOT EXISTS public.delivery_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.users(id),
  type TEXT NOT NULL CHECK (type IN ('delay', 'lost', 'damaged', 'wrong_item', 'other')),
  description TEXT,
  photo_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'escalated')),
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_incidents_delivery ON public.delivery_incidents(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_incidents_status ON public.delivery_incidents(status);

ALTER TABLE public.delivery_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parties can view delivery incidents" ON public.delivery_incidents;
CREATE POLICY "Parties can view delivery incidents" ON public.delivery_incidents
  FOR SELECT USING (
    reported_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.deliveries d
      WHERE d.id = delivery_incidents.delivery_id
        AND (d.buyer_id = auth.uid() OR d.seller_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

DROP POLICY IF EXISTS "Buyer or seller can report incident" ON public.delivery_incidents;
CREATE POLICY "Buyer or seller can report incident" ON public.delivery_incidents
  FOR INSERT WITH CHECK (
    reported_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.deliveries d
      WHERE d.id = delivery_incidents.delivery_id
        AND (d.buyer_id = auth.uid() OR d.seller_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can manage incidents" ON public.delivery_incidents;
CREATE POLICY "Admins can manage incidents" ON public.delivery_incidents
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- =========================================
-- FIN LOGISTIQUE
-- =========================================
