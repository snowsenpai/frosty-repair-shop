import { getCustomer } from '@/lib/queries/getCustomer';
import { getTicket } from '@/lib/queries/getTicket';
import * as Sentry from "@sentry/nextjs";
import { BackButton } from '@/components/BackButton';
import TicketForm from '@/app/(rs)/tickets/form/TicketForm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, init as kindeInit } from '@kinde/management-api-js'

type TSearchParam = { [key: string]: string | undefined }

export async function generateMetadata({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  const { customerId, ticketId } = await searchParams

  if (!customerId && !ticketId) {
    return {
      title: 'Missing Ticket ID or Customer ID',
    }
  }

  if (customerId) {
    return {
      title: `New Ticket for Customer #${customerId} | Frosty Repair Shop`,
    }
  }

  if (ticketId) {
    return {
      title: `Edit Ticket #${ticketId} | Frosty Repair Shop`,
    }
  }
}

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

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, currentUser] = await Promise.all([
      getPermission("manager"),
      getUser()
    ]);

    const isManager = managerPermission?.isGranted ?? false;

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

      if (!isManager) {
        const isEditable = ticket.tech.toLowerCase() === currentUser?.email?.toLowerCase()
        return (
          <TicketForm customer={customer} ticket={ticket} isEditable={isEditable} />
        )
      }

      kindeInit() // Initialize Kinde Management API

      const { users } = await Users.getUsers()
      const tech = users ? users.map(user => ({ id: user.email!, description: user.email! })) : []

      return (
        <TicketForm customer={customer} ticket={ticket} tech={tech} />
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

      if (!isManager) {
        return (
          <TicketForm customer={customer} />
        )
      }

      kindeInit() // Initialize Kinde Management API

      const { users } = await Users.getUsers()
      const tech = users ? users.map(user => ({ id: user.email!, description: user.email! })) : []

      return (
        <TicketForm customer={customer} tech={tech} />
      )
    }

  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e)
      throw e
    }
  }
}
