-- ============================================
-- MIGRATION PHASE 6 - ONBOARDING SELLER
-- ============================================
-- Complète les tables shops et documents pour l'onboarding complet
-- À exécuter dans l'éditeur SQL de Supabase APRÈS supabase-metier-migration.sql

-- ============================================
-- 1. COMPLÉTER TABLE SHOPS
-- ============================================

-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE public.shops 
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'verified', 'suspended'));

-- Mettre à jour seller_id depuis vendor_id si nécessaire
-- Note: seller_id est un alias pratique pour accéder rapidement au user_id depuis seller/vendor
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shops' AND column_name = 'vendor_id') THEN
    UPDATE public.shops s
    SET seller_id = v.user_id
    FROM public.vendors v
    WHERE s.vendor_id = v.id AND s.seller_id IS NULL;
  END IF;
END $$;

-- Index pour seller_id
CREATE INDEX IF NOT EXISTS idx_shops_seller_id ON public.shops(seller_id);
CREATE INDEX IF NOT EXISTS idx_shops_status ON public.shops(status);

-- Migration: Si is_verified = true, mettre status = 'verified'
UPDATE public.shops SET status = 'verified' WHERE is_verified = TRUE AND status = 'draft';

-- ============================================
-- 2. COMPLÉTER TABLE DOCUMENTS (seller_documents)
-- ============================================

-- Renommer la table documents en vendor_documents pour clarté (si nécessaire)
-- OU créer une nouvelle table vendor_documents si documents sert à autre chose
-- Pour cette migration, on garde documents mais on ajoute seller_id pour faciliter les requêtes

ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Mettre à jour seller_id depuis vendor_id
UPDATE public.documents d
SET seller_id = v.user_id
FROM public.vendors v
WHERE d.vendor_id = v.id AND d.seller_id IS NULL;

-- Index pour seller_id
CREATE INDEX IF NOT EXISTS idx_documents_seller_id ON public.documents(seller_id);

-- Ajouter uploaded_at si absent (normalement created_at existe déjà)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'uploaded_at') THEN
    ALTER TABLE public.documents ADD COLUMN uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Migration des types de documents (rccm -> company_registration, id_fiscal -> license, etc.)
-- Note: On garde les anciens types pour compatibilité, mais on peut étendre avec les nouveaux
-- Pour l'instant, on ajoute un check étendu
DO $$
BEGIN
  -- Si la contrainte CHECK existe déjà, on ne peut pas la modifier directement
  -- Il faut d'abord la supprimer puis la recréer
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'documents' AND constraint_name LIKE '%type%check%'
  ) THEN
    -- On garde l'ancien check pour compatibilité
    -- Les nouveaux types seront ajoutés dans une prochaine migration si nécessaire
    NULL;
  END IF;
END $$;

-- ============================================
-- 3. RLS POLICIES - SHOPS (COMPLÉTÉES)
-- ============================================

-- Supprimer les anciennes policies si elles existent (pour les recréer proprement)
DROP POLICY IF EXISTS "Shops are viewable by everyone if verified" ON public.shops;
DROP POLICY IF EXISTS "Sellers can view and manage their own shops" ON public.shops;

-- Policy: Sellers peuvent voir et gérer leur propre boutique
CREATE POLICY "Sellers can manage their own shop" ON public.shops
  FOR ALL USING (
    seller_id = auth.uid() OR
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
  );

-- Policy: Admins peuvent tout voir et gérer
CREATE POLICY "Admins can manage all shops" ON public.shops
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: Buyers peuvent voir uniquement les boutiques vérifiées
CREATE POLICY "Buyers can view verified shops" ON public.shops
  FOR SELECT USING (
    status = 'verified' AND is_verified = TRUE
  );

-- ============================================
-- 4. RLS POLICIES - DOCUMENTS (COMPLÉTÉES)
-- ============================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Sellers can view and upload their own documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can view and update all documents" ON public.documents;

-- Policy: Sellers peuvent voir et uploader leurs documents
CREATE POLICY "Sellers can manage their own documents" ON public.documents
  FOR ALL USING (
    seller_id = auth.uid() OR
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
  );

