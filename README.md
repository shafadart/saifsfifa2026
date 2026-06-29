<div align="center">
  <img src="public/assets/fifalogo.png" alt="MaMa TV Logo" width="200"/>
  
  # 📺 MaMa TV - Premium Live Streaming App

  <p>A modern, highly-optimized Next.js web application designed for streaming live sports and TV channels with an integrated Paywall, Admin Dashboard, and Real-time Chat.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-Database-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
</div>

<br />

## ✨ Features

- **⚽ Premium Live Streaming:** Custom-built HLS Video Player to handle `.m3u8` streams seamlessly.
- **💎 Custom Paywall System:** Users get a fully automated **2-minute free trial**. After the trial, the screen locks with a premium glassmorphism paywall, requiring a VIP key to unlock.
- **🛡️ Secure Admin Dashboard:** 
  - Generate one-time use VIP Keys (`VIP-XXXX-XXXX`).
  - Track active user devices.
  - One-click Ban/Unban devices for policy violations.
- **💬 Real-Time Live Chat:** Engaging chat interface for viewers to interact during live matches.
- **📱 Fully Responsive:** Carefully crafted CSS for a perfect viewing experience across Desktop, Tablet, and Mobile devices.
- **🚀 Serverless Ready:** Uses Firebase Firestore, making it 100% ready to deploy on Vercel or Netlify for free.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React 18, TypeScript
- **Styling:** Vanilla CSS Modules with custom Glassmorphism UI
- **Backend/Database:** Firebase Firestore, Next.js API Routes
- **Video Player:** React Player (HLS/M3U8 Support)

---

## 🚀 Quick Start (Run Locally)

### 1. Clone the repository
```bash
git clone https://github.com/shafadart/saifsfifa2026.git
cd saifsfifa2026
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Rename `.env.example` to `.env.local` and add your Firebase credentials:
```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
ADMIN_SECRET_TOKEN=your_secure_secret_token
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


---

## ☁️ Deployment

This project is fully optimized for **Netlify** or **Vercel**. 
1. Create a new site on Netlify/Vercel and link this GitHub repository.
2. Go to your deployment platform's **Environment Variables** settings and add all the keys from your `.env.local` file.
3. Deploy! 🚀

---
<div align="center">
  <i>Developed with ❤️ for sports enthusiasts.</i>
</div>
