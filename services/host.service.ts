/**
 * Service Host / Airbnb — Gestion logements et réservations
 * Utilise Supabase avec fallback sur mock si tables absentes
 */

import { createClient } from '@/lib/supabase/server';
import type { HostProperty } from '@/lib/host-properties';
import { HOST_PROPERTIES_MOCK, getHostProperty as getMockProperty, getHostProperties as getMockProperties } from '@/lib/host-properties';

/** Convertit une row Supabase en HostProperty */
function rowToHostProperty(row: Record<string, unknown>): HostProperty {
  const images = Array.isArray(row.images) ? (row.images as string[]) : [];
  const amenities = Array.isArray(row.amenities) ? (row.amenities as string[]) : [];
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ''),
    city: String(row.city),
    price_per_night: Number(row.price_per_night),
    currency: String(row.currency ?? 'FCFA'),
    rating: Number(row.rating ?? 0),
    host_badge: (row.host_badge as HostProperty['host_badge']) ?? 'bronze',
    images: images.length > 0 ? images : ['https://picsum.photos/seed/host/800/600'],
    capacity: Number(row.capacity ?? 1),
    type: String(row.type ?? 'Logement'),
    amenities,
  };
}

/**
 * Récupère toutes les propriétés actives (catalogue public)
 */
export async function getHostProperties(filters?: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<HostProperty[]> {
  try {
    const supabase = await createClient();
    let query = (supabase as any)
      .from('host_properties')
      .select('*')
      .eq('status', 'active');

    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters?.minPrice != null) {
      query = query.gte('price_per_night', filters.minPrice);
    }
    if (filters?.maxPrice != null) {
      query = query.lte('price_per_night', filters.maxPrice);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('host_properties not available, using mock:', error.message);
      return getMockProperties(filters);
    }
    if (!data || data.length === 0) {
      return getMockProperties(filters);
    }

    return data.map(rowToHostProperty);
  } catch {
    return getMockProperties(filters);
  }
}

/**
 * Récupère une propriété par ID
 */
export async function getHostProperty(id: string): Promise<HostProperty | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('host_properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return getMockProperty(id);
    }
    return rowToHostProperty(data);
  } catch {
    return getMockProperty(id);
  }
}

/**
 * Récupère les propriétés d'un hôte (dashboard)
 */
export async function getHostPropertiesByHost(hostId: string): Promise<HostProperty[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('host_properties')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data.map(rowToHostProperty);
  } catch {
    return [];
  }
}

/**
 * Crée une propriété
 */
export async function createHostProperty(
  hostId: string,
  input: {
    title: string;
    description?: string;
    city: string;
    price_per_night: number;
    currency?: string;
    host_badge?: HostProperty['host_badge'];
    images?: string[];
    capacity?: number;
    type?: string;
    amenities?: string[];
    rules?: string;
  }
): Promise<HostProperty | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('host_properties')
      .insert({
        host_id: hostId,
        title: input.title,
        description: input.description ?? '',
        city: input.city,
        price_per_night: input.price_per_night,
        currency: input.currency ?? 'FCFA',
        host_badge: input.host_badge ?? 'bronze',
        images: input.images ?? [],
        capacity: input.capacity ?? 1,
        type: input.type ?? 'Logement',
        amenities: input.amenities ?? [],
        rules: input.rules ?? null,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating host_property:', error);
      return null;
    }
    return rowToHostProperty(data);
  } catch (e) {
    console.error('Error creating host_property:', e);
    return null;
  }
}

/**
 * Récupère les réservations reçues par un hôte
 */
export async function getHostBookingsByHost(hostId: string): Promise<Array<{
  id: string;
  property_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_amount: number;
  currency: string;
  status: string;
  property_title?: string;
  guest_email?: string;
  created_at: string;
}>> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('host_bookings')
      .select(`
        id, property_id, guest_id, check_in, check_out, guests_count, total_amount, currency, status, created_at,
        host_properties(title)
      `)
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      property_id: row.property_id,
      guest_id: row.guest_id,
      check_in: row.check_in,
      check_out: row.check_out,
      guests_count: row.guests_count,
      total_amount: row.total_amount,
      currency: row.currency,
      status: row.status,
      property_title: row.host_properties?.title,
      created_at: row.created_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Récupère les réservations d'un voyageur
 */
export async function getHostBookingsByGuest(guestId: string): Promise<Array<{
  id: string;
  property_id: string;
  host_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_amount: number;
  currency: string;
  status: string;
  property_title?: string;
  city?: string;
  created_at: string;
}>> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('host_bookings')
      .select(`
        id, property_id, host_id, check_in, check_out, guests_count, total_amount, currency, status, created_at,
        host_properties(title, city)
      `)
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      property_id: row.property_id,
      host_id: row.host_id,
      check_in: row.check_in,
      check_out: row.check_out,
      guests_count: row.guests_count,
      total_amount: row.total_amount,
      currency: row.currency,
      status: row.status,
      property_title: row.host_properties?.title,
      city: row.host_properties?.city,
      created_at: row.created_at,
    }));
  } catch {
    return [];
  }
}
