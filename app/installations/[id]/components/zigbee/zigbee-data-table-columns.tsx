'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export interface ZigbeeDeviceTableView {
  ieee: string;
  last_updated: Date;
  entity_name: string;
  timeago: { last_updated: Date; timestamp: Date };
  name: string | null;
  device: string;
  lqi: { min: number; max: number; mean: number; median: number };
  power_source: string | null;
  battery_type: BatteryType | null;
  integration_type: string;
  id: string;
}

import TimeAgo from 'react-timeago';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BatteryType } from '@/app/types';
export const columns: ColumnDef<ZigbeeDeviceTableView>[] = [
  {
    accessorKey: 'ieee',
    header: () => (
      <div className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">IEEE</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                IEEE is the unique identifier for the Zigbee device, also known as MAC
                address.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    id: 'IEEE',
    cell: ({ row }) => <div className="lowercase text-xs">{row.getValue('IEEE')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-xs">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'lqi',
    id: 'LQI',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  LQI
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  LQI (Link Quality Indicator) is a metric used in Zigbee to determine the
                  quality of a link between two devices.
                  <br />A higher value indicates a better link quality.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const { mean: meanA }: { mean: number } = rowA.getValue('LQI');
      const { mean: meanB }: { mean: number } = rowB.getValue('LQI');

      return meanA - meanB;
    },
    cell: ({ row }) => {
      const {
        min,
        max,
        mean,
        median,
      }: { min: number; max: number; mean: number; median: number } = row.getValue('LQI');
      const isAbnormalLQI =
        mean <= Number(process.env.NEXT_PUBLIC_WARNING_THRESHOLD_ZIGBEE_LQI);
      const className = isAbnormalLQI ? 'text-red-600 font-semibold' : ' font-regular';
      const classNames = ` ${className} text-center text-xs`;

      return (
        <div className={classNames}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{min != max ? `${min} - ${max}` : `${min}`}</TooltipTrigger>
              <TooltipContent>
                Mean: {mean} Median: {median}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: 'last_updated',
    header: ({ column }) => (
      <div className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Last updated
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>The time the Zigbee device was last seen to update its status.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const amount: Date = row.getValue('last_updated');

      return (
        <div className="text-right font-regular text-xs">{amount.toLocaleString()}</div>
      );
    },
  },
  {
    accessorKey: 'timeago',
    header: ({ column }) => (
      <div className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Δ Observation
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                The relative time between the snapshot of data taken and the time the
                Zigbee device reported its status.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    sortingFn: (a, b) => {
      const recA: { last_updated: Date; timestamp: Date } = a.getValue('timeago');
      const recB: { last_updated: Date; timestamp: Date } = b.getValue('timeago');

      const diffA = recA.timestamp.getTime() - recA.last_updated.getTime();
      const diffB = recB.timestamp.getTime() - recB.last_updated.getTime();

      return diffA - diffB;
    },

    cell: ({ row }) => {
      const { last_updated, timestamp }: { last_updated: Date; timestamp: Date } =
        row.getValue('timeago');

      return (
        <div className="text-right font-regular text-xs">
          {<TimeAgo date={last_updated} now={() => timestamp.getTime()} />}
        </div>
      );
    },
  },
  {
    accessorKey: 'device',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Device
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const device: string | null = row.getValue('device');

      return <div className="text-right font-regular text-xs">{device ?? ''}</div>;
    },
  },
  {
    accessorKey: 'power_source',
    header: ({ column }) => (
      <div className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Power
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Indicates the power source of the Zigbee device, whether battery-powered
                or plugged in.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    cell: ({ row }) => {
      const power_source: string = row.getValue('power_source');
      const battery_level: number = power_source.startsWith('Battery')
        ? Number(power_source.slice(8))
        : 0;
      const className = battery_level < 30 ? 'font-semibold text-red-600' : '';

      return (
        <div className="flex justify-center items-center text-center text-xs font-regular">
          {power_source.startsWith('Battery') ? (
            <div className="center">
              <Icons.battery />
              <div className={className}>{battery_level}</div>
            </div>
          ) : (
            <Icons.zap />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'battery_type',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Battery type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const batteryType: BatteryType | null = row.getValue('battery_type');
      let displayBattery: string = '';

      if (!batteryType) {
        displayBattery = 'unk.';
      } else if ((batteryType.count ?? 0) > 1) {
        displayBattery = `${batteryType.count}x ${batteryType.type}`;
      } else {
        displayBattery = batteryType.type;
      }

      return <div className="text-center font-regular text-xs">{displayBattery}</div>;
    },
  },
  {
    accessorKey: 'integration_type',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Source
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const source: string = row.getValue('integration_type');

      return <div className="text-center font-regular text-xs">{source}</div>;
    },
  },
];
