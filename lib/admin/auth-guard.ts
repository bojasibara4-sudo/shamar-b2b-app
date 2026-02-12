import { redirect } from "next/navigation";

export async function requireAdmin() {
  return true;
}

export async function requireAdminRole(_roles: string[]) {
  return { id: '', email: '', role: 'SUPER_ADMIN' };
}
