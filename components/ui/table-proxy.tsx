
'use client';
import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TimeAgo from 'react-timeago';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Observation, ZigbeeDevice } from '@/app/types';
import { DataTableDemo, ZigbeeDeviceTableView } from './data-table';

export function TableProxy({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, fetchObservationsForInstallation, user, getAccessTokenSilently,installationId]);


const devices =
observations?.length > 0
  ? (observations[0].zigbee?.devices ?? []).map(d => mapToTableView(d, observations[0]))
  : [];

  return (
   <DataTableDemo data={devices} />
  );
}

function mapToTableView(device: ZigbeeDevice, observation: Observation): ZigbeeDeviceTableView {
    return {
      id: device.ieee,
      ieee: device.ieee,
      last_updated: new Date(device.last_updated),
      entity_name: device.entity_name,
      name_by_user: device.name_by_user,
      timeago: { last_updated: new Date(device.last_updated), timestamp: new Date(observation.timestamp) }, //<TimeAgo date={device.last_updated} now={() => new Date(observation.timestamp).getTime()} />,
      device: `${device.brand} ${device.entity_name}`,
      lqi: device.lqi,
      power_source: device.power_source,
      integration_type: device.integration_type.toLocaleUpperCase(),
    };
  }
  