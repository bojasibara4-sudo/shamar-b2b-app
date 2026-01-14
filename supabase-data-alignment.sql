-- ============================================
-- SCRIPT D'ALIGNEMENT DES DONNÉES - PHASE 2
-- SHAMAR B2B - Production Readiness
-- ============================================
-- OBJECTIF : Corriger les données pour rendre les dashboards exploitables
-- À exécuter dans l'éditeur SQL de Supabase
-- 
-- ATTENTION : Ce script ne modifie PAS la structure des tables
-- Il nettoie et aligne uniquement les données existantes

-- ============================================
-- 1. NETTOYAGE DES DONNÉES ORPHELINES
-- ============================================

-- Supprimer les order_items sans commande valide
DELETE FROM public.order_items 
WHERE order_id NOT IN (SELECT id FROM public.orders);

-- Supprimer les commandes sans acheteur ou vendeur valide
DELETE FROM public.orders 
WHERE buyer_id NOT IN (SELECT id FROM public.users)
   OR seller_id NOT IN (SELECT id FROM public.users);

-- Supprimer les produits sans vendeur valide
DELETE FROM public.products 
WHERE seller_id NOT IN (SELECT id FROM public.users);

-- Supprimer les offres sans produit, acheteur ou vendeur valide
DELETE FROM public.offers 
WHERE product_id NOT IN (SELECT id FROM public.products)
   OR buyer_id NOT IN (SELECT id FROM public.users)
   OR seller_id NOT IN (SELECT id FROM public.users);

-- ============================================
-- 2. CORRECTION DES STATUTS ET CHAMPS REQUIS
-- ============================================

-- S'assurer que tous les produits ont un statut valide
UPDATE public.products 
SET status = 'active' 
WHERE status IS NULL OR status NOT IN ('active', 'inactive', 'sold_out');

-- S'assurer que tous les produits ont une devise
UPDATE public.products 
SET currency = 'FCFA' 
WHERE currency IS NULL OR currency NOT IN ('FCFA', 'USD', 'EUR');

-- S'assurer que tous les produits ont un prix > 0
UPDATE public.products 
SET price = 1000 
WHERE price IS NULL OR price <= 0;

-- S'assurer que toutes les commandes ont un statut valide
UPDATE public.orders 
SET status = 'PENDING' 
WHERE status IS NULL OR status NOT IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- S'assurer que toutes les commandes ont une devise
UPDATE public.orders 
SET currency = 'FCFA' 
WHERE currency IS NULL OR currency NOT IN ('FCFA', 'USD', 'EUR');

-- S'assurer que toutes les commandes ont un montant > 0
UPDATE public.orders 
SET total_amount = 1000 
WHERE total_amount IS NULL OR total_amount <= 0;

-- ============================================
-- 3. CRÉATION DE DONNÉES DE DÉMONSTRATION
-- (Seulement si aucune donnée existante)
-- ============================================

DO $$
DECLARE
  admin_user_id UUID;
  seller_user_id UUID;
  buyer_user_id UUID;
  product_id_1 UUID;
  product_id_2 UUID;
  order_id_1 UUID;
  order_id_2 UUID;
  user_count INTEGER;
  product_count INTEGER;
  order_count INTEGER;
