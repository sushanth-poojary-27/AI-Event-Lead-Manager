# AI Event Lead Manager

A full-stack application for capturing, organizing, and managing leads collected at business events.

## Features

- Add leads
- Edit leads
- Delete leads
- Search leads by name, company, or email
- Filter leads by follow-up status and event
- PostgreSQL database persistence
- AI-generated lead summaries
- AI-generated follow-up messages
- Responsive dashboard interface

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Next.js API Routes
- AI integration with a mock fallback

## Lead Data

Each lead contains:

- Name
- Company
- Email
- Event
- Notes
- Follow-up status

Follow-up statuses:

- PENDING
- CONTACTED
- FOLLOW_UP
- CLOSED

## Project Structure

```text
app/
  api/
    ai/
    leads/
  page.tsx

components/
  AIResultModal.tsx
  DeleteConfirmModal.tsx
  LeadCard.tsx
  LeadFilters.tsx
  LeadFormModal.tsx
  LeadList.tsx
  StatusBadge.tsx

lib/
  ai.ts
  prisma.ts

prisma/
  schema.prisma

types/
  lead.ts