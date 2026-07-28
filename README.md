# MiraiVote

MiraiVote is a modern polling and live voting platform built with a React frontend, Express/MongoDB backend, Clerk authentication, and real-time Socket.IO updates. It enables authenticated creators to build polls, share public poll links, and track live responses and analytics.

## Project Overview

MiraiVote is designed to help creators launch engaging polls with clear question flows, public participation, and real-time result tracking.

It supports:
- authenticated poll creation and private management for creators
- public voting through shareable poll slugs
- both authenticated and anonymous participation modes
- live result updates via WebSockets
- analytics dashboards to monitor responses and engagement
- Clerk authentication and user synchronization for secure access

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 | UI rendering and component-based application structure |
| Frontend | Vite | fast development server and optimized build |
| Frontend | Tailwind CSS | styling and responsive layout |
| Frontend | Clerk React | authentication and session management |
| Frontend | Socket.IO client | live poll updates |
| Backend | Node.js + Express | API server and routing |
| Backend | MongoDB + Mongoose | document persistence and data modeling |
| Backend | Clerk backend | Clerk user sync and secure auth support |
| Backend | Socket.IO server | real-time poll event delivery |
| Backend | Zod | request validation |
| Backend | cors, cookie-parser | CORS and cookie handling |

## Project Structure

- `frontend/` - React application and public UI
- `backend/` - Express API, database models, and realtime socket server
- `backend/src/models/` - Mongoose schemas for Poll, Question, Option, Participant, Answer, and User
- `backend/src/routes/` - API routes for polls and user sync
- `backend/src/services/` - business logic and interaction with the database
- `backend/src/controllers/` - request handlers
- `backend/src/config/db.js` - MongoDB connection logic
- `frontend/src/routes/router.jsx` - application routing

## Getting Started

### 1. Clone repository

```bash
git clone <repo-url> miraivote
cd miraivote
```

### 2. Install dependencies

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

### 3. Configure environment variables

#### Backend `.env`

Create `backend/.env` with:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.example.com/db_name
PORT=8000
CLIENT_URL=http://localhost:5173
CLERK_SECRET_KEY=clerk_secret_key_here
NODE_ENV=development
```

- `MONGO_URI` is your MongoDB connection string.
- `PORT` is the port the backend server listens on.
- `CLIENT_URL` is the frontend origin allowed by CORS.
- `CLERK_SECRET_KEY` is your Clerk server secret key.
- `NODE_ENV` can be `development` or `production`.

#### Frontend `.env`

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=clerk_publishable_key_here
```

- `VITE_API_URL` points to the backend API base URL.
- `VITE_CLERK_PUBLISHABLE_KEY` is required by Clerk on the frontend.

### 4. Run the backend

```bash
cd backend
pnpm run dev
```

### 5. Run the frontend

```bash
cd frontend
pnpm run dev
```

Then open the Vite URL, usually `http://localhost:5173`.

## Core Features

- Creator dashboard: authenticated users can create, edit, and manage polls with multiple questions and answer options.
- Public voting: share a poll slug link that allows participants to respond without signing in when anonymous mode is enabled.
- Authentication support: Clerk handles sign-up, sign-in, and secure user sessions for protected poll management.
- Real-time voting: Socket.IO broadcasts live vote counts to users viewing the same poll and analytics screens.
- Response tracking: participants are recorded as authenticated users or anonymous identifiers to prevent duplicates.
- Analytics and insights: creators can view poll statistics, vote distribution, and participation rates on dedicated analytics pages.
- User synchronization: backend syncs Clerk users into MongoDB so user profiles are available and linked to created polls.

## API Endpoints

### Poll endpoints
- `POST /api/poll` - create a new poll
- `GET /api/poll` - fetch all polls
- `PATCH /api/poll/:pollId` - update poll data
- `GET /api/poll/:id` - retrieve a poll by ID
- `DELETE /api/poll/:id` - delete a poll
- `GET /api/poll/:pollId/analytics` - retrieve analytics for a poll
- `GET /api/poll/public/:slug` - fetch public poll data by slug
- `POST /api/poll/:slug/submit` - submit a poll response

### User endpoint
- `POST /api/user/sync` - sync authenticated Clerk users into the local database


## Real-Time Features

- Backend initializes a Socket.IO server in `backend/server.js`
- Clients join rooms by `pollId`
- The app pushes live updates to everyone viewing the same poll
- Real-time updates are used on public poll pages and analytics views

## Deployment Notes

- Update `CLIENT_URL` and `VITE_API_URL` for production domains.
- Use a production MongoDB cluster and secure your Clerk keys.
- Configure CORS origins in `backend/src/app.js` if deploying to a custom host.

## Notes

- The frontend uses Clerk for authentication and syncs user profiles to MongoDB via `/api/user/sync`.
- Poll creation and analytics are available only for authenticated users.
- Public polls are accessible with a slug and support live voting.

## Quick Start

1. `cd backend && pnpm install`
2. `cd frontend && pnpm install`
3. Create `.env` files for backend and frontend
4. `cd backend && pnpm run dev`
5. `cd frontend && pnpm run dev`

Enjoy building and using MiraiVote!
