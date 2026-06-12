# 🚀 Career OS — Sirigiri Anand Kumar's Interactive Portfolio

A premium, interactive, recruiter-first developer portfolio web application built with **React**, **TypeScript**, **Express**, and **Gemini 3.5**. It acts as a comprehensive "Career OS" to highlight Anand's academic growth, DSA roadmap progress, open-source work, and achievements, featuring a real-time admin panel control system and an AI chat assistant.

---

## ✨ Key Features

### 1. 🤖 Resilient AI Recruiter Assistant
- Recruiter chatbot trained directly on Anand's profile details, open-source contributions (GSSoC), and DSA learning timeline.
- Features a **fail-safe intelligent fallback responder** that ensures a smooth conversational experience even without an active Gemini API key.

### 2. 🎛️ Career OS Control Center (Admin Panel)
- **General Profiles**: Real-time updates for legal name, major, email, phone, and profiles (LinkedIn, LeetCode, GitHub, Hack2Skill).
- **Competency Calibrator**: Calibrate learning weights and status of different technical competencies via live sliders.
- **Avatar System**: Upload custom avatars directly within the app (up to 2MB).
- **Credentials Manager**: Dynamically log, attach, or remove academic and industry certifications.

### 3. 📈 Live Analytics & Metrics
- CORS-compliant backend proxies fetch real-time stats directly from **GitHub** (repos, followers, star count, top languages) and **LeetCode** (problems solved, rankings).
- System-wide mock override capabilities in the control center if remote endpoints experience latency or connection limits.

### 4. 🗺️ B.Tech Interactive Roadmap
- Chronological timeline tracking academic targets across all 4 years of the B.Tech curriculum at REVA University.
- Differentiates milestones into Completed, Current, and Future phases with custom objectives.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Vanilla CSS | Core interface, layout, and type safety |
| **Animations** | Motion (Framer Motion) | Smooth micro-animations, slide-overs, and transitions |
| **Icons** | Lucide React | Modern visual iconography |
| **Backend** | Node.js, Express, tsx | REST API proxies for CORS-bypass and configuration APIs |
| **AI Integration** | Google GenAI SDK (`gemini-3.5-flash`) | Natural language recruiter assistant chatbot |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes packaged with Node.js)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Anandsirigiri07/portfolio.git
   cd portfolio
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env.local` (or `.env`):
     ```bash
     cp .env.example .env.local
     ```
   - In `.env.local`, set your `GEMINI_API_KEY`:
     ```env
     GEMINI_API_KEY="your_actual_api_key_here"
     ```
   *(Note: If no API key is specified, the application will automatically run in local mock fallback mode so all chatbot inquiries remain functional!)*

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 📦 Project Structure

```text
├── assets/             # Static visual assets
├── dist/               # Production build folder (Vite + Server bundle)
├── src/
│   ├── components/     # UI Component libraries (Admin, AI chat, resume, timeline)
│   ├── App.tsx         # Main entry component
│   ├── data.ts         # Initial portfolio profile data seeding
│   ├── index.css       # Core styling & custom HSL color tokens
│   ├── main.tsx        # React client entrypoint
│   └── types.ts        # TypeScript interface definitions
├── server.ts           # Express server setup and backend proxies
├── vite.config.ts      # Vite optimization pipeline configurations
└── tsconfig.json       # TypeScript transpilation settings
```

---

## 💻 Building for Production

To compile both frontend and backend for production use:
```bash
npm run build
```
This builds your frontend files into `dist/` and bundles `server.ts` into a lightweight, standalone Node file `dist/server.cjs`. 

To launch the production bundle:
```bash
npm start
```
