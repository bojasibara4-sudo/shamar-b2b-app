-- ============================================
-- MIGRATION PHASES 7-8-9 - PRODUCTION READY
-- ============================================
-- Paiements réels, livraisons, notations, disputes
-- À exécuter dans l'éditeur SQL de Supabase APRÈS toutes les migrations précédentes

-- ============================================
-- PHASE 7 - PAIEMENTS RÉELS
-- ============================================

-- Table PAYMENTS (paiements réels Stripe)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount_total DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  vendor_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'paid', 'failed', 'refunded')),
  provider TEXT NOT NULL DEFAULT 'stripe' CHECK (provider IN ('stripe', 'mobile_money', 'bank_transfer')),
  provider_payment_id TEXT,
  provider_session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_buyer_id ON public.payments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_payments_vendor_id ON public.payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON public.payments(provider_payment_id);

-- Table PAYOUTS (versements aux sellers)
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  provider_payout_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_vendor_id ON public.payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_period ON public.payouts(period_start, period_end);

-- ============================================
-- PHASE 8 - LOGISTIQUE & LIVRAISON
-- ============================================

-- Table DELIVERIES (livraisons)
CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('standard', 'express', 'pickup')),
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'disputed')),
  tracking_code TEXT,
  shipping_address TEXT,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_vendor_id ON public.deliveries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_buyer_id ON public.deliveries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking_code ON public.deliveries(tracking_code);

-- ============================================
-- PHASE 9 - CONFIANCE, NOTATION & SCALING
-- ============================================

-- Table REVIEWS (avis et notations)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(order_id, buyer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON public.reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- Table DISPUTES (litiges)
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  against_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'rejected')),
  resolution_note TEXT,
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON public.disputes(raised_by);
CREATE INDEX IF NOT EXISTS idx_disputes_against_user ON public.disputes(against_user);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - ACTIVATION
-- ============================================

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PAYMENTS
-- ============================================

-- Buyers voient leurs paiements
CREATE POLICY "Buyers can view their payments" ON public.payments
  FOR SELECT USING (buyer_id = auth.uid());

-- Sellers voient leurs revenus (vendor_id)
CREATE POLICY "Sellers can view their payments" ON public.payments
  FOR SELECT USING (vendor_id = auth.uid());

-- Admins voient tout
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service peut insérer (via API route avec auth)
CREATE POLICY "Authenticated users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- RLS POLICIES - PAYOUTS
-- ============================================

-- Sellers voient leurs payouts
CREATE POLICY "Sellers can view their payouts" ON public.payouts
  FOR SELECT USING (vendor_id = auth.uid());

-- Admins voient et gèrent tout
CREATE POLICY "Admins can manage all payouts" ON public.payouts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES - DELIVERIES
-- ============================================

-- Buyers voient leurs livraisons
CREATE POLICY "Buyers can view their deliveries" ON public.deliveries
  FOR SELECT USING (buyer_id = auth.uid());

-- Sellers voient leurs livraisons
CREATE POLICY "Sellers can view and update their deliveries" ON public.deliveries
  FOR ALL USING (vendor_id = auth.uid());

-- Admins voient tout
CREATE POLICY "Admins can manage all deliveries" ON public.deliveries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES - REVIEWS
-- ============================================

-- Tous peuvent voir les avis publiés
CREATE POLICY "Everyone can view published reviews" ON public.reviews
  FOR SELECT USING (status = 'published');

-- Buyers peuvent créer leurs avis
CREATE POLICY "Buyers can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Sellers voient leurs avis
CREATE POLICY "Sellers can view their reviews" ON public.reviews
  FOR SELECT USING (vendor_id = auth.uid());

-- Admins peuvent tout gérer
CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES - DISPUTES
-- ============================================

-- Users voient leurs disputes
CREATE POLICY "Users can view their disputes" ON public.disputes
  FOR SELECT USING (raised_by = auth.uid() OR against_user = auth.uid());

-- Users peuvent créer des disputes
CREATE POLICY "Users can create disputes" ON public.disputes
  FOR INSERT WITH CHECK (raised_by = auth.uid());

-- Admins peuvent tout gérer
CREATE POLICY "Admins can manage all disputes" ON public.disputes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRIGGERS - UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN DE LA MIGRATION PHASES 7-8-9
-- ============================================
