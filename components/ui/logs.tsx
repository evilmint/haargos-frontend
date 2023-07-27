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
          <TableCell className="font-medium">{log.time}</TableCell>
          <TableCell>{log.type}</TableCell>
          <TableCell>{log.thread}</TableCell>
          <TableCell className="text-right">{log.log}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  );
}
