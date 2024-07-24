[![dexxheader](https://github.com/user-attachments/assets/c992c235-d73e-4243-8c0a-83d8e741062d)](https://dexx-drab.vercel.app/)
# Dexx - AI Flashcard & Roadmap Tool


## Introduction

Supercharge your studying with Dexx - the AI tool that generates fully customizable flashcards and roadmaps. Powered by GPT-4.

## Tech Stack

- Next.js 14
- Prisma
- Supabase
- NextAuth
- Shadcn/ui
- TailwindCSS

## Future Updates

- Decrease instances of null or unavailable links in roadmap resources
- Add more login providers
- Public/private decks
- Review sessions provide XP to users
- Leaderboards

## Getting Started

1. **Clone & create the repository**

```bash
npx create-next-app my-project-name --example "https://github.com/alex-melia/dexx"
```

2. **Install the dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Specify environment variables

I used cloudinary to store images, feel free to use your choice of storage

```bash
OPENAI_API_KEY="OPEN_API_KEY"
DATABASE_URL="DATABASE_URL_STRING"
AUTH_SECRET="AUTH_SECRET"
CLOUDINARY_CLOUD_NAME="CLOUDINARY_CLOUD_NAME"
CLOUDINARY_API_KEY="CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="CLOUDINARY_API_SECRET"
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## Running the App

1. **Starting client and server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
