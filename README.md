# AI Event Lead Manager

A simple full-stack application for capturing, organizing, and following up with leads collected at business events.

## 🚀 Live Demo

**Live App:** https://ai-event-lead-manager-delta.vercel.app/

**GitHub:** https://github.com/sushanth-poojary-27/AI-Event-Lead-Manager

---

## What I Built

Business event leads are often collected quickly during conferences, meetups, and networking events. Without a simple system, it becomes difficult to organize those contacts and remember who needs to be followed up with.

I built this application to provide a focused workflow for managing event leads from capture to follow-up.

The application allows users to:

- Add new event leads
- Edit lead information
- Delete leads
- Search leads
- Filter leads by event and follow-up status
- Track follow-up progress
- Generate a concise AI-style summary of lead notes
- Draft a personalized follow-up message
- Persist lead data in PostgreSQL

The project intentionally focuses on the core requirements instead of adding unnecessary features.

---

## ✨ Features

### Lead Management

Each lead contains:

- Name
- Company
- Email
- Event
- Notes
- Follow-up status

Supported follow-up statuses:

- `PENDING`
- `CONTACTED`
- `FOLLOW_UP`
- `CLOSED`

### Search & Filtering

Users can quickly find leads using:

- Search by name, company, or email
- Filter by event
- Filter by follow-up status

### AI Assistance

Each lead has two AI actions:

**AI Summary**

Creates a concise summary of the lead notes and highlights useful business context and a possible next step.

**Draft Follow-up**

Creates a professional follow-up message using the lead's information, event, and notes.

The AI functionality is isolated behind a dedicated API route and currently includes a mock fallback so the application works without requiring a paid AI API key.

### Persistent Database

Lead data is stored in PostgreSQL using Prisma ORM.

The deployed application uses a hosted PostgreSQL database, allowing changes made through the live application to persist across sessions.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Production Database | Neon PostgreSQL |
| Deployment | Vercel |
| AI | Dedicated AI API layer with mock fallback |

---

## 🏗 Architecture

```text
                    ┌─────────────────────┐
                    │     Next.js UI      │
                    │   Lead Dashboard    │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
             /api/leads                 /api/ai
                  │                         │
                  ▼                         ▼
              Prisma                  AI Service
                  │                         │
                  ▼                         ▼
        PostgreSQL Database         AI / Mock Fallback
```

The frontend uses reusable components for:

- Lead cards
- Lead forms
- Filters
- Status badges
- Delete confirmation
- AI result display

---

## 📡 API

### Lead API

```text
GET    /api/leads
POST   /api/leads
GET    /api/leads/:id
PATCH  /api/leads/:id
DELETE /api/leads/:id
```

### AI API

```text
POST /api/ai
```

Supported actions:

```text
summary
followup
```

---

## 🗄 Database

The main database model is `Lead`.

```text
Lead
├── id
├── name
├── company
├── email
├── event
├── notes
├── followUpStatus
├── createdAt
└── updatedAt
```

---

## 💻 Local Development

### Prerequisites

- Node.js
- PostgreSQL
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/event_lead_manager?schema=public"
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open:

http://localhost:3000

---

## ✅ Testing

The application was manually tested for:

- Creating leads
- Editing leads
- Deleting leads
- Searching leads
- Filtering by status
- Filtering by event
- PostgreSQL persistence
- AI summary generation
- AI follow-up generation
- Production deployment

---

## 🎯 Design Decisions

### Focused scope

The implementation focuses on the core lead-management workflow requested in the assignment rather than adding unrelated features such as authentication, analytics, email sending, or calendar integrations.

### Reusable UI

The lead form is reused for both creating and editing leads, while AI output is displayed using a reusable result modal.

### API-first backend

Lead operations are handled through dedicated API routes, keeping frontend UI logic separate from database operations.

### AI fallback

The AI functionality is isolated behind `/api/ai`. A mock fallback is included so the application can demonstrate the complete AI workflow without requiring paid AI API access.

---

## 🔮 Possible Future Improvements

With additional time, the application could be extended with:

- Authentication and user-specific lead lists
- Production Gemini API integration
- Pagination for larger lead collections
- Lead and follow-up analytics
- Email sending directly from the application

---

## 👤 Author

**Sushanth Poojary**

Built as a full-stack internship take-home project.