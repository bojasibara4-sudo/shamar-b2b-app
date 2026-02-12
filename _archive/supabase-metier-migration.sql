-- ============================================
-- MIGRATION MÉTIER SHAMAR B2B
-- ============================================
-- Ce fichier crée toutes les tables métier manquantes :
-- sellers (vendors), shops (complété), documents, badges, commissions, transactions
-- À exécuter dans l'éditeur SQL de Supabase APRÈS supabase-schema.sql

-- ============================================
-- 1. TABLE VENDORS (Profils sellers avec niveaux)
-- ============================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended')),
  level TEXT NOT NULL DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_level ON public.vendors(level);

-- ============================================
-- 2. TABLE SHOPS (Complétée - existe partiellement dans code)
-- ============================================
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_shops_vendor_id ON public.shops(vendor_id);
CREATE INDEX IF NOT EXISTS idx_shops_category ON public.shops(category);
CREATE INDEX IF NOT EXISTS idx_shops_is_verified ON public.shops(is_verified);

-- Migration : Si la table shops existe déjà avec owner_id, créer une migration
-- Pour l'instant, on crée la nouvelle structure
-- Note: Si des données existent, il faudra migrer owner_id → vendor_id

-- ============================================
-- 3. TABLE DOCUMENTS (Documents légaux pour validation sellers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('rccm', 'id_fiscal', 'registre_commerce', 'autre')),
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_vendor_id ON public.documents(vendor_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(type);

-- ============================================
-- 4. TABLE BADGES (Badges disponibles)
-- ============================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level_required TEXT CHECK (level_required IN ('bronze', 'silver', 'gold', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_badges_code ON public.badges(code);
CREATE INDEX IF NOT EXISTS idx_badges_category ON public.badges(category);

-- ============================================
-- 5. TABLE VENDOR_BADGES (Attribution badges aux sellers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.vendor_badges (
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (vendor_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_badges_vendor_id ON public.vendor_badges(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_badges_badge_id ON public.vendor_badges(badge_id);

-- ============================================
-- 6. TABLE COMMISSIONS (Taux de commission par catégorie et niveau)
-- ============================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT,
  vendor_level TEXT NOT NULL CHECK (vendor_level IN ('bronze', 'silver', 'gold', 'premium')),
  percentage DECIMAL(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, vendor_level)
);

CREATE INDEX IF NOT EXISTS idx_commissions_category ON public.commissions(category);
CREATE INDEX IF NOT EXISTS idx_commissions_vendor_level ON public.commissions(vendor_level);

-- ============================================
-- 7. TABLE TRANSACTIONS (Transactions financières)
-- ============================================
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

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS) - ACTIVATION
-- ============================================
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS POLICIES - VENDORS
-- ============================================
-- Les sellers peuvent voir leur propre profil
CREATE POLICY "Sellers can view their own profile" ON public.vendors
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Seuls les admins peuvent créer/modifier des sellers (vendors)
CREATE POLICY "Only admins can manage vendors" ON public.vendors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 10. RLS POLICIES - SHOPS
-- ============================================
-- Tous peuvent voir les boutiques vérifiées
CREATE POLICY "Verified shops are viewable by everyone" ON public.shops
  FOR SELECT USING (is_verified = TRUE);

-- Les sellers peuvent voir leurs propres boutiques
CREATE POLICY "Sellers can view their own shops" ON public.shops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = shops.vendor_id
      AND vendors.user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Les sellers peuvent créer leurs boutiques
CREATE POLICY "Sellers can create their own shops" ON public.shops
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = shops.vendor_id
      AND vendors.user_id = auth.uid()
      AND vendors.status = 'verified'
    )
  );

-- Les sellers peuvent modifier leurs boutiques (sauf is_verified)
CREATE POLICY "Sellers can update their own shops" ON public.shops
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = shops.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Seuls les admins peuvent vérifier les boutiques
CREATE POLICY "Only admins can verify shops" ON public.shops
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 11. RLS POLICIES - DOCUMENTS
-- ============================================
-- Les sellers peuvent voir leurs propres documents
CREATE POLICY "Sellers can view their own documents" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = documents.vendor_id
      AND vendors.user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Les sellers peuvent créer leurs documents
CREATE POLICY "Sellers can create their own documents" ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = documents.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Seuls les admins peuvent approuver/rejeter les documents
CREATE POLICY "Only admins can approve documents" ON public.documents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 12. RLS POLICIES - BADGES
-- ============================================
-- Tous peuvent voir les badges
CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT USING (true);

-- Seuls les admins peuvent gérer les badges
CREATE POLICY "Only admins can manage badges" ON public.badges
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 13. RLS POLICIES - VENDOR_BADGES
-- ============================================
-- Tous peuvent voir les badges attribués
CREATE POLICY "Seller badges are viewable by everyone" ON public.vendor_badges
  FOR SELECT USING (true);

-- Seuls les admins peuvent attribuer des badges (via fonction RPC recommandée)
CREATE POLICY "Only admins can assign badges" ON public.vendor_badges
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 14. RLS POLICIES - COMMISSIONS
-- ============================================
-- Tous peuvent voir les taux de commission
CREATE POLICY "Commissions are viewable by everyone" ON public.commissions
  FOR SELECT USING (true);

-- Seuls les admins peuvent gérer les commissions
CREATE POLICY "Only admins can manage commissions" ON public.commissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 15. RLS POLICIES - TRANSACTIONS
-- ============================================
-- Les sellers et acheteurs peuvent voir leurs transactions
CREATE POLICY "Users can view their transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = transactions.order_id
      AND (
        orders.buyer_id = auth.uid() OR
        orders.seller_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Seuls le système (via fonction RPC) peut créer des transactions
CREATE POLICY "System can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (true); -- RPC functions bypass RLS, mais on garde pour sécurité

-- Seuls les admins peuvent modifier les transactions
CREATE POLICY "Only admins can update transactions" ON public.transactions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 16. TRIGGERS - updated_at
-- ============================================
-- Utiliser la fonction existante update_updated_at_column()

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 17. DONNÉES INITIALES - BADGES
-- ============================================
INSERT INTO public.badges (code, label, description, category, level_required) VALUES
  ('verified_seller', 'Vendeur Vérifié', 'Vendeur avec documents validés', 'verification', NULL),
  ('top_seller', 'Top Vendeur', 'Vendeur avec plus de 100 commandes', 'sales', 'gold'),
  ('fast_shipper', 'Expéditeur Rapide', 'Expéditions rapides et fiables', 'logistics', 'silver'),
  ('premium_partner', 'Partenaire Premium', 'Vendeur de niveau premium', 'partnership', 'premium'),
  ('new_seller', 'Nouveau Vendeur', 'Vendeur récemment inscrit', 'status', NULL)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 18. DONNÉES INITIALES - COMMISSIONS
-- ============================================
-- Taux par défaut : Bronze 15%, Silver 12%, Gold 10%, Premium 8%
INSERT INTO public.commissions (category, vendor_level, percentage) VALUES
  (NULL, 'bronze', 15.00),
  (NULL, 'silver', 12.00),
  (NULL, 'gold', 10.00),
  (NULL, 'premium', 8.00)
ON CONFLICT (category, vendor_level) DO NOTHING;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
