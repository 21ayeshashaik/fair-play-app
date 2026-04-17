# FairPlay — Golf | Charity | Community

FairPlay is a professional subscription-driven web platform that combines golf performance tracking, charity fundraising, and a monthly reward engine. Built with a "Mobile-First" philosophy and an enterprise-grade design system.

## 🚀 Core Features

### For Users
- **Dashboard Overview**: Instant snapshot of subscription status, rolling handicap average, and total winnings.
- **Score Entry**: Securely log Stableford scores with a smart 5-score rolling window logic.
- **Charity & Impact**: Select from a verified directory of charities and set your monthly contribution percentage (min 10%).
- **Winnings & Draws**: View prize history, upcoming draw countdowns, and upload score proof for payout verification.
- **Account Settings**: Manage profile details, notification preferences, security, and billing in a clean tabbed interface.

### For Administrators
- **Analytics Overview**: Platform-wide KPIs including total subscribers, prize pool status, and charity impact.
- **User Management**: Search, filter, and manage all platform subscribers and their participation.
- **Draw Engine**: Configure and simulate monthly draws (Random or Algorithmic/Weighted previews) and publish official results.
- **Charity Management**: Full CRUD dashboard to manage the organization directory and active statuses.
- **Winner Verification**: review submitted proof, approve/reject claims, and track payout processing.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router)
- **Database / Auth**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS (Enterprise Design System)
- **Icons**: Lucide React
- **Payments**: Stripe (Integration Ready)
- **Deployment**: Optimized for Vercel

---

## 📱 Mobile-First Design
The platform features a premium **Mobile Bottom Navigation Bar** that automatically takes over on smaller screens, ensuring the application feels like a native app. Content grids and tables have been optimized with fluid layouts for a seamless experience across all devices.

---

## ⚙️ Setup & Installation

### 1. Database Setup
The application uses Supabase. Run the provided SQL schema to initialize the database:
- **Schema File**: [`supabase/schema.sql`](./supabase/schema.sql)
- Includes tables for Users, Scores, Charities, Draws, Winners, and Verifications with Row Level Security (RLS).

### 2. Environment Variables
Rename `.env.local.example` to `.env.local` and add your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# Optional Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Locally
```bash
npm install
npm run dev
```

---

## 🔐 Admin Access (Testing)
- **URL**: `/admin/login`
- **Email**: `admin@fairplay.com`
- **Password**: `Admin@FairPlay2026`

---

## ✅ Feature Checklist
- [x] Professional Light Theme UI
- [x] Responsive Mobile Bottom Nav
- [x] 5-Score Rolling Database Logic
- [x] Algorithmic Draw Simulation Engine
- [x] Charity Directory & Selection Module
- [x] Winner Proof Upload & Admin Verification Workflow
- [x] Full CRUD Admin Control Panel
- [x] Supabase RLS Protected Schema
