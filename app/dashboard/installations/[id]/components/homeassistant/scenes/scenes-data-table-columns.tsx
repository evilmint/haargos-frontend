'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
export interface SceneTableView {
  id: string;
  name: string;
  state: string | null;
  friendly_name: string | null;
}

export const columns: ColumnDef<SceneTableView>[] = [
  {
    accessorKey: 'friendly_name',
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
    cell: ({ row }) => <div className="text-xs">{row.getValue('friendly_name')}</div>,
  },
  {
    accessorKey: 'state',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
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
          {date != null
            ? date.toLocaleDateString() + ', ' + date.toLocaleTimeString()
            : 'Never'}
        </div>
      );
    },
  },
];
