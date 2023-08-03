import Image from 'next/image';

import { Logs } from '@/components/ui/logs';
import { Storage } from '@/components/ui/storage';
import { Docker } from '@/components/ui/docker';
import { Environment } from '@/components/ui/environment';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';

import { MainNav } from '@/components/ui/main-nav';
import { Installations } from '@/components/ui/installations';
import { UserNav } from '@/components/ui/user-nav';
import { DashboardHeaderInstallation } from '@/components/ui/dashboardHeaderInstallation';
import { Zigbee } from '@/components/ui/zigbee';
import { InstallationName } from '@/components/ui/installationName';

export default function DashboardInstallationPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <InstallationName installationId={params.id} />
      
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="docker">Docker</TabsTrigger>
              <TabsTrigger value="zigbee">Zigbee</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <DashboardHeaderInstallation installationId={params.id} />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Installations</CardTitle>
                    <CardDescription>Client installations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Installations />
                  </CardContent>
                </Card>
                <Card className="col-span-8">
                  <CardContent className="pl-2">
                    <Logs installationId={params.id} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Installations</CardTitle>
                    <CardDescription>Client installations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Installations />
                  </CardContent>
                </Card>

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
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Installations</CardTitle>
                    <CardDescription>Client installations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Installations />
                  </CardContent>
                </Card>

                <Docker installationId={params.id} />
              </div>
            </TabsContent>

            <TabsContent value="zigbee" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Installations</CardTitle>
                    <CardDescription>Client installations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Installations />
                  </CardContent>
                </Card>

                <Zigbee installationId={params.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
