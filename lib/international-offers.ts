/**
 * Données mock pour le module Commerce International (hors Chine)
 * Afrique ↔ Monde : fournisseurs, offres bulk, MOQ, incoterms
 */

export type InternationalBadge = 'gold' | 'verified' | '';

export interface InternationalOffer {
  id: string;
  supplier_id: string;
  supplier_name: string;
  supplier_logo?: string;
  country: string;
  country_code: string;
  product: string;
  product_category: string;
  moq: number;
  moq_unit: string;
  price_bulk: number;
  currency: string;
  incoterm: 'FOB' | 'CIF' | 'EXW';
  lead_time_days: number;
  certifications: string[];
  badge: InternationalBadge;
  description: string;
  specifications?: Record<string, string>;
}

export const INTERNATIONAL_OFFERS_MOCK: InternationalOffer[] = [
  {
    id: '1',
    supplier_id: 's1',
    supplier_name: 'AgriExport Senegal',
    country: 'Sénégal',
    country_code: 'SN',
    product: 'Arachides décortiquées',
    product_category: 'Agroalimentaire',
    moq: 5000,
    moq_unit: 'kg',
    price_bulk: 2.8,
    currency: 'USD',
    incoterm: 'FOB',
    lead_time_days: 14,
    certifications: ['ISO 22000', 'HACCP'],
    badge: 'verified',
    description: 'Arachides de qualité export, calibrées, prêtes pour transformation.',
  },
  {
    id: '2',
    supplier_id: 's2',
    supplier_name: 'Cacao Ivory Co',
    country: "Côte d'Ivoire",
    country_code: 'CI',
    product: 'Fèves de cacao',
    product_category: 'Agroalimentaire',
    moq: 10000,
    moq_unit: 'kg',
    price_bulk: 2.2,
    currency: 'USD',
    incoterm: 'CIF',
    lead_time_days: 21,
    certifications: ['UTZ', 'Rainforest Alliance'],
    badge: 'gold',
    description: 'Cacao fermenté premium, origine Côte d\'Ivoire.',
  },
  {
    id: '3',
    supplier_id: 's3',
    supplier_name: 'TechParts Nigeria',
    country: 'Nigeria',
    country_code: 'NG',
    product: 'Composants électroniques',
    product_category: 'Électronique',
    moq: 500,
    moq_unit: 'unités',
    price_bulk: 15,
    currency: 'USD',
    incoterm: 'EXW',
    lead_time_days: 30,
    certifications: ['CE', 'RoHS'],
    badge: 'verified',
    description: 'Composants électroniques pour assemblage industriel.',
  },
  {
    id: '4',
    supplier_id: 's4',
    supplier_name: 'Cotton Ghana Ltd',
    country: 'Ghana',
    country_code: 'GH',
    product: 'Coton brut',
    product_category: 'Textile',
    moq: 20000,
    moq_unit: 'kg',
    price_bulk: 1.5,
    currency: 'USD',
    incoterm: 'FOB',
    lead_time_days: 45,
    certifications: ['Better Cotton'],
    badge: '',
    description: 'Coton africain longue fibre, qualité textile.',
  },
];

export function getInternationalOffer(id: string): InternationalOffer | undefined {
  return INTERNATIONAL_OFFERS_MOCK.find((o) => o.id === id);
}

export function getInternationalOffers(filters?: {
  country?: string;
  product?: string;
  minMoq?: number;
  maxPrice?: number;
  minPrice?: number;
  incoterm?: string;
  maxLeadTime?: number;
  certification?: string;
}): InternationalOffer[] {
  let list = [...INTERNATIONAL_OFFERS_MOCK];
  if (filters?.country) {
    list = list.filter((o) => o.country.toLowerCase().includes(filters.country!.toLowerCase()));
  }
  if (filters?.product) {
    list = list.filter(
      (o) =>
        o.product.toLowerCase().includes(filters.product!.toLowerCase()) ||
        o.product_category.toLowerCase().includes(filters.product!.toLowerCase()) ||
        o.supplier_name.toLowerCase().includes(filters.product!.toLowerCase())
    );
  }
  if (filters?.minMoq != null) list = list.filter((o) => o.moq >= filters!.minMoq!);
  if (filters?.maxPrice != null) list = list.filter((o) => o.price_bulk <= filters!.maxPrice!);
  if (filters?.minPrice != null) list = list.filter((o) => o.price_bulk >= filters!.minPrice!);
  if (filters?.incoterm) list = list.filter((o) => o.incoterm === filters.incoterm);
  if (filters?.maxLeadTime != null) list = list.filter((o) => o.lead_time_days <= filters!.maxLeadTime!);
  if (filters?.certification) {
    const cert = filters.certification.toLowerCase();
    list = list.filter((o) => o.certifications.some((c) => c.toLowerCase().includes(cert)));
  }
  return list;
}
