/** Rôles applicatifs (admin/seller/buyer + hiérarchie owner + rôles métier) */
export type AppRole = 'buyer' | 'seller' | 'admin' | 'super_admin' | 'vice_admin' | 'partner' | 'apple' | 'owner_root' | 'owner_exec' | 'admin_staff';

export type User = {
  id: string;
  email: string;
  role: AppRole;
};

export type LoginResponse = {
  success: boolean;
  user: User;
  error?: string;
};

export type RegisterResponse = {
  success: boolean;
  user: User;
  error?: string;
};

/**
 * Service d'authentification mock
 * Utilise les routes API Next.js pour gérer les cookies
 */
export async function login(
  email: string,
  password: string
): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Erreur de connexion');
  }

  return data.user;
}

export async function register(
  email: string,
  password: string,
  confirmPassword: string
): Promise<User> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  });

  const data: RegisterResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Erreur lors de l\'inscription');
  }

  return data.user;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
  });
}
