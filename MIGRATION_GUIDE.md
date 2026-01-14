# CropSync Kiosk: Supabase to MySQL Migration Guide

## Overview

This document describes the migration from Supabase backend to MySQL database for the CropSync Kiosk application. The initial migration focuses on **user authentication** using the `users` table.

## What Changed

### 1. New Backend API (FastAPI + MySQL)

A new Python FastAPI backend has been added in the `backend/` directory:

```
backend/
├── main.py           # FastAPI application with auth endpoints
├── requirements.txt  # Python dependencies
├── .env.example      # Environment variables template
└── README.md         # Backend documentation
```

### 2. Frontend API Service

A new API service replaces the Supabase client:

- **File**: `src/lib/api.js`
- **Purpose**: HTTP client for communicating with the MySQL backend
- **Features**:
  - JWT token management
  - Login/logout functionality
  - Session persistence via localStorage

### 3. Updated Authentication Flow

| Component | Before (Supabase) | After (MySQL) |
|-----------|-------------------|---------------|
| Login Field | `login_pin` from `farmers` table | `user_id` from `users` table |
| Auth Method | Supabase Auth SDK | JWT tokens via REST API |
| Session Storage | Supabase session | localStorage + JWT |
| Backend | Supabase Cloud | Self-hosted FastAPI |

### 4. Files Modified

- `src/store/slices/authSlice.js` - Uses new API service
- `src/pages/LoginPage.jsx` - Uses MySQL API for login
- `src/pages/Login.jsx` - Uses MySQL API for login
- `.env.example` - New API URL configuration
- `.gitignore` - Added backend-related ignores

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure `.env` with your MySQL credentials:
   ```env
   DB_HOST=your_mysql_host
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=u511597003_kiosk
   JWT_SECRET=your-secure-secret-key
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Create `.env` file in the project root:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

## Database Schema

The `users` table structure used for authentication:

```sql
CREATE TABLE `users` (
  `user_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `client_code` varchar(50) DEFAULT NULL,
  `mandal` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `card_uid` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);
```

## API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login with user_id |
| `/api/auth/login-by-card` | POST | Login with NFC card UID |
| `/api/auth/verify-token` | POST | Verify JWT token validity |

### Users

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/{user_id}` | GET | Get user details |

## Testing Login

You can test login with any `user_id` from the database, for example:
- `123456` - Laxma Reddy
- `213001` - Gundagoni lingaiah
- `950218` - Belli Yogi

## Remaining Supabase Dependencies

The following slices still use Supabase and will need migration in future updates:

- `src/store/slices/cropAdvisorySlice.js`
- `src/store/slices/cropSlice.js`
- `src/store/slices/droneSlice.js`
- `src/store/slices/marketSlice.js`
- `src/store/slices/productsSlice.js`
- `src/store/slices/seedsSlice.js`
- `src/store/slices/weatherSlice.js`

These will require additional API endpoints in the backend to fully remove Supabase.

## Production Deployment

For production deployment:

1. Set a strong `JWT_SECRET`
2. Configure CORS origins in `backend/main.py`
3. Use HTTPS for all API calls
4. Consider using a process manager like PM2 or systemd for the backend
5. Set up proper database connection pooling
