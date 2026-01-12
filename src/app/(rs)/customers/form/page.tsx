import { getCustomer } from '@/lib/queries/getCustomer';
import * as Sentry from "@sentry/nextjs";
import { BackButton } from '@/components/BackButton';

type TSearchParam = { [key: string]: string | undefined }

export default async function CustomerFormPage({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  try {
    const { customerId } = await searchParams

    // Edit customer form 

    if (!customerId) {
      // new customer form component 
      return (
        <>
          <h2 className="text-2xl mb-2">Customer ID is required</h2>
          <BackButton title="Go Back" variant="default" />
        </>
      )
    }

    const customer = await getCustomer(parseInt(customerId))

    if (!customer) {
      return (
        <>
          <h2 className="text-2xl mb-2">Customer ID #{customerId} not found</h2>
          <BackButton title="Go Back" variant="default" />
        </>
      )
    }

    // put customer form component
    return (
      <>
        <h2 className="text-2xl mb-2">Customer: {customer.firstName} {customer.lastName}</h2>
        <p>Customer ID: {customer.id}</p>
        <p>Email: {customer.email}</p>
        <p>Phone: {customer.phone}</p>
        <p>Address: {customer.address1} {customer.address2}, {customer.city}, {customer.state} {customer.zip}</p>
      </>
    )

  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e)
      throw e
    }
  }
}