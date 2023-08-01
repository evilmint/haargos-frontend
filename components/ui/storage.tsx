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

import { useState, useEffect } from "react";
import { useInstallationStore } from "@/app/services/stores";

export function Storage() {
  const observations = useInstallationStore((state) => state.observations);
  const fetchInstallations = useInstallationStore((state) => state.fetchInstallations);

  useEffect(() => {
    fetchInstallations()
  }, [fetchInstallations]);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Storage ({observations[0].environment.storage.length})</CardTitle>
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
            {(observations[0].environment.storage ?? []).map(storage => (
              <TableRow key={storage.mounted_on}>
                <TableCell className="font-medium text-xs">
                  {storage.name}
                </TableCell>
                <TableCell className="text-xs">{storage.available}</TableCell>
                <TableCell className="text-xs">
                  {storage.use_percentage}
                </TableCell>
                <TableCell className="text-xs">{storage.used}</TableCell>
                <TableCell className="text-xs">{storage.size}</TableCell>
                <TableCell className="text-xs">{storage.mounted_on}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
