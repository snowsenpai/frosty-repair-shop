"use client"

import { TTicketSearchResult } from '@/lib/queries/getTicketSearchResults'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { CircleCheckIcon, CircleXIcon } from 'lucide-react'

type Props = {
  data: TTicketSearchResult,
}

type TicketRow = TTicketSearchResult[number]

type ColumnHeaderKey = keyof TicketRow

export default function TicketTable({ data }: Props) {
  const router = useRouter()

  const columnHeaderArray: ColumnHeaderKey[] = [
    'ticketDate',
    'title',
    'tech',
    'firstName',
    'lastName',
    'email',
    'completed',
  ]

  const columnLabels: Record<ColumnHeaderKey, string> = {
    id: 'ID',
    ticketDate: 'Date',
    title: 'Title',
    tech: 'Tech',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    completed: 'Completed',
  }

  const columnHelper = createColumnHelper<TicketRow>()

  const columns = columnHeaderArray.map((columnName) => {
    return columnHelper.accessor((row) => {
      // transformational - prepare data for sorting/filtering
      const value = row[columnName]
      if (columnName === 'ticketDate' && value instanceof Date) {
        return value.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      }
      if (columnName === 'completed') {
        return value ? 'COMPLETED' : 'OPEN'
      }
      return value
    }, {
      id: columnName,
      header: columnLabels[columnName],
      cell: ({ getValue }) => {
        // presentational - render the UI
        const value = getValue()
        if (columnName === 'completed') {
          return (
            <div className="grid place-content-center">
              {value === 'OPEN' ? <CircleXIcon className="opacity-25" /> : <CircleCheckIcon className="text-green-600" />}
            </div>
          )
        }
        return value
      },
    })
  })

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
                onClick={() => router.push(`/tickets/form?ticketId=${row.original.id}`)}
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
