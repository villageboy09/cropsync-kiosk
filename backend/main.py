"""
CropSync Kiosk Backend API
MySQL-based authentication and user management
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
import hashlib

# Load environment variables
load_dotenv()

app = FastAPI(
    title="CropSync Kiosk API",
    description="Backend API for CropSync Kiosk Application",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "cropsync-kiosk-secret-key-2024")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Database configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "u511597003_kiosk"),
}


# Pydantic models
class LoginRequest(BaseModel):
    user_id: str


class UserResponse(BaseModel):
    user_id: str
    name: str
    phone_number: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    region: Optional[str] = None
    client_code: Optional[str] = None
    mandal: Optional[str] = None
    profile_image_url: Optional[str] = None
    created_at: Optional[str] = None
    card_uid: Optional[str] = None


class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None


class TokenData(BaseModel):
    user_id: str
    exp: datetime


# Database connection helper
def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")


def create_jwt_token(user_id: str) -> str:
    """Create a JWT token for the user"""
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "user_id": user_id,
        "exp": expiration
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def verify_jwt_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "CropSync Kiosk API is running"}


@app.get("/api/health")
async def health_check():
    """Health check with database connectivity test"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        connection.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Login endpoint - authenticates user by user_id
    The user_id can be entered via the numeric keypad on the kiosk
    """
    user_id = request.user_id.strip()
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Query user by user_id
        query = """
            SELECT user_id, name, phone_number, district, village, 
                   region, client_code, mandal, profile_image_url, 
                   created_at, card_uid
            FROM users 
            WHERE user_id = %s
        """
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if user:
            # Convert datetime to string if present
            if user.get('created_at'):
                user['created_at'] = str(user['created_at'])
            
            # Create JWT token
            token = create_jwt_token(user['user_id'])
            
            return LoginResponse(
                success=True,
                message="Login successful",
                user=UserResponse(**user),
                token=token
            )
        else:
            return LoginResponse(
                success=False,
                message="Invalid User ID. Please try again.",
                user=None,
                token=None
            )
            
    except Error as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")


@app.post("/api/auth/login-by-card", response_model=LoginResponse)
async def login_by_card(card_uid: str):
    """
    Login endpoint - authenticates user by NFC card UID
    """
    card_uid = card_uid.strip()
    
    if not card_uid:
        raise HTTPException(status_code=400, detail="Card UID is required")
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Query user by card_uid
        query = """
            SELECT user_id, name, phone_number, district, village, 
                   region, client_code, mandal, profile_image_url, 
                   created_at, card_uid
            FROM users 
            WHERE card_uid = %s
        """
        cursor.execute(query, (card_uid,))
        user = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if user:
            # Convert datetime to string if present
            if user.get('created_at'):
                user['created_at'] = str(user['created_at'])
            
            # Create JWT token
            token = create_jwt_token(user['user_id'])
            
            return LoginResponse(
                success=True,
                message="Login successful",
                user=UserResponse(**user),
                token=token
            )
        else:
            return LoginResponse(
                success=False,
                message="Card not registered. Please contact administrator.",
                user=None,
                token=None
            )
            
    except Error as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")


@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user details by user_id"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT user_id, name, phone_number, district, village, 
                   region, client_code, mandal, profile_image_url, 
                   created_at, card_uid
            FROM users 
            WHERE user_id = %s
        """
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        if user:
            if user.get('created_at'):
                user['created_at'] = str(user['created_at'])
            return UserResponse(**user)
        else:
            raise HTTPException(status_code=404, detail="User not found")
            
    except Error as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred")


@app.post("/api/auth/verify-token")
async def verify_token(token: str):
    """Verify if a JWT token is valid"""
    payload = verify_jwt_token(token)
    if payload:
        return {"valid": True, "user_id": payload.get("user_id")}
    else:
        return {"valid": False, "user_id": None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
