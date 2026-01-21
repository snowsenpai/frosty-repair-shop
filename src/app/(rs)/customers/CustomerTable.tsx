"use client"

import { TSelectCustomerSchema } from '@/schemas/customer'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { useRouter } from 'next/navigation'

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

  const columnHelper = createColumnHelper<TSelectCustomerSchema>()

  const columns = columnHeaderArray.map((columnName) =>
    columnHelper.accessor(columnName, {
      id: columnName,
      header: columnName.charAt(0).toUpperCase() + columnName.slice(1),
    })
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='mt-6 rounded-lg overflow-hidden border border-border'>
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
  )
}