# Employee Attendance & Leave Management System

## Project Overview
A backend application developed using FastAPI and PostgreSQL to manage employee attendance and leave requests securely and efficiently.

## Technology Stack

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Argon2 Password Hashing

## Features

### Employee

- User registration and login
- Secure JWT authentication
- Daily attendance check-in
- Attendance history
- Leave request submission
- Leave request history

### Admin

- Admin authentication and authorization
- Dashboard statistics
- Employee listing and search
- Employee attendance viewing
- Leave request approval and rejection
- Admin comments on leave requests

## Project Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd employee_attendance_backend
```

### 2. Create a Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate the Virtual Environment

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file in the project root and configure:

- PostgreSQL database credentials
- JWT secret key
- JWT algorithm

Never commit your `.env` file or expose database credentials.

### 6. Start the Application

```bash
python -m uvicorn app.main:app --reload
```

## API Documentation

Once the application is running, access the interactive Swagger API documentation:

http://127.0.0.1:8000/docs

## Database

PostgreSQL is used as the relational database, with SQLAlchemy handling database operations and ORM mapping.

## Security

- Passwords are securely hashed using Argon2.
- JWT tokens are used for authentication.
- Role-Based Access Control (RBAC) restricts admin-only operations.
- Environment variables protect sensitive configuration.