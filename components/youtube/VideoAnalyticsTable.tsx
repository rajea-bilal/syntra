'use client';

import { useState, Fragment } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  SortingState,
  ExpandedState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

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
import { Card } from '@/components/ui/Card';
import { VideoConversionFunnel } from './VideoConversionFunnel';
import Image from 'next/image';

export const columns: ColumnDef<CombinedVideoData>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={row.getToggleExpandedHandler()}
          disabled={!row.getCanExpand()}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              row.getIsExpanded() ? 'rotate-180' : ''
            }`}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Video',
    cell: ({ row }) => {
      const video = row.original;
      return (
        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
          <Image
            width={48}
            height={40}
            className="h-10 w-12 rounded-md object-cover"
            src={video.thumbnailUrl}
            alt={video.title}
          />
          <span className="font-medium text-zinc-500 dark:text-zinc-400">{video.title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'stats.viewCount',
    header: ({ column }) => (
      <div 
        className="flex text-zinc-500 dark:text-zinc-400 items-center justify-end cursor-pointer select-none"
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
          className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Likes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'leadsGenerated',
    header: ({ column }) => (
      <div 
        className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Leads
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'callsBooked',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Calls Booked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'callsAccepted',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Calls Accepted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'closedDeals',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Closes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'number')}</div>,
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ row }) => {
        const revenueTotal = row.original.revenue || 0;
        return <div className="text-right">{formatValue(revenueTotal, 'currency')}</div>
    }
  },
  {
    accessorKey: 'revenuePerView',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Revenue/View
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'currency')}</div>,
  },
  {
    accessorKey: 'viewToCloseRate',
    header: ({ column }) => (
        <div 
          className="flex items-center justify-end cursor-pointer select-none text-zinc-500 dark:text-zinc-400"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          View-to-Close Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
    cell: ({ getValue }) => <div className="text-right">{formatValue(getValue() as number, 'percentage')}</div>,
  },
];

interface VideoAnalyticsTableProps {
  data: CombinedVideoData[];
  isLoading: boolean;
}

export function VideoAnalyticsTable({ data = [], isLoading }: VideoAnalyticsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      expanded,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
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
    <Card className="bg-white/60 backdrop-blur-lg border border-white/30 dark:border-zinc-800/90 dark:shadow-md dark:shadow-black/30 shadow-md rounded-2xl p-4">
      <div className="overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead 
                      key={header.id} 
                      className={`p-4 dark:text-zinc-400 ${header.column.id !== 'title' ? 'text-right' : ''}`}
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
                  <Fragment key={row.id}>
                    <TableRow 
                      data-state={row.getIsSelected() && 'selected'}
                      className="dark:data-[state=selected]:bg-zinc-800/50"
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="p-4 dark:text-zinc-400">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow className="dark:bg-zinc-800/50">
                        <TableCell colSpan={columns.length} className="p-2 sm:p-4 bg-gray-50 dark:bg-zinc-800/50">
                          <VideoConversionFunnel video={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
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
    </Card>
  );
} 