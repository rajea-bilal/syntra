'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CombinedVideoData } from '@/types/youtube';
import { formatValue } from '@/lib/utils';

export const columns: ColumnDef<CombinedVideoData>[] = [
  {
    accessorKey: 'title',
    header: 'Video',
    cell: ({ row }) => {
      const video = row.original;
      return (
        <div className="flex items-center gap-4">
          <img className="h-10 w-12 rounded-md object-cover" src={video.thumbnailUrl} alt="" />
          <span className="font-medium">{video.title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'stats.viewCount',
    header: ({ column }) => (
      <div 
        className="flex items-center justify-end cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Views
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'stats.likeCount',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Likes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'callsBooked',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Calls Booked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ row }) => {
        const revenueTotal = row.original.revenue?.total || 0;
        return <div className="text-right">{formatValue(revenueTotal, 'currency')}</div>
    }
  },
];

interface VideoAnalyticsTableProps {
  data: CombinedVideoData[];
  isLoading: boolean;
}

export function VideoAnalyticsTable({ data = [], isLoading }: VideoAnalyticsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
        pagination: {
            pageSize: 10,
        }
    }
  });

  if (isLoading) {
    return <div className="text-center p-8">Loading video performance...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center p-8 text-zinc-500">No video data available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead 
                    key={header.id} 
                    className={`p-4 ${header.column.id !== 'title' ? 'text-right' : ''}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow 
                  key={row.id} 
                  data-state={row.getIsSelected() && 'selected'}
                  className="even:bg-zinc-50 dark:even:bg-zinc-900"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
} 