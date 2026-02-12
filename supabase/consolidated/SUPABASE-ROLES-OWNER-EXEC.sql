-- ============================================
-- Rôles hiérarchiques super-administration
-- Exécuter APRÈS SUPABASE-BASE.sql
-- Étend users.role pour owner_root, owner_exec, admin_staff
-- ============================================

-- Supprimer la contrainte actuelle sur role
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin', 'seller', 'buyer', 'owner_root', 'owner_exec', 'admin_staff'));

COMMENT ON COLUMN public.users.role IS 'admin | seller | buyer | owner_root (Président) | owner_exec (Vice-président) | admin_staff (admin normal)';
