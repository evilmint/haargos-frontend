'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { Storage } from './components/storage';
import { Docker } from './components/docker';
import { Environment } from './components/environment';
import { ZigbeeDataTableProxy } from './components/zigbee-data-table-proxy';
import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';
import { DashboardHeaderInstallation } from '@/app/installations/[id]/components/dashboard-header';
import { Auth0Provider } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogsDataTableProxy } from './components/logs-data-table-proxy';

export default function DashboardInstallationPage({ params }: { params: { id: string } }) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [defaultTab, setDefaultTab] = useState<string>('overview');
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOrigin(window.location.origin);

    if (window.location.hash != null && window.location.hash.length > 0) {
      setDefaultTab(window.location.hash.slice(1));
    } else {
      setDefaultTab('overview');
    }
  }, [setDefaultTab, setOrigin]);

  useEffect(() => {
    const onHashChanged = () => {
      const newHash = window.location.hash.slice(1);
      setDefaultTab(newHash?.length > 0 ? newHash : 'overview');
    };

    window.addEventListener('hashchange', onHashChanged);

    return () => {
      window.removeEventListener('hashchange', onHashChanged);
    };
  }, []);

  return (
    defaultTab != null &&
    origin != null && (
      <Auth0Provider
        domain="dev-ofc2nc2a0lc4ncig.eu.auth0.com"
        clientId="3EGUK8VIxgWNygQ1My32IIMeFz2KFeXm"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: 'https://api.haargos.smartrezydencja.pl',
        }}
      >
        <div className="flex-col">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <MainNav installationId={params.id} className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <Tabs
              value={defaultTab}
              onValueChange={value => {
                window.location.hash = `#${value}`;
              }}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="zigbee">Zigbee</TabsTrigger>
                {/* <TabsTrigger value="test">Zigbee2</TabsTrigger> */}
                <TabsTrigger value="host">Host</TabsTrigger>
                <TabsTrigger value="docker">Docker</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <DashboardHeaderInstallation installationId={params.id} />

                {/* <Logs installationId={params.id} /> */}

                <LogsDataTableProxy installationId={params.id} />
              </TabsContent>

              <TabsContent value="host" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-7">
                    <CardHeader>
                      <CardTitle>CPU</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Environment installationId={params.id} />
                    </CardContent>
                  </Card>

                  <Storage installationId={params.id} />
                </div>
              </TabsContent>

              <TabsContent value="docker" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Docker installationId={params.id} />
                </div>
              </TabsContent>

              <TabsContent value="zigbee" className="space-y-4">
                <ZigbeeDataTableProxy installationId={params.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Auth0Provider>
    )
  );
}
