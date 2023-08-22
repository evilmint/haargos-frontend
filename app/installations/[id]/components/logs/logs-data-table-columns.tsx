'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogTableView } from './logs-data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const columns: ColumnDef<LogTableView>[] = [
  {
    accessorKey: 'time',
    header: ({ column }) => (
      <div className="text-left">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Time
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is the timestamp of when the log entry was created.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const date: Date = row.getValue('time');
      return <div className="text-xs">{`${date.toLocaleDateString() + ', ' + date.toLocaleTimeString()}`}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <div className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>The type represents the severity of the log. 'W' means a Warning, whereas 'E' indicates an Error.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
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
    header: ({ column }) => (
      <div className="text-right">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Thread
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>The thread identifier provides information about the specific process that generated the log entry.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    cell: ({ row }) => {
      const thread: string = row.getValue('thread');

      return <div className="text-right font-regular text-xs">{thread.toLocaleString()}</div>;
    },
  },
];
