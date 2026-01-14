import { getCurrentUser } from './auth';
import { UserRole } from './permissions';

/**
 * Source unique de vérité pour le rôle utilisateur
 * Centralise l'accès au rôle depuis getCurrentUser()
 */
export function getCurrentUserRole(): UserRole | null {
  const user = getCurrentUser();
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
export function hasUserRole(role: UserRole | UserRole[]): boolean {
  const userRole = getCurrentUserRole();
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
export function isUserAdmin(): boolean {
  return hasUserRole('admin');
}

/**
 * Vérifie si l'utilisateur est seller
 */
export function isUserSeller(): boolean {
  return hasUserRole('seller');
}

/**
 * Vérifie si l'utilisateur est buyer
 */
export function isUserBuyer(): boolean {
  return hasUserRole('buyer');
}
