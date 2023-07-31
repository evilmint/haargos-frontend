"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import TimeAgo from "react-timeago";
import { Button } from "@/registry/new-york/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getObservations } from "../../app/services/observations";
import { getInstallations } from "../../app/services/installations";
import { useState, useEffect } from "react";

export function Environment({ ...props }) {
  const [installations, setInstallations] = useState<any>([]);
  const [installation, setInstallation] = useState<any>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [highestStorage, setHighestStorage] = useState<any>(null);
  const [observations, setObservations] = useState<any[]>([]);

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
    };
    fetchInstallations();
  }, []);

  return (
    <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Model name</TableHead>
              <TableHead>Architecture</TableHead>
              <TableHead>Load</TableHead>
              <TableHead>MHz</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          
          {observations.length > 0 && 
              <TableRow key={observations[0].environment.cpu.model_name}>
                <TableCell className="font-medium text-xs">
                  {observations[0].environment.cpu.model_name}
                </TableCell>
                <TableCell className="text-xs">{observations[0].environment.cpu.architecture}</TableCell>
                <TableCell className="text-xs">{observations[0].environment.cpu.load}</TableCell>
                <TableCell className="text-xs">{observations[0].environment.cpu.cpu_mhz}</TableCell>
              </TableRow>
}

          </TableBody>
        </Table>
  );
}
