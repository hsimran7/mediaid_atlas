# MediAid AI — Setup Guide
## MongoDB Atlas + Cloudinary + Gemini AI

---

## ⚡ Quick Start (5 steps)

```
1. MongoDB Atlas URI  →  mediaid/backend/.env → MONGO_URI
2. Cloudinary keys   →  mediaid/backend/.env → CLOUDINARY_*
3. Gemini API key    →  mediaid/backend/.env → GEMINI_API_KEY
4. npm install (backend)
5. npm run seed + npm run dev
```

---

## 📋 Step 1 — MongoDB Atlas (Free Cloud DB)

### Create your free cluster:

1. Go to **https://cloud.mongodb.com** → Sign up free
2. Click **"Build a Database"** → Choose **FREE (M0 Shared)**
3. Select cloud provider (AWS/GCP) and region closest to you
4. Click **"Create"**

### Get your connection string:

1. Click **"Connect"** on your cluster
2. Choose **"Drivers"** → Node.js
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your Atlas credentials
5. Add database name: `mediaid`
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/mediaid?retryWrites=true&w=majority
   ```

### Allow your IP (IMPORTANT!):
1. Left menu → **"Network Access"**
2. Click **"Add IP Address"**
3. For development: **"Allow Access from Anywhere"** (0.0.0.0/0)
   *(Restrict this for production)*

### Paste into .env:
```env
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/mediaid?retryWrites=true&w=majority
```

---

## 📋 Step 2 — Cloudinary (Free Video/Image Storage)

Cloudinary gives you **25 GB free storage** for videos, PDFs, and images.

1. Go to **https://cloudinary.com** → Sign up free
2. After signup, go to your **Dashboard**
3. Copy these 3 values:
   - **Cloud Name** (e.g., `dxyz12345`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### Create Upload Preset:
1. Settings → Upload → **"Add upload preset"**
2. Preset name: `mediaid_uploads`
3. Signing mode: **Unsigned** (for direct frontend uploads later)
4. Folder: `mediaid`
5. Click **Save**

### Paste into .env:
```env
CLOUDINARY_CLOUD_NAME=dxyz12345
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
CLOUDINARY_UPLOAD_PRESET=mediaid_uploads
```

---

## 📋 Step 3 — Google Gemini AI (Free API)

Gemini 1.5 Flash is **completely free** with generous limits.

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Select existing project or create new one
5. Copy the API key (starts with `AIzaSy...`)

### Paste into .env:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Gemini Free Tier Limits:**
- 15 requests/minute
- 1 million tokens/day
- No billing required

---

## 📋 Step 4 — Final .env File

Your complete `mediaid/backend/.env` should look like:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/mediaid?retryWrites=true&w=majority

JWT_SECRET=make_this_a_long_random_string_at_least_32_characters_long
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=dxyz12345
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
CLOUDINARY_UPLOAD_PRESET=mediaid_uploads

GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

MAX_FILE_SIZE_MB=100
```

---

## 📋 Step 5 — Install & Run

### Backend:
```bash
cd mediaid/backend
npm install
npm run seed       # Creates 5 demo users + 7 solutions in Atlas
npm run dev        # Starts on http://localhost:5000
```

### Verify backend is working:
```
http://localhost:5000/api/health
```
Expected response:
```json
{
  "success": true,
  "services": {
    "database": "☁️ MongoDB Atlas",
    "ai": "🤖 Gemini AI Active",
    "storage": "☁️ Cloudinary"
  }
}
```

### Frontend:
```bash
cd mediaid/frontend/vite-project
npm install
npm run dev        # Starts on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@mediaid.ai | Admin@123 |
| Contributor | amara@mediaid.ai | Contrib@123 |
| Seeker | seeker@mediaid.ai | Seeker@123 |

---

## 🎬 How Video Upload Works

1. User (contributor) fills out the form in **Contribute** page
2. Selects a video file (MP4, WebM, MOV up to 100MB)
3. Frontend sends `multipart/form-data` to `POST /api/solutions`
4. Backend multer middleware uploads to **Cloudinary** automatically
5. Cloudinary returns a secure URL + auto-generated thumbnail
6. URL is saved to MongoDB Atlas in the `solutions` collection
7. Solution goes to **pending** status for admin review
8. Admin approves → solution appears in all seekers' dashboards

### What gets stored in MongoDB per video:
```
title, description, condition, conditionKey
mediaType: "video"
fileUrl: "https://res.cloudinary.com/dxyz12345/video/upload/mediaid/videos/mediaid-xxx.mp4"
thumbnailUrl: "https://res.cloudinary.com/dxyz12345/image/upload/.../mediaid-xxx.jpg"
fileName, fileSize, fileMimeType
author → User._id
status: "pending" → "approved"
views, likesCount, savesCount, comments[]
```

---

## 💬 How AI Chat Works

1. User types a question in the **Chat** page
2. Frontend calls `POST /api/chat` with message + history
3. Backend does 2 things simultaneously:
   - **Searches MongoDB** for verified solutions matching the condition
   - **Calls Gemini AI** with medical system prompt
4. Gemini returns structured first aid protocol
5. Backend returns: AI response + verified solutions from DB
6. Frontend shows AI response + "Verified Community Solutions" cards
7. If user is logged in: query is saved to their activity log in Atlas

### Chat query is logged to Atlas:
```
ChatLog collection:
  user: User._id (null if anonymous)
  message: "how to treat burns"
  response: "🩺 Burns First Aid..."
  conditionKey: "burn"
  language: "en"
  usedAI: true
  matchedSolutions: [Solution._id, ...]
```

---

## 🏗 MongoDB Atlas Collections

After running `npm run seed`, you'll see these collections in Atlas:

| Collection | Purpose |
|---|---|
| `users` | Login details, roles, stats, activity logs |
| `solutions` | Uploaded videos/PDFs/guides with metadata |
| `chatlogs` | Every chat query + response (anonymous + logged-in) |

### View your data in Atlas:
1. Go to your cluster → **"Browse Collections"**
2. Select `mediaid` database
3. Browse `users`, `solutions`, `chatlogs` collections

---

## 🔍 Troubleshooting

### MongoDB connection fails:
- Check IP whitelist in Atlas Network Access (add 0.0.0.0/0)
- Verify username/password in MONGO_URI
- Make sure you have `/mediaid` in the URI after the hostname

### Cloudinary upload fails:
- Verify Cloud Name, API Key, API Secret are correct
- Check file size is under MAX_FILE_SIZE_MB

### Gemini AI returns errors:
- Verify API key at https://aistudio.google.com/app/apikey
- Check rate limits (15 req/min on free tier)
- App falls back to rule-based responses automatically

### "IP not whitelisted" error:
- Atlas Dashboard → Network Access → Add IP → Allow Access from Anywhere
