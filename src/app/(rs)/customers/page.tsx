import Link from "next/link"

export const metadata = {
  title: "Customers",
}

export default function Customers() {
  return (
    <div>
      <h2>Customers Page</h2>
      <Link href="/customers/form" className="underline">New Customer</Link>
    </div>
  )
}