'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SceneTableView } from './scenes-data-table';
import { Icons } from '@/components/icons';

import TimeAgo from 'react-timeago';
export const columns: ColumnDef<SceneTableView>[] = [
  {
    accessorKey: 'friendly_name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-xs">{row.getValue('friendly_name')}</div>,
  },
  {
    accessorKey: 'state',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Last triggered
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const dateString: string | undefined = row.getValue('state');
      const date = dateString != null ? new Date(dateString) : null;

      return (
        <div className="text-right font-regular text-xs">
          {date != null ? date.toLocaleDateString() + ', ' + date.toLocaleTimeString() : 'Never'}
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'timeago',
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-right">
  //         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //           Δ Observation
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   sortingFn: (a, b) => {
  //     const recA: { last_updated: Date; timestamp: Date } = a.getValue('timeago');
  //     const recB: { last_updated: Date; timestamp: Date } = b.getValue('timeago');

  //     const diffA = recA.timestamp.getTime() - recA.last_updated.getTime();
  //     const diffB = recB.timestamp.getTime() - recB.last_updated.getTime();

  //     return diffA - diffB;
  //   },

  //   cell: ({ row }) => {
  //     const { last_updated, timestamp }: { last_updated: Date; timestamp: Date } = row.getValue('timeago');

  //     return (
  //       <div className="text-right font-regular text-xs">
  //         {<TimeAgo date={last_updated} now={() => timestamp.getTime()} />}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'device',
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-right">
  //         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //           Device
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const device: string | null = row.getValue('device');

  //     return <div className="text-right font-regular text-xs">{device ?? ''}</div>;
  //   },
  // },
  // {
  //   accessorKey: 'power_source',
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-center">
  //         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //           Power
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const power_source: string = row.getValue('power_source');
  //     const battery_level: number = power_source.startsWith('Battery') ? Number(power_source.slice(8)) : 0;
  //     const className = battery_level < 30 ? 'font-semibold text-red-600' : '';

  //     return (
  //       <div className="flex justify-center items-center text-center text-xs font-regular">
  //         {power_source.startsWith('Battery') ? (
  //           <div className="center">
  //             <Icons.battery />
  //             <div className={className}>
  //             {battery_level}
  //             </div>
  //           </div>
  //         ) : (
  //           <Icons.zap />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'integration_type',
  //   header: ({ column }) => {
  //     return (
  //       <div className="text-center">
  //         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //           Source
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const source: string = row.getValue('integration_type');

  //     return <div className="text-center font-regular text-xs">{source}</div>;
  //   },
  // },
];
