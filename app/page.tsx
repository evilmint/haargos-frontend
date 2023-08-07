'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Tabs, TabsContent } from '@/registry/new-york/ui/tabs';
import { MainNav } from '@/components/ui/main-nav';
import { Overview } from '@/components/ui/overview';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { UserNav } from '@/components/ui/user-nav';
import { Auth0Provider } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (origin != null) && (
    <Auth0Provider
      domain="dev-ofc2nc2a0lc4ncig.eu.auth0.com"
      clientId="3EGUK8VIxgWNygQ1My32IIMeFz2KFeXm"
      authorizationParams={{
        redirect_uri: origin ?? "https://haargos.smartrezydencja.pl",
        audience: 'https://api.haargos.smartrezydencja.pl',
      }}
    >
      <div className="hidden flex-col sm:flex">
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-7">
                    <CardHeader>
                      <CardTitle>Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Auth0Provider>
  );
}
