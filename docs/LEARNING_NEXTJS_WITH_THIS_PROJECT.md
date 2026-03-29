# Learning Next.js with JobTracker

This document explains how this codebase maps to **Next.js App Router** concepts and to the **project proposal** (MongoDB, JWT, dashboards, etc.). Read it alongside the code.

## 1. App Router: folders vs URLs

- The `app/` directory defines routes. Parentheses like `(dashboard)` are **route groups**: they organize files **without** changing the URL. So `app/(dashboard)/employer/dashboard/page.tsx` is served at **`/employer/dashboard`**, not `/dashboard/employer/...`.
- **`page.tsx`** = the UI for a route. **`layout.tsx`** = shared shell (sidebar, header). **`route.ts`** inside `app/api/...` = HTTP API (Route Handlers).

## 2. Server vs client components

- By default, components in `app/` are **Server Components** (no `use client`). They can read the database directly but cannot use hooks like `useState` or browser APIs.
- Add **`"use client"`** at the top of files that need interactivity (`useState`, `onClick`, `useAuth`, browser `fetch` with cookies from the browser, etc.).
- **Pattern used here:** pages that only compose UI can stay server components; interactive pieces (forms, tables with modals) are client components.

## 3. Authentication: JWT in httpOnly cookies

- **Proposal:** JWT for auth. **Implementation:** After login/register, the Route Handler (`app/api/auth/login`, `register`) sets an **httpOnly** cookie named `token`. JavaScript on the page cannot read it, which reduces XSS risk compared to storing tokens in `localStorage`.
- **`AuthContext`** calls **`GET /api/auth/me`** with `credentials: "include"` so the browser sends the cookie. The server verifies the JWT and returns user JSON.
- **`middleware.ts`** runs on the Edge for paths under `/employer/*` and `/worker/*`. It verifies the JWT with **`jose`** (Edge-compatible). Invalid/missing token → redirect to `/login`.

## 4. MongoDB + Mongoose

- **`lib/mongodb.ts`** connects with Mongoose and caches the connection on `global` so serverless “cold starts” do not open hundreds of connections.
- **Models** in `models/` match the proposal collections (Users, Workers, Projects, Tasks, Attendance, Payments).
- **API routes** (e.g. `app/api/workers/route.ts`) call `connectDB()`, then query with the logged-in **employer** id from the JWT (`auth.sub`), so one employer cannot edit another’s data.

## 5. Route Handlers (`app/api/.../route.ts`)

- Export **`GET`**, **`POST`**, **`PATCH`**, **`DELETE`** as named functions. They receive `NextRequest` and return `NextResponse.json(...)`.
- Password hashing uses **bcrypt** in Node Route Handlers only (not in Edge middleware).

## 6. Real-time (SSE)

- **`app/api/realtime/notifications/route.ts`** is a minimal **Server-Sent Events** stream. The proposal also mentioned WebSockets; SSE is simpler for one-way server→client pushes. You can later add Redis pub/sub or a dedicated WS service.

## 7. UI vs proposal checklist

| Topic | Where to look |
|--------|----------------|
| Landing nav (Features, About, Contact) | `components/Navbar.tsx`, `app/page.tsx` section `id`s |
| Employer sidebar + Settings | `components/layout/EmployerSidebar.tsx` |
| Worker sidebar + Profile | `components/layout/WorkerSidebar.tsx` |
| Task status colors (Pending / In Progress / Completed) | `app/(dashboard)/employer/tasks/components/TaskTable.tsx` |
| Employer dashboard payment chart | `app/(dashboard)/employer/dashboard/page.tsx` |
| Worker check-in / GPS | `app/(dashboard)/worker/dashboard/page.tsx`, `app/api/worker/check-in/route.ts` |
| Worker profile + history modal | `app/(dashboard)/employer/workers/components/WorkerTable.tsx`, `GET /api/workers/[id]` |
| Reports CSV / Print PDF | `app/(dashboard)/employer/reports/page.tsx` |

## 8. Local setup

1. Copy **`.env.example`** → **`.env.local`** and set `MONGODB_URI` and `JWT_SECRET` (32+ characters).
2. Run MongoDB locally or use Atlas.
3. `npm run dev` → register an employer account, then add workers (with the **same email** as a worker user if you want the roster linked to a login).

## 9. What you could add next

- **Forgot password** flow (tokens + email).
- **Progress photos** (upload to S3 or local storage, URLs in Task/Attendance).
- **Worker ratings** updates from completed jobs (already have `reputation` on Worker).
- **“Smart matching”** from the proposal: scoring workers by skill + reputation (algorithm + API).

This project is structured so you can grow from **UI + mock data** toward a **full product** without throwing away the Next.js layout you already built.
