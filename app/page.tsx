import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">AI Funds</h1>
        <p className="text-gray-300 mb-8">Smart Investment Platform</p>
        <a 
          href="/auth/signin" 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Sign In
        </a>
      </div>
    </div>
  )
} 