import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { tickets } from '@/db/schema'

export const insertTicketSchema = createInsertSchema(tickets, {
  id: z.union([z.number(), z.literal('(New')]),
  title: (schema) => schema.min(1, 'Title is required'),
  description: (schema) => schema.optional(),
  tech: (schema) => z.email('Invalid email address'),
})

export const selectTicketSchema = createSelectSchema(tickets)

export type TInsertTicketSchema = z.infer<typeof insertTicketSchema>
export type TSelectTicketSchema = z.infer<typeof selectTicketSchema>
