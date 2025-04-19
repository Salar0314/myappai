'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles (
            full_name,
            email,
            binance_wallet
          )
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      setWithdrawals(data || [])
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (withdrawalId: string, status: 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ status })
        .eq('id', withdrawalId)
      if (error) throw error

      if (status === 'completed') {
        const withdrawal = withdrawals.find((w) => w.id === withdrawalId)
        if (withdrawal) {
          // Update user's tokens
          const { data: tokenData } = await supabase
            .from('tokens')
            .select('amount')
            .eq('user_id', withdrawal.user_id)
            .single()

          if (tokenData) {
            const { error: updateError } = await supabase
              .from('tokens')
              .update({ amount: tokenData.amount - 1 })
              .eq('user_id', withdrawal.user_id)
            if (updateError) throw updateError
          }
        }
      }

      fetchWithdrawals()
    } catch (error) {
      console.error('Error updating withdrawal status:', error)
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {withdrawal.profiles?.full_name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {withdrawal.profiles?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">${withdrawal.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {withdrawal.profiles?.binance_wallet}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        withdrawal.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : withdrawal.status === 'completed'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {withdrawal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(withdrawal.id, 'completed')}
                          className="text-green-500 hover:text-green-400"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(withdrawal.id, 'rejected')}
                          className="text-red-500 hover:text-red-400"
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