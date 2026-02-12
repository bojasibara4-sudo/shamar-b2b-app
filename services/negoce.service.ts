/**
 * Service Négoce Matières Premières — Supabase + fallback mock
 */

import { createClient } from '@/lib/supabase/server';
import type { NegoceOffer } from '@/lib/negoce-offers';
import { getNegoceOffer as getMockOffer, getNegoceOffers as getMockOffers } from '@/lib/negoce-offers';

function rowToOffer(row: Record<string, unknown>): NegoceOffer {
  const specs = typeof row.specifications === 'object' && row.specifications ? (row.specifications as Record<string, string>) : {};
  const certs = Array.isArray(row.certifications) ? (row.certifications as string[]) : [];
  return {
    id: String(row.id),
    supplier_id: String(row.supplier_id),
    supplier_name: String(row.supplier_name),
    country: String(row.country),
    country_code: String(row.country_code ?? ''),
    product: String(row.product),
    type: (row.type as NegoceOffer['type']) ?? 'autre',
    description: String(row.description ?? ''),
    specifications: specs,
    stock_available: Number(row.stock_available ?? 0),
    stock_unit: String(row.stock_unit ?? 'tonnes'),
    moq: Number(row.moq),
    moq_unit: String(row.moq_unit ?? 'tonnes'),
    price_indicator: Number(row.price_indicator),
    currency: String(row.currency ?? 'USD'),
    incoterm: (row.incoterm as 'FOB' | 'CIF' | 'EXW') ?? 'FOB',
    lead_time_days: Number(row.lead_time_days ?? 14),
    certifications: certs,
    badge: (row.badge as NegoceOffer['badge']) ?? 'bronze',
  };
}

export async function getNegoceOffers(filters?: { type?: string; country?: string; product?: string; minMoq?: number; maxPrice?: number; incoterm?: string; certification?: string }): Promise<NegoceOffer[]> {
  try {
    const supabase = await createClient();
    let query = (supabase as any).from('negoce_offers').select('*').eq('status', 'active');
    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.country) query = query.ilike('country', `%${filters.country}%`);
    if (filters?.product) query = query.or(`product.ilike.%${filters.product}%,supplier_name.ilike.%${filters.product}%`);
    if (filters?.minMoq != null) query = query.gte('moq', filters.minMoq);
    if (filters?.maxPrice != null) query = query.lte('price_indicator', filters.maxPrice);
    if (filters?.incoterm) query = query.eq('incoterm', filters.incoterm);
    const { data, error } = await query;
    if (error) return getMockOffers(filters);
    if (!data?.length) return getMockOffers(filters);
    let list = data.map(rowToOffer);
    if (filters?.certification) {
      const c = filters.certification.toLowerCase();
      list = list.filter((o) => o.certifications.some((x) => x.toLowerCase().includes(c)));
    }
    return list;
  } catch {
    return getMockOffers(filters);
  }
}

export async function getNegoceOffer(id: string): Promise<NegoceOffer | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any).from('negoce_offers').select('*').eq('id', id).maybeSingle();
    if (error || !data) return getMockOffer(id);
    return rowToOffer(data);
  } catch {
    return getMockOffer(id);
  }
}

export async function getNegoceContractsByBuyer(buyerId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any).from('negoce_contracts').select('*, negoce_offers(product, supplier_name)').eq('buyer_id', buyerId).order('created_at', { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getNegoceContractsBySupplier(supplierId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any).from('negoce_contracts').select('*, negoce_offers(product)').eq('supplier_id', supplierId).order('created_at', { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getNegoceOffersBySupplier(supplierId: string): Promise<NegoceOffer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any).from('negoce_offers').select('*').eq('supplier_id', supplierId).order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(rowToOffer);
  } catch {
    return [];
  }
}

export async function getNegoceRFQsBySupplier(supplierId: string) {
  try {
    const supabase = await createClient();
    const { data: offers } = await (supabase as any).from('negoce_offers').select('id').eq('supplier_id', supplierId);
    const ids = (offers || []).map((o: { id: string }) => o.id);
    if (ids.length === 0) return [];
    const { data, error } = await (supabase as any).from('negoce_rfqs').select('*, negoce_offers(product, supplier_name)').in('offer_id', ids).order('created_at', { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getNegoceRFQsByBuyer(buyerId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any).from('negoce_rfqs').select('*, negoce_offers(product, supplier_name, country)').eq('buyer_id', buyerId).order('created_at', { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
