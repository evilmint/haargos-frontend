'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Auth0Provider } from '@auth0/auth0-react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RedirectProvider } from './redirect-provider';
import { RefreshDataProvider } from './refresh-data-provider';

type ProviderSetProps = {
  children: React.ReactNode;
};

export default function ProviderSet({ children }: ProviderSetProps) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [pathname, setPathname] = useState<string | null>(null);

  const pathX = usePathname();

  useEffect(() => {
    setOrigin(window.location.origin);
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    setPathname(pathX);
  }, [pathX]);

  const redirectUri = (origin ?? '') + (pathname?.startsWith('/signup') ? '/signup' : '');
  console.log(`redirectUri: ${redirectUri}`);
  return (
    origin &&
    process.env.NEXT_PUBLIC_WARNING_AUTH0_CLIENT_ID && (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Auth0Provider
          domain={process.env.NEXT_PUBLIC_WARNING_AUTH0_DOMAIN ?? ''}
          clientId={process.env.NEXT_PUBLIC_WARNING_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: redirectUri,
            scope: process.env.NEXT_PUBLIC_WARNING_AUTH0_SCOPE,
            audience: process.env.NEXT_PUBLIC_WARNING_AUTH0_AUDIENCE,
          }}
          useRefreshTokens={true}
          useRefreshTokensFallback={false}
          cacheLocation="localstorage"
        >
          <RedirectProvider>
            <RefreshDataProvider>{children}</RefreshDataProvider>
          </RedirectProvider>
        </Auth0Provider>
      </ThemeProvider>
    )
  );
}
