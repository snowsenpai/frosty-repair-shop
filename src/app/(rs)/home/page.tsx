import { redirect } from 'next/navigation'

export default function Home() {
  // after login, redirect to /tickets
  redirect('/tickets')
}