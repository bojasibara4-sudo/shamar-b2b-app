import { getCurrentUser } from './auth';

export type UserRole = 'admin' | 'seller' | 'buyer';

export type UserStatus = 'pending' | 'active' | 'banned';
export type SellerStatus = 'pending' | 'approved' | 'rejected';

export interface UserWithStatus {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  sellerStatus?: SellerStatus;
}

/**
 * Vérifie si l'utilisateur a le rôle requis
 */
export function hasRole(requiredRole: UserRole | UserRole[]): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }

  return user.role === requiredRole;
}

/**
 * Vérifie si l'utilisateur est admin
 */
export function isAdmin(): boolean {
  return hasRole('admin');
}

/**
 * Vérifie si l'utilisateur est seller
 */
export function isSeller(): boolean {
  return hasRole('seller');
}

/**
 * Vérifie si l'utilisateur est buyer
 */
export function isBuyer(): boolean {
  return hasRole('buyer');
}

/**
 * Vérifie si l'utilisateur peut accéder à une route dashboard
 */
export function canAccessDashboard(role?: UserRole): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (role) {
    return user.role === role;
  }

  return ['admin', 'seller', 'buyer'].includes(user.role);
}

/**
 * Vérifie si un utilisateur a un statut actif
 */
export function isUserActive(user: UserWithStatus | null): boolean {
  if (!user) return false;
  return user.status === 'active';
}

/**
 * Vérifie si un seller est approuvé
 */
export function isSellerApproved(user: UserWithStatus | null): boolean {
  if (!user || user.role !== 'seller') return false;
  return user.sellerStatus === 'approved';
}

/**
 * Vérifie si un utilisateur peut accéder à son dashboard
 */
export function canAccessRoleDashboard(role: UserRole): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (user.role !== role) return false;

  // Vérifier le statut utilisateur
  if (!isUserActive(user as UserWithStatus)) return false;

  // Si seller, vérifier qu'il est approuvé
  if (role === 'seller' && !isSellerApproved(user as UserWithStatus)) {
    return false;
  }

  return true;
}

