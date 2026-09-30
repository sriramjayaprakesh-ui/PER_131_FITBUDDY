# FitBuddy – AI Fitness Plan Generator

> **“Your AI-powered personal fitness companion”**

FitBuddy is a modern, responsive full-stack fitness web application powered by **Google Gemini AI (`gemini-3.8-flash`)**. It empowers users to generate structured, personalized 7-day workout plans, goal-specific nutrition and recovery guidance, and allows interactive plan refinement through natural language feedback without overwriting original baseline plans.

---

## 1. Project Title
**FitBuddy – AI Fitness Plan Generator**

## 2. Project Description
FitBuddy bridges the gap between generic fitness templates and expensive personal trainers. By taking into account the user's age, weight, target fitness goal, desired intensity, experience level, available workout days, session duration, and unique equipment/injury constraints, FitBuddy leverages Google Gemini to architect a practical, balanced, and safety-checked 7-day fitness regimen. FitBuddy also features an Admin/Coach Dashboard for monitoring trainees, inspecting routines, and reviewing user feedback.

---

## 3. Key Features

- **User Authentication & Account Management**:
  - Secure signup, login, and session persistence with cryptographically salted password hashing (`crypto.pbkdf2Sync`).
  - Automatically associates personalized workout plans, feedback, and history with the authenticated user account.
  - Built-in 1-Click Demo Logins for fast testing (Alex Rivera, Sarah Chen, Marcus Johnson with `password123`).
- **Personalized 7-Day Workout Routine**:
  - Dynamically structured from Day 1 to Day 7.
  - Each day includes target focus, 5–10 min warm-up, core exercises (with sets, reps/duration, rest times, and form cues), cool-down stretches, and recovery tips.
- **Goal-Tailored Nutrition & Recovery Tips**:
  - Actionable advice aligned directly with the user's primary goal (e.g., protein synthesis for muscle gain, hydration and safe caloric deficit for fat loss, anti-inflammatory whole foods for wellness).
- **Interactive AI Plan Improvement (Feedback Loop)**:
  - Users can submit conversational feedback (e.g., *"Add 15 min of yoga on rest days"*, *"Knee-friendly, avoid high-impact jumping"*, *"Increase core focus"*).
  - Gemini AI analyzes the original blueprint and regenerates a modified 7-day schedule.
- **Plan History & Comparison**:
  - Both Original and Updated plans are stored and accessible side-by-side or through tabbed views.
- **Coach / Admin Dashboard**:
  - Live statistics: Total Users, Plans Generated, Updated Plans, Active Trainees.
  - Filterable by Fitness Goal, Intensity, Experience, and sortable by date or goal.
  - Search by Name or User ID.
  - Full inspection of profile, original plan, updated plan, feedback notes, and user deletion.
- **Print & Offline Download**:
  - One-click print-ready stylesheet for gym printing.
  - Offline text (.txt) export with full workout breakdowns.
- **Safety-First Wellness Logic**:
  - Avoids medical diagnosis or extreme weight-loss protocols.
  - Joint-friendly modifications for beginners.
  - Clear medical disclaimers throughout the UI.

---

## 4. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion
- **Backend**: Node.js 22, Express 4, `@google/genai` TypeScript SDK
- **AI Engine**: Google Gemini (`gemini-3.8-flash`) with structured JSON schema enforcement
- **Storage**: Persistent JSON database engine (`/data/fitbuddy_db.json`) with pre-seeded test profiles
- **Build / Dev Server**: Vite 8 with integrated full-stack API middleware

---

## 5. Gemini AI Integration

FitBuddy utilizes the official `@google/genai` SDK on the server side:

```ts
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' },
  },
});
```

### Core AI Functions:
1. `generateWorkoutPlan(profile)`: Uses `gemini-3.8-flash` with a strict `responseSchema` and system safety instructions to generate all 7 days with warm-ups, exercises, rest intervals, cool-downs, and nutrition tips.
2. `updateWorkoutPlan(originalPlan, feedback, profile)`: Reads original plan details, user profile, and user feedback to safely adapt the 7-day schedule while keeping formatting intact.

