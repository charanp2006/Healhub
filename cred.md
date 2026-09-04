# HealHub — Dummy Login Credentials

Demo credentials for local development. These match the values seeded by
`apps/api/scripts/seed.ts` and the API env (`apps/api/.env`).

## Roles & Where to Log In

| Role | App | Base URL | Login endpoint |
|------|-----|----------|----------------|
| Admin | `apps/admin` | http://localhost:3002 | `/api/admin/login` |
| Doctor | `apps/hospital` (Clinic) | http://localhost:3001 | `/api/doctor/login` |
| Hospital | `apps/hospital` (Clinic) | http://localhost:3001 | `/api/hospital/login` |
| Patient | `apps/web` | http://localhost:3000 | `/api/user/login` |

Note: The Clinic app (`apps/hospital`) serves **both** the Hospital and Doctor
roles. The Admin app (`apps/admin`) is Admin-only.

## Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@healhub.com` | `Admin@123` |
| **Doctor** | `doctor@healhub.com` | `Doctor@123` |
| **Hospital** | `hospital@healhub.com` | `Hospital@123` |
| **Patient** | `demo@healhub.com` | `Demo@123` |

## Notes

- **Admin** has no database record. It is driven purely by the API env vars
  `ADMIN_EMAIL` / `ADMIN_PW` in `apps/api/.env` (falls back to
  `admin@healhub.com` / `Admin@123`).
- **Patient / Doctor / Hospital** are created/stored in MongoDB by the seed
  script. Run seeding with:

  ```bash
  npm run seed --workspace=api
  ```

  The hospital account is marked `isRegistered: true` (required to log in).
- To seed or run the API, MongoDB must be reachable first (see
  `apps/api/lib/db.ts` SRV resolution).
