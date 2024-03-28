'use client';

import { UserAlarmConfigurationState } from '@/app/types';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface AlarmConfigurationTableView {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  state: string;
  created_at: string;
  actions: {
    alarmId: string;
    deleteAlarm: (alarmId: string) => void;
    editAlarm: (alarmId: string) => void;
  };
}

export const columns: ColumnDef<AlarmConfigurationTableView>[] = [
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-xs"
        dangerouslySetInnerHTML={{ __html: row.getValue('category') }}
      />
    ),
  },
  {
    accessorKey: 'name',
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
    cell: ({ row }) => (
      <div
        className="text-xs"
        dangerouslySetInnerHTML={{ __html: row.getValue('name') }}
      />
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Alarm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-xs"
        dangerouslySetInnerHTML={{ __html: row.getValue('description') }}
      />
    ),
  },
  {
    accessorKey: 'state',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            State
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const rawState: UserAlarmConfigurationState = row.getValue('state');
      const formattedState: string = rawState.replaceAll('_', ' ');

      let state: React.ReactElement;

      switch (rawState) {
        case 'OK':
          state = <Icons.checkCircle className="w-6 h-6 text-green-600" />;
          break;

        case 'IN_ALARM':
          state = <Icons.alertCircle className="w-6 h-6 text-red-600" />;
          break;

        case 'NO_DATA':
          state = <Icons.helpCircle className="w-6 h-6 text-gray-600" />;
          break;
      }

      return (
        <div className="text-xs items-center align-center flex flex-col">
          {state}
          <div>{formattedState}</div>
        </div>
      );
    },
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
    accessorKey: 'actions',
    header: () => {
      return <div className="text-right">Actions</div>;
    },
    cell: ({ row }) => {
      const {
        deleteAlarm,
        editAlarm,
        alarmId,
      }: {
        deleteAlarm: (alarmId: string) => void;
        editAlarm: (alarmId: string) => void;
        alarmId: string;
      } = row.getValue('actions');
      return (
        <div className="text-xs text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="bg-sr-600 dark:text-white hover:bg-sr-700 whitespace-nowrap"
              >
                <Icons.cog6tooth className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => {
                    editAlarm(alarmId);
                  }}
                >
                  <span>Edit</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => {
                    deleteAlarm(alarmId);
                  }}
                >
                  <span className="text-red-600">Delete Alarm</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
