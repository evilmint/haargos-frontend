'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Auth0Provider } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';

type ProviderSetProps = {
  children: React.ReactNode;
};

export default function ProviderSet({ children }: ProviderSetProps) {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_WARNING_AUTH0_DOMAIN ?? ''}
        clientId={process.env.NEXT_PUBLIC_WARNING_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={{
          redirect_uri:
            origin ?? process.env.NEXT_PUBLIC_WARNING_AUTH0_REDIRECT_URI_DEFAULT ?? '',
          audience: process.env.NEXT_PUBLIC_WARNING_AUTH0_AUDIENCE ?? '',
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        {children}
      </Auth0Provider>
    </ThemeProvider>
  );
}
