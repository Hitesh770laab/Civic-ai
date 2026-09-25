# 🏙️ CivicAI — Smart Municipal Issue Resolution Platform

> **Explainable AI-Powered Urban Issue Intelligence & Civic Triage Engine**

CivicAI is an urban issue reporting and automated governance resolution platform. It bridges citizens with municipal field operations through computer vision defect detection, NLP urgency evaluation, spatial PostGIS/Shapely ward routing, and explainable SLA tracking.

---

## ✨ Key Features

### 1. 👥 Inclusive & Accessible Citizen View
- **🗣️ Voice-First & Multi-Lingual Guidance**: Integrated Text-to-Speech (audio guide) and Speech-to-Text (microphone voice input) supporting **English**, **हिंदी (Hindi)**, and **Español (Spanish)**.
- **🌟 Easy Visual Mode**: Designed for all citizens including elderly and illiterate users with giant pictorial emojis, sound effects, and simple step-by-step navigation.
- **🎯 YOLOv8 Computer Vision Scanner**: Automatically scans uploaded photos or camera feeds to detect and highlight urban defects (potholes, garbage piles, traffic signals, etc.) with confidence bounding boxes.
- **📍 1-Tap GPS & Spatial Pinning**: Instant geolocation lock or visual pin-drop on stylized municipal ward maps.
- **⚡ NLP Urgency Keyword Analyzer**: Detects high-priority keywords ("school", "hospital", "accident", "flooding") in real-time.

### 2. 🛡️ Field Officer Prioritized Queue
- **Live SLA Timers**: Dynamic countdown monitors for 2h (Critical), 6h (High), 12h (Medium), and 24h (Standard) resolution deadlines.
- **Priority Triage**: Sort by AI score (0–10), category, and status.
- **One-Click Resolution**: Quick status transition from `NEW` ➔ `IN_PROGRESS` ➔ `RESOLVED`.

### 3. 📊 City Admin Operations Dashboard
- **Municipal KPIs**: Live metrics on active tickets, SLA compliance rate, resolved count, and urgent hazard count.
- **🔥 Spatial Hotspot Clusters**: Interactive ward-by-ward density mapping.
- **🧠 4-Factor AI Explanation**: Full mathematical breakdown of priority formulas ($S = W_t + U_{nlp} + D_{vision} + H_{ward}$).

---

## 🛠️ Architecture & Tech Stack

```
CivicAI Platform
├── 🌐 Frontend (React + Vite + Vanilla CSS Tokens)
│   ├── Multi-Lingual Web Speech API (TTS & STT)
│   ├── Web Audio API Synthesizer
│   ├── Canvas Confetti & Micro-Interactions
│   └── Lucide Icons
│
└── ⚡ Backend (FastAPI + Python 3.11+)
    ├── YOLOv8 Defect Vision Service
    ├── Spatial Geometry (Shapely / PostGIS Boundary Polygon Indexing)
    ├── NLP Urgency Scorer & Heuristic Engine
    └── Async REST API with In-Memory Mock Fallbacks
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Run Backend
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
API runs at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

---

## 📄 License
MIT License. Built for smart cities and accessible civic intelligence.
