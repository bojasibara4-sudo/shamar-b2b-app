'use client';

import { usePathname } from 'next/navigation';
import { getThemeForRoute, type ThemeName } from '@/lib/theme-mapping';
import { useEffect } from 'react';

/**
 * Composant client qui applique automatiquement le thème selon la route
 * 
 * Usage dans un layout ou page :
 * ```tsx
 * <ThemeProvider>
 *   {children}
 * </ThemeProvider>
 * ```
 */
export default function ThemeProvider({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
}) {
  const pathname = usePathname();
  const theme = defaultTheme || getThemeForRoute(pathname);

  return (
    <div className={`${theme} app-bg`}>
      {children}
    </div>
  );
}

/**
 * Hook pour obtenir le thème actuel selon la route
 */
export function useTheme() {
  const pathname = usePathname();
  return getThemeForRoute(pathname);
}
