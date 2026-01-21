import Link from "next/link"
import * as Sentry from '@sentry/nextjs'
import CustomerSearch from '@/app/(rs)/customers/CustomerSearch'
import { getCustomerSearchResults } from '@/lib/queries/getCustomerSearchResults'
import CustomerTable from '@/app/(rs)/customers/CustomerTable'

type TSearchParam = { [key: string]: string | undefined }

export const metadata = {
  title: "Customer Search",
}

export default async function Customers({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  const { searchText } = await searchParams

  if (!searchText) return <CustomerSearch />

  // start Sentry span for performance monitoring
  // const span = Sentry.startInactiveSpan({
  //   name: 'get-customer-search-results-2',
  // })
  // query database for customers matching searchText
  const results = await getCustomerSearchResults(searchText)
  // span.end()

  // return results, include CustomerSearch component at top of page
  return (
    <div>
      <CustomerSearch />
      {
        results.length ? <CustomerTable data={results} /> : (
          <div className='mt-6 p-4 bg-secondary rounded-md'>
            <p className='mb-4'>No customers found matching "{searchText}".</p>
          </div>
        )
      }
    </div>
  )
}