'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        router.push('/dashboard')
        return
      }

      setUser(user)
    }
    checkAdmin()
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen">
      <nav className="bg-secondary/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-2xl font-bold text-primary">
                Admin Panel
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin/deposits"
                  className="text-gray-300 hover:text-white"
                >
                  Deposits
                </Link>
                <Link
                  href="/admin/withdrawals"
                  className="text-gray-300 hover:text-white"
                >
                  Withdrawals
                </Link>
                <Link
                  href="/admin/users"
                  className="text-gray-300 hover:text-white"
                >
                  Users
                </Link>
              </div>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/auth/signin')
              }}
              className="text-gray-300 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
} 