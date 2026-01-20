"use server"

import { eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { tickets } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { insertTicketSchema, type TInsertTicketSchema } from '@/schemas/ticket'

export const saveTicketAction = actionClient
  .metadata({ actionName: 'saveTicketAction' })
  .inputSchema(insertTicketSchema, {
    handleValidationErrorsShape: async (errors) => flattenValidationErrors(errors).fieldErrors,
  })
  .action(async ({
    parsedInput: ticket
  }: { parsedInput: TInsertTicketSchema }) => {
    const { isAuthenticated } = getKindeServerSession()

    // user's authentication always needs to be verified in a server action
    // server actions receive a POST request from the client, so they need to be protected and data revalidated
    const isAuth = await isAuthenticated()

    if (!isAuth) redirect('/login')

    // New Ticket
    // createdAt and updatedAt are set by the database
    if (ticket.id === '(New)') {
      const result = await db.insert(tickets).values({
        customerId: ticket.customerId,
        title: ticket.title,
        ...(ticket.description?.trim() ? { description: ticket.description } : {}),
        tech: ticket.tech,
      }).returning({ insertedId: tickets.id })

      return { message: `Ticket ID #${result[0].insertedId} created successfully` }
    }

    // Existing ticket
    const result = await db.update(tickets)
      .set({
        customerId: ticket.customerId,
        title: ticket.title,
        description: ticket.description?.trim() ?? null,
        completed: ticket.completed,
        tech: ticket.tech,
      })
      .where(eq(tickets.id, ticket.id!))
      .returning({ updatedId: tickets.id })

    return { message: `Ticket ID #${result[0].updatedId} updated successfully` }
  })
