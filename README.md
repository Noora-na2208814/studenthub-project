# studenthub-project

This repository contains the implementation of a Social Media Platform developed for CMPS 350.

## Project Structure
- phase1: Frontend implementation
- phase2: Full-stack implementation with database (Next.js + Prisma)

## How to Run Phase 2

1. Navigate to phase2:
cd phase2

2. Install dependencies:
npm install

3. Setup database:
npx prisma generate
npx prisma migrate dev

4. Seed database:
npx prisma db seed

5. Run the project:
npm run dev

6. Open in browser:
http://localhost:3000/client/index.html