'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function makeSimpleCell<T>(
  label: string,
  name: string,
  width = '100px',
): ColumnDef<T> {
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
      <div className={`text-xs flex justify-center text-center`}>
        {row.getValue(name)}
      </div>
    ),
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

