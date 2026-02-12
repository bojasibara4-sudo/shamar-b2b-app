/**
 * Mapping automatique route → thème CSS
 * 
 * Ce fichier définit la correspondance entre les routes de l'application
 * et les classes de thème CSS disponibles dans app/styles/themes.css
 */

export type ThemeName =
  | 'theme-home'
  | 'theme-b2b'
  | 'theme-b2c'
  | 'theme-international'
  | 'theme-sourcing'
  | 'theme-host'
  | 'theme-negociation'
  | 'theme-marketplace'
  | 'theme-dashboard-admin'
  | 'theme-dashboard-manager'
  | 'theme-dashboard-super-admin'
  | 'theme-b2b-dashboard'
  | 'theme-b2b-forms'
  | 'theme-b2b-products'
  | 'theme-china-dashboard'
  | 'theme-home-auth'
  | 'theme-home-mobile'
  | 'theme-marketplace-filters'
  | 'theme-negociation-comparisons'
  | 'theme-negociation-dashboard'
  | 'theme-profile-billing'
  | 'theme-profile-preferences'
  | 'theme-profile-security'
  | 'theme-profile-security-b2c-home'
  | 'theme-profile-security-b2c-product-list'
  | 'theme-sourcing-dashboard'
  | 'theme-sourcing-inventory'
  | 'theme-airbnb-booking'
  | 'theme-airbnb-calendar';

/**
 * Mapping route → thème
 * 
 * Les routes sont mappées de manière hiérarchique :
 * - Routes spécifiques en premier (ex: /dashboard/admin)
 * - Routes génériques ensuite (ex: /dashboard)
 * - Fallback par défaut
 */
const ROUTE_THEME_MAP: Record<string, ThemeName> = {
  // ========== HOME ==========
  '/': 'theme-home',
  '/home': 'theme-home',
  
  // ========== AUTH ==========
  '/auth/login': 'theme-home-auth',
  '/auth/register': 'theme-home-auth',
  '/auth/onboarding': 'theme-home-auth',
  
  // ========== MARKETPLACE ==========
  '/b2b': 'theme-b2b',
  '/b2b/dashboard': 'theme-b2b-dashboard',
  '/b2b/products': 'theme-b2b-products',
  '/b2b/forms': 'theme-b2b-forms',
  
  '/b2c': 'theme-b2c',
  
  '/international': 'theme-international',
  
  '/sourcing': 'theme-sourcing',
  '/sourcing/dashboard': 'theme-sourcing-dashboard',
  '/sourcing/inventory': 'theme-sourcing-inventory',
  
  '/sourcing-chine': 'theme-china-dashboard',
  '/china': 'theme-china-dashboard',
  
  '/marketplace': 'theme-marketplace',
  '/marketplace/filters': 'theme-marketplace-filters',
  '/products': 'theme-marketplace',
  '/shop': 'theme-marketplace',
  '/cart': 'theme-marketplace',
  
  // ========== DASHBOARD ==========
  '/dashboard': 'theme-dashboard-admin',
  '/dashboard/admin': 'theme-dashboard-admin',
  '/dashboard/admin/overview': 'theme-dashboard-admin',
  '/dashboard/admin/users': 'theme-dashboard-admin',
  '/dashboard/admin/products': 'theme-dashboard-admin',
  '/dashboard/admin/orders': 'theme-dashboard-admin',
  '/dashboard/admin/settings': 'theme-dashboard-admin',
  '/dashboard/admin/commissions': 'theme-dashboard-admin',
  '/dashboard/admin/agents': 'theme-dashboard-admin',
  '/dashboard/admin/buyers': 'theme-dashboard-admin',
  '/dashboard/admin/sellers': 'theme-dashboard-admin',
  '/dashboard/admin/stats': 'theme-dashboard-admin',
  '/dashboard/admin/analytics': 'theme-dashboard-admin',
  '/dashboard/admin/payments': 'theme-dashboard-admin',
  '/dashboard/admin/transactions': 'theme-dashboard-admin',
  '/dashboard/admin/disputes': 'theme-dashboard-admin',
  '/dashboard/admin/documents': 'theme-dashboard-admin',
  
  '/dashboard/seller': 'theme-dashboard-manager',
  '/dashboard/seller/onboarding': 'theme-dashboard-manager',
  '/dashboard/seller/products': 'theme-dashboard-manager',
  '/dashboard/seller/orders': 'theme-dashboard-manager',
  '/dashboard/seller/commissions': 'theme-dashboard-manager',
  '/dashboard/seller/leads': 'theme-dashboard-manager',
  '/dashboard/seller/messages': 'theme-dashboard-manager',
  
  '/dashboard/buyer': 'theme-dashboard-manager',
  '/dashboard/buyer/orders': 'theme-dashboard-manager',
  '/dashboard/buyer/search': 'theme-dashboard-manager',
  
  '/admin': 'theme-dashboard-super-admin',
  '/admin/overview': 'theme-dashboard-super-admin',
  '/admin/users': 'theme-dashboard-super-admin',
  '/admin/products': 'theme-dashboard-super-admin',
  '/admin/orders': 'theme-dashboard-super-admin',
  '/admin/settings': 'theme-dashboard-super-admin',
  
  // ========== PROFILE ==========
  '/profile': 'theme-profile-security',
  '/profile/security': 'theme-profile-security',
  '/profile/preferences': 'theme-profile-preferences',
  '/profile/billing': 'theme-profile-billing',
  '/profile/edit': 'theme-profile-preferences',
  '/profile/info': 'theme-profile-preferences',
  '/profile/kyc': 'theme-profile-security',
  '/profile/settings': 'theme-profile-preferences',
  '/profile/notifications': 'theme-profile-preferences',
  '/profile/roles': 'theme-profile-security',
  '/profile/badges': 'theme-profile-preferences',
  '/profile/analytics': 'theme-profile-preferences',
  '/profile/wallet': 'theme-profile-billing',
  '/profile/payments': 'theme-profile-billing',
  '/profile/payouts': 'theme-profile-billing',
  '/profile/commissions': 'theme-profile-billing',
  '/profile/orders': 'theme-profile-preferences',
  '/profile/products': 'theme-profile-preferences',
  '/profile/cart': 'theme-profile-preferences',
  '/profile/favorites': 'theme-profile-preferences',
  '/profile/deliveries': 'theme-profile-preferences',
  '/profile/disputes': 'theme-profile-security',
  '/profile/addresses': 'theme-profile-preferences',
  '/profile/shop': 'theme-profile-preferences',
  
  // ========== HOST / AIRBNB ==========
  '/host': 'theme-host',
  '/host/properties': 'theme-host',
  '/host/reservations': 'theme-airbnb-booking',
  '/host/payments': 'theme-airbnb-booking',
  '/host/booking': 'theme-airbnb-booking',
  '/airbnb': 'theme-airbnb-booking',
  '/airbnb/calendar': 'theme-airbnb-calendar',
  
  // ========== NEGOCIATION ==========
  '/negociation': 'theme-negociation',
  '/negociation/comparisons': 'theme-negociation-comparisons',
  '/negociation/dashboard': 'theme-negociation-dashboard',
  '/rfq': 'theme-negociation',
  
  // ========== BUSINESS ==========
  '/onboarding': 'theme-home-auth',
  '/documents': 'theme-profile-security',
  '/deliveries': 'theme-profile-preferences',
  '/logistics': 'theme-sourcing-dashboard',
  
  // ========== DISPUTES ==========
  '/disputes': 'theme-profile-security',
  
  // ========== FINANCE ==========
  '/payments': 'theme-profile-billing',
  '/payments/escrow': 'theme-profile-billing',
  '/payments/international': 'theme-profile-billing',
  '/payments/invoice': 'theme-profile-billing',
  '/payments/confirm': 'theme-profile-billing',
};

