'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogTableView } from './logs-data-table';

export const columns: ColumnDef<LogTableView>[] = [
  {
    accessorKey: 'time',
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const time: Date = row.getValue('time');
      return <div className="text-xs">{`${time.toLocaleDateString()}, ${time.toLocaleTimeString()}`}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="text-xs text-center">{row.getValue('type')}</div>,
  },
  {
    accessorKey: 'log',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Log
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-xs w-" dangerouslySetInnerHTML={{ __html: row.getValue('log') }}></div>,
  },
  {
    accessorKey: 'thread',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Thread
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const thread: string = row.getValue('thread');

      return <div className="text-right font-regular text-xs">{thread.toLocaleString()}</div>;
    },
  },
];
