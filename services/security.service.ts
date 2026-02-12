/**
 * ASB Security — Service de détection fraude et logs sécurité
 * SHAMAR B2B
 */

import { createClient } from '@/lib/supabase/server';

export type SecurityEventType =
  | 'LOGIN_FAILED'
  | 'LOGIN_SUCCESS'
  | 'SUSPICIOUS_AMOUNT'
  | 'MULTIPLE_ORDERS_SHORT_TIME'
  | 'NEW_USER_LARGE_ORDER'
  | 'DISPUTE_RAISED'
  | 'ADMIN_ACTION'
  | 'PAYMENT_FAILED_REPEATED'
  | 'IP_CHANGE_SENSITIVE';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityLog {
  id: string;
  user_id?: string;
  event_type: SecurityEventType;
  severity: SecuritySeverity;
  message: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

const FRAUD_AMOUNT_THRESHOLD = 5_000_000; // 5M FCFA
const NEW_USER_DAYS = 30;
const ORDERS_TIME_WINDOW_HOURS = 1;
const ORDERS_COUNT_THRESHOLD = 5;

/**
 * Enregistre un événement sécurité
 */
export async function logSecurityEvent(
  eventType: SecurityEventType,
  severity: SecuritySeverity,
  message: string,
  options?: { userId?: string; metadata?: Record<string, unknown>; ipAddress?: string }
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await (supabase as any)
      .from('security_logs')
      .insert({
        user_id: options?.userId ?? null,
        event_type: eventType,
        severity,
        message,
        metadata: options?.metadata ?? {},
        ip_address: options?.ipAddress ?? null,
      });

    if (error) {
      console.error('Error logging security event:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error logging security event:', error);
    return false;
  }
}

/**
 * Analyse une transaction pour patterns de fraude
 * Retourne un score 0–100 et des alertes
 */
export async function analyzeTransaction(
  userId: string,
  amount: number,
  orderId: string,
  options?: { isNewUser?: boolean }
): Promise<{ riskScore: number; alerts: string[] }> {
  const supabase = await createClient();
  const alerts: string[] = [];
  let riskScore = 0;

  // Montant suspect
  if (amount >= FRAUD_AMOUNT_THRESHOLD) {
    alerts.push(`Montant élevé : ${amount.toLocaleString()} FCFA`);
    riskScore += 30;
    await logSecurityEvent('SUSPICIOUS_AMOUNT', 'medium', `Transaction ${amount} FCFA par user ${userId}`, {
      userId,
      metadata: { amount, orderId },
    });
  }

  // Nouveau utilisateur + grosse commande
  if (options?.isNewUser && amount >= 500_000) {
    alerts.push('Nouveau compte avec commande importante');
    riskScore += 40;
    await logSecurityEvent('NEW_USER_LARGE_ORDER', 'high', `Nouveau user ${userId} - commande ${amount}`, {
      userId,
      metadata: { amount, orderId },
    });
  }

  // Multiples commandes en peu de temps
  const windowStart = new Date();
  windowStart.setHours(windowStart.getHours() - ORDERS_TIME_WINDOW_HOURS);
  const { data: recentOrders } = await (supabase as any)
    .from('orders')
    .select('id')
    .eq('buyer_id', userId)
    .gte('created_at', windowStart.toISOString());

  if (recentOrders && recentOrders.length >= ORDERS_COUNT_THRESHOLD) {
    alerts.push(`${recentOrders.length} commandes en ${ORDERS_TIME_WINDOW_HOURS}h`);
    riskScore += 35;
    await logSecurityEvent('MULTIPLE_ORDERS_SHORT_TIME', 'high', `User ${userId} : ${recentOrders.length} commandes récentes`, {
      userId,
      metadata: { orderCount: recentOrders.length, orderId },
    });
  }

  riskScore = Math.min(100, riskScore);
  return { riskScore, alerts };
}

/**
 * Récupère les logs sécurité (admin)
 */
export async function getSecurityLogs(options?: {
  limit?: number;
  severity?: SecuritySeverity;
  eventType?: SecurityEventType;
  userId?: string;
}): Promise<SecurityLog[]> {
  const supabase = await createClient();

  try {
    let query = (supabase as any)
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(options?.limit ?? 50);

    if (options?.severity) {
      query = query.eq('severity', options.severity);
    }
    if (options?.eventType) {
      query = query.eq('event_type', options.eventType);
    }
    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting security logs:', error);
      return [];
    }

    return (data || []) as SecurityLog[];
  } catch (error) {
    console.error('Error getting security logs:', error);
    return [];
  }
}

/**
 * Statistiques pour le dashboard ASB
 */
