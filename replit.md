# FitFeast - AI-Powered Fitness & Nutrition Platform

## Overview

FitFeast is a full-stack fitness and nutrition application that solves the 70% user dropout rate in fitness apps through AI-personalized, adaptive workout and diet plans. The platform generates personalized Push/Pull/Legs workout splits, nutrition plans based on user metrics, and includes features like TensorFlow.js-powered form analysis, progress tracking with visual analytics, and gamified streak/discipline scoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with Shadcn UI component library (New York style)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Data Visualization**: Recharts for progress charts
- **AI/ML Client-side**: TensorFlow.js with Pose Detection for exercise form analysis

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with local strategy (session-based auth)
- **Password Hashing**: Node.js crypto module (scrypt)
- **Session Storage**: Express-session with in-memory store (MemoryStore)

### Project Structure
```
├── client/               # React frontend
│   └── src/
│       ├── components/   # UI components (Shadcn + custom)
│       ├── pages/        # Route pages
│       ├── hooks/        # Custom React hooks
│       └── utils/        # Utility functions
├── server/               # Express backend
│   ├── routes/           # API route handlers
│   ├── utils/            # Business logic (AI, calorie calculations)
│   └── models.ts         # Mongoose schemas
├── shared/               # Shared types and schemas
│   ├── schema.ts         # Zod schemas for validation
│   └── routes.ts         # API contract definitions
└── migrations/           # Drizzle migrations (if PostgreSQL used)
```

### Build System
- **Development**: Vite dev server with HMR, proxied to Express backend
- **Production**: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### API Design
- RESTful endpoints under `/api/`
- Standardized response format: `{ success: boolean, data: {}, message: string, error?: string }`
- Protected routes use `requireAuth` middleware checking `req.isAuthenticated()`

### Key Features Implementation
1. **AI Content Generation**: OpenAI API with rule-based fallback in `server/utils/aiLogic.ts`
2. **Calorie/Macro Calculations**: Mifflin-St Jeor equation in `server/utils/calorieCalculator.ts`
3. **Form Analysis**: Client-side TensorFlow.js pose detection (simplified demo implementation)
4. **Progress Tracking**: Workout/diet logs with streak calculations and discipline scoring

## External Dependencies

### Database
- **MongoDB**: Primary database via Mongoose ODM
- **Connection**: `MONGODB_URI` environment variable required
- **Note**: Drizzle ORM config exists for PostgreSQL but MongoDB/Mongoose is the active implementation

### AI Services
- **OpenAI API**: For generating personalized workout plans, diet plans, recipes, and feedback
- **Environment Variable**: `OPENAI_API_KEY` (optional - falls back to rule-based logic)

### Authentication
- **Session Secret**: `SESSION_SECRET` environment variable (defaults to hardcoded value in dev)

### Frontend Libraries
- **Radix UI**: Headless UI primitives for accessible components
- **TensorFlow.js**: `@tensorflow/tfjs` and `@tensorflow-models/pose-detection` for client-side ML

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundler for production
- **Drizzle Kit**: Database migration tool (configured but MongoDB is primary)