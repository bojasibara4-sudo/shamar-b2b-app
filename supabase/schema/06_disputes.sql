-- ============================================
-- 06_disputes.sql — Litiges, messages, preuves
-- Dépend de : 01_users.sql, 03_orders.sql
-- ============================================

-- --------------------------------------------
-- Table public.disputes (litiges commande)
-- --------------------------------------------
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  against_user UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  amount_requested DECIMAL(12, 2),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'rejected')),
  resolution_note TEXT,
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.disputes IS 'Litiges (raised_by / against_user = users.id)';

CREATE INDEX idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX idx_disputes_raised_by ON public.disputes(raised_by);
CREATE INDEX idx_disputes_against_user ON public.disputes(against_user);
CREATE INDEX idx_disputes_status ON public.disputes(status);

-- --------------------------------------------
-- Table public.dispute_messages (chat litige)
-- --------------------------------------------
CREATE TABLE public.dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dispute_messages IS 'Messages dans un litige';

CREATE INDEX idx_dispute_messages_dispute_id ON public.dispute_messages(dispute_id);
CREATE INDEX idx_dispute_messages_sender_id ON public.dispute_messages(sender_id);

-- --------------------------------------------
-- Table public.dispute_evidence (pièces jointes litige)
-- --------------------------------------------
CREATE TABLE public.dispute_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dispute_evidence IS 'Preuves / pièces jointes litige';

CREATE INDEX idx_dispute_evidence_dispute_id ON public.dispute_evidence(dispute_id);
