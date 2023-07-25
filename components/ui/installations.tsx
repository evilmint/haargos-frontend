import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button";

export function Installations({...props}) {
  const {list} = props;

  return (
    <div className="space-y-8">
        <div className="flex items-center">
        
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Podgórnik 2/51</p>
          <p className="text-sm text-muted-foreground">
            1 issue
          </p>
        </div>
        <div className="ml-auto font-medium">
          <Button>View</Button>
        </div>
      </div>

      {[].map((s) => {
        return <div className="flex items-center">
        {/* <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>3195</AvatarFallback>
        </Avatar> */}
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{new Date(s.timestamp).toLocaleDateString() + " " + new Date(s.timestamp).toLocaleTimeString()}</p>
          <p className="text-sm text-muted-foreground">
            {s.dangers.length} issue{s.dangers.length == 1 ? "" : "s"}
          </p>
        </div>
        <div className="ml-auto font-medium">+$1,999.00</div>
      </div>
      })}


    </div>
  )
}
