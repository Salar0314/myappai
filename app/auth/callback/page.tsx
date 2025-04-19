'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          router.push('/auth/signin')
          return
        }

        if (session?.user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()

          if (profile?.is_admin) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        } else {
          // If no session, try to get it from the URL
          const { data: { session: newSession }, error: newError } = await supabase.auth.getSession()
          
          if (newError) {
            console.error('Error getting new session:', newError)
            router.push('/auth/signin')
            return
          }

          if (newSession?.user) {
            // Check if user is admin
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', newSession.user.id)
              .single()

            if (newProfile?.is_admin) {
              router.push('/admin')
            } else {
              router.push('/dashboard')
            }
          } else {
            router.push('/auth/signin')
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth/signin')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="max-w-md w-full space-y-8 p-8 bg-secondary/50 backdrop-blur-sm rounded-lg border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Authenticating...
          </h2>
          <p className="mt-2 text-gray-400">
            Please wait while we verify your session
          </p>
        </div>
      </div>
    </div>
  )
} 