'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export function makeSimpleCell<T>(
  label: string,
  name: string,
  width = '100px',
  alignment = 'justify-center',
): ColumnDef<T> {
  return {
    accessorKey: name,
    header: ({ column }) => (
      <div className={`flex ${alignment}`}>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className={`text-xs flex ${alignment} text-center`}>{row.getValue(name)}</div>
    ),
  };
}

export function makeDateCell<T>(label: string, name: string): ColumnDef<T> {
  return {
    accessorKey: label,
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    sortingFn: 'datetime',
    cell: ({ row }) => {
      const dateString: string | undefined = row.getValue(label);
      const date = dateString != null ? new Date(dateString) : null;

      return (
        <div className="text-right font-regular text-xs">
          {date != null
            ? date.toLocaleDateString() + ', ' + date.toLocaleTimeString()
            : 'Never'}
        </div>
      );
    },
  };
}

export function makeBooleanCell<T>(label: string, name: string): ColumnDef<T> {
  return {
    accessorKey: name,
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-center flex justify-center">
        {row.getValue(name) ? (
          <Icons.checkCircle className="w-6 h-6 text-green-600" />
        ) : (
          <Icons.xCircle className="w-6 h-6 text-red-600" />
        )}
      </div>
    ),
  };
}
