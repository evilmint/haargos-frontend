"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Log } from "../../app/types.d";

export function Logs({ ...props }) {
  const { logs } = props;

  return (
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
          <TableCell className="font-medium text-xs">{log.time}</TableCell>
          <TableCell className="text-xs">{log.type}</TableCell>
          <TableCell className="text-xs">{log.thread}</TableCell>
          <TableCell className="text-right" dangerouslySetInnerHTML={{__html: log.log}}></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  );
}
