import Link from "next/link"

export const metadata = {
  title: "Tickets",
}

export default function Tickets() {
  return (
    <div>
      <h2>Tickets Page</h2>
      <Link href="/tickets/form?ticketId=1" className="underline">New Ticket</Link>
    </div>
  )
}