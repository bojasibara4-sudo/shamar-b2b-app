/**
 * Service Commerce International — Supabase + fallback mock
 */

import { createClient } from '@/lib/supabase/server';
import type { InternationalOffer } from '@/lib/international-offers';
import {
  INTERNATIONAL_OFFERS_MOCK,
  getInternationalOffer as getMockOffer,
  getInternationalOffers as getMockOffers,
} from '@/lib/international-offers';

function rowToOffer(row: Record<string, unknown>): InternationalOffer {
  const certs = Array.isArray(row.certifications) ? (row.certifications as string[]) : [];
  return {
    id: String(row.id),
    supplier_id: String(row.supplier_id),
    supplier_name: String(row.supplier_name),
    supplier_logo: row.supplier_logo ? String(row.supplier_logo) : undefined,
    country: String(row.country),
    country_code: String(row.country_code ?? ''),
    product: String(row.product),
    product_category: String(row.product_category ?? 'Autre'),
    moq: Number(row.moq),
    moq_unit: String(row.moq_unit ?? 'kg'),
    price_bulk: Number(row.price_bulk),
    currency: String(row.currency ?? 'USD'),
    incoterm: (row.incoterm as 'FOB' | 'CIF' | 'EXW') ?? 'FOB',
    lead_time_days: Number(row.lead_time_days ?? 14),
    certifications: certs,
    badge: (row.badge as InternationalOffer['badge']) ?? '',
    description: String(row.description ?? ''),
    specifications: typeof row.specifications === 'object' && row.specifications ? (row.specifications as Record<string, string>) : undefined,
  };
}

/** Liste des offres avec filtres */
export async function getInternationalOffers(filters?: {
  country?: string;
  product?: string;
  minMoq?: number;
  maxPrice?: number;
  minPrice?: number;
  incoterm?: string;
  maxLeadTime?: number;
  certification?: string;
}): Promise<InternationalOffer[]> {
  try {
    const supabase = await createClient();
    let query = (supabase as any)
      .from('international_offers')
      .select('*')
      .eq('status', 'active');

    if (filters?.country) {
      query = query.ilike('country', `%${filters.country}%`);
    }
    if (filters?.product) {
      query = query.or(
        `product.ilike.%${filters.product}%,product_category.ilike.%${filters.product}%,supplier_name.ilike.%${filters.product}%`
      );
    }
    if (filters?.minMoq != null) query = query.gte('moq', filters.minMoq);
    if (filters?.maxPrice != null) query = query.lte('price_bulk', filters.maxPrice);
    if (filters?.minPrice != null) query = query.gte('price_bulk', filters.minPrice);
    if (filters?.incoterm) query = query.eq('incoterm', filters.incoterm);
    if (filters?.maxLeadTime != null) query = query.lte('lead_time_days', filters.maxLeadTime);

    const { data, error } = await query;

    if (error) {
      console.warn('international_offers not available, using mock:', error.message);
      return getMockOffers(filters);
    }
    if (!data || data.length === 0) {
      return getMockOffers(filters);
    }

    let list = data.map(rowToOffer);
    if (filters?.certification) {
      const cert = filters.certification.toLowerCase();
      list = list.filter((o) => o.certifications.some((c) => c.toLowerCase().includes(cert)));
    }
    return list;
  } catch {
    return getMockOffers(filters);
  }
}

/** Offre par ID */
export async function getInternationalOffer(id: string): Promise<InternationalOffer | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('international_offers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return getMockOffer(id);
    }
    return rowToOffer(data);
  } catch {
    return getMockOffer(id);
  }
}

/** Créer une RFQ */
export async function createInternationalRFQ(
  offerId: string,
  buyerId: string,
  input: { quantity: number; port_destination?: string; incoterm?: string; specs?: string; message?: string }
): Promise<{ id: string } | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('international_rfqs')
      .insert({
        offer_id: offerId,
        buyer_id: buyerId,
        quantity: input.quantity,
        port_destination: input.port_destination ?? null,
        incoterm: input.incoterm ?? 'FOB',
        specs: input.specs ?? null,
        message: input.message ?? null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating international_rfq:', error);
      return null;
    }
    return { id: data.id };
  } catch (e) {
    console.error('Error creating international_rfq:', e);
    return null;
  }
}

/** RFQs reçues par un exportateur */
export async function getInternationalRFQsBySupplier(supplierId: string) {
  try {
    const supabase = await createClient();
    const { data: offers } = await (supabase as any)
      .from('international_offers')
      .select('id')
      .eq('supplier_id', supplierId);
    const offerIds = (offers || []).map((o: { id: string }) => o.id);
    if (offerIds.length === 0) return [];

    const { data, error } = await (supabase as any)
      .from('international_rfqs')
      .select('*, international_offers(product, supplier_name)')
      .in('offer_id', offerIds)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/** RFQs d'un importateur */
export async function getInternationalRFQsByBuyer(buyerId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('international_rfqs')
      .select('*, international_offers(product, supplier_name, country)')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/** Contrats d'un importateur */
export async function getInternationalContractsByBuyer(buyerId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('international_contracts')
      .select('*, international_offers(product, supplier_name)')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/** Contrats d'un exportateur */
export async function getInternationalContractsBySupplier(supplierId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('international_contracts')
      .select('*, international_offers(product)')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/** Offres d'un exportateur */
export async function getInternationalOffersBySupplier(supplierId: string): Promise<InternationalOffer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('international_offers')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(rowToOffer);
  } catch {
    return [];
  }
}
