-- ============================================================
-- FairPlay — Complete Supabase Database Schema
-- Run this in your Supabase SQL Editor (new project)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. USERS — Extended profile (links to Supabase Auth)
-- ============================================================
create table if not exists users (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text not null,
  last_name     text not null,
  email         text not null unique,
  phone         text,
  plan          text not null default 'monthly' check (plan in ('monthly', 'yearly')),
  status        text not null default 'active'  check (status in ('active', 'lapsed', 'cancelled')),
  scores_count  int  not null default 0,
  joined_at     timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 2. SUBSCRIPTIONS
-- ============================================================
create table if not exists subscriptions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references users(id) on delete cascade,
  plan            text not null check (plan in ('monthly', 'yearly')),
  status          text not null default 'active' check (status in ('active', 'past_due', 'cancelled')),
  stripe_sub_id   text,
  current_period_start timestamptz,
  current_period_end   timestamptz,
  amount_pence    int not null,  -- store in smallest currency unit
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 3. GOLF SCORES  (rolling 5-score window per user)
-- ============================================================
create table if not exists golf_scores (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references users(id) on delete cascade,
  date       date not null,
  score      int  not null check (score between 1 and 45),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One score per date per user
  unique (user_id, date)
);

-- Index for fast per-user ordered queries
create index if not exists idx_golf_scores_user_date on golf_scores (user_id, date desc);

-- ============================================================
-- 4. CHARITIES
-- ============================================================
create table if not exists charities (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text not null,
  category    text not null,
  website     text,
  logo_url    text,
  supporters  int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 5. CHARITY SELECTIONS  (user → charity mapping + contribution %)
-- ============================================================
create table if not exists charity_selections (
  user_id          uuid primary key references users(id) on delete cascade,
  charity_id       uuid not null references charities(id),
  contribution_pct int  not null default 10 check (contribution_pct between 10 and 100),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- 6. DRAWS  (monthly draw records)
-- ============================================================
create table if not exists draws (
  id             uuid primary key default uuid_generate_v4(),
  draw_month     text not null unique,   -- e.g. "April 2026"
  draw_mode      text not null default 'algorithmic' check (draw_mode in ('random', 'algorithmic')),
  draw_numbers   int[] not null default '{}',  -- the 5 drawn numbers
  pool_total     numeric(12,2) not null default 0,
  jackpot_amount numeric(12,2) not null default 0,   -- jackpot carried into this draw
  rollover       numeric(12,2) not null default 0,   -- jackpot rolling to next month
  winner_count   int not null default 0,
  status         text not null default 'pending' check (status in ('pending', 'published')),
  published_at   timestamptz,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- 7. DRAW ENTRIES  (tracks which scores entered which draw)
-- ============================================================
create table if not exists draw_entries (
  id         uuid primary key default uuid_generate_v4(),
  draw_id    uuid not null references draws(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  scores     int[] not null,   -- snapshot of the 5 scores at draw time
  created_at timestamptz not null default now(),
  unique (draw_id, user_id)
);

-- ============================================================
-- 8. WINNERS
-- ============================================================
create table if not exists winners (
  id                   uuid primary key default uuid_generate_v4(),
  draw_id              uuid not null references draws(id),
  user_id              uuid not null references users(id),
  match_type           text not null check (match_type in ('match5', 'match4', 'match3')),
  matched_numbers      int[] not null,
  prize_amount         numeric(12,2) not null,
  verification_status  text not null default 'unverified'
                         check (verification_status in ('unverified', 'pending', 'approved', 'rejected')),
  payment_status       text not null default 'pending'
                         check (payment_status in ('pending', 'paid')),
  paid_at              timestamptz,
  submitted_at         timestamptz,
  created_at           timestamptz not null default now()
);

-- ============================================================
-- 9. WINNER VERIFICATIONS  (proof submissions)
-- ============================================================
create table if not exists winner_verifications (
  winner_id    uuid primary key references winners(id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  proof_url    text,      -- Supabase Storage path to uploaded screenshot
  notes        text,      -- Admin notes on rejection
  reviewed_by  uuid references users(id),
  reviewed_at  timestamptz,
  submitted_at timestamptz not null default now()
);

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table users                enable row level security;
alter table subscriptions        enable row level security;
alter table golf_scores          enable row level security;
alter table charity_selections   enable row level security;
alter table charities            enable row level security;
alter table draws                enable row level security;
alter table draw_entries         enable row level security;
alter table winners              enable row level security;
alter table winner_verifications enable row level security;

-- Users can read and update their own profile
create policy "users_own_read"   on users for select using (auth.uid() = id);
create policy "users_own_update" on users for update using (auth.uid() = id);

-- Users manage their own scores
create policy "scores_own"       on golf_scores for all using (auth.uid() = user_id);

-- Users manage their own charity selection
create policy "charity_sel_own"  on charity_selections for all using (auth.uid() = user_id);

-- Charities are public readable
create policy "charities_public" on charities for select using (true);

-- Published draws are public readable
create policy "draws_public"     on draws for select using (status = 'published');

-- Users can see their own winnings
create policy "winners_own"      on winners for select using (auth.uid() = user_id);
create policy "verif_own"        on winner_verifications for select
  using (winner_id in (select id from winners where user_id = auth.uid()));

-- Users can insert their own verification (proof upload)
create policy "verif_insert_own" on winner_verifications for insert
  with check (winner_id in (select id from winners where user_id = auth.uid()));

-- ============================================================
-- SEED DATA — Charities
-- ============================================================
insert into charities (name, description, category, supporters, active) values
  ('Global Clean Water Initiative', 'Providing clean, safe drinking water to communities across Sub-Saharan Africa and South Asia.', 'Environment', 1240, true),
  ('Children''s Education Fund',    'Funding access to quality education for underprivileged children in over 30 countries.',          'Education',   892,  true),
  ('Mental Health Alliance',        'Raising awareness and funding research for mental health conditions worldwide.',                   'Health',       764,  true),
  ('Ocean Plastic Recovery',        'Coordinating global efforts to remove plastic waste from the world''s oceans.',                   'Environment',  631,  true),
  ('Hunger Relief Network',         'Delivering nutritious meals and sustainable food programs to families in crisis.',                'Humanitarian', 1105, true),
  ('Reforestation Trust',           'Planting native trees and restoring natural habitats across deforested regions.',                 'Environment',  488,  true),
  ('Women in STEM Foundation',      'Scholarships, mentorship, and advocacy for women and girls entering STEM disciplines.',          'Education',    377,  true),
  ('Veterans Support Alliance',     'Mental health, housing, and career support for military veterans.',                              'Health',       541,  true)
on conflict (name) do nothing;
