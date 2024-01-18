'use client';
import { useInstallationStore } from '@/app/services/stores';
import { Icons } from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isLocalDomain } from '@/lib/local-domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Skeleton } from '@/registry/new-york/ui/skeleton';
import { useAuth0 } from '@auth0/auth0-react';
import { Badge, Color, Flex, ProgressBar, Text, Tracker } from '@tremor/react';
import moment from 'moment';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import { Notes } from './notes';

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

  const degradedLinkThreshold = Number(
    process.env.NEXT_PUBLIC_DEGRADED_LINK_THRESHOLD_MS,
  );
  const data: Tracker[] = (installation?.health_statuses ?? []).map(status => {
    const isDegradedLink = status.time >= degradedLinkThreshold;
    const color: Color = !status.is_up ? 'rose' : isDegradedLink ? 'yellow' : 'emerald';
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
      await fetchObservationsForInstallation(installationId, token, false);
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

  const copyStatuses = [...(installation?.health_statuses ?? [])];
  const recent_health_status = copyStatuses.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const healthy: { is_healthy: boolean; last_updated: string | null; color: Color } =
    installation && installation.health_statuses.length > 0
      ? {
          is_healthy: recent_health_status[0].is_up ?? false,
          last_updated: recent_health_status[0].timestamp,
          color: recent_health_status[0].is_up
            ? recent_health_status[0].time > degradedLinkThreshold
              ? 'yellow'
              : 'green'
            : 'red',
        }
      : { is_healthy: false, last_updated: null, color: 'red' };

  const localDomain =
    installation?.urls?.instance?.url_type == 'PRIVATE' ||
    installation?.urls?.instance?.url
      ? isLocalDomain(new URL(installation.urls.instance.url))
      : false;
  const isCollectingData =
    installation &&
    installation.health_statuses.length == 0 &&
    installation.urls?.instance?.is_verified == true &&
    !localDomain;

  return (
    <div>
      <div className="my-4 text-sm">
        <Notes installationId={installationId} />
      </div>

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
                    <TimeAgo
                      className="font-semibold"
                      date={observations[0]?.timestamp}
                    />
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
              ) : (
                <div>
                  {installation && installation.urls.instance?.is_verified ? (
                    isCollectingData == false ? (
                      localDomain ? (
                        <Badge color="gray" icon={Icons.signal}>
                          Local address
                        </Badge>
                      ) : (
                        <Badge color={healthy.color} icon={Icons.signal}>
                          <TimeAgo date={healthy.last_updated ?? ''} />
                        </Badge>
                      )
                    ) : (
                      <Badge color="orange" icon={Icons.cog6tooth}>
                        Collecting status...
                      </Badge>
                    )
                  ) : installation &&
                    installation.urls.instance &&
                    installation.urls.instance.verification_status != 'EMPTY' ? (
                    installation &&
                    installation.urls.instance.verification_status == 'FAILED' ? (
                      <Badge color="red" icon={Icons.shieldExclamation}>
                        Verification failed
                      </Badge>
                    ) : (
                      <Badge color="yellow" icon={Icons.cog6tooth}>
                        Verification pending
                      </Badge>
                    )
                  ) : (
                    <Badge color="gray" icon={Icons.cog6tooth}>
                      No instance URL provided
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

                  {installation &&
                    installation.urls.instance?.is_verified &&
                    data.length > 0 && <Tracker data={data} className="mt-2" />}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last boot</CardTitle>
            <Icons.zap />
          </CardHeader>
          <CardContent>
            <div className="">
              {observationsLoading || isLoading ? (
                <Skeleton className="h-8" />
              ) : observations.length > 0 ? (
                <div>
                  <Text>
                    <TimeAgo
                      date={
                        observations[observations.length - 1].environment.boot_time ?? ''
                      }
                    />
                  </Text>
                </div>
              ) : (
                <div className="text-xl font-bold">n/a</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
