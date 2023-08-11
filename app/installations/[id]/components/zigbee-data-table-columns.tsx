'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ZigbeeDeviceTableView } from './zigbee-data-table';
import { Icons } from '@/components/icons';

import TimeAgo from 'react-timeago';
export const columns: ColumnDef<ZigbeeDeviceTableView>[] = [
  {
    accessorKey: 'ieee',
    header: 'IEEE',
    id: 'IEEE',
    cell: ({ row }) => <div className="lowercase text-xs">{row.getValue('IEEE')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            LQI
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'alphanumeric',
    cell: ({ row }) => {
      const lqi = parseFloat(row.getValue('LQI'));
      const isAbnormalLQI = lqi <= 32;
      const className = isAbnormalLQI ? 'text-red-600 font-semibold' : ' font-regular';
      const classNames = ` ${className} text-center text-xs`;

      return <div className={classNames}>{lqi}</div>;
    },
  },
  {
    accessorKey: 'last_updated',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Last updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const amount: Date = row.getValue('last_updated');

      return <div className="text-right font-regular text-xs">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'timeago',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Δ Observation
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: (a, b) => {
      const recA: { last_updated: Date; timestamp: Date } = a.getValue('timeago');
      const recB: { last_updated: Date; timestamp: Date } = b.getValue('timeago');

      const diffA = recA.timestamp.getTime() - recA.last_updated.getTime();
      const diffB = recB.timestamp.getTime() - recB.last_updated.getTime();

      return diffA - diffB;
    },

    cell: ({ row }) => {
      const { last_updated, timestamp }: { last_updated: Date; timestamp: Date } = row.getValue('timeago');

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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Power
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const power_source: string = row.getValue('power_source');

      return (
        <div className="flex justify-center items-center text-center text-xs font-regular">
          {power_source.startsWith('Battery') ? <div className="center"><Icons.battery />{power_source.slice(8)}</div> : <Icons.zap />}
        </div>
      );
    },
  },
  {
    accessorKey: 'integration_type',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
