-- ============================================
-- SUPABASE-LITIGE-COMPLET
-- Prérequis : SUPABASE-BASE.sql (users, orders)
-- Idempotent. Tables : disputes, dispute_messages, dispute_evidence.
-- ============================================

CREATE TABLE IF NOT EXISTS public.disputes (
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
CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON public.disputes(raised_by);
CREATE INDEX IF NOT EXISTS idx_disputes_against_user ON public.disputes(against_user);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

CREATE TABLE IF NOT EXISTS public.dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON public.dispute_messages(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_sender_id ON public.dispute_messages(sender_id);

CREATE TABLE IF NOT EXISTS public.dispute_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dispute_evidence_dispute_id ON public.dispute_evidence(dispute_id);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Disputes parties view" ON public.disputes;
CREATE POLICY "Disputes parties view" ON public.disputes FOR SELECT USING (
  raised_by = auth.uid() OR against_user = auth.uid());
DROP POLICY IF EXISTS "Disputes create" ON public.disputes;
CREATE POLICY "Disputes create" ON public.disputes FOR INSERT WITH CHECK (raised_by = auth.uid());
DROP POLICY IF EXISTS "Admins manage disputes" ON public.disputes;
CREATE POLICY "Admins manage disputes" ON public.disputes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Dispute messages parties" ON public.dispute_messages;
CREATE POLICY "Dispute messages parties" ON public.dispute_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_messages.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())));
DROP POLICY IF EXISTS "Dispute messages insert" ON public.dispute_messages;
CREATE POLICY "Dispute messages insert" ON public.dispute_messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_messages.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())));

ALTER TABLE public.dispute_evidence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Dispute evidence parties" ON public.dispute_evidence;
CREATE POLICY "Dispute evidence parties" ON public.dispute_evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_evidence.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())));
DROP POLICY IF EXISTS "Dispute evidence insert" ON public.dispute_evidence;
CREATE POLICY "Dispute evidence insert" ON public.dispute_evidence FOR INSERT WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_evidence.dispute_id AND (d.raised_by = auth.uid() OR d.against_user = auth.uid())));

DROP TRIGGER IF EXISTS update_disputes_updated_at ON public.disputes;
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
