# MediAid AI — Clinical First Aid Intelligence

A multilingual AI-powered first aid guidance app, built with **React + Vite**.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Root component — layout, state, modals, flyout
├── App.css                   # All component styles (design system)
├── index.css                 # Global resets
│
├── components/
│   ├── Sidebar.jsx           # Collapsible sidebar + situation groups
│   ├── Navbar.jsx            # Topbar — breadcrumb, ECG, lang, mode, voice
│   ├── TypingIndicator.jsx   # Animated typing dots
│   ├── VoiceAssistant.jsx    # Mic button component
│   ├── LanguageSelector.jsx  # Language dropdown
│   └── header.jsx            # Re-export alias for Navbar
│
├── pages/
│   ├── Chatbot.jsx           # AI Chat page with protocol cards
│   ├── Resources.jsx         # Resource library with filters
│   ├── Contribute.jsx        # Remedy submission form
│   └── Dashboard.jsx         # Stats, charts, system status
│
├── data/
│   └── firstAidData.js       # All first aid DB, situations, i18n, resources
│
├── services/
│   └── voiceService.js       # Web Speech API (STT + TTS) wrapper
│
└── styles/
    ├── app.css               # CSS variables & grid background
    └── chat.css              # Chat message & protocol card styles
```

## ✨ Features

- 🩺 **AI Chat** — keyword-matched first aid protocols with step-by-step cards
- 🗣️ **Voice Assistant** — speech-to-text input + text-to-speech responses
- 🌍 **8 Languages** — EN, UR, HI, AR, FR, ES, SW, BN
- 📚 **Resource Library** — filterable PDFs, videos, and guides
- 🌿 **Contribute** — community remedy submission form
- 📊 **Dashboard** — live stats, query charts, submission status
- 🚨 **Emergency FAB** — quick access to emergency numbers worldwide
- 📋 **Situation Flyout** — detailed protocol, resources, remedies, do/don't
- 🌑 **Clinical Dark Theme** — IBM Plex typefaces, scanline overlay, ECG animation

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **Web Speech API** (SpeechRecognition + SpeechSynthesis)
- **IBM Plex Sans / Mono / Bebas Neue** (Google Fonts)
- Pure CSS variables — no CSS framework dependencies
