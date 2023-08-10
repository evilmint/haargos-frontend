'use client';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { Log } from '../../../types';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';

export function Logs({ ...params }) {
  const { installationId } = params;
  const logs = useInstallationStore(state => state.logsByInstallationId[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token);
    });
  }, [fetchInstallations, isAuthenticated, user, getAccessTokenSilently]);

  return (
    <Tabs defaultValue="logtable" className="space-y-4">
      <h3 className="inline ml-4 font-semibold">Issues ({(logs ?? []).length})</h3>
      <TabsList className="ml-4">
        <TabsTrigger value="logtable">Visual</TabsTrigger>
        <TabsTrigger value="lograw">Raw</TabsTrigger>
      </TabsList>
      <TabsContent value="logtable" className="space-y-4">
        <Table>
          <TableCaption>A list of your recent logs.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead>Log</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-right w-[100px]">Thread</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(logs ?? []).map((log: Log) => (
              <TableRow key={log.time}>
                <TableCell className="font-medium text-xs">{log.time}</TableCell>
                <TableCell className="text-left" dangerouslySetInnerHTML={{ __html: log.log }}></TableCell>
                <TableCell className="text-xs text-center">{log.type}</TableCell>
                <TableCell className="text-xs text-right">{log.thread}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="lograw">
        <div className="relative mx-auto mt-4">
          <div className="bg-slate-950 text-white p-4 rounded-md">
            <div className="flex justify-between items-center mb-2"></div>
            <div className="overflow-x-auto">
              <pre id="code" className="text-gray-300 text-xs">
                <code>{(logs ?? []).map((l: Log) => l.raw).join('\n')}</code>
              </pre>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
