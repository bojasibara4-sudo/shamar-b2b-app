/**
 * Données mock Module Négoce Matières Premières (B2B Premium fermé)
 */

export type NegoceBadge = 'bronze' | 'silver' | 'gold' | 'diamond';
export type NegoceType = 'minerai' | 'cacao' | 'petrole' | 'bois' | 'cafe' | 'autre';

export interface NegoceOffer {
  id: string;
  supplier_id: string;
  supplier_name: string;
  country: string;
  country_code: string;
  product: string;
  type: NegoceType;
  description: string;
  specifications: Record<string, string>;
  stock_available: number;
  stock_unit: string;
  moq: number;
  moq_unit: string;
  price_indicator: number;
  currency: string;
  incoterm: 'FOB' | 'CIF' | 'EXW';
  lead_time_days: number;
  certifications: string[];
  badge: NegoceBadge;
  image_url?: string;
}

export const NEGOCE_OFFERS_MOCK: NegoceOffer[] = [
  { id: '1', supplier_id: 's1', supplier_name: 'Cacao Coop CI', country: "Côte d'Ivoire", country_code: 'CI', product: 'Fèves de cacao premium', type: 'cacao', description: 'Cacao fermenté qualité export.', specifications: { humidite: '7%' }, stock_available: 5000, stock_unit: 'tonnes', moq: 20, moq_unit: 'tonnes', price_indicator: 2800, currency: 'USD', incoterm: 'FOB', lead_time_days: 14, certifications: ['UTZ'], badge: 'gold' },
  { id: '2', supplier_id: 's2', supplier_name: 'Mines Pro SA', country: 'Guinée', country_code: 'GN', product: 'Bauxite calcinée', type: 'minerai', description: 'Bauxite qualité métallurgique.', specifications: { al2o3: '>52%' }, stock_available: 50000, stock_unit: 'tonnes', moq: 500, moq_unit: 'tonnes', price_indicator: 85, currency: 'USD', incoterm: 'FOB', lead_time_days: 30, certifications: ['ISO 9001'], badge: 'diamond' },
  { id: '3', supplier_id: 's3', supplier_name: 'Bois Africain SARL', country: 'Cameroun', country_code: 'CM', product: 'Grumes Acajou', type: 'bois', description: 'Acajou FSC.', specifications: { essence: 'Khaya' }, stock_available: 2000, stock_unit: 'm³', moq: 100, moq_unit: 'm³', price_indicator: 450, currency: 'USD', incoterm: 'CIF', lead_time_days: 45, certifications: ['FSC'], badge: 'silver' },
];

export function getNegoceOffer(id: string): NegoceOffer | undefined {
  return NEGOCE_OFFERS_MOCK.find((o) => o.id === id);
}

export function getNegoceOffers(filters?: { type?: string; country?: string; product?: string; minMoq?: number; maxPrice?: number; incoterm?: string; certification?: string }): NegoceOffer[] {
  let list = [...NEGOCE_OFFERS_MOCK];
  if (filters?.type) list = list.filter((o) => o.type === filters.type);
  if (filters?.country) list = list.filter((o) => o.country.toLowerCase().includes(filters.country!.toLowerCase()));
  if (filters?.product) list = list.filter((o) => o.product.toLowerCase().includes(filters.product!.toLowerCase()) || o.supplier_name.toLowerCase().includes(filters.product!.toLowerCase()));
  if (filters?.minMoq != null) list = list.filter((o) => o.moq >= filters!.minMoq!);
  if (filters?.maxPrice != null) list = list.filter((o) => o.price_indicator <= filters!.maxPrice!);
  if (filters?.incoterm) list = list.filter((o) => o.incoterm === filters.incoterm);
  if (filters?.certification) {
    const c = filters.certification.toLowerCase();
    list = list.filter((o) => o.certifications.some((x) => x.toLowerCase().includes(c)));
  }
  return list;
}
