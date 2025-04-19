'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const plans = [
  {
    id: 'crypto',
    name: 'Crypto Trading',
    description: 'AI-powered cryptocurrency trading with advanced market analysis.',
    icon: '💰',
    minAmount: 36,
  },
  {
    id: 'stock',
    name: 'Stock Market',
    description: 'Intelligent stock market investments with machine learning predictions.',
    icon: '📈',
    minAmount: 100,
  },
  {
    id: 'nft',
    name: 'NFT Market',
    description: 'Strategic NFT investments with AI-driven trend analysis.',
    icon: '🖼️',
    minAmount: 50,
  },
  {
    id: 'mixed',
    name: 'Mixed Market',
    description: 'Diversified portfolio across multiple asset classes.',
    icon: '🌐',
    minAmount: 200,
  },
  {
    id: 'physical',
    name: 'Physical Assets',
    description: 'AI-optimized physical asset investments.',
    icon: '🏢',
    minAmount: 500,
  },
]

interface DepositRequest {
  id: string
  user_id: string
  amount: number
  plan_id: string
  status: 'pending' | 'approved' | 'rejected'
  payment_proof: string
  created_at: string
}

const DepositInstructions = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
    <h3 className="text-lg font-medium text-white">Deposit Instructions</h3>
    <div className="space-y-2 text-gray-400">
      <p>1. Send your deposit to Binance Pay ID: <span className="text-primary font-mono">512996544</span></p>
      <p>2. Upload your payment proof (screenshot or transaction ID)</p>
      <p>3. Your deposit will be reviewed within 24 hours</p>
      <p>4. Once approved, your investment will be activated</p>
      <div className="mt-4 p-4 bg-white/5 rounded-lg">
        <p className="text-sm font-medium text-white mb-2">Token System:</p>
        <ul className="text-sm space-y-1">
          <li>• 1 token = 2 successful referrals who have made deposits</li>
          <li>• Tokens are required for withdrawals</li>
          <li>• Track your tokens in your profile</li>
        </ul>
      </div>
    </div>
  </div>
)

export default function Deposit() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [amount, setAmount] = useState(36)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handlePaymentProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentProof(file)
    }
  }

  const handleDeposit = async () => {
    if (!selectedPlan || !paymentProof) {
      setError('Please select a plan and upload payment proof')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Upload payment proof
      const fileExt = paymentProof.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProof)

      if (uploadError) throw uploadError

      // Create deposit request
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: depositError } = await supabase
        .from('deposits')
        .insert([
          {
            user_id: user.id,
            amount,
            plan_id: selectedPlan,
            status: 'pending',
            payment_proof: uploadData.path
          }
        ])

      if (depositError) throw depositError

      toast.success('Deposit request submitted successfully')
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
      toast.error('Failed to submit deposit request')
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="space-y-8">
      <DepositInstructions />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Make a Deposit</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-lg cursor-pointer transition ${
                selectedPlan === plan.id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-white/5 border-white/10'
              } border`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="text-4xl mb-4">{plan.icon}</div>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <p className="text-sm text-gray-400">Min. deposit: ${plan.minAmount}</p>
            </motion.div>
          ))}
        </div>

        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (USD)
              </label>
              <div className="space-y-4">
                <input
                  type="range"
                  min={selectedPlanData?.minAmount}
                  max="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>${selectedPlanData?.minAmount}</span>
                  <span>$10,000</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={selectedPlanData?.minAmount}
                  max="10000"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Proof
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handlePaymentProof}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              {paymentProof && (
                <p className="mt-2 text-sm text-gray-400">
                  Selected file: {paymentProof.name}
                </p>
              )}
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

            <button
              onClick={handleDeposit}
              disabled={loading || amount < (selectedPlanData?.minAmount || 0) || !paymentProof}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                />
              ) : (
                'Submit Deposit Request'
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 