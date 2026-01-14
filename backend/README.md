# CropSync Kiosk Backend

FastAPI backend for CropSync Kiosk application with MySQL database support.

## Prerequisites

- Python 3.8+
- MySQL Server (or MariaDB)
- pip (Python package manager)

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your MySQL database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=u511597003_kiosk

# JWT Configuration
JWT_SECRET=your-secure-secret-key
```

### 3. Database Setup

Import the database schema:

```bash
mysql -u your_user -p your_database < path/to/u511597003_kiosk.sql
```

### 4. Run the Server

```bash
# Development mode
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check

- `GET /` - Basic health check
- `GET /api/health` - Health check with database connectivity test

### Authentication

- `POST /api/auth/login` - Login with user_id
  ```json
  {
    "user_id": "123456"
  }
  ```

- `POST /api/auth/login-by-card?card_uid=xxx` - Login with NFC card UID

- `POST /api/auth/verify-token?token=xxx` - Verify JWT token

### Users

- `GET /api/users/{user_id}` - Get user details by user_id

## Response Format

### Successful Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "user_id": "123456",
    "name": "John Doe",
    "phone_number": "9876543210",
    "district": "Nalgonda",
    "village": "Cheruvuannaram",
    "region": "Nalgonda",
    "client_code": "NLG001",
    "mandal": null,
    "profile_image_url": null,
    "created_at": "2025-12-15 07:59:46",
    "card_uid": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Failed Login Response

```json
{
  "success": false,
  "message": "Invalid User ID. Please try again.",
  "user": null,
  "token": null
}
```

## Security Notes

1. In production, set a strong `JWT_SECRET`
2. Configure CORS origins properly in `main.py`
3. Use HTTPS in production
4. Consider rate limiting for login endpoints
