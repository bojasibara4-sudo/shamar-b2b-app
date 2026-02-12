-- ============================================
-- 04_payments_escrow.sql — Paiements, versements, escrow, commissions, transactions
-- Dépend de : 01_users.sql, 03_orders.sql
-- Aligné types/supabase.ts (vendor_id, vendor_amount pour payments).
-- ============================================

-- --------------------------------------------
-- Table public.payments (paiements commande)
-- types/supabase : vendor_id, vendor_amount. App peut insérer seller_id → trigger 12 sync vendor_id.
-- --------------------------------------------
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount_total DECIMAL(12, 2) NOT NULL,
  commission_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  vendor_amount DECIMAL(12, 2),
  seller_amount DECIMAL(12, 2),
  currency TEXT NOT NULL DEFAULT 'FCFA',
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'mobile_money', 'bank_transfer')),
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'paid', 'failed', 'refunded')),
  provider_payment_id TEXT,
  provider_session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'Paiements (vendor_id/seller_id = vendeur, trigger 12 sync)';

CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_buyer_id ON public.payments(buyer_id);
CREATE INDEX idx_payments_vendor_id ON public.payments(vendor_id);
CREATE INDEX idx_payments_seller_id ON public.payments(seller_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- --------------------------------------------
-- Table public.payouts (versements vendeur)
-- App utilise seller_id à l’insert et vendor_id au select : une seule colonne vendor_id.
-- --------------------------------------------
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  period_start DATE,
  period_end DATE,
  provider_payout_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payouts IS 'Versements (vendor_id/seller_id, trigger 12 sync)';

CREATE INDEX idx_payouts_vendor_id ON public.payouts(vendor_id);
CREATE INDEX idx_payouts_seller_id ON public.payouts(seller_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);

-- --------------------------------------------
-- Table public.escrows (séquestre par commande)
-- --------------------------------------------
CREATE TABLE public.escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN (
    'CREATED', 'HOLD', 'SHIPPED', 'DELIVERED', 'RELEASED', 'DISPUTED', 'CANCELLED', 'REFUNDED'
  )),
  held_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  dispute_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.escrows IS 'Escrow par commande (dispute_id FK ajoutée après 06_disputes si besoin)';

CREATE INDEX idx_escrows_order_id ON public.escrows(order_id);
CREATE INDEX idx_escrows_buyer_id ON public.escrows(buyer_id);
CREATE INDEX idx_escrows_seller_id ON public.escrows(seller_id);
CREATE INDEX idx_escrows_status ON public.escrows(status);

-- --------------------------------------------
-- Table public.commissions (taux par niveau / catégorie)
-- --------------------------------------------
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_level TEXT NOT NULL CHECK (seller_level IN ('bronze', 'silver', 'gold', 'premium')),
  category TEXT,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.commissions IS 'Taux de commission (seller_level, category optionnel)';

CREATE INDEX idx_commissions_seller_level ON public.commissions(seller_level);
CREATE INDEX idx_commissions_category ON public.commissions(category);

-- --------------------------------------------
-- Table public.transactions (historique financier)
-- --------------------------------------------
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  commission_amount DECIMAL(12, 2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.transactions IS 'Lignes de transaction (commission, statut)';

CREATE INDEX idx_transactions_order_id ON public.transactions(order_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
