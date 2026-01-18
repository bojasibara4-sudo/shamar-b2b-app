import { redirect } from 'next/navigation';
import { getCurrentUser } from './auth';
import { UserRole, UserStatus, SellerStatus } from './permissions';
import { User } from '@/services/auth.service';

/**
 * Guard pour protéger une route selon le rôle
 * Utilisé dans les layouts et pages
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

/**
 * Guard pour protéger une route selon le rôle
 */
export async function requireRole(role: UserRole | UserRole[]): Promise<User> {
  const user = await requireAuth();
  
  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(user.role)) {
    redirect('/dashboard');
  }
  
  return user;
}

/**
 * Guard pour protéger une route admin
 */
export async function requireAdmin(): Promise<User> {
  return requireRole('admin');
}

/**
 * Guard pour protéger une route seller
 */
export async function requireSeller(): Promise<User> {
  return requireRole('seller');
}

/**
 * Guard pour protéger une route buyer
 */
export async function requireBuyer(): Promise<User> {
  return requireRole('buyer');
}

/**
 * Vérifie le statut utilisateur et redirige si nécessaire
 */
export function checkUserStatus(
  _user: User,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _requiredStatus: UserStatus = 'active'
): void {
  // Pour l'instant, on considère tous les utilisateurs comme 'active'
  // Cette fonction sera étendue quand les statuts seront implémentés dans la DB
  // TODO: Implémenter la vérification réelle du statut
}

/**
 * Vérifie le statut seller et redirige si nécessaire
 */
export function checkSellerStatus(
  user: User,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _requiredStatus: SellerStatus = 'approved'
): void {
  if (user.role !== 'seller') {
    redirect('/dashboard');
  }

  // Pour l'instant, on considère tous les sellers comme 'approved'
  // Cette fonction sera étendue quand les statuts seront implémentés dans la DB
  // TODO: Implémenter la vérification réelle du statut seller
}

