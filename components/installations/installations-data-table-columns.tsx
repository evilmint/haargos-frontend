'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, LucideExternalLink } from 'lucide-react';

import { makeBooleanCell, makeSimpleCell } from '@/lib/table-cells-helper';
import { Badge } from '@tremor/react';
import { Icons } from '../icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface InstallationTableView {
  id: string;
  general: {
    goToHomeAssistant: (url: string) => void;
    goToInstallation: () => void;
    name: string;
    is_up: boolean;
    instance_url: string | null;
    installation_url: string;
  };
  agent_version: string;
  ha_version: string;
  is_healthy: boolean;
  volume: boolean;
  cpu: boolean;
  memory: boolean;
  ha_version_tick: boolean;
  log_errors: number;
  log_warnings: number;
  low_lqi_zigbee_devices: number;
  low_battery_devices: number;
  unhealthy_docker_containers: number;
  navigate_to_installation: string;
  navigate_to_homeassistant: string | null;
}

export const columns: ColumnDef<InstallationTableView>[] = [
  {
    accessorKey: 'general',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Installation
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    filterFn: (a, _, filterValue) => {
      return a.original.general.name
        .toLocaleLowerCase()
        .includes(filterValue.toLocaleLowerCase());
    },
    cell: ({ row }) => {
      const general: {
        goToHomeAssistant: (url: string) => void;
        goToInstallation: () => void;
        name: string;
        is_up: boolean;
        instance_url: string | null;
        installation_url: string;
      } = row.getValue('general');
      return (
        <div className="text-xs text-center">
          <div className="mb-1">
            {' '}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="whitespace-nowrap">
                  {general.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{general.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => {
                      general.goToInstallation();
                    }}
                  >
                    <LucideExternalLink className="mr-2 h-4 w-4" />
                    <span>Go to Installation</span>
                  </DropdownMenuItem>
                  {general && general.instance_url && (
                    <DropdownMenuItem
                      onSelect={() => {
                        general.instance_url &&
                          general.goToHomeAssistant(general.instance_url);
                      }}
                    >
                      <LucideExternalLink className="mr-2 h-4 w-4" />
                      <span>Go to HomeAssistant</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {general.instance_url && (
            <Badge color={general.is_up ? 'green' : 'red'} icon={Icons.signal}>
              {general.is_up ? 'live' : 'down'}
            </Badge>
          )}
        </div>
      );
    },
  },
  makeSimpleCell('Unhealthy Dockers', 'unhealthy_docker_containers'),
  makeSimpleCell('Low Battery Devices', 'low_battery_devices', '150px'),
  makeSimpleCell('Low LQI Devices', 'low_lqi_zigbee_devices'),
  makeBooleanCell('Memory', 'memory'),
  makeBooleanCell('Volume', 'volume'),
  makeBooleanCell('CPU', 'cpu'),
  makeSimpleCell('HA Version', 'ha_version'),
  makeSimpleCell('Log Errors', 'log_errors'),
];
