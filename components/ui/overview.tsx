'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useEffect, useState } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { Observation, ZigbeeDevice } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';

export function Overview() {
  const installations = useInstallationStore(state => state.installations);
  const observations = useInstallationStore(state => state.observations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently, getIdTokenClaims, user, logout, isAuthenticated } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      console.log('Fetched token ' + token);
      setToken(token);
    });
  }, [getAccessTokenSilently]);

  // Fetch the installations whenever the token changes.
  useEffect(() => {
    if (token) {
      console.log('Fetching with token ' + token);
      fetchInstallations(token)
        .then(() => Promise.all(installations.map(({ id }) => fetchObservationsForInstallation(id, token))))
        .catch((error) => console.error(error));
    }
  }, [
    fetchInstallations,
    fetchObservationsForInstallation,
    isAuthenticated,
    user,
    token,  // replace getAccessTokenSilently with token
    installations,
  ]);

  const allObservations = Object.values(observations).flat();

  const cpuIssueCount = allObservations.reduce((a: any, i: any) => {
    return a + (i.dangers.includes('high_cpu_usage') ? 1 : 0);
  }, 0);

  const volumeIssueCount = allObservations.reduce((a: number, i: Observation) => {
    return a + (i.dangers.includes('high_volume_usage') ? 1 : 0);
  }, 0);

  const memoryIssueCount = allObservations.reduce((a: number, i: Observation) => {
    return a + (i.dangers.includes('high_memory_usage') ? 1 : 0);
  }, 0);

  const logErrorIssueCount = allObservations.reduce((a: number, i: Observation) => {
    return a + (i.dangers.includes('log_errors') ? 1 : 0);
  }, 0);

  const logWarningIssueCount = allObservations.reduce((a: number, i: Observation) => {
    return a + (i.dangers.includes('log_warnings') ? 1 : 0);
  }, 0);

  const zigbeeIssueCount = allObservations.reduce((a: number, i: Observation) => {
    return (
      a +
      (i.zigbee?.devices.reduce((c: number, d: ZigbeeDevice) => {
        return c + (new Date(d.last_updated).getTime() == 0 ? 1 : 0);
      }, 0) ?? 0)
    );
  }, 0);

  const data = [
    {
      name: 'Volume',
      total: volumeIssueCount,
    },
    {
      name: 'CPU',
      total: cpuIssueCount,
    },
    {
      name: 'Memory',
      total: memoryIssueCount,
    },
    {
      name: 'Log errors',
      total: logErrorIssueCount,
    },
    {
      name: 'Log warnings',
      total: logWarningIssueCount,
    },
    {
      name: 'Zigbee',
      total: zigbeeIssueCount,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tickFormatter={value => `${value}`}
        />
        <Tooltip cursor={false} />
        <Bar dataKey="total" fill="#2485af" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
