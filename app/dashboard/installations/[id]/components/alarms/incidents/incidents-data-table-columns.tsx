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
  id: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const columns: ColumnDef<AlarmIncidentTableView>[] = [
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Action
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-xs">{row.getValue('type')}</div>,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const dateString: string | undefined = row.getValue('created_at');
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
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Updated at
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const dateString: string | undefined = row.getValue('updated_at');
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
    accessorKey: 'status',
    id: 'status',
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
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Status of the job</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    cell: ({ row }) => {
      const status: string = row.getValue('status');
      return (
        <div className="text-center relative-flex flex justify-center text-xs">
          {status.toUpperCase()}
        </div>
      );
    },
  },
];
