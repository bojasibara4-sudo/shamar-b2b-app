/**
 * Rôles hiérarchiques super-administration
 * owner_root = Président (contrôle total)
 * owner_exec = Vice-président (super admin opérationnel)
 * admin_staff = Admin normal (optionnel futur)
 */

export const OWNER_ROLE_ROOT = 'owner_root' as const;
export const OWNER_ROLE_EXEC = 'owner_exec' as const;
export const OWNER_ROLE_ADMIN_STAFF = 'admin_staff' as const;

export type OwnerRole = typeof OWNER_ROLE_ROOT | typeof OWNER_ROLE_EXEC | typeof OWNER_ROLE_ADMIN_STAFF;

export const OWNER_ROLES: OwnerRole[] = [OWNER_ROLE_ROOT, OWNER_ROLE_EXEC, OWNER_ROLE_ADMIN_STAFF];

/** Rôles qui ont accès aux routes /root/* (Président uniquement) */
export function isOwnerRoot(role: string): boolean {
  return role === OWNER_ROLE_ROOT;
}

/** Rôles qui ont accès aux routes /exec/* (Vice-président ou Président) */
export function isOwnerExecOrRoot(role: string): boolean {
  return role === OWNER_ROLE_EXEC || role === OWNER_ROLE_ROOT;
}

/** Rôles considérés comme "admin" pour les routes admin existantes (dashboard, API /api/admin) */
export function isAdminLike(role: string): boolean {
  return (
    role === 'admin' ||
    role === 'super_admin' ||
    role === OWNER_ROLE_EXEC ||
    role === OWNER_ROLE_ROOT ||
    role === OWNER_ROLE_ADMIN_STAFF
  );
}
