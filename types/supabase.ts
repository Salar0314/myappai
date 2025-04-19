export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url: string | null
          binance_wallet: string
          invested_amount: number
          created_at: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          created_at: string
        }
      }
      deposits: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: 'pending' | 'confirmed' | 'rejected'
          created_at: string
        }
      }
      withdrawals: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'rejected'
          created_at: string
        }
      }
      plans: {
        Row: {
          id: string
          user_id: string
          category: 'crypto' | 'stock' | 'nft' | 'mixed' | 'physical'
          amount: number
          start_date: string
          end_date: string
          status: 'active' | 'completed'
        }
      }
      tokens: {
        Row: {
          id: string
          user_id: string
          amount: number
          created_at: string
        }
      }
    }
  }
} 