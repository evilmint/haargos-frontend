'use client';

import { Tabs, TabsContent } from '@/registry/new-york/ui/tabs';
import { MainNav } from '@/components/ui/main-nav';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { UserNav } from '@/components/ui/user-nav';
import { Auth0Provider } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { InstallationsDataTableProxy } from '@/components/installations/installations-data-table-proxy';

export default function DashboardPage() {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    origin != null && (
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_WARNING_AUTH0_DOMAIN ?? ''}
        clientId={process.env.NEXT_PUBLIC_WARNING_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={{
          redirect_uri: origin ?? process.env.NEXT_PUBLIC_WARNING_AUTH0_REDIRECT_URI_DEFAULT ?? '',
          audience: process.env.NEXT_PUBLIC_WARNING_AUTH0_AUDIENCE ?? '',
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <div className="flex-col sm:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            {true && (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsContent value="overview" className="space-y-4">
                  <DashboardHeader />
                  <InstallationsDataTableProxy />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </Auth0Provider>
    )
  );
}
