# Database Schema

## Tables

### `users`
Mirrors `auth.users` with additional profile fields. Auto-populated via trigger on signup.
- `id` — UUID (FK to auth.users)
- `email` — unique
- `full_name` — display name
- `role` — `admin` | `member`

### `meetings`
- `id`, `title`, `description`, `scheduled_at`, `location`, `status`, `created_by`

### `sections`
- Belongs to a meeting. `type`: `attendance`, `election`, `motion`, `general`

### `attendance`
- One record per user per section per meeting. Unique constraint enforces no double check-in.

### `candidates`
- Belongs to a section of type `election`.

### `motions`
- Belongs to a section of type `motion`.

### `votes_people`
- A user's vote in an election section. Either `candidate_id` or `manual_name` must be set.

### `votes_motions`
- A user's vote on a specific motion. `vote`: `yes` | `no` | `abstain`. Optional `comment`.

## Security
All tables use Row Level Security (RLS). Admins have full read access to all tables.
Members can only view/insert their own records.