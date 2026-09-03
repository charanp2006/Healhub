# 🏥 HealHub — Hospital Management & Healthcare Booking Platform

> **Healhub** is a modern, all-in-one healthcare platform that connects **patients**, **doctors**, **hospitals/clinics**, and **administrators** — think of it as the "Uber for healthcare."

This repository is the **Next.js-based monorepo** rebuild of Healhub (previously a MERN app in `hospital-managment-website`).

---

## 🚀 Tech Stack (Final Decided)

### Frontend — all apps (web / admin / hospital)
- **Next.js 14+** (App Router — SSR/SSG/API routes)
- **TypeScript** — type safety end-to-end
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — prebuilt accessible components
- **Framer Motion** — animations
- **Lenis** — smooth scrolling
- **React Hook Form** + **Zod** — forms & validation
- **TanStack Query** — server-state
- **Zustand** — client state
- **Axios** — HTTP client

### Backend
- **Node.js** (LTS) — runtime
- **Next.js API routes** — primary REST API (auth, CRUD, billing)
- **FastAPI** *(added later)* — AI/ML features only
- **Mongoose** — ODM
- **Zod** — validation

### Database
- **MongoDB** — primary NoSQL database
- **Firebase Firestore** *(optional)* — real-time / serverless sync & auth

### Extras
- **Razorpay** — payment gateway (India)
- **Cloudinary** — image storage & optimization
- **Auth.js / Firebase Auth** — authentication with 4-role RBAC (admin, doctor, hospital, patient)
- **Monorepo** — Turborepo + pnpm workspaces

---

## 🗂️ Monorepo Structure

```
healhub/
├── apps/
│   ├── web/            # Patient-facing website (Next.js)
│   ├── admin/          # Admin CMS panel (Next.js)
│   ├── hospital/       # Hospital/Clinic panel (Next.js)
│   └── ml-api/         # FastAPI (added later — AI/ML only)
├── packages/
│   ├── ui/             # Shared shadcn/ui components
│   ├── types/          # Shared TypeScript types
│   └── config/         # Shared eslint / tsconfig / tailwind presets
├── package.json        # Workspace root
├── turbo.json          # Turborepo config
├── pnpm-workspace.yaml
└── PROJECT_ARCHITECTURE.md   # Full architecture guide & decision log
```

> 📖 **See [`PROJECT_ARCHITECTURE.md`](./PROJECT_ARCHITECTURE.md)** for the complete stack comparison, structure decisions, deployment options, and backend framework analysis.

---

## 🎯 The Platforms

| Website | Users | Purpose |
|---------|-------|---------|
| **web** | Patients | Discover doctors/hospitals, book appointments, pay, view prescriptions |
| **admin** | Platform admins | User management, content moderation, analytics, billing |
| **hospital** | Hospitals/Clinics | Manage doctors, rooms/beds, patients, revenue |
| **ml-api** | (internal) | AI/ML — doctor recommendation, symptom analysis, later |

---

## 🧱 Architecture: Hybrid Backend

```
web / admin / hospital  →  Next.js API routes  (auth, CRUD, billing, DB)
                                │
                                │  internal HTTP call
                                ▼
                     FastAPI (AI/ML only)  ← added later
```

- Start with **Next.js only** — everything REST/CRUD lives there.
- Add **FastAPI** when real ML ships.
- **Never expose FastAPI** to the public — only Next.js talks to it.

---

## 🔐 Roles & Authentication

Four roles with role-based access control (RBAC):

| Role | Token / Access |
|------|----------------|
| Patient | Web app access |
| Doctor | Doctor panel |
| Hospital | Hospital panel |
| Admin | Admin CMS |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm (or npm/yarn)
- MongoDB (local or Mongo Atlas)
- Firebase project *(optional)*
- Razorpay account *(for payments)*
- Cloudinary account *(for images)*

### 1. Install & setup Monorepo

```bash
# (from repo root)
pnpm install
```

### 2. Create the apps

```bash
# Create Next.js apps (web, admin, hospital)
pnpm create next-app apps/web    --typescript --tailwind --app
pnpm create next-app apps/admin  --typescript --tailwind --app
pnpm create next-app apps/hospital --typescript --tailwind --app

# Add shared packages
mkdir -p packages/ui packages/types packages/config
```

### 3. Environment variables

Each app needs its own `.env.local`:

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_RAZORPAY_KEY=your_key
```

```env
# Backend / API (Next.js routes)
MONGODB_URI=mongodb://localhost:27017/healhub
JWT_SECRET=your_secret
CLOUDINARY_URL=your_url
```

### 4. Run the dev servers

```bash
# Run all apps in parallel
pnpm turbo dev

# Run a single app
pnpm turbo dev --filter=web
```

---

## 🗓️ Roadmap

- [x] Define architecture & tech stack (monorepo, Next.js, Tailwind, shadcn/ui, MongoDB)
- [ ] Scaffold monorepo with Turborepo + pnpm
- [ ] Build **web** (patient: discover, book, pay, prescriptions)
- [ ] Build **admin** CMS (users, content, analytics)
- [ ] Build **hospital** panel (doctors, rooms/beds, revenue)
- [ ] Razorpay payments
- [ ] Cloudinary image uploads
- [ ] 4-role RBAC auth
- [ ] Firebase real-time sync *(optional)*
- [ ] **FastAPI + AI/ML** (doctor recommendation, symptom analysis)

---

## 📚 Docs

- `PROJECT_ARCHITECTURE.md` — full architecture, stack comparison & decision log
- `CLAUDE.md` / `AGENTS.md` — agent/editor notes

---

## 📄 License

MIT — see `LICENSE`.
