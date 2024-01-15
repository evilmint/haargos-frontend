'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export interface AddonTableView {
  name: string;
  slug: string;
  description: string;
  advanced: boolean;
  stage: string;
  version: string;
  version_latest: { version: string; isLatest: boolean };
  update_available: boolean;
  available: boolean;
  detached: boolean;
  homeassistant: string | null;
  state: string;
  repository: string;
  build: boolean;
  repo_url: string;
}

export const columns: ColumnDef<AddonTableView>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </>
      );
    },
    cell: ({ row }) => <div className="text-xs">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'slug',
    header: () => <span>Slug</span>,
    cell: ({ row }) => <div className="text-xs">{row.getValue('slug')}</div>,
  },
  {
    accessorKey: 'version',
    header: () => (
      <div className="text-center">
        <span>Version</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-center">{row.getValue('version')}</div>
    ),
  },
  {
    accessorKey: 'version_latest',
    header: () => (
      <div className="text-center">
        <span>Latest Version</span>
      </div>
    ),
    cell: ({ row }) => {
      const latestVersion: { version: string; isLatest: boolean } =
        row.getValue('version_latest');
      return (
        <div
          className={cn(
            'text-xs text-center',
            !latestVersion.isLatest ? 'font-semibold text-yellow-600' : '',
          )}
        >
          {latestVersion.version}
        </div>
      );
    },
  },
  {
    accessorKey: 'update_available',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            className="text-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Update available
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div
        className={cn(
          'text-xs text-center relative-flex flex justify-center',
          row.getValue('update_available') ? 'font-semibold text-green-600' : '',
        )}
      >
        {row.getValue('update_available') ? (
          <Icons.checkCircle className="w-6 h-6 text-green-600" />
        ) : (
          <Icons.xCircle className="w-6 h-6 text-red-600" />
        )}
      </div>
    ),
  },
  {
    accessorKey: 'available',
    header: () => <span>Available</span>,
    cell: ({ row }) => (
      <div className="text-xs">{boolToYesNo(row.getValue('available'))}</div>
    ),
  },
  {
    accessorKey: 'detached',
    header: () => <div className="text-center">Detached</div>,
    cell: ({ row }) => (
      <div className="text-xs text-center">{boolToYesNo(row.getValue('detached'))}</div>
    ),
  },
  {
    accessorKey: 'homeassistant',
    header: () => <span>Home Assistant</span>,
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('homeassistant') || 'N/A'}</div>
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
      const state: string = row.getValue('state');
      return (
        <div className="text-center relative-flex flex justify-center text-xs">
          {getStateComponent(state)}
        </div>
      );
    },
  },
  {
    accessorKey: 'repository',
    header: () => <span>Repository</span>,
    cell: ({ row }) => <div className="text-xs">{row.getValue('repository')}</div>,
  },
  {
    accessorKey: 'build',
    header: () => <div className="text-center">Build</div>,
    cell: ({ row }) => {
      const build: boolean = row.getValue('build');
      return <div className="text-xs text-center">{boolToYesNo(build)}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: () => <span>Description</span>,
    cell: ({ row }) => <div className="text-xs">{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'advanced',
    header: () => <div className="text-center">Advanced</div>,
    cell: ({ row }) => {
      const isAdvanced: boolean = row.getValue('advanced');
      return <div className="text-xs text-center">{boolToYesNo(isAdvanced)}</div>;
    },
  },
  {
    accessorKey: 'stage',
    header: () => <div className="text-center">Stage</div>,
    cell: ({ row }) => <div className="text-xs text-center">{row.getValue('stage')}</div>,
  },
  {
    accessorKey: 'repo_url',
    header: () => <span>Repo URL</span>,
    cell: ({ row }) => (
      <Link href={row.getValue('repo_url')} target="_blank" rel="noopener noreferrer">
        <Button>Visit</Button>
      </Link>
    ),
  },
];

function boolToYesNo(value: boolean): string {
  return value ? 'Yes' : 'No';
}

function getStateComponent(state: string) {
  switch (state) {
    case 'stopped':
      return <Icons.xCircle className="w-6 h-6 text-red-600" />;
    case 'started':
      return <Icons.checkCircle className="w-6 h-6 text-green-600" />;
    default:
      return <Icons.helpCircle className="w-6 h-6 text-gray-400" />;
  }
}
