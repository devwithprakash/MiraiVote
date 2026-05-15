# MiraiVote Backend

A robust Node.js and Express.js API server for the MiraiVote polling application. This backend provides comprehensive endpoints for user authentication, poll management, analytics, and real-time updates via Socket.io.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Polls](#poll-endpoints)
- [Database Schema](#database-schema)
  - [User Model](#user-model)
  - [Poll Model](#poll-model)
  - [Question Model](#question-model)
  - [Option Model](#option-model)
  - [Answer Model](#answer-model)
  - [Participant Model](#participant-model)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Authentication & Security](#authentication--security)
- [Real-time Features](#real-time-features)
- [Services](#services)
- [Email Configuration](#email-configuration)
- [Scripts](#scripts)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

MiraiVote Backend is a production-ready REST API built with Express.js and MongoDB. It handles:

- User authentication with JWT tokens
- Poll creation and management
- Question and option management
- Real-time poll updates via Socket.io
- Email notifications for verification and password reset
- Detailed poll analytics and results
- Public and private poll support

## ✨ Features

### Authentication & Security

- **User Registration**: Sign up with email and password
- **Email Verification**: Secure email verification with token expiration
- **Login/Logout**: JWT-based authentication
- **Password Reset**: Forgot password with email verification
- **Token Refresh**: Refresh token mechanism for session management
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Zod schema validation for all requests

### Poll Management

- **Create Polls**: Build custom polls with multiple questions and options
- **Fetch Polls**: Get user's polls or specific poll details
- **Delete Polls**: Remove polls (creator only)
- **Public Sharing**: Generate shareable tokens for polls
- **Expiration Handling**: Automatic poll expiration management

### Results & Analytics

- **Real-time Results**: Submit answers and get instant feedback
- **Analytics Endpoint**: Detailed poll statistics and analysis
- **Response Tracking**: Track participants and their responses
- **Result Aggregation**: Compile poll results with participation data

### Real-time Communication

- **Socket.io Integration**: Real-time poll updates
- **Room Management**: Poll-specific rooms for targeted updates
- **Event Broadcasting**: Notify all participants of changes

## 🛠 Tech Stack

### Runtime & Framework

- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web application framework
- **Socket.io 4.8.3** - Real-time bidirectional communication

### Database

- **MongoDB** - NoSQL database
- **Mongoose 9.6.2** - MongoDB object modeling

### Authentication & Security

- **jsonwebtoken 9.0.3** - JWT token generation and verification
- **bcryptjs 3.0.3** - Password hashing and validation

### Email

- **nodemailer 8.0.7** - Email sending service

### Utilities & Middleware

- **cors 2.8.6** - Cross-Origin Resource Sharing
- **cookie-parser 1.4.7** - HTTP Cookie parsing
- **dotenv 17.4.2** - Environment variable management
- **zod 4.4.3** - Schema validation library

### Development Tools

- **nodemon 3.1.14** - Auto-restart server on file changes

### Package Manager

- **pnpm** - Fast, disk space efficient package manager

## 📁 Project Structure

```
backend/
├── server.js                      # Server entry point with Socket.io setup
├── src/
│   ├── app.js                     # Express app configuration
│   ├── config/
│   │   ├── db.js                  # MongoDB connection setup
│   │   └── email.js               # Email configuration (Nodemailer)
│   ├── controllers/
│   │   ├── user.controller.js     # User authentication logic
│   │   └── poll.controller.js     # Poll CRUD operations
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification (required auth)
│   │   ├── auth-optional.middleware.js  # Optional authentication
│   │   ├── error.middleware.js    # Global error handling
│   │   └── validate.middleware.js # Zod schema validation
│   ├── models/
│   │   ├── user.model.js          # User schema and model
│   │   ├── poll.model.js          # Poll schema and model
│   │   ├── question.model.js      # Poll question schema
│   │   ├── option.model.js        # Answer option schema
│   │   ├── answer.model.js        # User answer schema
│   │   └── participant.model.js   # Poll participant tracking
│   ├── routes/
│   │   ├── user.route.js          # User authentication routes
│   │   └── poll.route.js          # Poll management routes
│   ├── schemas/
│   │   ├── user.schema.js         # User validation schemas (Zod)
│   │   └── poll.schema.js         # Poll validation schemas (Zod)
│   ├── services/
│   │   ├── user.service.js        # User business logic
│   │   └── poll.service.js        # Poll business logic
│   └── utils/
│       ├── api-error.js           # Custom error class
│       ├── api-response.js        # Standard response formatter
│       └── jwt.utils.js           # JWT utility functions
├── package.json                   # Project dependencies
├── pnpm-lock.yaml                 # Dependency lock file
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 16.x or higher
- **pnpm**: Version 8.x or higher (or npm/yarn)
- **MongoDB**: Local or cloud instance (MongoDB Atlas recommended)
- **Email Service**: SMTP credentials (Gmail, SendGrid, etc.)

### Installation

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   Or with npm:
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env` file in the backend root directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/miraivote
# Or MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/miraivote

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
SENDER_EMAIL=noreply@miraivote.com
SENDER_NAME=MiraiVote

# Frontend URLs (for email links)
FRONTEND_URL=http://localhost:5173
PRODUCTION_URL=https://miraivote.vercel.app

# API Base URLs
API_BASE_URL=http://localhost:5000/api
```

**For Gmail SMTP**:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password (not your regular password)
3. Use the App Password in `SMTP_PASS`

### Database Setup

MongoDB will automatically create the database and collections when the server starts. No manual setup is required if using MongoDB Atlas.

### Running the Server

**Development mode** (with hot reload):

```bash
pnpm dev
```

**Production mode**:

```bash
pnpm start
```

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required, min: 2),
  email: String (required, unique, lowercase),
  password: String (required, min: 8, hashed),
  refreshToken: String,
  isVerified: Boolean (default: false),
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Poll Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  mode: String (enum: ["auth", "anonymous"], default: "auth"),
  shareToken: String (unique, required),
  expireAt: Date (required),
  creatorId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Question Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  type: String (enum: ["single", "multiple"], default: "single"),
  pollId: ObjectId (ref: Poll, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Option Model

```javascript
{
  _id: ObjectId,
  text: String (required),
  questionId: ObjectId (ref: Question, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Answer Model

```javascript
{
  _id: ObjectId,
  questionId: ObjectId (ref: Question, required),
  selectedOptionId: ObjectId (ref: Option, required),
  participantId: ObjectId (ref: Participant, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Participant Model

```javascript
{
  _id: ObjectId,
  pollId: ObjectId (ref: Poll, required),
  userId: ObjectId (ref: User, nullable),
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Middleware

### auth.middleware.js

- Verifies JWT token from Authorization header
- Extracts user information from token
- Required for protected routes
- Returns 401 if token is invalid or missing

### auth-optional.middleware.js

- Attempts to verify JWT token
- Allows requests without token
- Sets user info if token is valid
- Used for public polls (authenticated or anonymous)

### validate.middleware.js

- Validates request body/query against Zod schemas
- Returns 400 if validation fails
- Provides detailed error messages

### error.middleware.js

- Global error handling
- Standardizes error responses
- Logs errors for debugging
- Returns appropriate HTTP status codes

## 🛡️ Authentication & Security

### JWT Implementation

- **Access Token**: Short-lived (7 days by default)
- **Refresh Token**: Long-lived (30 days by default)
- **Token Refresh**: Endpoint to get new access token

### Password Security

- Passwords hashed with bcryptjs (salt rounds: 10)
- Passwords not returned in queries (select: false)
- Password reset uses temporary token with expiration

### CORS Configuration

- Allowed origins: Frontend URL and Vercel deployment
- Credentials: Allowed
- Methods: GET, POST, PUT, DELETE, OPTIONS

### Input Validation

- All inputs validated with Zod schemas
- Email format validation
- Password strength requirements (min 8 characters)
- Name length validation (min 2 characters)

## 📡 Real-time Features

### Socket.io Integration

**Connection Setup**:

```javascript
const socket = io("http://localhost:5000", {
  path: "/socket.io",
});
```

**Available Events**:

**Join Poll Room**:

```javascript
socket.emit("join_poll", pollId);
```

**Poll Update**:

```javascript
socket.on("poll_updated", (data) => {
  // Handle poll update
});
```

**Disconnect**:

```javascript
socket.on("disconnect", () => {
  // Handle disconnection
});
```

### Broadcasting

- When poll results update, all connected clients in that poll's room are notified
- Socket rooms named as `poll:{pollId}`
- Automatic cleanup on disconnection

## 🔄 Services

### user.service.js

- User registration and validation
- Email verification logic
- Password reset flow
- Token generation and management
- User data retrieval

### poll.service.js

- Poll CRUD operations
- Question and option management
- Poll result calculation
- Analytics data aggregation
- Participant tracking

## 📧 Email Configuration

### Supported Providers

- **Gmail** (recommended for development)
- **SendGrid**
- **AWS SES**
- Any SMTP-compatible service

### Email Templates

- **Verification Email**: Welcome + verification link
- **Password Reset Email**: Password reset link with expiration
- **Notification Emails**: Poll notifications and updates

### Setup Steps

1. Configure SMTP credentials in `.env`
2. Update `FRONTEND_URL` for email links
3. Test email sending in development

## 📜 Scripts

| Script      | Command      | Description                    |
| ----------- | ------------ | ------------------------------ |
| Start       | `pnpm start` | Run server in production       |
| Development | `pnpm dev`   | Run with nodemon (auto-reload) |

## 💻 Development Workflow

### Code Organization

- **Controllers**: Route handlers and request processing
- **Services**: Business logic and database operations
- **Middleware**: Request processing and validation
- **Models**: Mongoose schemas and database structure
- **Routes**: API endpoint definitions
- **Utils**: Helper functions and utilities

### Best Practices

- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all inputs with Zod
- Use meaningful variable and function names
- Keep controllers thin, logic in services
- Use middleware for cross-cutting concerns

### Error Handling

- Custom `ApiError` class for consistency
- Try-catch blocks in async functions
- Error middleware for global handling
- Proper HTTP status codes

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

1. Go to project settings
2. Add all `.env` variables in Environment Variables section
3. Redeploy after adding variables

### MongoDB Atlas Setup

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to `MONGO_URI` environment variable
4. Add IP whitelist (allow all for development)

### CORS Configuration for Deployment

Update `app.js` with production URLs:

```javascript
cors({
  origin: [
    "https://miraivote.vercel.app",
    "http://localhost:5173",
    "your-production-url",
  ],
  credentials: true,
});
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/dbname

# Common issues:
# - Wrong password
# - IP not whitelisted in MongoDB Atlas
# - Invalid connection string format
```

### Email Not Sending

- Verify SMTP credentials
- Check firewall/antivirus blocking SMTP port (587)
- Enable "Less secure apps" for Gmail (if using)
- Use Gmail App Password (not regular password)

### CORS Errors

- Ensure frontend URL is in allowed origins
- Check `credentials: true` is set
- Verify request includes proper headers

### Token Expiration Issues

- Check JWT_SECRET and REFRESH_TOKEN_SECRET
- Verify token expiration times in `.env`
- Ensure client stores and uses refresh token

### Socket.io Connection Issues

- Verify Socket.io path: `/socket.io`
- Check CORS configuration matches
- Ensure WebSocket is not blocked by firewall
