-- ============================================
-- 02_marketplace.sql — Boutiques, produits, vendeurs, badges, favoris
-- Dépend de : 01_users.sql (public.users)
-- Exécutable sur base vide après 01_users.
-- ============================================

-- --------------------------------------------
-- Table public.vendors (vendeur = user seller avec niveau)
-- --------------------------------------------
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  level TEXT NOT NULL DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE public.vendors IS 'Profil vendeur lié à un user (niveau, statut)';

CREATE INDEX idx_vendors_user_id ON public.vendors(user_id);
CREATE INDEX idx_vendors_status ON public.vendors(status);
CREATE INDEX idx_vendors_level ON public.vendors(level);

-- --------------------------------------------
-- Table public.shops (boutique par vendeur)
-- --------------------------------------------
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  country TEXT,
  city TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.shops IS 'Boutique d’un vendeur (vendor_id = users.id)';

CREATE INDEX idx_shops_vendor_id ON public.shops(vendor_id);

-- --------------------------------------------
-- Table public.products (produits marketplace)
-- --------------------------------------------
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.products IS 'Produits (seller_id = users.id, category pour commissions)';

CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_shop_id ON public.products(shop_id);
CREATE INDEX idx_products_category ON public.products(category);

-- --------------------------------------------
-- Table public.badges (définition des badges)
-- --------------------------------------------
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.badges IS 'Catalogue des badges (or, vérifié, etc.)';

CREATE INDEX idx_badges_code ON public.badges(code);

-- --------------------------------------------
-- Table public.vendor_badges (attribution badge → vendor)
-- --------------------------------------------
CREATE TABLE public.vendor_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(vendor_id, badge_id)
);

COMMENT ON TABLE public.vendor_badges IS 'Badges attribués aux vendeurs';

CREATE INDEX idx_vendor_badges_vendor_id ON public.vendor_badges(vendor_id);
CREATE INDEX idx_vendor_badges_badge_id ON public.vendor_badges(badge_id);

-- --------------------------------------------
-- Table public.favorites (favoris acheteur)
-- --------------------------------------------
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

COMMENT ON TABLE public.favorites IS 'Produits favoris par utilisateur';

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_product_id ON public.favorites(product_id);
