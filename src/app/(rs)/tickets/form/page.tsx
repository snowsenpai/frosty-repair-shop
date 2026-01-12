import { getCustomer } from '@/lib/queries/getCustomer';
import { getTicket } from '@/lib/queries/getTicket';
import * as Sentry from "@sentry/nextjs";
import { BackButton } from '@/components/BackButton';

type TSearchParam = { [key: string]: string | undefined }

export default async function TicketFormPage({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  try {
    const { customerId, ticketId } = await searchParams

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className="text-2xl mb-2">Ticket ID or Customer ID required to load ticket form</h2>
          <BackButton title="Go Back" variant="default" />
        </>
      )
    }

    // Edit ticket form - only ticketId is provided
    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId))

      if (!ticket) {
        return (
          <>
            <h2 className="text-2xl mb-2">Ticket ID #{ticketId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        )
      }

      const customer = await getCustomer(ticket.customerId)

      if (!customer) {
        return (
          <>
            <h2 className="text-2xl mb-2">Customer ID #{ticket.customerId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        )
      }

      // put ticket form component for editing
      return (
        <>
          <h2 className="text-2xl mb-2">Edit Ticket #{ticket.id}</h2>
          <p>Customer: {customer.firstName} {customer.lastName}</p>
          <p>Email: {customer.email}</p>
          <p>Title: {ticket.title}</p>
          <p>Description: {ticket.description}</p>
          <p>Completed: {ticket.completed ? "Yes" : "No"}</p>
          <p>Tech: {ticket.tech}</p>
        </>
      )
    }

    // New ticket form - only customerId is provided
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId))

      if (!customer) {
        return (
          <>
            <h2 className="text-2xl mb-2">Customer ID #{customerId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        )
      }

      if (!customer.active) {
        return (
          <>
            <h2 className="text-2xl mb-2">Customer ID #{customerId} is not active</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        )
      }

      // put ticket form component for creating
      return (
        <>
          <h2 className="text-2xl mb-2">New Ticket for {customer.firstName} {customer.lastName}</h2>
          <p>Customer ID: {customer.id}</p>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
          <p>Address: {customer.address1} {customer.address2}, {customer.city}, {customer.state} {customer.zip}</p>
        </>
      )
    }

  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e)
      throw e
    }
  }
}
