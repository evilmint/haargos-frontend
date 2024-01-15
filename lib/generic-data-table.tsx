'use client';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, LucideExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnVisibilityManager } from '@/lib/column-visibility-manager';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type GenericDataTableParams = {
  defaultColumnVisibility?: VisibilityState;
  columnVisibilityKey: string;
  pluralEntityName?: string;
  filterColumnName?: string;
  link?: (column: any) => string | null;
  linkColumnName?: string;
  columnIdToNameTransformer?: (column: string) => string;
  columns: ColumnDef<any>[];
  data: any;
};

export function GenericDataTable({ ...params }: GenericDataTableParams) {
  const { columns, columnVisibilityKey, defaultColumnVisibility, data } = params;

  const columnVisibilityManager = new ColumnVisibilityManager(
    defaultColumnVisibility ?? {},
    columnVisibilityKey,
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setColumnVisibility(columnVisibilityManager.getVisibility());
  }, [setColumnVisibility]);

  useEffect(() => {
    if (Object.keys(columnVisibility).length != 0) {
      columnVisibilityManager.setVisibility(columnVisibility);
    }
  }, [columnVisibility]);

  function defaultColumnIdTransform(id: string): string {
    const transformed = id
      .toLocaleLowerCase()
      .replaceAll('_', ' ')
      .replaceAll('ha', 'HA')
      .replaceAll('ieee', 'IEEE')
      .replaceAll('lqi', 'LQI')
      .replaceAll('cpu', 'CPU')
      .replaceAll('zigbee', 'Zigbee');

    return transformed.slice(0, 1).toLocaleUpperCase() + transformed.slice(1);
  }

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: { pageSize: 20 },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {params.filterColumnName && (
          <Input
            placeholder={`Filter ${params.pluralEntityName ?? 'entities'}...`}
            value={
              (table.getColumn(params.filterColumnName)?.getFilterValue() as string) ?? ''
            }
            onChange={event =>
              table
                .getColumn(params.filterColumnName ?? 'name')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Column <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {params?.columnIdToNameTransformer?.(column.id) ??
                      defaultColumnIdTransform(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => {
                    const entityHref = params.link?.(row.original);

                    const RenderedElement = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    );

                    return (
                      <TableCell key={cell.id}>
                        {params.linkColumnName == cell.column.id && entityHref ? (
                          <Link
                            className="text-blue-700 inline"
                            target="_blank"
                            href={entityHref}
                          >
                            <div className="flex">
                              {RenderedElement}{' '}
                              <LucideExternalLink className="ml-1 w-4 h-4" />
                            </div>
                          </Link>
                        ) : (
                          RenderedElement
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No {params.pluralEntityName ?? 'entities'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
