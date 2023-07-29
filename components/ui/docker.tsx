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

import { SVGWithText } from "./SVGWithText";

export function Docker({ ...props }) {
  const { observation } = props;

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>
          Docker containers ({observation.docker.containers.length})
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
            {(observation.docker.containers ?? []).map((container: any) => (
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
                <TableCell className="text-xs">{container.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
