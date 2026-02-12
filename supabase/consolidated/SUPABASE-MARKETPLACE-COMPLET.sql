-- ============================================
-- SUPABASE-MARKETPLACE-COMPLET
-- Prérequis : SUPABASE-BASE.sql (users, products, orders, shops, badges)
-- Idempotent. Contient : colonnes produits/shops, product_reviews, product_rfqs, offers.
-- ============================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_tiers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_available DECIMAL(15, 2) NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_unit TEXT NOT NULL DEFAULT 'tonnes';

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
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published product reviews" ON public.product_reviews;
CREATE POLICY "Anyone can view published product reviews" ON public.product_reviews FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Buyers can create product reviews" ON public.product_reviews;
CREATE POLICY "Buyers can create product reviews" ON public.product_reviews FOR INSERT WITH CHECK (buyer_id = auth.uid());
DROP POLICY IF EXISTS "Admins can manage product reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage product reviews" ON public.product_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS category TEXT;

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view badges" ON public.badges;
CREATE POLICY "Public can view badges" ON public.badges FOR SELECT USING (true);

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
DROP POLICY IF EXISTS "Buyer and seller can view product_rfq" ON public.product_rfqs;
CREATE POLICY "Buyer and seller can view product_rfq" ON public.product_rfqs FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());
DROP POLICY IF EXISTS "Buyers can create product_rfq" ON public.product_rfqs;
CREATE POLICY "Buyers can create product_rfq" ON public.product_rfqs FOR INSERT WITH CHECK (buyer_id = auth.uid());
DROP POLICY IF EXISTS "Buyer and seller can update product_rfq" ON public.product_rfqs;
CREATE POLICY "Buyer and seller can update product_rfq" ON public.product_rfqs FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());
DROP POLICY IF EXISTS "Admins can manage product_rfqs" ON public.product_rfqs;
CREATE POLICY "Admins can manage product_rfqs" ON public.product_rfqs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Table offers (négociation, mes offres, RFQ)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  currency TEXT NOT NULL DEFAULT 'FCFA',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'counter_offer')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_offers_product_id ON public.offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON public.offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller_id ON public.offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers(status);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Offers buyer or seller or admin" ON public.offers;
CREATE POLICY "Offers buyer or seller or admin" ON public.offers FOR SELECT USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
DROP POLICY IF EXISTS "Buyers can create offers" ON public.offers;
CREATE POLICY "Buyers can create offers" ON public.offers FOR INSERT WITH CHECK (buyer_id = auth.uid());
DROP POLICY IF EXISTS "Buyer or seller can update offers" ON public.offers;
CREATE POLICY "Buyer or seller can update offers" ON public.offers FOR UPDATE USING (
  buyer_id = auth.uid() OR seller_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
DROP TRIGGER IF EXISTS update_offers_updated_at ON public.offers;
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
