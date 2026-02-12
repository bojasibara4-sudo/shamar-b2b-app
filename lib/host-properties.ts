/**
 * Données mock pour les propriétés Host (lodgings)
 * À remplacer par Supabase quand la table host_properties sera créée
 */

export interface HostProperty {
  id: string;
  title: string;
  description: string;
  city: string;
  price_per_night: number;
  currency: string;
  rating: number;
  host_badge: 'bronze' | 'argent' | 'or' | 'diamant';
  images: string[];
  capacity: number;
  type: string;
  amenities: string[];
}

export const HOST_PROPERTIES_MOCK: HostProperty[] = [
  {
    id: '1',
    title: 'Villa Emeraude - Assinie',
    description: 'Magnifique villa en bord de mer avec piscine privée. Idéale pour séjours en famille ou entre amis.',
    city: 'Assinie Mafia, CI',
    price_per_night: 250000,
    currency: 'FCFA',
    rating: 4.9,
    host_badge: 'or',
    images: ['https://picsum.photos/seed/resort1/800/600'],
    capacity: 8,
    type: 'Villa',
    amenities: ['Piscine', 'WiFi', 'Climatisation', 'Cuisine équipée', 'Plage privée'],
  },
  {
    id: '2',
    title: 'Hôtel des Ambassadeurs',
    description: 'Hôtel de charme au cœur du Plateau. Vue sur la lagune, chambres climatisées.',
    city: 'Plateau, Abidjan',
    price_per_night: 85000,
    currency: 'FCFA',
    rating: 4.7,
    host_badge: 'argent',
    images: ['https://picsum.photos/seed/hotel1/800/600'],
    capacity: 2,
    type: 'Chambre d\'hôtel',
    amenities: ['WiFi', 'Climatisation', 'Petit-déjeuner', 'Room service'],
  },
  {
    id: '3',
    title: 'Résidence Touristique Kribi',
    description: 'Appartement avec vue sur l\'océan. Proche des chutes et plages.',
    city: 'Kribi, CM',
    price_per_night: 120000,
    currency: 'FCFA',
    rating: 4.8,
    host_badge: 'diamant',
    images: ['https://picsum.photos/seed/kribi1/800/600'],
    capacity: 4,
    type: 'Appartement',
    amenities: ['WiFi', 'Plage', 'Cuisine', 'Parking', 'Climatisation'],
  },
];

export function getHostProperty(id: string): HostProperty | undefined {
  return HOST_PROPERTIES_MOCK.find((p) => p.id === id);
}

export function getHostProperties(filters?: { city?: string; minPrice?: number; maxPrice?: number }): HostProperty[] {
  let list = [...HOST_PROPERTIES_MOCK];
  if (filters?.city) {
    list = list.filter((p) => p.city.toLowerCase().includes(filters.city!.toLowerCase()));
  }
  if (filters?.minPrice) {
    list = list.filter((p) => p.price_per_night >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    list = list.filter((p) => p.price_per_night <= filters.maxPrice!);
  }
  return list;
}
