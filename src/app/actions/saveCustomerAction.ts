"use server"

import { eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { customers } from '@/db/schema'
import { handleUniqueConstraintError } from '@/lib/dbErrorHelpers'
import { actionClient } from '@/lib/safe-action'
import { insertCustomerSchema, type TInsertCustomerSchema } from '@/schemas/customer'

const customerConstraintMessages = {
  'customers_email_unique': (email: string) => `A customer with email "${email}" already exists.`,
  'customers_phone_unique': (phone: string) => `A customer with phone "${phone}" already exists.`,
};

export const saveCustomerAction = actionClient
  .metadata({ actionName: 'saveCustomerAction' })
  .inputSchema(insertCustomerSchema, {
    handleValidationErrorsShape: async (errors) => flattenValidationErrors(errors).fieldErrors,
  })
  .action(async ({
    parsedInput: customer
  }: { parsedInput: TInsertCustomerSchema }) => {
    const { isAuthenticated } = getKindeServerSession()

    // user's authentication always needs to be verified in a server action
    // server actions receive a POST request from the client, so they need to be protected and data revalidated
    const isAuth = await isAuthenticated()

    if (!isAuth) redirect('/login')

    // New Customer
    // All new customers are active by default - no need to set active to true
    // createdAt and updatedAt are set by the database
    if (customer.id === 0) {
      try {
        const result = await db.insert(customers).values({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address1: customer.address1,
          ...(customer.address2?.trim() ? { address2: customer.address2 } : {}), // optional spread operator to avoid inserting empty strings
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          ...(customer.notes?.trim() ? { notes: customer.notes } : {}),
        }).returning({ insertedId: customers.id })

        return { message: `Customer ID #${result[0].insertedId} created successfully` }
      } catch (e) {
        handleUniqueConstraintError(e, customerConstraintMessages, {
          email: customer.email,
          phone: customer.phone,
        });
      }
    }

    // Existing customer
    try {
      const result = await db.update(customers)
        .set({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address1: customer.address1,
          address2: customer.address2?.trim() ?? null,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          notes: customer.notes?.trim() ?? null,
          active: customer.active,
        })
        .where(eq(customers.id, customer.id!))
        .returning({ updatedId: customers.id })

      return { message: `Customer ID #${result[0].updatedId} updated successfully` }
    } catch (e) {
      handleUniqueConstraintError(e, customerConstraintMessages, {
        email: customer.email,
        phone: customer.phone,
      });
    }
  })