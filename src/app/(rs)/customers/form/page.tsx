import { getCustomer } from '@/lib/queries/getCustomer';
import * as Sentry from "@sentry/nextjs";
import { BackButton } from '@/components/BackButton';
import CustomerForm from '@/app/(rs)/customers/form/CustomerForm';

type TSearchParam = { [key: string]: string | undefined }

export async function generateMetadata({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  const { customerId } = await searchParams

  if (!customerId) {
    return {
      title: 'New Customer',
    }
  }

  return {
    title: `Edit Customer #${customerId}`,
  }
}

export default async function CustomerFormPage({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  try {
    const { customerId } = await searchParams

    // Edit customer form 

    if (!customerId) {
      // new customer form component
      return (
        <CustomerForm />
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
      <CustomerForm customer={customer} />
    )

  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e)
      throw e
    }
  }
}