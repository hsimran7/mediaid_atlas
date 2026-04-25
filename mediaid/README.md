# 🩺 MediAid AI — Full Stack

**Clinical First Aid Intelligence with Voice** — Multilingual AI-powered emergency guidance platform with a full backend, user authentication, and community solutions database.

---

## 📁 Project Structure

```
mediaid/
├── backend/              ← Node.js + Express + MongoDB API
│   ├── server.js
│   ├── models/           User.js · Solution.js
│   ├── controllers/      auth · solutions · users
│   ├── middleware/       JWT auth · file upload · error handler
│   ├── routes/           /api/auth · /api/solutions · /api/users
│   └── utils/            seed.js · token.js
│
└── frontend/
    └── vite-project/     ← React 18 + Vite 5
        └── src/
            ├── App.jsx                Root component
            ├── context/AuthContext   Global auth state
            ├── services/api.js       HTTP service layer
            ├── components/           Sidebar · Navbar · AuthModal
            └── pages/
                ├── Chatbot           AI first aid chat
                ├── SeekerDashboard   Browse/save/like solutions
                ├── Contribute        Upload video/PDF solutions
                ├── Resources         Resource library
                └── Dashboard         Analytics
```

---

## 🚀 Running the Full Stack

### 1. Start the Backend

```bash
cd mediaid/backend
npm install
npm run seed        # Populate demo users and solutions
npm run dev         # http://localhost:5000
```

### 2. Start the Frontend

```bash
cd mediaid/frontend/vite-project
npm install
npm run dev         # http://localhost:5173
```

---

## 🔑 Demo Logins

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | `admin@mediaid.ai` | `Admin@123` | Everything + user management |
| Contributor | `amara@mediaid.ai` | `Contrib@123` | Upload & manage solutions |
| Seeker | `seeker@mediaid.ai` | `Seeker@123` | Browse & save solutions |

---

## ✨ Features

### For Seekers
- 🔍 **Discover Solutions** — Browse community-uploaded video, PDF, and guide solutions
- 🔖 **Save** solutions to personal dashboard
- ❤️ **Like** and 💬 **comment** on solutions
- 📋 **Activity Log** — See your browsing history
- 🎙️ **Voice Assistant** — Voice-guided first aid

### For Contributors
- 🎬 **Upload Videos** (MP4, WebM, MOV up to 50MB)
- 📄 **Upload PDFs** and written guides
- 🔗 **Link YouTube / external resources**
- 📊 **Stats Dashboard** — Views, likes, approval status per submission
- 📝 **Step-by-step protocol editor**

### For Admins
- ✅ **Approve / Reject** submitted solutions
- 👥 **User management** — View all users, change roles, disable accounts
- 📊 **Full platform analytics**

### Core App
- 🩺 **AI Chat** — Keyword-matched first aid protocols
- 🌍 **8 Languages** — EN, UR, HI, AR, FR, ES, SW, BN
- 🚨 **Emergency FAB** — Quick access to emergency numbers
- 📋 **Situation Flyout** — Protocol, resources, remedies, do/don't

---

## 🌐 API Endpoints Summary

```
POST /api/auth/register          Register user
POST /api/auth/login             Login → JWT token
GET  /api/auth/me                Get profile (auth)
GET  /api/auth/dashboard         Personalized dashboard (auth)

GET  /api/solutions              List approved solutions
GET  /api/solutions/:id          Single solution (tracks views)
GET  /api/solutions/by-condition/:key   By condition key
POST /api/solutions              Create solution (contributor)
POST /api/solutions/:id/like     Toggle like (auth)
POST /api/solutions/:id/save     Toggle save (auth)
POST /api/solutions/:id/comment  Add comment (auth)
PATCH /api/solutions/:id/review  Approve/reject (admin)

GET  /api/users                  All users (admin)
PATCH /api/users/:id/role        Change role (admin)
GET  /api/solutions/stats/overview   Platform stats
```