export async function getSecurityStats(): Promise<{
  totalEvents24h: number;
  highSeverity24h: number;
  critical24h: number;
  topEventTypes: { event_type: string; count: number }[];
}> {
  const supabase = await createClient();
  const since = new Date();
  since.setHours(since.getHours() - 24);

  try {
    const { data: events } = await (supabase as any)
      .from('security_logs')
      .select('event_type, severity')
      .gte('created_at', since.toISOString());

    const list = (events || []) as { event_type: string; severity: string }[];
    const totalEvents24h = list.length;
    const highSeverity24h = list.filter((e) => e.severity === 'high' || e.severity === 'critical').length;
    const critical24h = list.filter((e) => e.severity === 'critical').length;

    const counts: Record<string, number> = {};
    list.forEach((e) => {
      counts[e.event_type] = (counts[e.event_type] || 0) + 1;
    });
    const topEventTypes = Object.entries(counts)
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { totalEvents24h, highSeverity24h, critical24h, topEventTypes };
  } catch (error) {
    console.error('Error getting security stats:', error);
    return { totalEvents24h: 0, highSeverity24h: 0, critical24h: 0, topEventTypes: [] };
  }
}

/** Alertes (table security_alerts si existante) */
export async function getSecurityAlerts(options?: { status?: string; limit?: number }): Promise<any[]> {
  const supabase = await createClient();
  try {
    let q = (supabase as any).from('security_alerts').select('*').order('created_at', { ascending: false }).limit(options?.limit ?? 100);
    if (options?.status) q = q.eq('status', options.status);
    const { data, error } = await q;
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function updateAlertStatus(alertId: string, status: string, resolvedBy?: string): Promise<boolean> {
  const supabase = await createClient();
  try {
    const { error } = await (supabase as any).from('security_alerts').update({
      status,
      resolved_at: status !== 'new' ? new Date().toISOString() : null,
      resolved_by: resolvedBy ?? null,
    }).eq('id', alertId);
    return !error;
  } catch {
    return false;
  }
}

/** Utilisateurs à risque (risk_scores + users). Filtres optionnels: country, region */
export async function getRiskUsers(limit = 50, filters?: { country?: string; region?: string }): Promise<any[]> {
  const supabase = await createClient();
  try {
    const { data: scores } = await (supabase as any).from('risk_scores').select('user_id, score, updated_at').order('score', { ascending: false }).limit(limit * 2);
    if (!scores?.length) return [];
    const ids = scores.map((s: any) => s.user_id);
    let userQuery = (supabase as any).from('users').select('id, email, full_name, role, company_name, country, city, region').in('id', ids);
    if (filters?.country?.trim()) userQuery = userQuery.eq('country', filters.country.trim());
    if (filters?.region?.trim()) userQuery = userQuery.eq('region', filters.region.trim());
    const { data: users } = await userQuery;
    const userMap = new Map((users || []).map((u: any) => [u.id, u]));
    const out = scores.map((s: any) => {
      const user = userMap.get(s.user_id);
      if (!user || typeof user !== 'object') return null;
      return { ...(user as Record<string, unknown>), risk_score: s.score, score_updated_at: s.updated_at };
    }).filter((u: any): u is Record<string, unknown> => u !== null && typeof u === 'object' && 'id' in u);
    return out.slice(0, limit);
  } catch {
    return [];
  }
}

/** Transactions / escrows pour monitoring */
export async function getSecurityTransactions(limit = 100): Promise<any[]> {
  const supabase = await createClient();
  try {
    const { data } = await (supabase as any).from('escrows').select('id, order_id, buyer_id, seller_id, amount, currency, status, created_at').order('created_at', { ascending: false }).limit(limit);
    return data || [];
  } catch {
    return [];
  }
}

/** Créer un signalement (table reports) */
export async function createReport(reporterId: string, reportType: 'vendor' | 'product' | 'user', targetId: string, message?: string): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();
  try {
    const { data, error } = await (supabase as any).from('reports').insert({ reporter_id: reporterId, report_type: reportType, target_id: targetId, message: message || null }).select('id').single();
    if (error) return { error: error.message };
    return { id: data?.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur' };
  }
}

/** Liste des signalements (admin) */
export async function getReports(options?: { report_type?: string; status?: string; limit?: number }): Promise<any[]> {
  const supabase = await createClient();
  try {
    let q = (supabase as any).from('reports').select('*').order('created_at', { ascending: false }).limit(options?.limit ?? 100);
    if (options?.report_type) q = q.eq('report_type', options.report_type);
    if (options?.status) q = q.eq('status', options.status);
    const { data, error } = await q;
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}
