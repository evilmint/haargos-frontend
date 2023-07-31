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
import { Log } from "../../app/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";

import { getObservations } from "../../app/services/observations";
import { getInstallations } from "../../app/services/installations";
import { useState, useEffect } from "react";

export function Storage({ ...props }) {
  const [installations, setInstallations] = useState<any>([]);
  const [installation, setInstallation] = useState<any>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [highestStorage, setHighestStorage] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<any[]>([]);

  useEffect(() => {
    const fetchInstallations = async () => {
      const installations = await (await getInstallations()).json();

      const sorted = installations.body.items.sort(
        (b: any, a: any) =>
          new Date(a.last_agent_connection).getTime() -
          new Date(b.last_agent_connection).getTime()
      );

      setInstallations(sorted);

      const observations = await (await getObservations(sorted[0].id)).json();
      setObservations(observations.body.items);

      let volumesUnsorted = observations.body.items[0].environment.storage.sort(
        (a: any, b: any) =>
          Number(b.use_percentage.slice(0, -1)) -
          Number(a.use_percentage.slice(0, -1))
      );

      let volumes = [];
      const map = new Map();
      for (const item of volumesUnsorted) {
        if (!map.has(item.mounted_on)) {
          map.set(item.mounted_on, true); // set any value to Map
          volumes.push({
            name: item.name,
            available: item.available,
            use_percentage: item.use_percentage,
            used: item.used,
            size: item.size,
            mounted_on: item.mounted_on,
          });
        }
      }

      setVolumes(volumes);
    };
    fetchInstallations();
  }, []);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Storage ({volumes.length})</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Mounted on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(volumes ?? []).map((volume: any) => (
              <TableRow key={volume.mounted_on}>
                <TableCell className="font-medium text-xs">
                  {volume.name}
                </TableCell>
                <TableCell className="text-xs">{volume.available}</TableCell>
                <TableCell className="text-xs">
                  {volume.use_percentage}
                </TableCell>
                <TableCell className="text-xs">{volume.used}</TableCell>
                <TableCell className="text-xs">{volume.size}</TableCell>
                <TableCell className="text-xs">{volume.mounted_on}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
