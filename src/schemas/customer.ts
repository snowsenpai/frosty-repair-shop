import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import {z} from 'zod'
import { customers } from '@/db/schema'

export const insertCustomerSchema = createInsertSchema(customers, {
  firstName: (schema) => schema.min(1, 'First name is required'),
  lastName: (schema) => schema.min(1, 'Last name is required'),
  email: (schema) => z.email('Invalid email address'),
  phone: (schema) =>
    schema.regex(
      /^\d{3}-\d{3}-\d{4}$/,
      'Invalid phone format. Use XXX-XXX-XXXX'
    ),
  address1: (schema) => schema.min(1, 'Address is required'),
  city: (schema) => schema.min(1, 'City is required'),
  state: (schema) =>
    schema.length(2, 'State must be a 2-character code').toUpperCase(),
  zip: (schema) =>
    schema.regex(
      /^\d{5}(-\d{4})?$/,
      'Invalid zip code. Use XXXXX or XXXXX-XXXX'
    ),
})

export const selectCustomerSchema = createSelectSchema(customers)

export type TInsertCustomerSchema = z.infer<typeof insertCustomerSchema>
export type TSelectCustomerSchema = z.infer<typeof selectCustomerSchema>
