# SecureAuth (AuthAPI)

A production-grade full-stack authentication system built with Node.js/Express/MongoDB on the backend and React on the frontend. Includes JWT access/refresh token rotation, Google OAuth2, email verification, TOTP-based 2FA, role-based access control, and activity logging.

**Live app:** https://secureauth-fullstack.vercel.app
**API:** https://secureauth-backend-wpzt.onrender.com

---

## Features

- Email/password registration with email verification
- JWT authentication with access + refresh token rotation
- Google OAuth2 login (via Passport.js)
- TOTP-based two-factor authentication (setup, enable, disable, verify-on-login)
- Password reset via email
- Role-based access control (user/admin)
- Admin endpoints: list users, view activity logs, unlock accounts, change roles, delete users
- Login activity logging
- Rate limiting (general + auth-specific + per-user login limiter)
- Input validation with Joi
- Security headers via Helmet, Mongo injection sanitization

---

## Tech Stack

**Backend**
- Node.js / Express 5
- MongoDB / Mongoose
- Passport.js (Google OAuth2 strategy)
- JSON Web Tokens (`jsonwebtoken`)
- `bcryptjs` for password hashing
- `otplib` + `qrcode` for 2FA
- `express-rate-limit`, `helmet`, `mongo-sanitize`
- Brevo (HTTP API) for transactional email

**Frontend**
- React
- Custom hooks: `useAuth`, `useTwoFactor`, `useAdmin`

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## Project Structure (backend)

```
backend/
├── config/
│   └── passport.js          # Google OAuth2 strategy
├── controllers/
│   ├── auth.controller.js
│   └── user.controller.js
├── middleware/
│   ├── authentication.js    # JWT verification
│   ├── authorize.js         # Role-based access control
│   ├── rateLimiter.js
│   ├── userRateLimiter.js
│   ├── validator.js         # Joi schemas
│   └── errorHandler.js
├── models/
│   └── users.js
├── routes/
│   ├── auth.routes.js
│   └── user.routes.js
├── services/
│   ├── auth.service.js
│   ├── mail.service.js      # Brevo HTTP API
│   ├── token.service.js
│   ├── twoFactor.service.js
│   ├── activity.service.js
│   └── user.service.js
├── views/emails/             # EJS email templates
└── server.js
```

---

## Environment Variables (Backend)

Create a `.env` file in `backend/` (never commit this):

```dotenv
# Server
PORT=5000
CLIENT_URL=https://secureauth-fullstack.vercel.app

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://secureauth-backend-wpzt.onrender.com/api/auth/google/callback

# Email (Brevo HTTP API)
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_verified_brevo_sender_email
```

> **Why Brevo's HTTP API instead of SMTP?** Render blocks outbound SMTP ports (25, 465, 587) on free-tier services. 
Sending over Brevo's HTTPS API sidesteps that restriction entirely. 
See [Deployment Notes](#deployment-notes--lessons-learned) below.

---

## Local Setup

```bash
# Backend
cd backend
npm install
npm run dev          # nodemon server.js

# Frontend
cd frontend/api-frontend
npm install
npm start
```

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login with email/password |
| POST | `/logout` | Logout |
| GET | `/verify-email` | Verify email via token link |
| GET | `/google` | Start Google OAuth flow |
| GET | `/google/callback` | Google OAuth callback |
| POST | `/2fa/verify-login` | Verify TOTP code at login |
| POST | `/2fa/setup` | Generate 2FA QR code *(auth required)* |
| POST | `/2fa/enable` | Enable 2FA *(auth required)* |
| POST | `/2fa/disable` | Disable 2FA *(auth required)* |

### Users (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all users *(admin only)* |
| GET | `/logs` | View activity logs *(admin only)* |
| GET | `/:id` | Get user by ID *(auth required)* |
| PUT | `/profile` | Update own profile *(auth required)* |
| PUT | `/:id` | Update a user *(auth required)* |
| PUT | `/:id/role` | Change user role *(admin only)* |
| DELETE | `/:id` | Delete a user *(admin only)* |
| POST | `/:id/unlock` | Unlock a locked account *(admin only)* |
| POST | `/forgot-password` | Request password reset email |
| POST | `/reset-password/:token` | Reset password via token |
| POST | `/refresh` | Refresh access token |

---

## Deployment Notes / Lessons Learned

A few production issues came up during deployment that are worth documenting for future reference:

1. **CORS misconfiguration** — `CLIENT_URL` on Render must exactly match the deployed frontend origin (no trailing slash), or preflight requests fail.
2. **`trust proxy` set to `true`** breaks `express-rate-limit`'s IP detection and throws `ERR_ERL_PERMISSIVE_TRUST_PROXY`, crashing every request. On single-reverse-proxy platforms like Render, use `app.set("trust proxy", 1)` instead.
3. **Don't block the HTTP response on email sending.** Fire email sends without `await`-blocking the response, and always wrap in try/catch — an email failure should never fail the whole request.
4. **SMTP is unreliable on PaaS free tiers.** Render blocks outbound SMTP ports (25/465/587) on free web services as of Sept 2025. Use a transactional email provider's **HTTP API** (Brevo, Resend, SendGrid) instead of SMTP.
5. **Brevo specifics:**
   - Use the **API Key** (SMTP & API → API Keys tab), not the SMTP key.
   - New/unrecognized server IPs are blocked by default — either authorize the IP or disable IP authorization in Brevo's security settings.
   - The sender email must be verified (click the confirmation link Brevo sends) before it can send from that address.
6. **Google OAuth "invalid request" errors** are almost always caused by a mismatch between `GOOGLE_CALLBACK_URL` and the **Authorized redirect URIs** registered in Google Cloud Console — must match character-for-character, including protocol and trailing slashes.

---