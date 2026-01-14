/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorer les erreurs ESLint pendant le build (temporaire)
  eslint: {
    ignoreDuringBuilds: true,
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