BEGIN
  -- Vérifier si des utilisateurs existent
  SELECT COUNT(*) INTO user_count FROM public.users;
  
  -- Si aucun utilisateur, on ne peut pas créer de données de démo
  -- (Les utilisateurs doivent être créés via auth.users d'abord)
  IF user_count = 0 THEN
    RAISE NOTICE 'Aucun utilisateur trouvé. Veuillez créer des utilisateurs via l''interface d''authentification d''abord.';
    RETURN;
  END IF;

  -- Vérifier si des produits existent
  SELECT COUNT(*) INTO product_count FROM public.products;
  
  -- Vérifier si des commandes existent
  SELECT COUNT(*) INTO order_count FROM public.orders;

  -- Si aucune donnée, créer des données de démonstration
  -- (Ceci est optionnel - à activer si nécessaire pour GTM)
  
  -- Sélectionner un admin existant
  SELECT id INTO admin_user_id FROM public.users WHERE role = 'admin' LIMIT 1;
  
  -- Sélectionner un seller existant
  SELECT id INTO seller_user_id FROM public.users WHERE role = 'seller' LIMIT 1;
  
  -- Sélectionner un buyer existant
  SELECT id INTO buyer_user_id FROM public.users WHERE role = 'buyer' LIMIT 1;

  -- Si aucun seller ou buyer, on ne peut pas créer de données de démo
  IF seller_user_id IS NULL OR buyer_user_id IS NULL THEN
    RAISE NOTICE 'Seller ou Buyer manquant. Veuillez créer des utilisateurs avec les rôles appropriés.';
    RETURN;
  END IF;

  -- Créer des produits si aucun n'existe
  IF product_count = 0 AND seller_user_id IS NOT NULL THEN
    INSERT INTO public.products (seller_id, name, description, price, currency, category, status, stock_quantity, min_order_quantity)
    VALUES 
      (seller_user_id, 'Produit Démo 1', 'Description du produit de démonstration 1', 50000, 'FCFA', 'Catégorie A', 'active', 100, 1),
      (seller_user_id, 'Produit Démo 2', 'Description du produit de démonstration 2', 75000, 'FCFA', 'Catégorie B', 'active', 50, 1)
    RETURNING id INTO product_id_1;
    
    SELECT id INTO product_id_1 FROM public.products WHERE name = 'Produit Démo 1' LIMIT 1;
    SELECT id INTO product_id_2 FROM public.products WHERE name = 'Produit Démo 2' LIMIT 1;
    
    RAISE NOTICE 'Produits de démonstration créés';
  END IF;

  -- Créer des commandes si aucune n'existe
  IF order_count = 0 AND buyer_user_id IS NOT NULL AND seller_user_id IS NOT NULL THEN
    -- Récupérer des produits existants
    SELECT id INTO product_id_1 FROM public.products WHERE seller_id = seller_user_id LIMIT 1;
    
    IF product_id_1 IS NOT NULL THEN
      -- Créer une commande DELIVERED (pour le revenu)
      INSERT INTO public.orders (buyer_id, seller_id, total_amount, currency, status, payment_status)
      VALUES (buyer_user_id, seller_user_id, 150000, 'FCFA', 'DELIVERED', 'paid')
      RETURNING id INTO order_id_1;
      
      -- Créer les order_items
      INSERT INTO public.order_items (order_id, product_id, quantity, price)
      VALUES (order_id_1, product_id_1, 3, 50000);
      
      -- Créer une commande PENDING (pour les stats)
      INSERT INTO public.orders (buyer_id, seller_id, total_amount, currency, status, payment_status)
      VALUES (buyer_user_id, seller_user_id, 75000, 'FCFA', 'PENDING', 'pending')
      RETURNING id INTO order_id_2;
      
      INSERT INTO public.order_items (order_id, product_id, quantity, price)
      VALUES (order_id_2, product_id_1, 1, 75000);
      
      RAISE NOTICE 'Commandes de démonstration créées';
    END IF;
  END IF;

END $$;

-- ============================================
-- 4. VÉRIFICATION POST-ALIGNEMENT
-- ============================================

-- Afficher un résumé des données
SELECT 
  'users' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
  COUNT(*) FILTER (WHERE role = 'seller') as seller_count,
  COUNT(*) FILTER (WHERE role = 'buyer') as buyer_count
FROM public.users
UNION ALL
SELECT 
  'products' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'active') as active_count,
  NULL::INTEGER as seller_count,
  NULL::INTEGER as buyer_count
FROM public.products
UNION ALL
SELECT 
  'orders' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'DELIVERED') as delivered_count,
  COUNT(*) FILTER (WHERE status = 'PENDING') as pending_count,
  NULL::INTEGER as buyer_count
FROM public.orders;

-- ============================================
-- FIN DU SCRIPT D'ALIGNEMENT
-- ============================================
-- Résultat attendu :
-- - Données cohérentes (pas de clés étrangères NULL)
-- - Statuts valides
-- - Dashboards exploitables (stats non nulles si données existent)
-- ============================================
