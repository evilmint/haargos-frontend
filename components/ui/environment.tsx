"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useInstallationStore } from "@/app/services/stores";
import { useEffect } from "react";

export function Environment({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore((state) => state.observations[installationId]);
  const fetchInstallations = useInstallationStore((state) => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore((state) => state.fetchObservationsForInstallation);

  useEffect(() => {
    fetchInstallations()
      .then(() => fetchObservationsForInstallation(installationId))
      .catch((error) => console.error(error));
  }, [fetchInstallations, fetchObservationsForInstallation, installationId]);

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
        {observations.length > 0 && (
          <TableRow key={observations[0].environment.cpu.model_name}>
            <TableCell className="font-medium text-xs">{observations[0].environment.cpu.model_name}</TableCell>
            <TableCell className="text-xs">{observations[0].environment.cpu.architecture}</TableCell>
            <TableCell className="text-xs">{observations[0].environment.cpu.load}</TableCell>
            <TableCell className="text-xs">{observations[0].environment.cpu.cpu_mhz}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
