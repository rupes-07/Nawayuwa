# Nawayuva Backend

A layered Node.js/Express REST API backed by Supabase (Postgres + Auth).

## Architecture

```
src/
├── config/        # env, Supabase client, optional raw Postgres pool
├── controllers/   # HTTP layer — parses req, calls services, shapes res
├── services/      # business logic, orchestrates repositories
├── repositories/  # data access layer — only place that talks to Supabase
├── routes/        # Express routers, one file per resource
├── middleware/     # auth guard, error handler, rate limiter, 404
├── validators/    # Joi schemas + validate() middleware factory
├── utils/         # ApiError, ApiResponse, asyncHandler, logger
├── constants/     # HTTP status codes, user-facing messages
├── types/         # JSDoc typedefs for editor intellisense
└── app.js         # Express app: middleware stack + route mounting
```

Request flow: `route -> validator -> controller -> service -> repository -> Supabase`.
Errors thrown anywhere in that chain are caught by `asyncHandler` and formatted
by `middleware/errorHandler.js`.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template and fill in your real values:
   ```bash
   cp .env.example .env
   ```
   You'll need a Supabase project URL, anon key, and service role key
   (Project Settings → API in the Supabase dashboard).

3. Create a `users` table in Supabase (id uuid PK matching `auth.users.id`,
   email, full_name, avatar_url, role, created_at, updated_at) — adjust
   `src/repositories/userRepository.js` if your schema differs.

4. Run in development (auto-restart on changes):
   ```bash
   npm run dev
   ```

5. Run in production:
   ```bash
   npm start
   ```

6. Run tests:
   ```bash
   npm test
   ```

## API overview

All routes are mounted under `API_PREFIX` (default `/api/v1`).

| Method | Endpoint            | Auth        | Description              |
|--------|----------------------|-------------|---------------------------|
| GET    | `/health`             | Public      | Health check              |
| POST   | `/auth/register`      | Public      | Create account            |
| POST   | `/auth/login`         | Public      | Log in, get tokens        |
| POST   | `/auth/refresh`       | Public      | Refresh access token      |
| POST   | `/auth/logout`        | Bearer token| Invalidate session         |
| GET    | `/auth/me`            | Bearer token| Current user profile      |
| GET    | `/users`              | Admin       | Paginated user list        |
| GET    | `/users/:id`          | Bearer token| Fetch a user by id         |
| PATCH  | `/users/:id`          | Bearer token| Update a user's profile    |
| DELETE | `/users/:id`          | Admin       | Delete a user              |

## Notes

- `src/config/supabase.js` exposes two clients: `supabaseAdmin` (service
  role, bypasses RLS — server-side only) and `supabasePublic` (anon key,
  respects RLS — used for the password login/refresh flows).
- `src/config/database.js` is optional and only activates if `DATABASE_URL`
  is set, for cases where you need raw SQL beyond what the Supabase client
  offers.
- Add new resources by following the existing `user` module as a template:
  a repository, a service, a controller, a validator, and a route file
  mounted in `src/routes/index.js`.
