-- ============================================
-- TABLE PAYMENTS (à ajouter au schéma Supabase)
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA' CHECK (currency IN ('FCFA', 'USD', 'EUR')),
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'mobile_money', 'bank_transfer')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
  transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_buyer_id ON public.payments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_order_unique ON public.payments(order_id) WHERE status = 'SUCCESS';

-- Activer RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- POLICIES PAYMENTS
-- ============================================
-- Les acheteurs peuvent voir leurs paiements
CREATE POLICY "Buyers can view their payments" ON public.payments
  FOR SELECT USING (
    buyer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND orders.seller_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Les acheteurs peuvent créer des paiements
CREATE POLICY "Buyers can create payments" ON public.payments
  FOR INSERT WITH CHECK (
    buyer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'buyer')
  );

-- Les acheteurs peuvent mettre à jour leurs paiements
CREATE POLICY "Buyers can update their payments" ON public.payments
  FOR UPDATE USING (
    buyer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger pour updated_at
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
