-- ============================================
-- 08_security.sql — Logs sécurité, alertes, scores risque, documents
-- Dépend de : 01_users.sql, 02_marketplace.sql (vendors pour documents)
-- ============================================

-- --------------------------------------------
-- Table public.security_logs (audit sécurité)
-- --------------------------------------------
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.security_logs IS 'Logs d’événements sécurité';

CREATE INDEX idx_security_logs_user_id ON public.security_logs(user_id);
CREATE INDEX idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at);

-- --------------------------------------------
-- Table public.security_alerts (alertes à traiter)
-- --------------------------------------------
CREATE TABLE public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.security_alerts IS 'Alertes sécurité (admin)';

CREATE INDEX idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX idx_security_alerts_status ON public.security_alerts(status);

-- --------------------------------------------
-- Table public.risk_scores (score risque par user)
-- --------------------------------------------
CREATE TABLE public.risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score DECIMAL(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE public.risk_scores IS 'Score de risque utilisateur';

CREATE INDEX idx_risk_scores_user_id ON public.risk_scores(user_id);
CREATE INDEX idx_risk_scores_score ON public.risk_scores(score);

-- --------------------------------------------
-- Table public.documents (KYC / pièces vendeur)
-- --------------------------------------------
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'rccm', 'id_fiscal', 'registre_commerce', 'autre', 'id_card', 'passport', 'selfie', 'proof_of_address'
  )),
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.documents IS 'Documents vendeur (KYC, RCCM, etc.)';

CREATE INDEX idx_documents_vendor_id ON public.documents(vendor_id);
CREATE INDEX idx_documents_status ON public.documents(status);
