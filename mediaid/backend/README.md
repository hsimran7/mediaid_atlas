# MediAid AI — Backend API

Express.js + MongoDB REST API powering authentication, user management, and the solutions database.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env .env.local    # Edit MONGO_URI, JWT_SECRET etc.

# 3. Seed database with demo data
npm run seed

# 4. Start dev server
npm run dev

# 5. Production
npm start
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/mediaid` | MongoDB connection string |
| `JWT_SECRET` | *(change this!)* | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
| `MAX_FILE_SIZE_MB` | `50` | Max upload size |
| `UPLOAD_PATH` | `./uploads` | Where files are stored |

---

## 📡 API Reference

### AUTH  `/api/auth`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login, returns JWT |
| GET | `/me` | ✅ | Get current user profile |
| PUT | `/profile` | ✅ | Update profile (name, bio, country...) |
| PUT | `/change-password` | ✅ | Change password |
| GET | `/dashboard` | ✅ | Personalized dashboard data |

**Register body:**
```json
{ "name": "John Doe", "email": "john@email.com", "password": "pass123",
  "role": "seeker|contributor", "country": "Pakistan", "language": "en" }
```

**Login body:**
```json
{ "email": "john@email.com", "password": "pass123" }
```

**Response (login/register):**
```json
{ "success": true, "token": "eyJ...", "user": { "_id": "...", "name": "...", "role": "seeker", ... } }
```

---

### SOLUTIONS  `/api/solutions`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Optional | List approved solutions (paginated, filterable) |
| GET | `/:id` | Optional | Get single solution (increments views) |
| GET | `/by-condition/:key` | Optional | Solutions for a specific condition key |
| POST | `/` | Contributor+ | Create solution (multipart/form-data) |
| PUT | `/:id` | Owner/Admin | Update solution |
| DELETE | `/:id` | Owner/Admin | Delete solution |
| POST | `/:id/like` | ✅ | Toggle like |
| POST | `/:id/save` | ✅ | Toggle save to profile |
| POST | `/:id/comment` | ✅ | Add comment |
| PATCH | `/:id/review` | Admin | Approve / reject / flag |
| GET | `/admin/pending` | Admin | List pending solutions |
| GET | `/stats/overview` | — | Platform statistics |

**Query params for GET `/`:**
```
?page=1&limit=12&mediaType=video&conditionKey=burn&severity=critical
&language=en&search=burn+treatment&sort=-createdAt&featured=true
```

**Create solution (form-data):**
```
title, description, condition, conditionKey, mediaType (video|pdf|guide|image|link),
externalUrl, duration, severity, tags, language, region, source, evidence,
steps (JSON array), ingredients (JSON array), file (binary upload)
```

**Condition keys:**
`burn, cpr, choking, wound, fever, fracture, snake, stroke, seizure, allergic,
asthma_attack, drowning, heatstroke, poisoning, diabetic, insect_sting,
dog_bite, scorpion, sprain, nosebleed, internal_bleed, chemical_burn,
sunburn, spinal_injury, infant_cpr, febrile_seizure, emergency_birth`

---

### USERS  `/api/users`  (Admin only)

| Method | Route | Description |
|---|---|---|
| GET | `/` | List all users (paginated) |
| GET | `/:id` | Get user + their solutions |
| PATCH | `/:id/role` | Change role (seeker/contributor/admin) |
| PATCH | `/:id/toggle-active` | Enable/disable account |
| GET | `/stats/overview` | User count by role |

---

## 🗄 Database Schema

### User
```
name, email, password (hashed), role (seeker|contributor|admin)
avatar, bio, country, language, specialization
queriesCount, savedSolutions[], viewedSolutions[]
solutionsCount, verifiedCount, totalViews, totalLikes
activityLog (last 20: action, detail, timestamp)
lastLogin, loginCount, isActive
```

### Solution
```
title, description, condition, conditionKey
mediaType (video|pdf|guide|image|link)
fileUrl, fileName, fileSize, fileMimeType
externalUrl, duration, thumbnailUrl
severity (critical|moderate|mild|general)
tags[], language, region, source, evidence
author (→ User), authorName
status (pending|approved|rejected|flagged)
steps[], ingredients[]
views, likes[], likesCount, saves[], savesCount
comments (user, userName, text, createdAt)[]
isFeatured, reviewNote, reviewedBy, reviewedAt
```

---

## 🔑 Demo Credentials (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@mediaid.ai` | `Admin@123` |
| Contributor | `amara@mediaid.ai` | `Contrib@123` |
| Contributor | `fatima@mediaid.ai` | `Contrib@123` |
| Contributor | `raj@mediaid.ai` | `Contrib@123` |
| Seeker | `seeker@mediaid.ai` | `Seeker@123` |

---

## 📁 Project Structure

```
backend/
├── server.js              # Entry point — Express app, middleware, routes
├── .env                   # Environment variables
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema + methods
│   └── Solution.js        # Solution schema + indexes
├── controllers/
│   ├── authController.js  # register, login, me, profile, dashboard
│   ├── solutionsController.js  # Full CRUD + like/save/comment/review
│   └── usersController.js # Admin user management
├── middleware/
│   ├── auth.js            # JWT protect, restrictTo, optionalAuth
│   ├── upload.js          # Multer file upload config
│   └── errorHandler.js    # Centralized error handler
├── routes/
│   ├── authRoutes.js
│   ├── solutionRoutes.js
│   └── userRoutes.js
└── utils/
    ├── token.js           # JWT generation helper
    └── seed.js            # Database seeder with demo data
```
