'use client';

import { Button } from '@/registry/new-york/ui/button';
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import { InstallationsDataTableProxy } from './installations/installations-data-table-proxy';
import { DashboardHeader } from './ui/dashboard-header';

export function InstallationsPresentContent() {
  return (
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
  );
}
