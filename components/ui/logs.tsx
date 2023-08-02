"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import { Log } from "../../app/types.d";
import { useEffect } from "react";
import { useInstallationStore } from "@/app/services/stores";

export function Logs({ ...params }) {
  const { installationId } = params;
  const logs = useInstallationStore((state) => state.logsByInstallationId[installationId]);
  const fetchInstallations = useInstallationStore(
    (state) => state.fetchInstallations
  );

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

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
              <TableHead className="w-[100px]">Timestamp</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Thread</TableHead>
              <TableHead className="text-right">Log</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(logs ?? []).map((log: Log) => (
              <TableRow key={log.time}>
                <TableCell className="font-medium text-xs">
                  {log.time}
                </TableCell>
                <TableCell className="text-xs">{log.type}</TableCell>
                <TableCell className="text-xs">{log.thread}</TableCell>
                <TableCell
                  className="text-left"
                  dangerouslySetInnerHTML={{ __html: log.log }}
                ></TableCell>
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
              <pre id="code" className="text-gray-300">
                <code>{(logs ?? []).map((l: Log) => l.raw).join("\n")}</code>
              </pre>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
