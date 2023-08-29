'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { Storage } from './components/storage';
import { Docker } from './components/docker';
import { Environment } from './components/environment';
import { ZigbeeDataTableProxy } from './components/zigbee/zigbee-data-table-proxy';
import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';
import { DashboardHeaderInstallation } from '@/app/installations/[id]/components/dashboard-header';
import { Auth0Provider } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { LogsDataTableProxy } from './components/logs/logs-data-table-proxy';
import { AutomationsDataTableProxy } from './components/automations/automations-data-table-proxy';
import { ScriptsDataTableProxy } from './components/scripts/scripts-data-table-proxy';
import { SceneDataTableProxy } from './components/scenes/scenes-data-table-proxy';
import { AgentInstallation } from './components/agent-installation';
import { InstallationOverviewChart } from './components/installation-overview-chart';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui/sheet';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/default/ui/alert-dialog';

export default function DashboardInstallationPage({ params }: { params: { id: string } }) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [defaultTab, setDefaultTab] = useState<string>('overview');

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
        domain={process.env.NEXT_PUBLIC_WARNING_AUTH0_DOMAIN ?? ''}
        clientId={process.env.NEXT_PUBLIC_WARNING_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={{
          redirect_uri: origin ?? process.env.NEXT_PUBLIC_WARNING_AUTH0_REDIRECT_URI_DEFAULT ?? '',
          audience: process.env.NEXT_PUBLIC_WARNING_AUTH0_AUDIENCE ?? '',
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
              <div className="w-[500px] inline">
                <TabsList>
                  <TabsTrigger value="install">Install</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="zigbee">Zigbee</TabsTrigger>
                  <TabsTrigger value="automations">Automations</TabsTrigger>
                  <TabsTrigger value="scripts">Scripts</TabsTrigger>
                  <TabsTrigger value="scenes">Scenes</TabsTrigger>
                  <TabsTrigger value="host">Host</TabsTrigger>
                  <TabsTrigger value="docker">Docker</TabsTrigger>
                </TabsList>

                <AlertDialog>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="float-right">
                        <Icons.cog6tooth />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Installation</SheetTitle>
                        <SheetDescription>Make changes to your installation here.</SheetDescription>
                      </SheetHeader>

                      <SheetFooter>
                        <SheetClose asChild>
                          <div className="grid grid-cols-1 py-4">
                            <AlertDialogTrigger asChild>
                              <Button type="reset">Delete installation</Button>
                            </AlertDialogTrigger>
                          </div>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your installation and remove its data
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <TabsContent value="install" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <AgentInstallation installationId={params.id} />
                </div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-4">
                <DashboardHeaderInstallation installationId={params.id} />

                <InstallationOverviewChart installationId={params.id} />

                <LogsDataTableProxy installationId={params.id} />
              </TabsContent>

              <TabsContent value="zigbee" className="space-y-4">
                <ZigbeeDataTableProxy installationId={params.id} />
              </TabsContent>

              <TabsContent value="automations" className="space-y-4">
                <AutomationsDataTableProxy installationId={params.id} />
              </TabsContent>

              <TabsContent value="scripts" className="space-y-4">
                <ScriptsDataTableProxy installationId={params.id} />
              </TabsContent>

              <TabsContent value="scenes" className="space-y-4">
                <SceneDataTableProxy installationId={params.id} />
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
            </Tabs>
          </div>
        </div>
      </Auth0Provider>
    )
  );
}
