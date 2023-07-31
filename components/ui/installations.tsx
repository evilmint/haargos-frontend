"use client";

import TimeAgo from "react-timeago";
import { Button } from "@/registry/new-york/ui/button";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { getObservations } from "../../app/services/observations";
import { getInstallations } from "../../app/services/installations";
import { Installation, InstallationApiResponse, Observation, ObservationApiResponse } from "@/app/types";

export function Installations() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    const fetchInstallations = async () => {
      const installations = await (await getInstallations()).json() as InstallationApiResponse;

      const sorted = installations.body.items.sort(
        (b: any, a: any) =>
          new Date(a.last_agent_connection).getTime() -
          new Date(b.last_agent_connection).getTime()
      );

      setInstallations(sorted);

      const observations = await (await getObservations(sorted[0].id)).json() as ObservationApiResponse;
      setObservations(observations.body.items);
    };
    fetchInstallations();
  }, []);

  const router = useRouter();

  return installations.map((installation: any) => {
    return (
      <div className="flex items-center space-y-4">
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
              router.push("/installations/" + installation.id);
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
