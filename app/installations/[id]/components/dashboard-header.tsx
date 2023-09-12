'use client';
import numeral from 'numeral';
import { Color, Tracker } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Skeleton } from '@/registry/new-york/ui/skeleton';
import { Icons } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge, Flex, ProgressBar, Text } from '@tremor/react';
import moment from 'moment';

export function DashboardHeaderInstallation({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const installations = useInstallationStore(state => state.installations);

  const installation = installations.find(i => i.id == installationId);
  const highestStorage = useInstallationStore(
    state => state.highestStorageByInstallationId[installationId],
  );
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const latestHaRelease = useInstallationStore(state => state.latestHaRelease);
  const { getAccessTokenSilently, user } = useAuth0();
  const [isLoading, setLoading] = useState<boolean>(true);

  const hasObservations = observations?.length > 0;
  const memoryUsed = hasObservations ? observations[0].environment.memory?.used ?? 0 : 0;
  const memoryTotal = hasObservations
    ? observations[0].environment.memory?.total ?? 0
    : 1;
  const memoryPercentage = Math.floor((memoryUsed / memoryTotal) * 100);

  const observationsLoading = observations == null || observations == undefined;

  const haVersion = observations?.length > 0 && observations[0].ha_config?.version;
  const isHAUpdateAvailable =
    latestHaRelease != null && haVersion != null && haVersion != latestHaRelease;

  interface Tracker {
    color: Color;
    tooltip: string;
  }

  const data: Tracker[] = (installation?.health_statuses ?? []).map(status => {
    const isDegradedLink = status.time >= 500;
    const color = isDegradedLink ? 'yellow' : status.is_up ? 'emerald' : 'rose';
    const tooltip = isDegradedLink
      ? 'Degraded'
      : status.is_up
      ? 'Operational'
      : 'Downtime';

    return {
      color: color,
      tooltip: `${moment(status.timestamp).calendar()}, ${tooltip} (${status.time.toFixed(
        0,
      )}ms)`,
    };
  });

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
    user,
  ]);

  const cpuArchitecture =
    (observations && observations[0]?.environment.cpu?.architecture) ?? 'n/a';

  const healthy =
    installation && installation.health_statuses.length > 0
      ? {
          is_healthy: installation.health_statuses[0].is_up ?? false,
          last_updated: installation?.health_statuses[0].timestamp,
        }
      : { is_healthy: false, last_updated: null };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agent</CardTitle>
          <Icons.git />
        </CardHeader>
        <CardContent>
          <div className="text-xl">
            {observationsLoading || isLoading ? (
              <Skeleton className="h-8" />
            ) : observations && observations.length > 0 ? (
              <div>
                <Text>{observations[0].agent_version}</Text>
                <Text>
                  Last seen{' '}
                  <TimeAgo className="font-semibold" date={observations[0]?.timestamp} />
                </Text>
              </div>
            ) : (
              <div className="font-bold">n/a</div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">HA version</CardTitle>
          <Icons.git />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold mr-2 inline">
            {observationsLoading || isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              haVersion ?? 'n/a'
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a
                  className="cursor-pointer"
                  href="https://github.com/home-assistant/core/releases"
                  target="_blank"
                >
                  {observationsLoading == false &&
                    isLoading == false &&
                    (observations.length > 0 ? (
                      isHAUpdateAvailable == false ? (
                        <Badge
                          className="cursor-pointer"
                          color="green"
                          icon={Icons.shieldCheck}
                        >
                          Up to date
                        </Badge>
                      ) : (
                        <Badge
                          className="cursor-pointer"
                          color="orange"
                          icon={Icons.shieldExclamation}
                        >
                          {latestHaRelease} available
                        </Badge>
                      )
                    ) : (
                      <div className="text-xl font-bold">n/a</div>
                    ))}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isHAUpdateAvailable ? `${latestHaRelease} available` : 'Up to date'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory</CardTitle>

          <Icons.memory />
        </CardHeader>
        <CardContent>
          <div className="text-xl">
            {observationsLoading || isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <div>
                <Flex>
                  <Text>
                    {numeral(
                      (observations[0]?.environment?.memory?.used ?? 0) / 1024 / 1024,
                    ).format('0.0')}
                    G &bull; {memoryPercentage}%
                  </Text>
                  <Text>
                    {numeral(
                      (observations[0]?.environment?.memory?.total ?? 0) / 1024 / 1024,
                    ).format('0.0')}
                    G
                  </Text>
                </Flex>
                <ProgressBar value={memoryPercentage} color="blue" className="mt-3" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volume max</CardTitle>
          <Icons.storage />
        </CardHeader>
        <CardContent>
          <div className="text-xl">
            {observationsLoading || isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              <div>
                <Flex>
                  <Text>
                    {highestStorage?.used} &bull;{' '}
                    {(
                      (Number(highestStorage?.used.slice(0, -1)) /
                        Number(highestStorage?.size.slice(0, -1))) *
                      100
                    ).toFixed(0)}
                    % &bull; {highestStorage?.name}
                  </Text>
                  <Text>{highestStorage?.size}</Text>
                </Flex>
                <ProgressBar
                  value={
                    (Number(highestStorage?.used.slice(0, -1)) /
                      Number(highestStorage?.size.slice(0, -1))) *
                    100
                  }
                  color="blue"
                  className="mt-3"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Architecture</CardTitle>
          <Icons.cpu />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            {observationsLoading || isLoading ? (
              <Skeleton className="h-8" />
            ) : (
              cpuArchitecture
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Instance status</CardTitle>
          <Icons.healthline />
        </CardHeader>
        <CardContent>
          <div className="">
            {observationsLoading || isLoading ? (
              <Skeleton className="h-8" />
            ) : observations.length > 0 ? (
              <div>
                {healthy.is_healthy ? (
                  <Badge color="green" icon={Icons.signal}>
                    <TimeAgo date={healthy.last_updated ?? ''} />
                  </Badge>
                ) : (
                  <Badge color="red" icon={Icons.signal}>
                    <TimeAgo date={healthy.last_updated ?? ''} />
                  </Badge>
                )}
                {healthy.last_updated && (
                  <div className="text-sm font-normal ml-2 inline">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger></TooltipTrigger>
                        <TooltipContent>
                          <p>
                            This shows the status and last time of a query of the
                            HomeAssistant instance url.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                {data.length > 0 && <Tracker data={data} className="mt-2" />}
              </div>
            ) : (
              <div className="text-xl font-bold">n/a</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
