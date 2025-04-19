'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Profile {
  id: string
  full_name: string
  email: string
  binance_wallet: string
  tokens: number
  invested_amount: number
  referral_code: string
}

interface Referral {
  id: string
  referred_by: string
  referred_to: string
  status: 'pending' | 'active'
  created_at: string
  user: {
    full_name: string
    email: string
    invested_amount: number
  }
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
    fetchReferrals()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    } catch (error: any) {
      toast.error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchReferrals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('referrals')
          .select(`
            *,
            user:profiles(full_name, email, invested_amount)
          `)
          .eq('referred_by', user.id)
          .order('created_at', { ascending: false })

        setReferrals(data || [])
      }
    } catch (error: any) {
      toast.error('Failed to fetch referrals')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          binance_wallet: profile.binance_wallet,
        })
        .eq('id', profile.id)

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error: any) {
      setError(error.message)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={profile?.full_name || ''}
              onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="binanceWallet" className="block text-sm font-medium text-gray-300 mb-2">
              Binance Wallet Address
            </label>
            <input
              id="binanceWallet"
              type="text"
              value={profile?.binance_wallet || ''}
              onChange={(e) => setProfile({ ...profile!, binance_wallet: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="Enter your Binance wallet address"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 text-sm"
            >
              {success}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition duration-200 flex items-center justify-center"
          >
            {saving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
              />
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-medium text-white mb-4">Account Security</h3>
        <div className="space-y-4">
          <button
            onClick={async () => {
              const { error } = await supabase.auth.resetPasswordForEmail(profile?.email || '')
              if (error) {
                toast.error('Failed to send password reset email')
              } else {
                toast.success('Password reset email sent')
              }
            }}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition duration-200"
          >
            Reset Password
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-medium text-white mb-4">Token & Referral Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-400">Available Tokens</p>
              <p className="text-2xl font-bold text-white">{profile?.tokens || 0}</p>
              <p className="text-xs text-gray-400 mt-1">1 token = 2 successful referrals</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-400">Total Investment</p>
              <p className="text-2xl font-bold text-white">${profile?.invested_amount || 0}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-sm text-gray-400">Your Referral Code</p>
              <p className="text-xl font-mono text-primary">{profile?.referral_code}</p>
              <p className="text-xs text-gray-400 mt-1">Share this code with friends</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-medium text-white mb-4">Your Referrals</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-4">User</th>
                  <th className="pb-4">Investment</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="text-gray-300">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{referral.user.full_name}</p>
                        <p className="text-sm text-gray-400">{referral.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4">${referral.user.invested_amount}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        referral.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-4">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 