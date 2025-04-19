'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface Deposit {
  id: string
  user_id: string
  amount: number
  plan_id: string
  status: 'pending' | 'approved' | 'rejected'
  payment_proof: string
  created_at: string
  user: {
    email: string
    full_name: string
  }
}

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select(`
          *,
          user:profiles(email, full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDeposits(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch deposits')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (depositId: string) => {
    try {
      const { error } = await supabase
        .from('deposits')
        .update({ status: 'approved' })
        .eq('id', depositId)

      if (error) throw error

      // Update user's invested amount and create investment plan
      const deposit = deposits.find(d => d.id === depositId)
      if (deposit) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            invested_amount: supabase.rpc('increment_invested_amount', {
              user_id: deposit.user_id,
              amount: deposit.amount
            })
          })
          .eq('id', deposit.user_id)

        if (updateError) throw updateError

        // Create investment plan
        const { error: planError } = await supabase
          .from('plans')
          .insert([
            {
              user_id: deposit.user_id,
              category: deposit.plan_id,
              amount: deposit.amount,
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
            }
          ])

        if (planError) throw planError
      }

      toast.success('Deposit approved successfully')
      fetchDeposits()
    } catch (error: any) {
      toast.error('Failed to approve deposit')
    }
  }

  const handleReject = async (depositId: string) => {
    try {
      const { error } = await supabase
        .from('deposits')
        .update({ status: 'rejected' })
        .eq('id', depositId)

      if (error) throw error

      toast.success('Deposit rejected')
      fetchDeposits()
    } catch (error: any) {
      toast.error('Failed to reject deposit')
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Deposit Requests</h1>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-4">User</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Plan</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="text-gray-300">
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{deposit.user.full_name}</p>
                      <p className="text-sm text-gray-400">{deposit.user.email}</p>
                    </div>
                  </td>
                  <td className="py-4">${deposit.amount}</td>
                  <td className="py-4">{deposit.plan_id}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deposit.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      deposit.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {deposit.status}
                    </span>
                  </td>
                  <td className="py-4">
                    {new Date(deposit.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    {deposit.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(deposit.id)}
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(deposit.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 