*Note: API keys are securely kept on the server and never exposed to the browser.*

---

## 6. Setup Instructions

1. Clone or download the repository.
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Ensure `.env` contains your Gemini API key (automatically configured in Google AI Studio).

---

## 7. Environment Variables

Create or review `.env`:

```env
# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# PORT: Server port (defaults to 3000)
PORT=3000

# APP_URL: Hosted URL
APP_URL="http://localhost:3000"
```

---

## 8. How to Run the Project

- **Development Mode** (Vite Dev Server with integrated API middleware):
  ```bash
  npm run dev
  ```
- **Typecheck & Lint**:
  ```bash
  npm run lint
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Run Full-Stack Server**:
  ```bash
  npm start
  ```

---

## 9. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Registers new user account with hashed password, returns auth token |
| `POST` | `/api/auth/login` | Authenticates user credentials, returns user profile and auth token |
| `GET` | `/api/auth/me` | Validates session token, returns currently logged in user account |
| `GET` | `/api/auth/my-plans` | Retrieves all 7-day plans associated with the authenticated account |
| `POST` | `/api/generate-workout` | Validates user profile, invokes Gemini AI, saves user, returns 7-day plan |
| `POST` | `/api/submit-feedback` | Receives feedback for a user ID, re-runs Gemini adaptation, updates record |
| `GET` | `/api/users` | Lists all users with optional `search`, `goal`, `intensity`, `experience`, `sortBy` filters |
| `GET` | `/api/users/:user_id` | Retrieves single user profile and plan history |
| `DELETE` | `/api/users/:user_id` | Deletes a user profile and their stored plans |
| `GET` | `/api/stats` | Returns aggregate statistics for the coach dashboard |
| `POST` | `/api/reset-demo` | Resets the database to initial high-quality demo profiles |

---

## 10. Project Structure

```
fitbuddy/
├── data/
│   └── fitbuddy_db.json         # Persistent JSON database
├── server/
│   ├── api.ts                   # Express API router & endpoints
│   ├── database.ts              # Data access layer, persistence & demo seed
│   └── geminiService.ts         # @google/genai SDK wrapper, prompt & schemas
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx   # Coach management table & stats
│   │   ├── FeedbackSection.tsx  # User feedback & plan modification form
│   │   ├── FitnessForm.tsx      # Responsive profile input form
│   │   ├── Hero.tsx             # Fitness hero header
│   │   ├── LoadingModal.tsx     # Animated progress modal
│   │   ├── Navbar.tsx           # Athletic navigation bar
│   │   ├── PlanHistory.tsx      # Original vs Updated plan comparison
│   │   ├── PlanView.tsx         # 7-day schedule & nutrition tip viewer
│   │   ├── UserDetailsModal.tsx # Inspection modal for admin
│   │   └── WorkoutDayCard.tsx   # Structured Day 1-7 workout card
│   ├── types/
│   │   └── fitness.ts           # Shared TypeScript interfaces & types
│   ├── utils/
│   │   └── exportPlan.ts        # Text formatter and file download utility
│   ├── App.tsx                  # Main application orchestrator
│   ├── index.css                # Dark gym theme & print stylesheets
│   └── main.tsx                 # React entry point
├── index.html                   # HTML template & fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Node dependencies and scripts
├── server.ts                    # Production Express server
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite configuration with API middleware
```

---

## 11. Safety Disclaimer

> **FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice, diagnosis, or treatment.**
> Always consult a qualified healthcare or certified fitness professional before beginning any new training regimen, especially if you have pre-existing medical conditions, cardiovascular concerns, joint injuries, or pregnancy.

---

## 12. Future Improvements

- Integration with wearable devices (Apple Health, Garmin, Fitbit) for biometric feedback.
- Interactive exercise video demonstration embeds and timer intervals.
- Caloric and macro calculator directly generating daily grocery lists.
- Multi-trainer permissions with client note sharing.
