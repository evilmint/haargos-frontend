'use client';

import React, { useEffect, useState } from 'react';
import { RedirectProvider } from './redirect-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Auth0Provider } from '@auth0/auth0-react';

type ProviderSetProps = {
  children: React.ReactNode;
};

export default function ProviderSet({ children }: ProviderSetProps) {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    process.env.NEXT_PUBLIC_WARNING_AUTH0_CLIENT_ID && (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Auth0Provider
          domain={process.env.NEXT_PUBLIC_WARNING_AUTH0_DOMAIN ?? ''}
          clientId={process.env.NEXT_PUBLIC_WARNING_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: origin ?? 'https://haargos.smartrezydencja.pl',
            audience:
              process.env.NEXT_PUBLIC_WARNING_AUTH0_AUDIENCE ??
              'https://api.haargos.smartrezydencja.pl',
          }}
          useRefreshTokens={true}
          useRefreshTokensFallback={false}
          cacheLocation="localstorage"
        >
          <RedirectProvider>{children}</RedirectProvider>
        </Auth0Provider>
      </ThemeProvider>
    )
  );
}
