import { cookies } from 'next/headers';
import { User } from '@/services/auth.service';

/**
 * Vérifie si l'utilisateur est authentifié
 * Source de vérité : cookie shamar_user (défini par API route serveur)
 */
export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('shamar_user');
  return !!userCookie;
}

/**
 * Récupère l'utilisateur depuis le cookie serveur
 * Source de vérité unique : cookie shamar_user (toujours défini par API route)
 */
export function getCurrentUser(): User | null {
  const cookieStore = cookies();
  
  // Lecture du cookie utilisateur (unique source de vérité)
  const userCookie = cookieStore.get('shamar_user');
  if (!userCookie) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    
    // Validation des champs requis
    if (!decoded.id || !decoded.email || !decoded.role) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Error decoding user cookie:', error);
    return null;
  }
}
