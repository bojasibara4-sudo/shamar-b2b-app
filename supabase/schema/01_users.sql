-- ============================================
-- 01_users.sql — Utilisateurs (base vide)
-- Exécutable sur une base Supabase vide.
-- Pas d'ALTER TABLE, pas de patch.
-- ============================================

-- --------------------------------------------
-- Table public.users (profil étendu, synchro auth.users optionnelle)
-- --------------------------------------------
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'seller', 'buyer')),
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  company_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  kyc_status TEXT CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  identity_verified BOOLEAN DEFAULT false,
  face_verified BOOLEAN DEFAULT false,
  business_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Profils utilisateurs (id = auth.users.id)';
COMMENT ON COLUMN public.users.role IS 'admin | seller | buyer';
COMMENT ON COLUMN public.users.kyc_status IS 'pending | verified | rejected';

-- Index pour filtres courants
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_kyc_status ON public.users(kyc_status);
