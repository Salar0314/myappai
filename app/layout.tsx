import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Funds - Smart Investment Platform',
  description: 'AI-powered investment platform with MLM referral system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-secondary text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
} 