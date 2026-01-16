import { getCurrentUser } from './auth';
import { UserRole } from './permissions';

/**
 * Source unique de vérité pour le rôle utilisateur
 * Centralise l'accès au rôle depuis getCurrentUser()
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  // Validation stricte du rôle
  const validRoles: UserRole[] = ['admin', 'seller', 'buyer'];
  if (!validRoles.includes(user.role as UserRole)) {
    return null;
  }

  return user.role as UserRole;
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function hasUserRole(role: UserRole | UserRole[]): Promise<boolean> {
  const userRole = await getCurrentUserRole();
  if (!userRole) {
    return false;
  }

  if (Array.isArray(role)) {
    return role.includes(userRole);
  }

  return userRole === role;
}

/**
 * Vérifie si l'utilisateur est admin
 */
export async function isUserAdmin(): Promise<boolean> {
  return hasUserRole('admin');
}

/**
 * Vérifie si l'utilisateur est seller
 */
export async function isUserSeller(): Promise<boolean> {
  return hasUserRole('seller');
}

/**
 * Vérifie si l'utilisateur est buyer
 */
export async function isUserBuyer(): Promise<boolean> {
  return hasUserRole('buyer');
}
