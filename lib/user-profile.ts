/**
 * Utilitaire pour gérer les profils utilisateur de manière idempotente
 * Évite les erreurs de duplication lors de la création
 */

import { createClient } from '@/lib/supabase/server';
import type { User } from '@/services/auth.service';

/**
 * Crée ou récupère le profil utilisateur de manière idempotente
 * Utilise INSERT ... ON CONFLICT DO NOTHING pour éviter les duplications
 * 
 * @param userId - ID de l'utilisateur depuis Supabase Auth
 * @param email - Email de l'utilisateur
 * @param defaultRole - Rôle par défaut (buyer)
 * @returns Profil utilisateur ou null en cas d'erreur
 */
export async function ensureUserProfile(
  userId: string,
  email: string,
  defaultRole: 'admin' | 'seller' | 'buyer' = 'buyer'
): Promise<User | null> {
  const supabase = await createClient();

  try {
    // Vérifier d'abord si le profil existe
    const { data: existingProfile, error: selectError } = await (supabase as any)
      .from('users')
      .select('id, email, role')
      .eq('id', userId)
      .single();

    // Si le profil existe, le retourner
    if (existingProfile && !selectError) {
      return {
        id: existingProfile.id,
        email: existingProfile.email,
        role: existingProfile.role,
      };
    }

    // Si le profil n'existe pas, le créer
    // Utiliser upsert avec ON CONFLICT pour éviter les erreurs de duplication
    const { data: newProfile, error: insertError } = await (supabase as any)
      .from('users')
      .upsert(
        {
          id: userId,
          email: email,
          role: defaultRole,
        },
        {
          onConflict: 'id',
          ignoreDuplicates: true,
        }
      )
      .select('id, email, role')
      .single();

    if (insertError) {
      // Si l'erreur est une contrainte unique (profil créé entre temps), réessayer de récupérer
      if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
        const { data: retryProfile, error: retryError } = await (supabase as any)
          .from('users')
          .select('id, email, role')
          .eq('id', userId)
          .single();

        if (retryProfile && !retryError) {
          return {
            id: retryProfile.id,
            email: retryProfile.email,
            role: retryProfile.role,
          };
        }
      }

      console.error('Error ensuring user profile:', insertError);
      return null;
    }

    if (!newProfile) {
      return null;
    }

    return {
      id: newProfile.id,
      email: newProfile.email,
      role: newProfile.role,
    };
  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
    return null;
  }
}
