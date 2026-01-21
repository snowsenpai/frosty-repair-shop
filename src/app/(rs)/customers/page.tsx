import Link from "next/link"
import CustomerSearch from '@/app/(rs)/customers/CustomerSearch'
import { getCustomerSearchResults } from '@/lib/queries/getCustomerSearchResults'

type TSearchParam = { [key: string]: string | undefined }

export const metadata = {
  title: "Customer Search",
}

export default async function Customers({ searchParams }: { searchParams: Promise<TSearchParam> }) {
  const { searchText } = await searchParams

  if (!searchText) return <CustomerSearch />

  // query database for customers matching searchText
  const results = await getCustomerSearchResults(searchText)

  // return results, include CustomerSearch component at top of page
  return (
    <div>
      <CustomerSearch />
      <p>{JSON.stringify(results)}</p>
      <Link href="/customers/form" className="underline">New Customer</Link>
    </div>
  )
}