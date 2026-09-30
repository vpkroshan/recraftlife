# RecraftLife

A production-ready e-waste recycling platform starter with a customer app flow, admin dashboard, backend API, and deployment configuration for `recraftlife.com`.

## What is included
- Backend API with auth, submissions, offers, pickups, payments, and notifications
- Admin dashboard (React + Vite)
- Android app skeleton (Kotlin + Jetpack Compose)
- Docker Compose for local development
- Deployment docs for GoDaddy + Cloudflare + Railway + Vercel
- Environment templates and sample data

## Quick start

```bash
# start backend
docker compose up --build

# or local backend
cd backend
npm install
cp .env.example .env
npm run dev

# admin dashboard
cd frontend/admin
npm install
npm run dev -- --host 0.0.0.0
```

## Default demo accounts

- Customer: `customer@recraftlife.com` / `Demo123!`
- Admin: `admin@recraftlife.com` / `Demo123!`
- Collector: `collector@recraftlife.com` / `Demo123!`

## Project structure

```text
backend/        Node.js API server
frontend/admin/ React admin dashboard
android/        Android Kotlin app skeleton
migrations/     SQL schema starter
README.md       project overview
DEPLOYMENT.md   domain and deployment instructions
.env.example    environment variables template
docker-compose.yml
```

## Production deployment target
- Domain: `https://recraftlife.com`
- API: `https://api.recraftlife.com`
- Admin: `https://admin.recraftlife.com`
- Mobile app: signed Android APK or Firebase App Distribution

## Important notes
- This starter implements a complete architecture, working demo flow, and deployment scaffolding.
- Production credentials (Stripe, Firebase, Twilio, Cloudinary, AI provider) must be supplied before live launch.
- Legal/privacy text is a placeholder and requires regional legal review.

## License
MIT
