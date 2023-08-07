'use client';
import numeral from 'numeral';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { useEffect } from 'react';
import TimeAgo from 'react-timeago';
import { useInstallationStore } from '@/app/services/stores';
import { Button } from '@/registry/new-york/ui/button';
import { useAuth0 } from '@auth0/auth0-react';

export function DashboardHeaderInstallation({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const highestStorage = useInstallationStore(state => state.highestStorageByInstallationId[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const haVersion = useInstallationStore(state => state.haVersion[installationId]);
  const { getAccessTokenSilently, getIdTokenClaims, user, logout, isAuthenticated } = useAuth0();

  const memoryValues =
    observations && observations.length > 0
      ? `${numeral(observations[0].environment.memory.used / 1024 / 1024).format('0.0')}G / ${numeral(
          observations[0].environment.memory.total / 1024 / 1024,
        ).format('0.0')}G `
      : 'n/a';

  const hasObservations = observations?.length > 0;
  const memoryUsed = hasObservations ? observations[0].environment.memory.used : 0;
  const memoryTotal = hasObservations ? observations[0].environment.memory.total : 1;
  const memoryPercentage = Math.floor((memoryUsed / memoryTotal) * 100) + '%';

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, getAccessTokenSilently, user, fetchObservationsForInstallation, installationId]);

  const cpuArchitecture = (observations && observations[0]?.environment.cpu.architecture) ?? 'n/a';
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agent version</CardTitle>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {observations && observations.length > 0 ? observations[0].agent_version : 'n/a'}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">HA version</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
        </CardHeader>
        <CardContent className="flex">
          <div className="text-2xl flex-1 font-bold inline">{haVersion ?? 'n/a'}</div>
          <Button
            onClick={() => {
              window.open('https://github.com/home-assistant/core/releases', '_blank');
            }}
            className="inline flex-1 flex-auto md:hidden"
            variant="outline"
          >
            Releases
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory</CardTitle>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {memoryValues}

            <p className="text-sm font-normal inline">{memoryPercentage}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage max</CardTitle>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <line x1="22" y1="12" x2="2" y2="12"></line>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            <line x1="6" y1="16" x2="6.01" y2="16"></line>
            <line x1="10" y1="16" x2="10.01" y2="16"></line>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {highestStorage ? `${highestStorage?.used}  / ${highestStorage?.size}` : 'n/a'}

            <p className="text-sm font-normal ml-2 inline">{highestStorage?.name ?? ''}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Architecture</CardTitle>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cpuArchitecture}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest activity</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {observations && observations?.length > 0 ? <TimeAgo date={observations[0]?.timestamp} /> : 'n/a'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