/**
 * Obtient le thème CSS à appliquer selon le pathname
 * 
 * @param pathname - Le pathname de la route (ex: '/dashboard/admin')
 * @returns Le nom de la classe de thème CSS
 */
export function getThemeForRoute(pathname: string): ThemeName {
  // Normaliser le pathname (supprimer trailing slash, query params, hash)
  const normalized = pathname.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  
  // Chercher une correspondance exacte
  if (ROUTE_THEME_MAP[normalized]) {
    return ROUTE_THEME_MAP[normalized];
  }
  
  // Chercher une correspondance partielle (route parente)
  // Ex: /dashboard/admin/users → cherche /dashboard/admin
  const segments = normalized.split('/').filter(Boolean);
  for (let i = segments.length; i > 0; i--) {
    const partialPath = '/' + segments.slice(0, i).join('/');
    if (ROUTE_THEME_MAP[partialPath]) {
      return ROUTE_THEME_MAP[partialPath];
    }
  }
  
  // Fallback par défaut
  return 'theme-home';
}

/**
 * Obtient le thème selon le segment de route (pour les layouts)
 * 
 * Utile dans les layouts où on connaît le segment de route
 * mais pas le pathname complet
 * 
 * @param segment - Le segment de route (ex: 'b2b', 'admin', 'seller')
 * @returns Le nom de la classe de thème CSS
 */
export function getThemeForSegment(segment: string): ThemeName {
  const segmentMap: Record<string, ThemeName> = {
    'b2b': 'theme-b2b',
    'b2c': 'theme-b2c',
    'international': 'theme-international',
    'sourcing': 'theme-sourcing',
    'sourcing-chine': 'theme-china-dashboard',
    'host': 'theme-host',
    'negociation': 'theme-negociation',
    'marketplace': 'theme-marketplace',
    'admin': 'theme-dashboard-admin',
    'seller': 'theme-dashboard-manager',
    'buyer': 'theme-dashboard-manager',
    'business': 'theme-profile-security',
    'disputes': 'theme-profile-security',
    'finance': 'theme-profile-billing',
    'public': 'theme-home',
    'protected': 'theme-dashboard-admin',
  };
  
  return segmentMap[segment] || 'theme-home';
}

/**
 * Liste tous les thèmes disponibles
 */
export function getAllThemes(): ThemeName[] {
  return [
    'theme-home',
    'theme-b2b',
    'theme-b2c',
    'theme-international',
    'theme-sourcing',
    'theme-host',
    'theme-negociation',
    'theme-marketplace',
    'theme-dashboard-admin',
    'theme-dashboard-manager',
    'theme-dashboard-super-admin',
    'theme-b2b-dashboard',
    'theme-b2b-forms',
    'theme-b2b-products',
    'theme-china-dashboard',
    'theme-home-auth',
    'theme-home-mobile',
    'theme-marketplace-filters',
    'theme-negociation-comparisons',
    'theme-negociation-dashboard',
    'theme-profile-billing',
    'theme-profile-preferences',
    'theme-profile-security',
    'theme-profile-security-b2c-home',
    'theme-profile-security-b2c-product-list',
    'theme-sourcing-dashboard',
    'theme-sourcing-inventory',
    'theme-airbnb-booking',
    'theme-airbnb-calendar',
  ];
}