-- Policy: Admins peuvent voir et valider tous les documents
CREATE POLICY "Admins can manage all documents" ON public.documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 5. STORAGE BUCKET - VENDOR DOCUMENTS
-- ============================================

-- Note: Le bucket doit être créé manuellement dans Supabase Dashboard
-- Storage > Buckets > New bucket
-- Nom: vendor-documents
-- Public: false
-- Allowed MIME types: application/pdf, image/jpeg, image/png, image/jpg

-- Policy pour le bucket (à exécuter après création du bucket)
-- Les sellers peuvent uploader dans leur dossier
-- Les admins peuvent lire tous les fichiers
-- CREATE POLICY "Sellers can upload in their folder" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'vendor-documents' AND
--     (storage.foldername(name))[1] = auth.uid()::text
--   );

-- CREATE POLICY "Sellers can read their documents" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'vendor-documents' AND
--     (storage.foldername(name))[1] = auth.uid()::text
--   );

-- CREATE POLICY "Admins can read all vendor documents" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'vendor-documents' AND
--     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
--   );

-- ============================================
-- 6. TRIGGER - MISE À JOUR STATUS VENDOR
-- ============================================

-- Fonction pour mettre à jour automatiquement le status du seller (vendor)
-- Le seller devient verified si:
-- - Sa boutique est verified
-- - TOUS ses documents requis sont approved

CREATE OR REPLACE FUNCTION update_vendor_status_on_shop_change()
RETURNS TRIGGER AS $$
DECLARE
  v_vendor_id UUID;
  v_user_id UUID;
  v_shop_verified BOOLEAN;
  v_documents_approved BOOLEAN;
BEGIN
  -- Récupérer vendor_id et user_id
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    v_vendor_id := NEW.vendor_id;
    SELECT user_id INTO v_user_id FROM public.vendors WHERE id = v_vendor_id;
  ELSE
    v_vendor_id := OLD.vendor_id;
    SELECT user_id INTO v_user_id FROM public.vendors WHERE id = v_vendor_id;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Vérifier si la boutique est verified
  SELECT COUNT(*) > 0 AND bool_and(is_verified = TRUE AND status = 'verified')
  INTO v_shop_verified
  FROM public.shops
  WHERE vendor_id = v_vendor_id;

  -- Vérifier si TOUS les documents requis sont approuvés
  SELECT COUNT(*) > 0 AND COUNT(*) = COUNT(*) FILTER (WHERE status = 'approved')
  INTO v_documents_approved
  FROM public.documents
  WHERE vendor_id = v_vendor_id;

  -- Mettre à jour le status du seller
  IF v_shop_verified AND v_documents_approved THEN
    UPDATE public.vendors
    SET status = 'verified', updated_at = NOW()
    WHERE id = v_vendor_id AND status != 'verified';
  ELSE
    UPDATE public.vendors
    SET status = 'pending', updated_at = NOW()
    WHERE id = v_vendor_id AND status != 'pending' AND status != 'suspended';
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur shops
DROP TRIGGER IF EXISTS trigger_update_vendor_status_on_shop_change ON public.shops;
CREATE TRIGGER trigger_update_vendor_status_on_shop_change
  AFTER INSERT OR UPDATE ON public.shops
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_status_on_shop_change();

-- Trigger sur documents
DROP TRIGGER IF EXISTS trigger_update_vendor_status_on_document_change ON public.documents;
CREATE TRIGGER trigger_update_vendor_status_on_document_change
  AFTER INSERT OR UPDATE OR DELETE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_status_on_shop_change();

-- ============================================
-- 7. CONTRAINTE - UNE SEULE BOUTIQUE PAR SELLER
-- ============================================

-- Note: On ne peut pas créer une contrainte unique directement
-- car un seller peut avoir plusieurs boutiques en statut 'draft'
-- Mais une seule en statut 'pending', 'verified', ou 'suspended'
-- Cette logique sera gérée au niveau applicatif

-- ============================================
-- FIN DE LA MIGRATION PHASE 6
-- ============================================
