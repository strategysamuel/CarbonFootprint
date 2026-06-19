# 🌱 CarbonMirror

> **See the world you create through your everyday choices.**

**Live Demo:** [https://carbon-footprint-231604223102.asia-south1.run.app](https://carbon-footprint-231604223102.asia-south1.run.app)

CarbonMirror is a production-ready carbon footprint awareness platform that drives genuine behavioural change through emotional engagement, behavioural science, AI coaching, and community action — built on Google's full cloud-native stack.

---

## ✨ Features

| Feature | Status |
|---|---|
| Landing page (Framer Motion hero) | ✅ Live |
| Firebase Authentication (Google + Email) | ✅ Live |
| User Onboarding Wizard (5-step) | ✅ Live |
| Dashboard Shell (collapsible sidebar) | ✅ Live |
| Dashboard Overview (Recharts) | ✅ Live |
| Firestore CRUD repositories | ✅ Live |
| Zustand stores (5 domains) | ✅ Live |
| Route protection (middleware + client guard) | ✅ Live |
| Error boundaries | ✅ Live |
| Structured Cloud Logging | ✅ Live |
| Docker multi-stage build | ✅ Live |
| Cloud Build pipeline | ✅ Live |
| Unit & integration tests | ✅ Live |
| Gemini AI Coach | 🔜 Prompt 2 |
| Activity Tracking & Calculations | 🔜 Prompt 2 |
| Community Challenges & Leaderboards | 🔜 Prompt 3 |
| Gamification (Badges, Streaks, XP) | 🔜 Prompt 3 |
| FCM Push Notifications | 🔜 Prompt 3 |
| BigQuery Analytics | 🔜 Prompt 4 |

---

## 🏗 Architecture

```
Browser (Next.js 15 App Router + React 19)
   │
   ├── Zustand stores (auth, user, goals, dashboard, notifications)
   ├── Firebase SDK (client-side auth + Firestore + Storage)
   │
   └── API Routes (Next.js)
         └── Gemini API (server-side, keys never exposed to client)

Google Cloud Infrastructure:
   ├── Cloud Run          — Containerised Next.js app
   ├── Cloud Firestore    — Primary database
   ├── Firebase Auth      — Authentication
   ├── Cloud Storage      — User avatars, assets
   ├── Artifact Registry  — Docker image registry
   ├── Cloud Build        — CI/CD pipeline
   ├── Secret Manager     — Production secrets
   ├── Cloud Logging      — Structured application logs
   └── Cloud Monitoring   — Observability & alerting
```

---

## 📁 Folder Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Auth route group (no layout)
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── dashboard/           # Protected dashboard area
│   │   ├── activities/
│   │   ├── ai-coach/
│   │   ├── community/
│   │   ├── goals/
│   │   └── settings/
│   ├── onboarding/
│   └── api/
│       └── health/
├── components/              # Shared UI components
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   └── ErrorBoundary.tsx
├── features/                # Domain feature modules
│   └── auth/
│       └── AuthProvider.tsx
├── firebase/                # Firebase SDK wrappers
│   ├── firebase.ts          # App singleton + env validation
│   ├── auth.ts              # All auth methods
│   ├── firestore.ts         # DB singleton + converters
│   ├── storage.ts
│   └── messaging.ts         # FCM (lazy, client-only)
├── hooks/                   # Custom React hooks (future)
├── lib/
│   ├── logger.ts            # Structured Cloud Logging compatible
│   └── utils.ts             # cn, formatCarbon, etc.
├── services/                # Firestore repositories
│   ├── userRepository.ts
│   ├── activityRepository.ts
│   ├── goalsRepository.ts
│   └── notificationsRepository.ts
├── stores/                  # Zustand state
│   ├── authStore.ts
│   ├── userStore.ts
│   ├── goalsStore.ts
│   ├── dashboardStore.ts
│   └── notificationStore.ts
├── styles/
│   └── globals.css
├── types/
│   └── index.ts             # All TypeScript interfaces
└── middleware.ts             # Edge route protection
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- Firebase project
- Google Cloud project (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/strategysamuel/CarbonFootprint.git
cd CarbonFootprint
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in methods: Google + Email/Password
4. Create a **Firestore** database (start in production mode)
5. Enable **Storage**
6. Get your app config: Project Settings → Your apps → Web app → SDK snippet

### 3. Set Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_REGION=europe-west1
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 🐳 Docker

### Build locally

```bash
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=your-key \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=... \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=... \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=... \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=... \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=... \
  -t carbon-mirror:local .
```

### Run locally

```bash
docker run -p 8080:8080 carbon-mirror:local
```

---

## ☁️ Cloud Run Deployment

### One-time Setup

```bash
# Set your project
export PROJECT_ID=your-gcp-project-id
export REGION=europe-west1

# Authenticate
gcloud auth login
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com

# Create Artifact Registry repository
gcloud artifacts repositories create carbon-mirror \
  --repository-format=docker \
  --location=$REGION \
  --description="CarbonMirror Docker images"

# Store secrets in Secret Manager
echo -n "your-firebase-api-key" | \
  gcloud secrets create firebase-api-key --data-file=-

# (repeat for each secret…)

echo -n "your-gemini-api-key" | \
  gcloud secrets create gemini-api-key --data-file=-
```

### Trigger Cloud Build

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions="_REGION=$REGION,_SERVICE_NAME=carbon-mirror"
```

### Manual Deploy

```bash
# Build and push
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/carbon-mirror/carbon-mirror:latest .
docker push $REGION-docker.pkg.dev/$PROJECT_ID/carbon-mirror/carbon-mirror:latest

# Deploy
gcloud run deploy carbon-mirror \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/carbon-mirror/carbon-mirror:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --port=8080 \
  --set-secrets=GEMINI_API_KEY=gemini-api-key:latest
```

---

## 🔒 Secret Manager

Secrets are never embedded in the Docker image or environment files. They are:

1. Stored in **Google Secret Manager**
2. Accessed by Cloud Build during the build step (`secretEnv`)
3. Injected into Cloud Run at runtime (`--set-secrets`)

Public Firebase config (`NEXT_PUBLIC_*`) is baked at build time as it is not sensitive (Firebase security is enforced by Firestore Rules, not by hiding config).

The sensitive `GEMINI_API_KEY` is server-side only and never exposed to the browser.

---

## 📊 Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | Profiles, onboarding data, settings, stats |
| `activities` | Logged carbon-producing/saving activities |
| `goals` | User-defined reduction targets |
| `nudges` | Scheduled behavioural nudges |
| `notifications` | In-app notification feed |
| `teams` | Community challenge groups |
| `badges` | Badge definitions |
| `achievements` | Per-user badge awards |
| `streaks` | Daily/weekly streak tracking |
| `aiRecommendations` | Gemini-generated personalised tips |

---

## 🔮 Future Enhancements

- **Carbon Activity Tracking** — Precise CO₂e calculations by category
- **CarbonMirror World** — 3D globe visualising your impact
- **Gemini Sustainability Coach** — Real-time AI chat and Climate Story Generator
- **FCM Nudges** — Scheduled behavioural push notifications
- **Community Challenges** — Team leaderboards and social comparison
- **Gamification** — Badges, XP, streaks, and achievement system
- **BigQuery Analytics** — Aggregated impact reporting and trend analysis
- **Carbon Offsetting** — Partner integrations for verified offsets

---

## 🛠 Troubleshooting

| Issue | Solution |
|---|---|
| Firebase config missing warnings | Copy `.env.example` → `.env.local` and fill in values |
| Auth popup blocked | Ensure your domain is in Firebase Auth → Authorised domains |
| Firestore permission denied | Check Firestore security rules in Firebase Console |
| Docker build fails at npm ci | Delete `node_modules` and `package-lock.json`, run `npm install` |
| Cloud Run container exits immediately | Check `PORT=8080` env var and health check endpoint `/api/health` |

---

## 📜 License

MIT © CarbonMirror Team
