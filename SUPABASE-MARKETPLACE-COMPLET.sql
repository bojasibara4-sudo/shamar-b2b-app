-- ============================================
-- FICHE SUPABASE MARKETPLACE — COMPLÈTE
-- ============================================
-- À copier-coller dans l’éditeur SQL Supabase (Dashboard > SQL Editor).
-- Prérequis : tables de base déjà créées (users, products, orders, shops, sellers, badges, reviews).
-- Ce script est idempotent (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

-- --------------------------------------------
-- 1. PRODUITS — Colonnes supplémentaires
-- --------------------------------------------
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_tiers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_available DECIMAL(15, 2) NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_unit TEXT NOT NULL DEFAULT 'tonnes';
COMMENT ON COLUMN public.products.specifications IS 'Spécifications produit (clé/valeur)';
COMMENT ON COLUMN public.products.price_tiers IS 'Paliers B2B [{ "min_quantity": 100, "price": 500 }]';

-- --------------------------------------------
-- 2. AVIS PRODUIT — Table product_reviews
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_buyer_id ON public.product_reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_reviews_product_buyer ON public.product_reviews(product_id, buyer_id);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published product reviews" ON public.product_reviews;
CREATE POLICY "Anyone can view published product reviews" ON public.product_reviews
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Buyers can create product reviews" ON public.product_reviews;
CREATE POLICY "Buyers can create product reviews" ON public.product_reviews
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage product reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage product reviews" ON public.product_reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------
-- 3. BOUTIQUES — Bannière, logo, catégorie
-- --------------------------------------------
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS category TEXT;

-- --------------------------------------------
-- 4. BADGES — Lecture publique
-- --------------------------------------------
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view badges" ON public.badges;
CREATE POLICY "Public can view badges" ON public.badges FOR SELECT USING (true);

-- --------------------------------------------
-- 5. RFQ PRODUIT (Demandes de devis B2B)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  specifications JSONB DEFAULT '{}'::jsonb,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'rejected')),
  quote_price DECIMAL(15, 2),
  quote_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_rfqs_product_id ON public.product_rfqs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_rfqs_buyer_id ON public.product_rfqs(buyer_id);
CREATE INDEX IF NOT EXISTS idx_product_rfqs_seller_id ON public.product_rfqs(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_rfqs_status ON public.product_rfqs(status);

ALTER TABLE public.product_rfqs ENABLE ROW LEVEL SECURITY;

-- Buyer et seller de la RFQ peuvent la voir
DROP POLICY IF EXISTS "Buyer and seller can view product_rfq" ON public.product_rfqs;
CREATE POLICY "Buyer and seller can view product_rfq" ON public.product_rfqs
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Buyer peut créer une RFQ
DROP POLICY IF EXISTS "Buyers can create product_rfq" ON public.product_rfqs;
CREATE POLICY "Buyers can create product_rfq" ON public.product_rfqs
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Buyer et seller peuvent mettre à jour (devis, accept/reject)
DROP POLICY IF EXISTS "Buyer and seller can update product_rfq" ON public.product_rfqs;
CREATE POLICY "Buyer and seller can update product_rfq" ON public.product_rfqs
  FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Admins tout gérer
DROP POLICY IF EXISTS "Admins can manage product_rfqs" ON public.product_rfqs;
CREATE POLICY "Admins can manage product_rfqs" ON public.product_rfqs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------
-- FIN DE LA FICHE
-- --------------------------------------------
-- Tables / colonnes concernées :
--   - products : specifications, price_tiers, images, min_order_quantity, stock_available, stock_unit
--   - product_reviews : avis par produit
--   - shops : banner_url, logo_url, category
--   - badges : politique SELECT publique
--   - product_rfqs : demandes de devis B2B (pending → quoted → accepted/rejected)
