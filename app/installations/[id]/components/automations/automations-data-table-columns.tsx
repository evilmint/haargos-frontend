'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutomationTableView } from './automations-data-table';
import { Icons } from '@/components/icons';

import TimeAgo from 'react-timeago';
import { Dot, GreenDot, RedDot } from '../../../../../components/ui/dots';
export const columns: ColumnDef<AutomationTableView>[] = [
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
    accessorKey: 'last_triggered',
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
      const dateString: string | undefined = row.getValue('last_triggered');
      const date = dateString != null ? new Date(dateString) : null;

      return (
        <div className="text-right font-regular text-xs">
          {date != null ? date.toLocaleDateString() + ', ' + date.toLocaleTimeString() : 'Never'}
        </div>
      );
    },
  },
  {
    accessorKey: 'state',
    id: 'state',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            State
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const state: string = row.getValue('state');
      return <div className="text-center">{state == 'off' ? <Dot.red /> : <Dot.green />}</div>;
    },
  },
];
