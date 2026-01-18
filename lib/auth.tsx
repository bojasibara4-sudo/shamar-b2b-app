import { createClient } from '@/lib/supabase/server';
import { User } from '@/services/auth.service';

/**
 * Vérifie si l'utilisateur est authentifié
 * Source de vérité : session Supabase
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Récupère l'utilisateur depuis la session Supabase
 * Source de vérité unique : session Supabase
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    // Récupérer le profil utilisateur depuis la table users
    const { data: userData, error } = await (supabase as any)
      .from('users')
      .select('id, email, role')
      .eq('id', session.user.id)
      .single();

    if (error || !userData) {
      // Si l'utilisateur n'existe pas dans la table users, créer le profil automatiquement (idempotent)
      const { data: newUserData, error: insertError } = await (supabase as any)
        .from('users')
        .upsert(
          {
            id: session.user.id,
            email: session.user.email || '',
            role: 'buyer', // Rôle par défaut
          },
          {
            onConflict: 'id',
            ignoreDuplicates: true,
          }
        )
        .select('id, email, role')
        .single();

      if (insertError || !newUserData) {
        // Si erreur lors de la création (peut être une duplication), réessayer de récupérer
        const { data: retryData, error: retryError } = await (supabase as any)
          .from('users')
          .select('id, email, role')
          .eq('id', session.user.id)
          .single();

        if (retryData && !retryError) {
          return {
            id: retryData.id,
            email: retryData.email,
            role: retryData.role,
          };
        }

        // Si toujours erreur, retourner les infos de base
        console.error('Error creating user profile:', insertError);
        return {
          id: session.user.id,
          email: session.user.email || '',
          role: 'buyer', // Rôle par défaut
        };
      }

      return {
        id: newUserData.id,
        email: newUserData.email,
        role: newUserData.role,
      };
    }

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
