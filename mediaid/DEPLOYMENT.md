# MediAid AI — Deployment Guide 🚀

This guide explains how to properly deploy the MediAid AI platform to a production environment using modern, robust cloud hosting platforms.

## 📌 Architecture Overview
- **Frontend**: React + Vite (Recommended hosting: **Vercel** or **Netlify**)
- **Backend**: Node.js + Express (Recommended hosting: **Render** or **Railway**)
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary (for videos, images, and PDFs)
- **AI**: Google Gemini API

---

## Step 1: Deploying the Backend (Render / Railway)

We recommend using **Render** as it has excellent free/hobby tiers for Node.js backends.

1. Create a new Web Service on Render and connect your GitHub repository.
2. Select the `backend` directory as the Root Directory.
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add all the variables found in `backend/.env.example` to the Render environment variables dashboard.
   - `NODE_ENV=production`
   - `PORT=5000` (Render will automatically override this if needed)
   - `MONGO_URI` (Your MongoDB Atlas connection string)
   - `JWT_SECRET` (A long random string)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `GEMINI_API_KEY`
   - **Important:** Set `FRONTEND_URL` later once you have deployed the frontend. Leave it as your temporary frontend URL or empty for now.

Once deployed, Render will provide a URL like `https://mediaid-backend.onrender.com`. Save this URL.

---

## Step 2: Deploying the Frontend (Vercel / Netlify)

We recommend **Vercel** for Vite/React applications.

1. Create a new project on Vercel and import your repository.
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to `frontend/vite-project`.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**: Add the variables found in `frontend/vite-project/.env.example`.
   - `VITE_API_URL`: Set this to your deployed backend URL + `/api` (e.g., `https://mediaid-backend.onrender.com/api`).
7. Click Deploy. Vercel will provide a URL like `https://mediaid-ai.vercel.app`.

*(Note: SPA routing configuration `vercel.json` and `_redirects` are already included in the project to prevent blank pages on refresh).*

---

## Step 3: Update CORS (Crucial)

Now that your frontend is deployed, you must update the backend to allow requests from the new frontend URL.

1. Go back to your backend hosting provider (Render).
2. Update the `FRONTEND_URL` environment variable to match your exact Vercel frontend URL (e.g., `https://mediaid-ai.vercel.app`). Do not include a trailing slash.
3. Save the changes. The backend will automatically restart and apply the new CORS policy.

---

## Step 4: MongoDB Atlas Configuration

Your `db.js` is already optimized for MongoDB Atlas. To ensure production stability:
1. Go to your MongoDB Atlas dashboard.
2. Navigate to **Network Access**.
3. Ensure you have added the IP address `0.0.0.0/0` (Allow access from anywhere). This is required because serverless platforms (like Render/Railway) use dynamic IPs. Your database is still secured by the username/password in the `MONGO_URI`.

---

## Step 5: Cloudinary Configuration

Your `cloudinary.js` is fully configured to securely stream buffer uploads directly to Cloudinary without saving them to the local disk in production.
1. Ensure your Cloudinary credentials are correct in the backend environment variables.
2. The system will automatically create folders like `mediaid/videos` and `mediaid/pdfs` in your Cloudinary account upon the first upload.

---

## Step 6: Final Production Verification Check

Once both services are live, visit your frontend URL and perform the following checks:
- [ ] **Login/Register:** Ensure authentication tokens persist and no blank screens appear.
- [ ] **Remedy Upload:** Log in as a Contributor and upload a remedy with an image/video. Ensure it uploads successfully.
- [ ] **Admin Moderation:** Log in as an Admin, view the pending remedy, and ensure the media preview works correctly. Approve it.
- [ ] **Chatbot:** Ask the AI a question related to the approved remedy to ensure it fetches the verified database result.
- [ ] **Hard Refresh:** Refresh the page while on a nested route (e.g., `/dashboard`). The page should reload normally without a 404 error.
