# MiraiVote Frontend

A modern, responsive, and feature-rich polling and voting application built with React and Vite. MiraiVote allows users to create, manage, and participate in interactive polls with real-time updates and detailed analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Build](#build)
- [Main Pages & Routes](#main-pages--routes)
- [Key Components](#key-components)
- [Services](#services)
- [Styling & Design](#styling--design)
- [Authentication](#authentication)
- [Real-time Features](#real-time-features)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Development Workflow](#development-workflow)
- [Best Practices](#best-practices)

## 🎯 Overview

MiraiVote is a full-stack polling application that enables users to:
- Create custom polls with multiple questions and options
- Share polls via public links
- Participate in real-time voting
- View detailed analytics and results
- Manage their poll dashboard
- Authenticate securely with email verification and password reset functionality

The frontend is a single-page application (SPA) built with React, featuring a modern UI with smooth animations and responsive design.

## ✨ Features

### Authentication
- **User Registration**: Create new accounts with email validation
- **Email Verification**: Secure email verification process
- **Login/Logout**: Secure authentication with JWT tokens
- **Password Reset**: Forgot password functionality with email verification
- **Protected Routes**: Secure routes requiring authentication

### Poll Management
- **Create Polls**: Build custom polls with multiple questions and options
- **Dashboard**: View all user-created polls
- **Real-time Updates**: Live updates when users participate in polls
- **Poll Sharing**: Generate public links for poll distribution
- **Poll Deletion**: Manage and remove polls

### Analytics & Insights
- **Results Visualization**: Charts and graphs showing poll results
- **Participation Stats**: Track number of participants
- **Response Distribution**: Visual representation of answer distributions
- **Detailed Analytics Page**: Comprehensive analytics for created polls

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for polished UI transitions
- **Toast Notifications**: Real-time feedback via React Hot Toast
- **Modern UI**: Gradient designs and modern styling with Tailwind CSS
- **Sidebar Navigation**: Easy access to main features

## 🛠 Tech Stack

### Core Framework
- **React 19.2.6** - JavaScript library for building user interfaces
- **React DOM 19.2.6** - React package for working with the DOM
- **React Router DOM 7.15.0** - Client-side routing and navigation

### Build Tool
- **Vite 8.0.12** - Next generation frontend build tool
- **@vitejs/plugin-react 6.0.1** - Fast Refresh plugin for React

### Styling
- **Tailwind CSS 4.3.0** - Utility-first CSS framework
- **@tailwindcss/vite 4.3.0** - Vite plugin for Tailwind CSS

### HTTP & Communication
- **Axios 1.16.0** - Promise-based HTTP client for API requests
- **Socket.io-client 4.8.3** - Real-time bidirectional communication

### UI & Animation
- **Framer Motion 12.38.0** - Animation library for React
- **Lucide React 1.14.0** - Beautiful & consistent icon library
- **React Hot Toast 2.6.0** - Notification toasts

### Data Visualization
- **Recharts 3.8.1** - Composable charting library built with React

### Development Tools
- **ESLint 10.3.0** - JavaScript linter
- **TypeScript Types** - Type definitions for React

### Package Manager
- **pnpm** - Fast, disk space efficient package manager

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Application entry point
│   ├── index.css                  # Global styles
│   ├── components/
│   │   ├── Layout.jsx             # Protected routes layout wrapper
│   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   └── auth/
│   │       └── AuthLayout.jsx     # Authentication pages layout
│   ├── context/
│   │   └── AuthContext.jsx        # Global authentication state management
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── auth/
│   │   │   ├── Login.jsx          # User login page
│   │   │   ├── Register.jsx       # User registration page
│   │   │   ├── VerifyEmail.jsx    # Email verification page
│   │   │   ├── VerifyNotice.jsx   # Email verification notice
│   │   │   ├── ForgotPassword.jsx # Password reset request page
│   │   │   ├── ForgotPasswordNotice.jsx  # Password reset notice
│   │   │   └── NewPassword.jsx    # New password setup page
│   │   └── poll/
│   │       ├── Dashboard.jsx      # User's poll dashboard
│   │       ├── CreatePoll.jsx     # Poll creation interface
│   │       ├── PollDetail.jsx     # Single poll details page
│   │       ├── Analytics.jsx      # Poll analytics and results
│   │       └── PublicPollPage.jsx # Public poll voting page
│   ├── router/
│   │   ├── router.jsx             # Route configuration
│   │   └── ProtectedRoute.jsx     # Route protection wrapper
│   ├── services/
│   │   ├── api.js                 # Axios instance configuration
│   │   ├── auth.service.js        # Authentication API calls
│   │   ├── poll.service.js        # Poll API calls
│   │   └── anonymous.js           # Anonymous API calls
│   └── socket/
│       └── socket.js              # Socket.io configuration
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── eslint.config.js               # ESLint configuration
├── vercel.json                    # Vercel deployment configuration
├── package.json                   # Project dependencies
├── pnpm-lock.yaml                 # Dependency lock file
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 16.x or higher
- **pnpm**: Version 8.x or higher (or npm/yarn as alternative)
- **Backend API**: The backend server should be running on `http://localhost:5000` (configurable)

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   Or if using npm:
   ```bash
   npm install
   ```

3. **Create environment configuration** (if needed):
   - Check `src/services/api.js` for API endpoint configuration
   - Default API URL: `http://localhost:5000/api`

### Development Server

Start the development server with hot module replacement (HMR):

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build

Create an optimized production build:

```bash
pnpm build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
pnpm preview
```

## 📄 Main Pages & Routes

### Public Routes (No Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.jsx` | Landing page with navigation and feature showcase |
| `/login` | `Login.jsx` | User login form |
| `/register` | `Register.jsx` | User registration form |
| `/verify-email/:token` | `VerifyEmail.jsx` | Email verification page |
| `/verify-notice` | `VerifyNotice.jsx` | Email verification notice |
| `/forgot-password` | `ForgotPassword.jsx` | Password reset request |
| `/forgot-password-notice` | `ForgotPasswordNotice.jsx` | Password reset notice |
| `/reset-password/:token` | `NewPassword.jsx` | New password creation |
| `/public/:pollId` | `PublicPollPage.jsx` | Public poll voting (shareable link) |

### Protected Routes (Authentication Required)

All protected routes are wrapped with the `Layout` component and require valid JWT token.

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | `Dashboard.jsx` | User's created polls dashboard |
| `/create` | `CreatePoll.jsx` | Create a new poll |
| `/poll/:id` | `PollDetail.jsx` | View specific poll details |
| `/analytics` | `Analytics.jsx` | View poll analytics and results |

## 🔧 Key Components

### App.jsx
- Root application component
- Wraps entire app with `AuthProvider` for state management
- Includes `Toaster` for notifications
- Sets up Router provider

### Layout.jsx
- Main layout wrapper for authenticated users
- Contains Sidebar navigation
- Routes for authenticated pages

### Sidebar.jsx
- Navigation component for authenticated users
- Links to Dashboard, Create Poll, and Analytics
- User profile/logout functionality

### AuthContext.jsx
- Global authentication state management
- Manages user login/logout
- Stores authentication tokens
- Provides auth state to all components

### AuthLayout.jsx
- Layout for authentication pages
- Consistent styling for login, register, and password reset pages

## 🔌 Services

### api.js
- Axios instance configuration
- Base URL setup for API calls
- Request/response interceptors for authentication

### auth.service.js
- User registration
- User login
- Email verification
- Password reset requests
- Password reset completion

### poll.service.js
- Create new polls
- Fetch polls (user's and all)
- Get poll details
- Get analytics data
- Delete polls
- Participate in polls

### anonymous.js
- Public API calls without authentication
- Participate in public polls

## 🎨 Styling & Design

### Tailwind CSS
- Utility-first CSS framework for responsive design
- Custom configurations in `tailwind.config.js`
- Mobile-first approach

### Design Features
- **Gradient backgrounds**: Purple and indigo gradients
- **Dark theme**: Modern dark UI with lighter text
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Fully responsive across all devices
- **Accessibility**: Semantic HTML and ARIA attributes

### Color Scheme
- **Primary**: Purple (#a855f7) and Indigo (#6366f1)
- **Background**: Dark gray (#0a0a14)
- **Text**: White and light gray tones
- **Accents**: Neon effects and gradient overlays

## 🔐 Authentication

### Flow
1. User registers with email and password
2. Verification email is sent
3. User verifies email via token link
4. User logs in with credentials
5. JWT token is stored in localStorage
6. Token is included in all protected API requests
7. Protected routes check for valid token

### Token Management
- JWT token stored in `localStorage`
- Token included in request headers via Axios interceptor
- Token validation on app initialization
- Auto-logout on token expiration

### Protected Routes
- `ProtectedRoute.jsx` component checks for valid authentication
- Redirects unauthenticated users to login page
- Wraps authenticated page layouts

## 📡 Real-time Features

### Socket.io Integration
- Real-time poll updates
- Live participant counts
- Instant result updates
- Socket connection in `socket/socket.js`

### Supported Events
- Poll participation updates
- Result changes
- New poll notifications
- User activity updates


### API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

#### Polls
- `GET /polls` - Get user's polls
- `POST /polls` - Create new poll
- `GET /polls/:id` - Get poll details
- `DELETE /polls/:id` - Delete poll
- `POST /polls/:id/participate` - Participate in poll
- `GET /polls/:id/analytics` - Get poll analytics
- `GET /public/polls/:id` - Get public poll

## 🔧 Environment Variables

Create a `.env` file in the frontend directory (if needed):

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Note**: Environment variables in Vite must start with `VITE_` to be exposed to the client.

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `pnpm dev` | Start development server with HMR |
| Build | `pnpm build` | Create optimized production build |
| Preview | `pnpm preview` | Preview production build locally |
| Lint | `pnpm lint` | Run ESLint to check code quality |

## 💻 Development Workflow

### Code Organization
- **Components**: Reusable UI components
- **Pages**: Full page components for routes
- **Services**: API call logic
- **Context**: Global state management
- **Router**: Route definitions and protections

### Best Practices
- Use functional components with hooks
- Separate API logic into services
- Use context for global state
- Keep components focused and reusable
- Use meaningful variable and function names

### Commit Conventions
- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused on single features/fixes

## 🐛 Troubleshooting

### Common Issues

**Development server not starting**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
pnpm dev
```

**API connection issues**
- Ensure backend server is running on correct port
- Check `src/services/api.js` for correct base URL
- Verify CORS settings on backend

**Authentication issues**
- Clear browser localStorage: `localStorage.clear()`
- Check that verification email token hasn't expired
- Ensure backend is sending correct JWT tokens

**Build errors**
- Clear Vite cache: `rm -rf dist .vite`
- Update dependencies: `pnpm update`
- Check for TypeScript errors

**Socket.io connection issues**
- Verify backend socket.io server is running
- Check socket endpoint in `src/socket/socket.js`
- Ensure no firewall blocking WebSocket connections


