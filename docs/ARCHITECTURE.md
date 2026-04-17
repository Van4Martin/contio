# Architecture Overview

## Frontend (React + Vite)
- **State**: Redux Toolkit with slices for auth, meetings, voting
- **Routing**: React Router v6 with protected routes for auth and admin roles
- **Services**: Thin service layer wrapping Supabase JS calls
- **Hooks**: Custom hooks (`useAuth`, `useAttendance`, `useVoting`) for shared logic
- **Styling**: CSS variables + inline styles for component isolation

## Backend (Supabase)
- **Auth**: Supabase Auth with JWT, metadata for role
- **Database**: PostgreSQL with RLS for row-level security
- **Edge Functions**: Optional Deno-based serverless functions for complex logic
- **Storage**: Not used in core flow; extendable for avatars

## Data Flow
1. User logs in → JWT stored in Supabase session
2. All service calls attach the session automatically via `supabase-js`
3. RLS policies enforce data access on the database level
4. Admin users are identified by `role = 'admin'` in the `users` table

## Deployment
- Frontend: Vercel or Netlify (static build via `vite build`)
- Backend: Supabase hosted (no server to manage)