'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Withdraw() {
  const [profile, setProfile] = useState<any>(null)
  const [tokens, setTokens] = useState(0)
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setProfile(profileData)

      // Fetch tokens
      const { data: tokenData } = await supabase
        .from('tokens')
        .select('amount')
        .eq('user_id', user.id)
        .single()
      setTokens(tokenData?.amount || 0)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || tokens < 1) return

    try {
      const { error } = await supabase.from('withdrawals').insert([
        {
          user_id: profile.user_id,
          amount: amount,
          status: 'pending',
        },
      ])
      if (error) throw error

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Request Withdrawal</h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-400">Available Tokens</label>
            <p className="text-2xl font-bold text-primary">{tokens}</p>
            <p className="text-sm text-gray-400 mt-1">
              You need at least 1 token to make a withdrawal
            </p>
          </div>
          <div>
            <label className="block text-gray-400">Binance Wallet Address</label>
            <p className="text-lg">{profile?.binance_wallet || 'Not set'}</p>
            <p className="text-sm text-gray-400 mt-1">
              Update your wallet address in your{' '}
              <a
                href="/dashboard/profile"
                className="text-primary hover:underline"
              >
                profile
              </a>{' '}
              if needed
            </p>
          </div>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block mb-2">Withdrawal Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input-field w-full"
                min="1"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={tokens < 1 || !profile?.binance_wallet}
            >
              Submit Withdrawal Request
            </button>
          </form>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Withdrawal Rules</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• You must have at least 1 token to make a withdrawal</li>
              <li>• Your Binance wallet address must be set in your profile</li>
              <li>
                • Withdrawals unlock once you bring 2 users with matching deposits
              </li>
              <li>• This maintains our fund structure and rewards early adopters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 