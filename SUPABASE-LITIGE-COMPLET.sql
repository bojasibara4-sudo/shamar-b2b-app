-- =========================================
-- SUPABASE FINANCE + LITIGE (COMPATIBLE 100%)
-- 1) Finance: Payments / Payouts / Escrow / Commissions / Transactions
-- 2) Litige: disputes, dispute_messages, dispute_evidence, amount_requested
-- SAFE VERSION (IF NOT EXISTS / DROP IF EXISTS)
-- =========================================


-- =========================
-- FUNCTION updated_at
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- =========================================================
-- 1. PAYMENTS (lié UNIQUEMENT à order_id)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','failed','refunded')),

  provider TEXT,
  provider_payment_id TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();



-- =========================================================
-- 2. PAYOUTS (seller uniquement)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','sent','failed')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_seller ON public.payouts(seller_id);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_payouts_updated_at ON public.payouts;
CREATE TRIGGER update_payouts_updated_at
BEFORE UPDATE ON public.payouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();



-- =========================================================
-- 3. ESCROWS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.users(id),
  seller_id UUID REFERENCES public.users(id),

  amount DECIMAL(12,2) NOT NULL,

  status TEXT NOT NULL DEFAULT 'held'
    CHECK (status IN ('held','released','refunded','disputed')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrows_order ON public.escrows(order_id);

ALTER TABLE public.escrows ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_escrows_updated_at ON public.escrows;
CREATE TRIGGER update_escrows_updated_at
BEFORE UPDATE ON public.escrows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- =========================================================
-- 4. COMMISSIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  seller_level TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- =========================================================
-- 5. TRANSACTIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

  amount DECIMAL(12,2) NOT NULL,
  commission_amount DECIMAL(12,2),

  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','paid','failed')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_order ON public.transactions(order_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();



-- =========================================
-- FIN FINANCE CLEAN
-- =========================================



-- =========================================
-- 6. LITIGE (DISPUTES) — à utiliser après orders/users
-- Si table disputes existe déjà (ex. SUPABASE-LIVRAISONS-DISPUTES), 
-- seules les colonnes/tables suivantes sont ajoutées.
-- =========================================

-- 6.1 Table disputes (si pas déjà créée)
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  against_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'resolved', 'rejected')),
  resolution_note TEXT,
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.disputes ADD COLUMN IF NOT EXISTS amount_requested DECIMAL(12, 2);

CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON public.disputes(raised_by);
CREATE INDEX IF NOT EXISTS idx_disputes_against_user ON public.disputes(against_user);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their disputes" ON public.disputes;
CREATE POLICY "Users can view their disputes" ON public.disputes
  FOR SELECT USING (raised_by = auth.uid() OR against_user = auth.uid());

DROP POLICY IF EXISTS "Users can create disputes" ON public.disputes;
CREATE POLICY "Users can create disputes" ON public.disputes
  FOR INSERT WITH CHECK (raised_by = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all disputes" ON public.disputes;
CREATE POLICY "Admins can manage all disputes" ON public.disputes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP TRIGGER IF EXISTS update_disputes_updated_at ON public.disputes;
CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 6.2 Table dispute_messages (chat litige)
CREATE TABLE IF NOT EXISTS public.dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON public.dispute_messages(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_sender_id ON public.dispute_messages(sender_id);

ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parties can view dispute messages" ON public.dispute_messages;
CREATE POLICY "Parties can view dispute messages" ON public.dispute_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.disputes d
      WHERE d.id = dispute_messages.dispute_id
        AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Parties can insert dispute messages" ON public.dispute_messages;
CREATE POLICY "Parties can insert dispute messages" ON public.dispute_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.disputes d
      WHERE d.id = dispute_messages.dispute_id
        AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())
    )
  );


-- 6.3 Table dispute_evidence (preuves / pièces jointes)
CREATE TABLE IF NOT EXISTS public.dispute_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dispute_evidence_dispute_id ON public.dispute_evidence(dispute_id);

ALTER TABLE public.dispute_evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parties can view dispute evidence" ON public.dispute_evidence;
CREATE POLICY "Parties can view dispute evidence" ON public.dispute_evidence
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.disputes d
      WHERE d.id = dispute_evidence.dispute_id
        AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Parties can insert dispute evidence" ON public.dispute_evidence;
CREATE POLICY "Parties can insert dispute evidence" ON public.dispute_evidence
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.disputes d
      WHERE d.id = dispute_evidence.dispute_id
        AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())
    )
  );


-- =========================================
-- FIN LITIGE — disputes, dispute_messages, dispute_evidence
-- =========================================