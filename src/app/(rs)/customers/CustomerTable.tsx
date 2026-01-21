"use client"

import { TSelectCustomerSchema } from '@/schemas/customer'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Props = {
  data: TSelectCustomerSchema[],
}

export default function CustomerTable({ data }: Props) {
  const router = useRouter()

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
      header: columnLabels[columnName],
    })
  )

  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                        <TableHead key={header.id} className='bg-secondary'>
                          <div>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            }
                          </div>
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