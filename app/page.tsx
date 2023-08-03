import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Tabs, TabsContent } from '@/registry/new-york/ui/tabs';
import { MainNav } from '@/components/ui/main-nav';
import { Overview } from '@/components/ui/overview';
import { Installations } from '@/components/ui/installations';
import { DashboardHeader } from '@/components/ui/dashboardHeader';
import { UserNav } from '@/components/ui/user-nav';

export default function DashboardPage() {
  return (
    <>
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
        </div>
      </div>
    </>
  );
}
