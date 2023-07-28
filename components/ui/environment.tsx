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

export function Environment({ ...props }) {
  const { observation } = props;

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
          
              <TableRow key={observation.environment.cpu.model_name}>
                <TableCell className="font-medium text-xs">
                  {observation.environment.cpu.model_name}
                </TableCell>
                <TableCell className="text-xs">{observation.environment.cpu.architecture}</TableCell>
                <TableCell className="text-xs">{observation.environment.cpu.load}</TableCell>
                <TableCell className="text-xs">{observation.environment.cpu.cpu_mhz}</TableCell>
              </TableRow>

          </TableBody>
        </Table>
  );
}
