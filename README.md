# LeadGate AI

Intelligent lead qualification SaaS for agencies, coaches, and consultants. Automatically score and qualify leads with AI before they book sales calls.

> **Quick Start:** Clone the repo, copy `.env.example` to `.env`, run `npm install && npm run dev`, and open `http://localhost:3000`.

## Features

- **AI Lead Scoring** — GPT-powered evaluation of budget, timeline, urgency, and problem quality
- **Lead Gate** — Only qualified leads see your booking calendar
- **Calendly Integration** — Qualified leads book calls directly
- **Slack Notifications** — Instant alerts for qualified leads
- **Lead Command Center** — Analytics dashboard with lead management
- **Custom Scoring Rules** — Adjust weights to match your ideal client profile
- **Multi-Tenant Forms** — Each user gets a unique form link (`/form/{userId}`)
- **Stripe Billing** — Pro plan at $499/month

## Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth v5 (email/password)
- **AI:** OpenAI API (GPT-4o-mini)
- **Payments:** Stripe subscriptions
- **Notifications:** Slack webhooks

## Project Structure

```
leadgate-ai/
├── prisma/
│   └── schema.prisma          # Database models
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & signup pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/     # Lead Command Center
│   │   │   ├── settings/      # User settings
│   │   │   └── billing/       # Stripe billing
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth + signup
│   │   │   ├── leads/         # Lead CRUD + stats
│   │   │   ├── score-lead/    # AI scoring engine
│   │   │   ├── settings/      # User settings API
│   │   │   └── stripe/        # Checkout, portal, webhook
│   │   ├── form/[userId]/     # Public lead qualification form
│   │   └── page.tsx           # Landing page
│   ├── components/            # UI components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── openai.ts          # AI scoring & summaries
│   │   ├── prisma.ts          # Prisma client
│   │   ├── slack.ts           # Slack notifications
│   │   ├── stripe.ts          # Stripe config
│   │   └── validations.ts     # Zod schemas
│   └── types/                 # TypeScript declarations
├── .env.example               # Environment variables template
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Stripe account (test mode)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd leadgate-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/leadgate"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI — get from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# Stripe — get from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_KEY="pk_test_..."

# Create a product + price in Stripe Dashboard → Products
NEXT_PUBLIC_STRIPE_PRICE_ID="price_..."

# Stripe CLI webhook secret (see below)
STRIPE_WEBHOOK_SECRET="whsec_..."

# Optional: Slack webhook URL
SLACK_WEBHOOK_URL=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 4. Set Up Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products) → Products
2. Create a new product: **"LeadGate AI Pro"** at **$499/month** (recurring)
3. Copy the Price ID (starts with `price_`) into `.env` as `NEXT_PUBLIC_STRIPE_PRICE_ID`
4. For webhooks locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

5. Copy the webhook signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - LeadGate AI"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Set the **Framework Preset** to **Next.js**
3. Add all environment variables from `.env` in the Vercel dashboard:
   - `DATABASE_URL` — Use a hosted PostgreSQL (Neon, Supabase, Railway, or Vercel Postgres)
   - `NEXTAUTH_SECRET` — A secure random string
   - `NEXTAUTH_URL` — Your Vercel deployment URL (e.g., `https://leadgate-ai.vercel.app`)
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY` (use live keys for production)
   - `NEXT_PUBLIC_STRIPE_KEY`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET` — Create a webhook endpoint in Stripe Dashboard pointing to `https://your-domain.com/api/stripe/webhook`
   - `NEXT_PUBLIC_APP_URL` — Your Vercel deployment URL
   - `SLACK_WEBHOOK_URL` (optional)

4. Click **Deploy**

### 3. Run Database Migrations

After deployment, run migrations against your production database:

```bash
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

### 4. Configure Stripe Webhook (Production)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret to your Vercel env as `STRIPE_WEBHOOK_SECRET`

## How It Works

1. **User signs up** → Gets a unique form link (`/form/{userId}`)
2. **User shares form link** → Prospects fill in project details
3. **AI scores the lead** → OpenAI evaluates budget, timeline, urgency, problem quality
4. **Lead routing:**
   - Score ≥ threshold → Show booking calendar + Slack notification + save as QUALIFIED
   - Score < threshold → Show thank-you page + save as DISQUALIFIED
5. **Dashboard** → View all leads, scores, AI reasoning, and analytics

## License

Private — All rights reserved.
