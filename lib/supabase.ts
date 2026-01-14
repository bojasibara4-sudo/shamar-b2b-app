import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client Supabase pour le navigateur (client-side)
// Créé uniquement si les variables d'environnement sont définies
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

// Types pour les tables Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'seller' | 'buyer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: 'admin' | 'seller' | 'buyer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'seller' | 'buyer';
          updated_at?: string;
        };
      };
    };
  };
};

