'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get total deposits
      const { data: deposits } = await supabase
        .from('deposits')
        .select('amount, status')

      // Get total withdrawals
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('amount, status')

      setStats({
        totalUsers: totalUsers || 0,
        totalDeposits: deposits?.reduce((sum, d) => sum + d.amount, 0) || 0,
        totalWithdrawals: withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0,
        pendingDeposits: deposits?.filter(d => d.status === 'pending').length || 0,
        pendingWithdrawals: withdrawals?.filter(w => w.status === 'pending').length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/50 p-6 rounded-lg border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary/50 p-6 rounded-lg border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-2">Total Deposits</h3>
          <p className="text-3xl font-bold text-primary">${stats.totalDeposits.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-2">
            {stats.pendingDeposits} pending approval
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/50 p-6 rounded-lg border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-2">Total Withdrawals</h3>
          <p className="text-3xl font-bold text-primary">${stats.totalWithdrawals.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-2">
            {stats.pendingWithdrawals} pending approval
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/50 p-6 rounded-lg border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <a
              href="/admin/deposits"
              className="block p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              Review Deposits
            </a>
            <a
              href="/admin/withdrawals"
              className="block p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              Review Withdrawals
            </a>
            <a
              href="/admin/users"
              className="block p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              Manage Users
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary/50 p-6 rounded-lg border border-gray-800"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Recent activity will be added here */}
            <p className="text-gray-400">No recent activity</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 