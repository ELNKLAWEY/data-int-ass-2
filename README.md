# Secure Authentication System

A full-stack web application implementing a secure multi-layer authentication system built with Node.js and Express. This project was developed as part of the Data Integration course assignment.

---

## Course Information

| Field       | Details                        |
|-------------|--------------------------------|
| **Course**  | Data Integration                |
| **Instructor** | Eng. Yahya Ashraf Ahmed     |

---

## Team Members

| Name                  | ID         |
|-----------------------|------------|
| Mohamed Osama         | 2305180    |
| Mostafa Ali Mostafa   | 2305616    |

---

## Project Overview

This application provides a robust authentication system featuring role-based access control, JWT-based session management, and Two-Factor Authentication (2FA) using TOTP (Time-based One-Time Passwords).

---

## Features

- **User Registration & Login** — Secure sign-up and sign-in with hashed passwords
- **Two-Factor Authentication (2FA)** — TOTP-based 2FA with QR code setup via Google Authenticator or any compatible app
- **JWT Authentication** — Stateless session management using JSON Web Tokens stored in HTTP-only cookies
- **Role-Based Access Control** — Separate dashboards and permissions for `admin`, `manager`, and `user` roles
- **Admin Panel** — Manage users, view all accounts, and control access levels
- **Password Hashing** — All passwords are hashed using `bcryptjs` before storage
- **SQLite Database** — Lightweight local database using `better-sqlite3`

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Runtime      | Node.js                             |
| Framework    | Express.js v5                       |
| Database     | SQLite (`better-sqlite3`)           |
| Auth         | JWT (`jsonwebtoken`), `bcryptjs`    |
| 2FA          | `speakeasy`, `qrcode`               |
| Sessions     | Cookie-based JWT (`cookie-parser`)  |
| Frontend     | Plain HTML, CSS, JavaScript         |

---

## Project Structure

```
data-int-2/
├── index.js                  # Entry point
├── src/
│   ├── app.js                # Express app setup & template engine
│   ├── config/               # Database configuration
│   ├── controllers/          # Route controllers (auth, admin, etc.)
│   ├── middleware/           # JWT verification & role guards
│   ├── models/               # Database models
│   └── routes/               # Auth & protected route definitions
├── views/                    # HTML templates
│   ├── login.html
│   ├── register.html
│   ├── setup-2fa.html
│   ├── verify-2fa.html
│   ├── dashboard.html
│   ├── admin.html
│   └── ...
├── public/                   # Static assets (CSS, JS)
├── database.db               # SQLite database file
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ELNKLAWEY/data-int-ass-2.git
cd data-int-ass-2

# Install dependencies
npm install

# Start the server
npm start
```

The application will be running at **http://localhost:3000**

---

## Authentication Flow

1. User registers with email and password
2. Password is hashed with `bcryptjs` and stored in SQLite
3. Upon login, a JWT token is issued and stored in an HTTP-only cookie
4. If 2FA is enabled, the user must verify a TOTP code from their authenticator app
5. Role-based middleware protects routes for `admin`, `manager`, and `user` roles

---

## Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

---

## License

This project is for academic purposes only.
