import Link from "next/link"
import TicketSearch from '@/app/(rs)/tickets/TicketSearch'
import { getTicketSearchResults } from '@/lib/queries/getTicketSearchResults'
import { getOpenTickets } from '@/lib/queries/getOpenTickets'

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
      <p>{JSON.stringify(results)}</p>
      <Link href="/tickets/form" className="underline">New Ticket</Link>
      </>
    )
  }

  // query database for tickets matching searchText
  const results = await getTicketSearchResults(searchText)

  // return results, include TicketSearch component at top of page
  return (
    <div>
      <TicketSearch />
      <p>{JSON.stringify(results)}</p>
      <Link href="/tickets/form" className="underline">New Ticket</Link>
    </div>
  )
}