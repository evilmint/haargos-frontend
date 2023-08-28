'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutomationTableView } from './automations-data-table';
import { Icons } from '@/components/icons';

import TimeAgo from 'react-timeago';
import { Dot } from '@/components/ui/dots';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  State
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  The green dot indicates that the automation is currently active and running.
                  <br />
                  The red dot means it's turned off.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    cell: ({ row }) => {
      const state: string = row.getValue('state');
      return <div className="text-center relative-flex flex justify-center text-xs">{state == 'off' ? <Icons.checkCircle className="w-6 h-6 text-red-600" /> : <Icons.checkCircle className="w-6 h-6 text-green-600" />}</div>;
    },
  },
];
