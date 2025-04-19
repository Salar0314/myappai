'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="max-w-md w-full space-y-8 p-8 bg-secondary/50 backdrop-blur-sm rounded-lg border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-gray-400">
            We've sent a verification link to your email address
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">
              What to do next:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Check your email inbox</li>
              <li>Click the verification link in the email</li>
              <li>Return to the app and sign in</li>
            </ol>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Didn't receive the email?
            </h3>
            <form onSubmit={handleResendVerification} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
                  Verification email sent successfully!
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-secondary placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Resend verification email'}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-primary hover:text-primary/90"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 