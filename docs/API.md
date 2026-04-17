# API Reference

All data access goes through the Supabase JavaScript client (`@supabase/supabase-js`).
Row Level Security policies enforce authorization at the database level.

## Auth Endpoints
| Action | Method |
|--------|--------|
| Register | `supabase.auth.signUp()` |
| Login | `supabase.auth.signInWithPassword()` |
| Logout | `supabase.auth.signOut()` |

## Meetings
| Action | Table |
|--------|-------|
| List all | `meetings` SELECT |
| Get by ID | `meetings` SELECT + `sections` JOIN |
| Create | `meetings` INSERT (admin only) |
| Update | `meetings` UPDATE (admin only) |
| Delete | `meetings` DELETE (admin only) |

## Attendance
| Action | Table |
|--------|-------|
| Check in | `attendance` UPSERT |
| Get for section | `attendance` SELECT |
| Get user's attendance | `attendance` SELECT by `user_id` |

## Voting
| Action | Table |
|--------|-------|
| Submit people vote | `votes_people` UPSERT |
| Submit motion vote | `votes_motions` UPSERT |
| Get people results | `votes_people` SELECT |
| Get motion results | `votes_motions` SELECT |

## Edge Functions (Optional)
- `POST /functions/v1/createMeeting` — Admin-only meeting creation with server-side auth
- `POST /functions/v1/submitVote` — Vote submission with validation
- `POST /functions/v1/attendanceCheck` — Attendance with timestamp logging