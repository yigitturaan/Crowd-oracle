<div align="center">
  <img src="public/eye-logo.png" alt="Crowd Oracle" width="280" />

  <h1>Crowd Oracle</h1>

  <p><strong>In a world where there is no absolute truth, is the majority always right?</strong></p>

  <p>
    <a href="https://crowd-oracle.vercel.app">Live App</a> &middot;
    <a href="https://farcaster.xyz/miniapps/2S48OqhLgh73/crowd-oracle">Farcaster MiniApp</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Farcaster-MiniApp-8B5CF6?logo=farcaster&logoColor=white" alt="Farcaster" />
    <img src="https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel" alt="Vercel" />
  </p>
</div>

---

## The Philosophy

Crowd Oracle is a social experiment disguised as a prediction platform. It poses bold, binary questions to the crowd and watches what happens when collective intuition meets reality.

The core question driving this project:

> *When no one truly knows the answer, does the majority's conviction become the truth — or just the loudest echo in the room?*

Each round, a single question is presented. Users vote, choose whether they relied on **logic** or **intuition**, and then wait. When the deadline arrives, reality delivers its verdict. The crowd either called it — or it didn't.

The first prophecy: **"Will ETH break $3,000 by January 1, 2026?"**

## How It Works

The app follows a three-stage lifecycle for every question:

```
  VOTING                    LOCKDOWN                   FINAL
  ──────────────────────    ──────────────────────     ──────────────────
  Cast your prophecy        Gates closed               The Eye reveals
  Pick YES or NO            Watch the momentum         Win / Lose / Spectator
  Logic or Intuition?       Countdown to reveal        Share your result
  Live ETH price            Stats are frozen           Next prophecy begins
```

**1. Voting** — The question is live. Users vote YES/NO and declare their methodology (logic & data vs. gut & intuition). Real-time dashboards show bull/bear momentum, tribe analysis, and live price feeds.

**2. Lockdown** — Voting closes. No more entries. The countdown begins. Users can only observe as the charts freeze and anticipation builds.

**3. Final** — Reality speaks. The Eye reveals whether the crowd was right. Winners see golden light; losers get a glitch. Everyone can share their result on Warpcast.

## Features

- **Binary Predictions** — Bold yes/no questions that anyone can answer
- **Decision Methodology Tracking** — Did you use logic or intuition? See how each group performed
- **Real-Time Dashboard** — Live momentum charts, bull/bear ratios, tribe analysis
- **Live Price Feed** — CoinGecko-powered price data with interactive charts
- **Crowd Analytics** — How the collective thinks, split by methodology
- **Warpcast Sharing** — Share your prediction and result with the Farcaster community
- **Community Suggestions** — Users propose the next prophecy
- **Three-Stage Lifecycle** — Voting → Lockdown → Reveal, with automatic stage transitions
- **Farcaster MiniApp** — Native experience inside Farcaster/Warpcast

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Charts | [Recharts](https://recharts.org) |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Platform | [Farcaster MiniApp SDK](https://miniapps.farcaster.xyz) |
| Deployment | [Vercel](https://vercel.com) |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with a `votes` and `suggestions` table

### Setup

```bash
# Clone
git clone https://github.com/yigitturaan/Crowd-oracle.git
cd Crowd-oracle

# Install dependencies
npm install

# Configure environment
cp .example.env .env.local
```

Add your environment variables to `.env.local`:

```env
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema

Create these tables in your Supabase project:

```sql
create table votes (
  id bigint generated always as identity primary key,
  user_id text not null,
  vote_choice text not null,       -- 'yes' or 'no'
  method text not null,            -- 'logic' or 'intuition'
  created_at timestamptz default now()
);

create table suggestions (
  id bigint generated always as identity primary key,
  content text not null,
  created_at timestamptz default now()
);
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing — "Can You See The Future?"
│   ├── vote/                 # Vote page with live ETH price & countdown
│   ├── methodology/          # Logic vs Intuition selection
│   ├── dashboard/            # Real-time stats, charts, sharing
│   ├── lockdown/             # Post-voting observation mode
│   ├── final/                # Result reveal with win/lose/spectator states
│   └── api/                  # API routes
├── components/
│   ├── FinalView.tsx         # Cinematic result screens (win/lose/spectator)
│   ├── LivePrice.tsx         # Real-time ETH price component
│   └── ui/                   # Shared UI components
├── lib/
│   ├── gameConfig.ts         # Stage dates & lifecycle logic
│   └── supabaseClient.ts    # Database client
├── middleware.ts              # Auto-routing based on game stage
└── minikit.config.ts         # Farcaster MiniApp manifest
```

## License

MIT

---

<div align="center">
  <sub>Built with conviction that the crowd knows something we don't.</sub>
</div>
