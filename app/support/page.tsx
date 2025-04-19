'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Support() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // In a real application, you would send this to your backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Contact Support</h1>
        <p className="text-center text-gray-400 mb-6">
          Our AI-powered support team is available 24/7. Send us your question, and
          we'll respond promptly.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field w-full h-32"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          {submitStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg">
              An error occurred. Please try again later.
            </div>
          )}
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Or email us directly at{' '}
            <a
              href="mailto:salarinnov123@gmail.com"
              className="text-primary hover:underline"
            >
              salarinnov123@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 