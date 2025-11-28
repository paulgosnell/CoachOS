import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin'
import PaymentsClient from './PaymentsClient'

export default async function AdminPaymentsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/dashboard')
  }

  return <PaymentsClient />
}
