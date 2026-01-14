/**
 * Script de seed pour SHAMAR B2B
 * Données réelles, propres et crédibles pour le marché africain + international
 */

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { realSeedData } from './seed-real-data';

async function main() {
  console.log('🌱 Démarrage du seed SHAMAR B2B...\n');

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    console.error('❌ Erreur: Supabase non configuré. Vérifiez les variables d\'environnement.');
    process.exit(1);
  }

  try {
    // 1. Créer les utilisateurs (via auth.users d'abord, puis public.users)
    console.log('👥 Création des utilisateurs...');
    const userIds: Record<string, string> = {};

    console.log('⚠️  Note: Les utilisateurs doivent exister dans auth.users avant d\'être créés dans public.users.');
    console.log('    Créer manuellement via Supabase Dashboard ou utiliser Supabase Admin API.\n');

    for (const userData of realSeedData.users) {
      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userData.id)
        .single();

      if (existingUser) {
        userIds[userData.email] = existingUser.id;
        console.log(`  ✓ ${userData.full_name || userData.email} (${userData.role}) - Existe déjà`);
        continue;
      }

      // Essayer de créer/upsert dans public.users
      // Note: Cela échouera si l'utilisateur n'existe pas dans auth.users
      const { data: user, error: userError } = await supabase
        .from('users')
        .upsert({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          full_name: userData.full_name,
          phone: userData.phone,
          company_name: userData.company_name,
          company_address: userData.company_address,
          country: userData.country,
        }, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (userError && !userError.message.includes('duplicate') && !userError.message.includes('unique')) {
        console.warn(`⚠️  Utilisateur ${userData.email}: ${userError.message}`);
        console.warn(`    → Créer manuellement dans auth.users avec UUID: ${userData.id}`);
      } else if (user) {
        userIds[userData.email] = user.id;
        console.log(`  ✓ ${userData.full_name || userData.email} (${userData.role})`);
      }
    }

    console.log(`\n✅ ${Object.keys(userIds).length} utilisateurs créés\n`);

    // 2. Créer les produits
    console.log('📦 Création des produits...');
    let productsCreated = 0;

    for (const productData of realSeedData.products) {
      const sellerId = userIds[productData.sellerEmail];
      if (!sellerId) {
        console.warn(`⚠️  Vendeur ${productData.sellerEmail} non trouvé, produit ignoré`);
        continue;
      }

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          seller_id: sellerId,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          currency: productData.currency,
          category: productData.category,
          image_url: (productData as any).image_url || null,
          stock_quantity: productData.stock_quantity,
          min_order_quantity: productData.min_order_quantity || 1,
          status: productData.status || 'active',
        })
        .select()
        .single();

      if (productError) {
        console.warn(`⚠️  Erreur produit ${productData.name}:`, productError.message);
      } else {
        productsCreated++;
        if (productsCreated % 20 === 0) {
          console.log(`  ✓ ${productsCreated} produits créés...`);
        }
      }
    }

    console.log(`\n✅ ${productsCreated} produits créés\n`);

    // 3. Créer quelques commandes et offres pour montrer l'activité
    console.log('🛒 Création des commandes et offres...');
    
    // Récupérer quelques produits et utilisateurs pour créer des relations
    const { data: allProducts } = await supabase
      .from('products')
      .select('id, seller_id, price, currency')
      .limit(20);

    const { data: buyers } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'buyer')
      .limit(5);

    if (allProducts && buyers && allProducts.length > 0 && buyers.length > 0) {
      let ordersCreated = 0;
      let offersCreated = 0;

      // Créer quelques offres
      for (let i = 0; i < Math.min(8, allProducts.length); i++) {
        const product = allProducts[i];
        const buyer = buyers[i % buyers.length];

        const { error: offerError } = await supabase
          .from('offers')
          .insert({
            product_id: product.id,
            buyer_id: buyer.id,
            seller_id: product.seller_id,
            price: Number(product.price) * 0.95, // Offre à 95% du prix
            quantity: Math.floor(Math.random() * 10) + 1,
            currency: product.currency as 'FCFA' | 'USD' | 'EUR',
            status: ['pending', 'accepted', 'pending'][Math.floor(Math.random() * 3)],
          });

        if (!offerError) offersCreated++;
      }

      // Créer quelques commandes
      for (let i = 0; i < Math.min(5, allProducts.length); i++) {
        const product = allProducts[i];
        const buyer = buyers[i % buyers.length];

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            buyer_id: buyer.id,
            seller_id: product.seller_id,
            total_amount: Number(product.price) * 2,
            currency: product.currency as 'FCFA' | 'USD' | 'EUR',
            status: ['PENDING', 'CONFIRMED', 'SHIPPED'][Math.floor(Math.random() * 3)],
            payment_status: ['pending', 'paid'][Math.floor(Math.random() * 2)],
          })
          .select()
          .single();

        if (!orderError && order) {
          // Créer les order_items
          await supabase
            .from('order_items')
            .insert({
              order_id: order.id,
              product_id: product.id,
              quantity: 2,
              price: Number(product.price),
            });

          ordersCreated++;
        }
      }

      console.log(`  ✓ ${offersCreated} offres créées`);
      console.log(`  ✓ ${ordersCreated} commandes créées`);
    }

    console.log('\n✅ Seed terminé avec succès!\n');
    console.log('📊 Résumé:');
    console.log(`   - ${Object.keys(userIds).length} utilisateurs`);
    console.log(`   - ${productsCreated} produits`);
    console.log(`   - Données prêtes pour démonstration\n`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

// Exécuter le seed
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
