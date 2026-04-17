# MeetGov — Meeting Governance System

A full-stack digital meeting management system built with **React + Vite** and **Supabase**.

## Features
- 🔐 Auth with role-based access (Admin / Member)
- 📅 Meeting creation and management
- ✅ Attendance check-in per section
- 🗳️ Election voting (listed candidates or manual name entry)
- 📋 Motion voting (Yes / No / Abstain) with optional comments
- 📊 Admin results dashboard
- 🔒 Row-Level Security via Supabase

## Tech Stack
- **Frontend**: React 18, Vite, Redux Toolkit, React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Edge Functions)
- **Styling**: CSS Variables + inline styles (no external CSS framework)
- **Icons**: Lucide React

## Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd meeting-governance-app/client
npm install
```

### 2. Configure Environment
```bash
cp ../.env.example ../.env
```
Fill in your Supabase project URL and anon key.

### 3. Run Migrations
In your Supabase dashboard SQL editor, run each file in `supabase/migrations/` in order (001 → 009).

### 4. Start Development
```bash
npm run dev
```

## Project Structure
See `docs/ARCHITECTURE.md` for a full breakdown.

## Roles
- **Admin**: Can create/manage meetings, sections, candidates, motions, and view all results.
- **Member**: Can view meetings, check in, and vote.

Set role during registration or update directly in Supabase's `users` table.







