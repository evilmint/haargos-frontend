'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface AlarmIncidentTableView {
  alarm_configuration: string;
  state: string;
  triggered_at: string;
}

export const columns: ColumnDef<AlarmIncidentTableView>[] = [
  {
    accessorKey: 'alarm_configuration',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Alarm configuration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('alarm_configuration')}</div>
    ),
  },
  {
    accessorKey: 'triggered_at',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Triggered at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const dateString: string | undefined = row.getValue('triggered_at');
      const date = dateString != null ? new Date(dateString) : null;

      return (
        <div className="text-right font-regular text-xs">
          {date != null
            ? date.toLocaleDateString() + ', ' + date.toLocaleTimeString()
            : 'Never'}
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
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  State
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>State</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    cell: ({ row }) => {
      const state: string = row.getValue('state');
      return (
        <div className="text-center relative-flex flex justify-center text-xs">
          {state.toUpperCase()}
        </div>
      );
    },
  },
];
