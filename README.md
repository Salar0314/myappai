# AI Funds - Smart Investment Platform

AI Funds is a modern investment platform that combines AI-powered trading strategies with a multi-level marketing (MLM) referral system. The platform offers various investment plans and provides users with a seamless experience for managing their investments and referrals.

## Features

- User Authentication & Profiles
- MLM Referral & Token System
- Investment Plans & AI Simulation
- Deposit & Withdrawal Workflow
- Admin Panel for Management
- Live Trading Dashboard
- Customer Support Integration

## Tech Stack

- Frontend: React + Tailwind CSS + Framer Motion
- Backend: Supabase (Auth, Database, Storage)
- Design Theme: Binance-inspired yellow (#F3BA2F) & black (#131722)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-funds.git
   cd ai-funds
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up Supabase Database:
   - Create the following tables in your Supabase project:
     - users (managed by Supabase Auth)
     - profiles
     - referrals
     - deposits
     - withdrawals
     - plans
     - tokens

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Profiles Table
```sql
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  binance_wallet text,
  invested_amount numeric default 0,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);
```

### Referrals Table
```sql
create table referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references profiles(id),
  referred_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Deposits Table
```sql
create table deposits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  amount numeric,
  status text check (status in ('pending', 'confirmed', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Withdrawals Table
```sql
create table withdrawals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  amount numeric,
  status text check (status in ('pending', 'completed', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Plans Table
```sql
create table plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  category text check (category in ('crypto', 'stock', 'nft', 'mixed', 'physical')),
  amount numeric,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text check (status in ('active', 'completed'))
);
```

### Tokens Table
```sql
create table tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  amount integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## Project Structure

```
ai-funds/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utility functions
│   └── supabase.ts       # Supabase client
├── public/                # Static assets
└── styles/                # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email salarinnov123@gmail.com or visit our support page. "# myappai" 
