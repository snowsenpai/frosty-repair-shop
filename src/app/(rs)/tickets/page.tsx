import Link from "next/link"
import TicketSearch from '@/app/(rs)/tickets/TicketSearch'
import { getTicketSearchResults } from '@/lib/queries/getTicketSearchResults'
import { getOpenTickets } from '@/lib/queries/getOpenTickets'
import TicketTable from '@/app/(rs)/tickets/TicketTable'

type TSearchParam = { [key: string]: string | undefined }

export const metadata = {
  title: "Ticket Search",
}

export default async function Tickets({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  const { searchText } = await searchParams

  // If no search text, get all open tickets
  if (!searchText) {
    const results = await getOpenTickets()
    return (
      <>
        <TicketSearch />
        {
          results.length ? <TicketTable data={results} /> : (
            <div className='mt-6 p-4 bg-secondary rounded-md'>
              <p className='mb-4'>No open tickets found.</p>
            </div>
          )
        }
      </>
    )
  }

  // query database for tickets matching searchText
  const results = await getTicketSearchResults(searchText)

  // return results, include TicketSearch component at top of page
  return (
    <div>
      <TicketSearch />
      {
        results.length ? <TicketTable data={results} /> : (
          <div className='mt-6 p-4 bg-secondary rounded-md'>
            <p className='mb-4'>No tickets found matching "{searchText}".</p>
          </div>
        )
      }
    </div>
  )
}