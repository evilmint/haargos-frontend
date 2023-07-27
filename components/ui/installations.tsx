import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import TimeAgo from "react-timeago";
import { Button } from "@/registry/new-york/ui/button";
import { useRouter } from 'next/navigation'

export function Installations({ ...props }) {
  const { installations } = props;
  const router = useRouter()

  return installations.map((installation: any) => {
    return (
      <div className="flex items-center space-y-4">
        {/* <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>3195</AvatarFallback>
        </Avatar> */}
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">
            {installation.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Last agent activity:{" "}
            <TimeAgo date={installation.last_agent_connection} />
          </p>
        </div>
        <div className="ml-auto space-x-2 font-medium">
          <Button
            onClick={() => {
              router.push('/installations/' + installation.id)
            }}
          >
            Open
          </Button>
          <Button
            
            onClick={() => {
              window.open(installation.urls.instance, "_blank");
            }}
          >
            HA
          </Button>
        </div>
      </div>
    );
  });
}
