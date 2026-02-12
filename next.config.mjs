/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-ready: ne pas ignorer les erreurs
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Rewrites : URLs obsolètes → routes réelles (éviter 404)
  async rewrites() {
    return [
      // /marketplace/* → routes sans préfixe
      { source: '/marketplace/products', destination: '/products' },
      { source: '/marketplace/products/:path*', destination: '/products/:path*' },
      { source: '/marketplace/shop', destination: '/shop' },
      { source: '/marketplace/shop/:path*', destination: '/shop/:path*' },
      { source: '/marketplace/cart', destination: '/cart' },
      { source: '/marketplace/b2b', destination: '/b2b' },
      { source: '/marketplace/b2c', destination: '/b2c' },
      { source: '/marketplace/international', destination: '/international' },
      { source: '/marketplace/sourcing', destination: '/sourcing' },
      { source: '/marketplace/sourcing-chine', destination: '/sourcing-chine' },
      // /admin/* → /dashboard/admin/* (redirections vers nouveaux écrans redesignés)
      { source: '/admin/overview', destination: '/dashboard/admin' },
      { source: '/admin/validation', destination: '/dashboard/admin' },
      { source: '/admin/users', destination: '/dashboard/admin/users' },
      { source: '/admin/users/:id', destination: '/dashboard/admin/security/users/:id' },
      { source: '/admin/orders', destination: '/dashboard/admin/orders' },
      { source: '/admin/sellers', destination: '/dashboard/admin/sellers' },
      { source: '/admin/buyers', destination: '/dashboard/admin/buyers' },
      { source: '/admin/products', destination: '/dashboard/admin/products' },
      { source: '/admin/disputes', destination: '/dashboard/admin/disputes' },
      { source: '/admin/disputes/:id', destination: '/dashboard/admin/disputes/:id' },
      { source: '/admin/documents', destination: '/dashboard/admin/documents' },
      { source: '/admin/kyc', destination: '/dashboard/admin/documents' },
      { source: '/admin/kyc/:sellerId', destination: '/dashboard/admin/documents?seller=:sellerId' },
      { source: '/admin/finance', destination: '/dashboard/admin/finance' },
      { source: '/admin/finance/transactions', destination: '/dashboard/admin/payments' },
      { source: '/admin/finance/escrows', destination: '/dashboard/admin/finance' },
      { source: '/admin/finance/refunds', destination: '/dashboard/admin/finance' },
      { source: '/admin/payments', destination: '/dashboard/admin/payments' },
      { source: '/admin/security', destination: '/dashboard/admin/security' },
      { source: '/admin/security/users', destination: '/dashboard/admin/security/users' },
      { source: '/admin/security/users/:id', destination: '/dashboard/admin/security/users/:id' },
      { source: '/admin/security/transactions', destination: '/dashboard/admin/security/transactions' },
      { source: '/admin/security/alerts', destination: '/dashboard/admin/security/alerts' },
      { source: '/admin/security/logs', destination: '/dashboard/admin/security/logs' },
      { source: '/admin/logs', destination: '/dashboard/admin/security/logs' },
      { source: '/admin/analytics', destination: '/dashboard/admin/analytics' },
      { source: '/admin/commissions', destination: '/dashboard/admin/commissions' },
      { source: '/admin/agents', destination: '/dashboard/admin/agents' },
      { source: '/admin/settings', destination: '/dashboard/admin/settings' },
      // Routes admin legacy (china, logistics) → dashboard admin (à créer ou rediriger)
      { source: '/admin/china', destination: '/dashboard/admin' },
      { source: '/admin/china/:path*', destination: '/dashboard/admin' },
      { source: '/admin/logistics', destination: '/dashboard/admin' },
      { source: '/admin/logistics/:path*', destination: '/dashboard/admin' },
    ];
  },
  // Exclure le dossier audit de la compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/audit/**'],
    };
    return config;
  },
  
  // Headers de sécurité HTTP (production-ready)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
