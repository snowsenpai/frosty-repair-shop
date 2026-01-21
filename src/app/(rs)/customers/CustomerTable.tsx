"use client"

import { TSelectCustomerSchema } from '@/schemas/customer'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, ColumnFiltersState, SortingState, getPaginationRowModel, getFilteredRowModel, getFacetedUniqueValues, getSortedRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Filter from '@/components/react-table/Filter'

type Props = {
  data: TSelectCustomerSchema[],
}

export default function CustomerTable({ data }: Props) {
  const router = useRouter()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'lastName',
      desc: false, // ascending order
    }
  ])

  const columnHeaderArray: Array<keyof TSelectCustomerSchema> = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'zip',
  ]

  const columnLabels: Partial<Record<keyof TSelectCustomerSchema, string>> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    city: 'City',
    zip: 'Zip',
  }

  const columnHelper = createColumnHelper<TSelectCustomerSchema>()

  const columns = columnHeaderArray.map((columnName) =>
    columnHelper.accessor(columnName, {
      id: columnName,
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            className='pl-1 w-full flex justify-between'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {columnLabels[columnName]}

            {
              column.getIsSorted() === 'asc' ? (
                <ArrowUp className='ml-2 h-4 w-4' />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className='ml-2 h-4 w-4' />
              ) : (
                <ArrowUpDown className='ml-2 h-4 w-4' />
              )
            }
          </Button>
        )
      },
    })
  )

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting },
    initialState: { pagination: { pageSize: 10 } },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className='mt-6 flex flex-col gap-4'>
      <div className='rounded-lg overflow-hidden border border-border'>
        <Table className='border'>
          <TableHeader>
            {
              // render table headers
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {
                    // render each header cell
                    headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className='bg-secondary p-1'>
                          <div>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            }
                          </div>
                          {header.column.getCanFilter() ? (
                            <div className='grid place-content-center'>
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </TableHead>
                      )
                    })
                  }
                </TableRow>
              ))
            }
          </TableHeader>
          <TableBody>
            {
              // render table rows
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40'
                  onClick={() => router.push(`/customers/form?customerId=${row.original.id}`)}
                >
                  {
                    // render each cell in the row
                    row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='border'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex basis-1/3 items-center'>
          <p className='whitespace-nowrap font-bold'>
            {`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${table.getFilteredRowModel().rows.length !== 1 ? 'Total Records' : 'Record'}]`}
          </p>
        </div>
        <div className='space-x-1'>
          <Button
            variant='outline'
            onClick={() => table.resetSorting()}
          >
            Reset Sorting
          </Button>
          <Button
            variant='outline'
            onClick={() => table.resetColumnFilters()}
          >
            Reset Filters
          </Button>
          <Button
            variant='outline'
            className='disabled:pointer-events-auto disabled:cursor-not-allowed'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            // shadcn/ui Button component adds pointer-events-none to disabled buttons, needs to be overridden
            className='disabled:pointer-events-auto disabled:cursor-not-allowed'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
