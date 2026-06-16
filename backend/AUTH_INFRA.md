# Authentication & Infrastructure Notes

This document explains the main libraries, middleware, and design choices used in the backend authentication and infra. It's written in simple language and shows how things work together.

## High-level auth design
- We issue a JWT on successful login and also create a server-side session (Redis-backed). This gives two ways to authenticate:
  - API clients can use the JWT in the `Authorization: Bearer <token>` header.
  - Browsers can use the session cookie (managed by `express-session` + Redis store).

Why keep both? JWTs are stateless and convenient for mobile/third-party clients. Sessions (cookies) are easier to invalidate server-side and work with browser flows. We left JWTs intact for backward compatibility.

Important behavior:
- Login returns a JWT and sets `req.session.user` on the server.
- `authMiddleware` first checks `req.session.user`; if not present, it falls back to the Bearer JWT in `Authorization` header.
- `POST /api/auth/logout` destroys the server session and clears the cookie, but it does NOT revoke already-issued JWTs. To revoke JWTs you need a blacklist or token-version mechanism.

## Libraries and why we use them

- `bcryptjs`
  - Purpose: hashing user passwords before storing in DB.
  - Why: it's a slow hashing function built for password security. We store only the hash so raw passwords are never saved.
  - How used: on registration we `hash(password)`; on login we `compare(plaintext, hash)`.

- `jsonwebtoken` (JWT)
  - Purpose: issue signed tokens that prove a user's identity without server-side lookup.
  - Why: useful for stateless API authentication (mobile apps, third-party clients).
  - How used: on login we `jwt.sign({ id, role }, JWT_SECRET, { expiresIn })`; on API calls we `jwt.verify(token, JWT_SECRET)` if session is absent.

- `express-session` + `connect-redis` + `redis`
  - Purpose: server-side session storage and cookie support.
  - Why: server sessions let you easily invalidate a user's session (logout), store small session data, and work well for browser apps.
  - How used: session middleware is mounted in `server.js` and stores sessions in Redis. On login we set `req.session.user`.

- `express-rate-limit`
  - Purpose: limit requests per IP to reduce abuse (DDOS, brute force).
  - Why: basic protection for endpoints, especially auth endpoints.
  - How used: a global limiter (15 min window, 100 requests per IP). For production-scale apps consider a Redis-backed limiter for multi-instance setups.

- `cors`
  - Purpose: configure which origins can call the API from browsers.
  - Why: required when frontend and backend run on different origins (ports/domains).
  - How used: `server.js` configures allowed origins and allows credentials (cookies).

- `dotenv`
  - Purpose: load environment variables from `.env` during development.
  - Why: keeps secrets and environment-specific settings out of source code.

- `mongoose`
  - Purpose: ORM for MongoDB.
  - Why: maps JS objects to MongoDB documents and simplifies DB operations.

- `multer`, `multer-storage-cloudinary`, `cloudinary`
  - Purpose: file upload handling and storing files in Cloudinary.
  - Why: handle image/document uploads from clients and host them reliably.

- `stripe`
  - Purpose: payment processing (checkout sessions, charges).
  - Why: integrate card payments and checkout flows.

- `express` / `body-parser`
  - Purpose: web server, request parsing.

## Security notes & recommendations
- Passwords: always use `bcrypt` (we do). Store only hashes.
- JWT revocation: logout destroys session but not JWT. If you need immediate JWT invalidation, implement a token blacklist or include a `tokenVersion` in user records and check it during `jwt.verify` step.
- Session cookies: in `production` we set `cookie.secure = true` so cookies are sent only over HTTPS. Keep `httpOnly: true` to prevent JS access.
- Rate limiter: use a Redis-backed store in production if you run multiple server instances.

## How logout works here
- Client calls `POST /api/auth/logout`.
- Server calls `req.session.destroy()` and clears the cookie `connect.sid`.
- After that, browser cookie-based auth is gone; JWT-based clients remain valid until their token expires.

## How to run Redis locally (quick)
- Option 1: install Redis on Windows via WSL (Ubuntu). Then `sudo apt install redis-server` and `sudo systemctl start redis`.
- Option 2: use a hosted Redis (Upstash, Redis Cloud) and set `REDIS_URL` in `.env`.

## Summary: why each piece matters (one-liners)
- `bcryptjs`: secure password hashing.
- `jsonwebtoken`: stateless tokens for APIs.
- `express-session` + `connect-redis`: server sessions with persistence and logout ability.
- `express-rate-limit`: basic abuse protection.
- `cors`: allow frontend to call backend safely.

---
If you want this file moved to a different location or expanded with code snippets and examples (logout curl examples, token blacklist pattern, or Redis-backed rate limiter), tell me which parts to expand.
