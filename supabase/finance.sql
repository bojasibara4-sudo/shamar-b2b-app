-- ============================================
-- SUPABASE — FINANCE (Paiements, Escrow, Commissions)
-- ============================================
-- Dossier : supabase/finance.sql (nouveau)
-- À exécuter dans Supabase Dashboard → SQL Editor.
-- Prérequis : tables public.users et public.orders existent déjà.
-- Script idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS).
-- Aucun "vendor" : tout en seller_id / seller_amount / seller_level.

-- --------------------------------------------
-- 1. FONCTION updated_at (si pas déjà créée)
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- 2. TABLE PAYMENTS (paiements)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount_total DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  seller_amount DECIMAL(10, 2) NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_payments_seller_id ON public.payments(seller_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers can view their payments" ON public.payments;
CREATE POLICY "Buyers can view their payments" ON public.payments
  FOR SELECT USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Sellers can view their payments" ON public.payments;
CREATE POLICY "Sellers can view their payments" ON public.payments
  FOR SELECT USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Authenticated users can create payments" ON public.payments;
CREATE POLICY "Authenticated users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- --------------------------------------------
-- 3. TABLE PAYOUTS (versements aux sellers)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_payouts_seller_id ON public.payouts(seller_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_period ON public.payouts(period_start, period_end);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sellers can view their payouts" ON public.payouts;
CREATE POLICY "Sellers can view their payouts" ON public.payouts
  FOR SELECT USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all payouts" ON public.payouts;
CREATE POLICY "Admins can manage all payouts" ON public.payouts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Authenticated can insert payouts" ON public.payouts;
CREATE POLICY "Authenticated can insert payouts" ON public.payouts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP TRIGGER IF EXISTS update_payouts_updated_at ON public.payouts;
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON public.payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- --------------------------------------------
-- 4. TABLE ESCROWS (séquestre CREATED → HOLD → SHIPPED → DELIVERED → RELEASED)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN (
    'CREATED', 'HOLD', 'SHIPPED', 'DELIVERED', 'RELEASED', 'DISPUTED', 'CANCELLED'
  )),
  held_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  dispute_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrows_order_id ON public.escrows(order_id);
CREATE INDEX IF NOT EXISTS idx_escrows_buyer_id ON public.escrows(buyer_id);
CREATE INDEX IF NOT EXISTS idx_escrows_seller_id ON public.escrows(seller_id);
CREATE INDEX IF NOT EXISTS idx_escrows_status ON public.escrows(status);

ALTER TABLE public.escrows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own escrows" ON public.escrows;
CREATE POLICY "Users can view own escrows" ON public.escrows
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all escrows" ON public.escrows;
CREATE POLICY "Admins can manage all escrows" ON public.escrows
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Authenticated can insert escrows" ON public.escrows;
CREATE POLICY "Authenticated can insert escrows" ON public.escrows
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Buyer seller can update escrow" ON public.escrows;
CREATE POLICY "Buyer seller can update escrow" ON public.escrows
  FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());

DROP TRIGGER IF EXISTS update_escrows_updated_at ON public.escrows;
CREATE TRIGGER update_escrows_updated_at BEFORE UPDATE ON public.escrows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- --------------------------------------------
-- 5. TABLE COMMISSIONS (taux par catégorie / niveau seller)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,
  seller_level TEXT NOT NULL CHECK (seller_level IN ('bronze', 'silver', 'gold', 'premium')),
  percentage DECIMAL(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, seller_level)
);

CREATE INDEX IF NOT EXISTS idx_commissions_category ON public.commissions(category);
CREATE INDEX IF NOT EXISTS idx_commissions_seller_level ON public.commissions(seller_level);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Commissions are viewable by everyone" ON public.commissions;
CREATE POLICY "Commissions are viewable by everyone" ON public.commissions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage commissions" ON public.commissions;
CREATE POLICY "Only admins can manage commissions" ON public.commissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP TRIGGER IF EXISTS update_commissions_updated_at ON public.commissions;
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Données initiales (ignorées si déjà présentes)
INSERT INTO public.commissions (category, seller_level, percentage)
VALUES
  (NULL, 'bronze', 15.0),
  (NULL, 'silver', 12.0),
  (NULL, 'gold', 10.0),
  (NULL, 'premium', 8.0)
ON CONFLICT (category, seller_level) DO NOTHING;

-- --------------------------------------------
-- 6. TABLE TRANSACTIONS (lien commande / commission)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their transactions" ON public.transactions;
CREATE POLICY "Users can view their transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = transactions.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "System can create transactions" ON public.transactions;
CREATE POLICY "System can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Only admins can update transactions" ON public.transactions;
CREATE POLICY "Only admins can update transactions" ON public.transactions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- --------------------------------------------
-- FIN — supabase/finance.sql
-- --------------------------------------------
-- Tables : payments, payouts, escrows, commissions, transactions
-- RLS + triggers + données initiales commissions
