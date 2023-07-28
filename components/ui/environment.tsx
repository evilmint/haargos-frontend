import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import TimeAgo from "react-timeago";
import { Button } from "@/registry/new-york/ui/button";
import { useRouter } from "next/navigation";

export function Environment({ ...props }) {
  const { observation } = props;

  return (
    <div className="items-center space-y-4">
      <h2 className="text-lg font-medium">CPU</h2>
      {/* <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>3195</AvatarFallback>
        </Avatar> */}
      <div>Architecture: {observation.environment.cpu.architecture}</div>
      <div>Load: {observation.environment.cpu.load}</div>
      <div>Model name: {observation.environment.cpu.model_name}</div>
      <div>MHz: {observation.environment.cpu.cpu_mhz}</div>
    </div>
  );
}
