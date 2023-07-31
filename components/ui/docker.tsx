"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";

import { SVGWithText } from "./SVGWithText";
import { getObservations } from "../../app/services/observations";
import { getInstallations } from "../../app/services/installations";
import { useState, useEffect } from "react";

export function Docker() {
  const [, setInstallations] = useState<any>([]);
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
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>
          Docker containers (
          {observations.length > 0 && observations[0].docker.containers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Running</TableHead>
              <TableHead>Restarting</TableHead>
              <TableHead>Started at</TableHead>
              <TableHead>Finished at</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.length > 0 &&
              (observations[0].docker.containers ?? []).map(
                (container: any) => (
                  <TableRow key={container.image}>
                    <TableCell className="font-medium text-xs">
                      {container.name}
                    </TableCell>
                    <TableCell className="text-xs">{container.image}</TableCell>
                    <TableCell className="text-xs">
                      {container.running ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <SVGWithText
                        showSVG={container.restarting}
                        textWithSVG="Yes"
                        fallbackText="No"
                      />
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(container.started_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(container.finished_at).getUTCSeconds() > 0
                        ? new Date(container.finished_at).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-xs">{container.state}</TableCell>
                    <TableCell className="text-xs">
                      {container.status}
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
