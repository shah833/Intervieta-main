# IntervieTA Authentication System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)

A production-ready full-stack authentication system built with modern technologies. This project provides a secure authentication stack for web applications, featuring JWT tokens, email verification, password reset, and role-based access control.

## 🚀 Features

- **User Registration & Login**: Secure user authentication with JWT access and refresh tokens
- **Email Verification**: Account activation via email verification links
- **Password Reset**: Secure password recovery with email-based reset
- **Role-Based Access Control**: Support for multiple user roles (investor, founder, admin)
- **Session Management**: Automatic token refresh and logout functionality
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS
- **API Documentation**: Interactive API docs with FastAPI/Swagger
- **Database Migrations**: Automated database schema management with Alembic
- **CORS Support**: Configurable cross-origin resource sharing

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic
- **Authentication**: JWT (JSON Web Tokens) with bcrypt hashing
- **Email**: SMTP-based email sending
- **Validation**: Pydantic schemas

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Native fetch API

## 📁 Project Structure

```
.
├── frontend/
│   ├── app/                     # Next.js pages and layouts
│   │   ├── dashboard/           # Protected dashboard page
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── forgot-password/     # Password reset request
│   │   ├── reset-password/      # Password reset form
│   │   └── verify-email/        # Email verification page
│   ├── components/              # Reusable React components
│   ├── context/                 # AuthContext provider
│   ├── lib/                     # API utilities and auth helpers
│   ├── middleware.ts            # Route protection middleware
│   └── public/                  # Static assets
└── backend/
    ├── app/
    │   ├── config.py            # Application settings
    │   ├── database.py          # Database connection
    │   ├── dependencies.py      # FastAPI dependencies
    │   ├── main.py              # FastAPI app initialization
    │   ├── models/              # SQLAlchemy models
    │   ├── routes/              # API route handlers
    │   ├── schemas/             # Pydantic schemas
    │   ├── services/            # Business logic services
    │   └── utils/               # Utility functions
    ├── alembic/                 # Database migrations
    ├── requirements.txt          # Python dependencies
    └── .env.example             # Environment variables template
```

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Git

## 🚀 Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/intervieta.git
   cd intervieta/backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb intervieta_db

   # Run migrations
   alembic upgrade head
   ```

6. **Start the backend server**
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://username:password@localhost/intervieta_db

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# App Settings
APP_NAME=IntervieTA
DEBUG=True
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📖 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and invalidate tokens |
| POST | `/auth/verify-email` | Verify email address |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |
| GET | `/auth/me` | Get current user information |

### Request/Response Examples

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "founder"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response includes access token and sets refresh token cookie.

## 🔧 Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Database Migrations

```bash
cd backend
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```

### Linting

```bash
# Backend
cd backend
flake8

# Frontend
cd frontend
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework for production
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL toolkit
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.
- Refresh token persistence (hashed in DB, revocation support)
- Frontend auth flow pages:
  - `/register`
  - `/login`
  - `/forgot-password`
  - `/reset-password`
  - `/verify-email`
  - `/dashboard`

## Local Setup

### 1. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set `DATABASE_URL` and `JWT_SECRET_KEY` in `backend/.env`.

Run migrations:

```bash
alembic upgrade head
```

Run API:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at `http://localhost:8000`.

## API Notes

- Access token expires in 15 minutes.
- Refresh token expires in 7 days.
- Refresh token is returned in HTTPOnly cookie (`refresh_token`).
- Access token is returned in response body and used as Bearer token.
- Login requires verified email.

## Production Deployment Notes

- Use HTTPS everywhere.
- Set `SECURE_COOKIES=true` in backend env for production.
- Use strong `JWT_SECRET_KEY` (32+ random chars).
- Restrict `CORS_ORIGINS` to exact frontend domains.
- Configure SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`) for verification/reset emails.
- Run Alembic migrations in CI/CD before app rollout.
- Add rate limiting (e.g. login, forgot-password) with Redis.
- Add structured logging and centralized monitoring.
- Use managed PostgreSQL with automated backups.

## Quick Test Flow

1. Register a new user at `/register`.
2. Verify account from email link (`/verify-email?token=...`).
3. Login at `/login`.
4. Access protected `/dashboard`.
5. Logout and confirm redirect protection via middleware.
