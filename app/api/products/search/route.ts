import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags')?.split(',') || [];
    const q = searchParams.get('q') || searchParams.get('query') || '';
    const idsParam = searchParams.get('ids');
    const ids = idsParam ? idsParam.split(',').filter(Boolean) : [];
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const country = searchParams.get('country') || searchParams.get('pays') || '';
    const city = searchParams.get('city') || searchParams.get('ville') || '';
    const region = searchParams.get('region') || '';
    const sort = searchParams.get('sort') || 'created_at';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    let sellerIds: string[] | null = null;
    if (country.trim() || city.trim() || region.trim()) {
      const idsFromUsers: string[] = [];
      let userQuery = (supabase as any).from('users').select('id');
      if (country.trim()) userQuery = userQuery.eq('country', country.trim());
      if (city.trim()) userQuery = userQuery.eq('city', city.trim());
      if (region.trim()) userQuery = userQuery.eq('region', region.trim());
      const { data: users } = await userQuery.limit(5000);
      if (Array.isArray(users)) users.forEach((u: any) => u.id && idsFromUsers.push(u.id));

      let shopQuery = (supabase as any).from('shops').select('vendor_id');
      if (country.trim()) shopQuery = shopQuery.eq('country', country.trim());
      if (city.trim()) shopQuery = shopQuery.eq('city', city.trim());
      if (region.trim()) shopQuery = shopQuery.eq('region', region.trim());
      const { data: shops } = await shopQuery.limit(5000);
      const idsFromShops: string[] = [];
      if (Array.isArray(shops) && shops.length > 0) {
        const vendorIds = [...new Set(shops.map((s: any) => s.vendor_id).filter(Boolean))];
        const { data: vList } = await (supabase as any).from('vendors').select('user_id').in('id', vendorIds);
        if (Array.isArray(vList)) vList.forEach((v: any) => v.user_id && idsFromShops.push(v.user_id));
      }
      sellerIds = [...new Set([...idsFromUsers, ...idsFromShops])];
      if (sellerIds.length === 0) return NextResponse.json({ products: [] });
    }

    let query = supabase.from('products').select('*').limit(limit);

    if (ids.length > 0) {
      query = query.in('id', ids);
    }
    if (sellerIds && sellerIds.length > 0) {
      query = query.in('seller_id', sellerIds);
    }

    const searchTerms = [...tags.map((t) => t.trim().toLowerCase()).filter(Boolean)];
    if (q.trim()) searchTerms.push(...q.trim().toLowerCase().split(/\s+/).filter(Boolean));
    if (searchTerms.length > 0 && ids.length === 0) {
      const orConditions = searchTerms
        .map((term) => `name.ilike.%${term}%,description.ilike.%${term}%`)
        .join(',');
      query = query.or(orConditions);
    }

    if (category && ids.length === 0) {
      query = query.eq('category', category);
    }
    if (minPrice != null && minPrice !== '') {
      const n = parseFloat(minPrice);
      if (!Number.isNaN(n)) query = query.gte('price', n);
    }
    if (maxPrice != null && maxPrice !== '') {
      const n = parseFloat(maxPrice);
      if (!Number.isNaN(n)) query = query.lte('price', n);
    }

    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (sort === 'name') query = query.order('name', { ascending: true });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error searching products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data || [] });
  } catch (error) {
    console.error('Search products error:', error);
    return NextResponse.json(
      { error: 'Error searching products' },
      { status: 500 }
    );
  }
}
