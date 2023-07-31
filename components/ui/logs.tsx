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
import { getObservations } from "../../app/services/observations";
import { getInstallations } from "../../app/services/installations";

import { useState, useEffect } from "react";

function wrapSquareBracketsWithEm(inputString: string) {
  const regex = /\[([^\]]+)\]/g;
  return inputString.replace(regex, '<p class="text-xs">[$1]</p>');
}

export function Logs({ ...params }) {
  const [, setObservations] = useState<any[]>([]);
  const [, setInstallations] = useState<any>([]);
  const [, setInstallation] = useState<any>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [, setHighestStorage] = useState<any>(null);

  const { installationId } = params;

  useEffect(() => {
    const fetchInstallations = async () => {
      const installations: any = await (await getInstallations()).json();

      const installation = installations.body.items.filter(
        (i: any) => i.id == installationId
      )[0];
      const observations = await (await getObservations(installationId)).json();
      const itemsArray = observations.body.items;

      // Function to find the storage entry with the highest use percentage in an array
      function findHighestUseStorage(storageArray: any) {
        let highestUsePercentage = -1;
        let highestUseStorage = null;

        storageArray.forEach((storage: any) => {
          const usePercentage = parseInt(
            storage.use_percentage.replace("%", "")
          );
          if (usePercentage > highestUsePercentage) {
            highestUsePercentage = usePercentage;
            highestUseStorage = storage;
          }
        });

        return highestUseStorage;
      }

      // Initialize variables to store the overall highest use storage
      let overallHighestUseStorage: any = null;
      let overallHighestUsePercentage = -1;

      // Loop through all items and find the highest use storage
      itemsArray.forEach((item: any) => {
        const storageArray = item.environment.storage;
        const highestUseStorage: any = findHighestUseStorage(storageArray);

        if (highestUseStorage) {
          const highestUsePercentage = parseInt(
            highestUseStorage.use_percentage.replace("%", "")
          );

          if (highestUsePercentage > overallHighestUsePercentage) {
            overallHighestUsePercentage = highestUsePercentage;
            overallHighestUseStorage = highestUseStorage;
          }
        }
      });

      if (overallHighestUseStorage != null) {
        setHighestStorage(
          overallHighestUseStorage.name +
            " " +
            overallHighestUseStorage.use_percentage
        );
      }

      setObservations(observations.body.items);
      setInstallation(installation);
      setInstallations(installations.body.items);

      let logString = "";

      for (const item of observations.body.items) {
        logString += item.logs;
        console.log(logString);
      }

      let logs = logString.split("\n");

      const resultArray: Log[] = [];

      for (const log of logs) {
        const parts = log.split(/\s+/);

        if (parts.length < 5) {
          continue;
        }

        const time = new Date(parts[0] + "T" + parts[1] + "Z").toLocaleString();
        const logType = parts[2][0];
        const thread = parts[3].replace("(", "").replace(")", "");
        const restOfLog = parts.slice(4).join(" ");

        resultArray.push({
          raw: log,
          time: time,
          type: logType,
          thread: thread,
          log: wrapSquareBracketsWithEm(restOfLog),
        });
      }

      setLogs(resultArray);
    };
    fetchInstallations();
  }, []);

  return (
    <Tabs defaultValue="logtable" className="space-y-4">
      <h3 className="inline ml-4 font-semibold">Issues ({logs.length})</h3>
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
                <code>{logs.map((l: Log) => l.raw).join("\n")}</code>
              </pre>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
