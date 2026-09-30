# RecraftLife Deployment Guide

This guide configures the project for live deployment on `recraftlife.com` using GoDaddy + Cloudflare + Railway + Vercel.

## Domains
- Customer app: `https://recraftlife.com`
- API: `https://api.recraftlife.com`
- Admin: `https://admin.recraftlife.com`

## 1) GoDaddy + Cloudflare setup

1. Log into GoDaddy and open your domain `recraftlife.com`.
2. Go to DNS settings.
3. Change nameservers to Cloudflare nameservers.
4. Add the site to Cloudflare and confirm it owns the domain.
5. In Cloudflare DNS, configure:

```dns
TYPE  NAME                  VALUE
CNAME api                  api.recraftlife.railway.app
CNAME admin                recraftlife-admin.vercel.app
CNAME @                    recraftlife.vercel.app
```

6. Turn on SSL/TLS in Cloudflare and set `Full (strict)`.

## 2) Backend deployment (Railway)

1. Create a new Railway project.
2. Add a PostgreSQL service.
3. Add a Node.js service from this GitHub repo.
4. Add the following env vars:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=replace_with_secure_secret
DATABASE_URL=postgresql://... 
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
BREVO_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
BASE_URL=https://api.recraftlife.com
ADMIN_URL=https://admin.recraftlife.com
```

5. Set the domain `api.recraftlife.com` to the Railway service.
6. Deploy.

## 3) Admin dashboard deployment (Vercel)

1. Import `frontend/admin` into Vercel.
2. Set build command to `npm install && npm run build`.
3. Set output directory to `dist`.
4. Set environment variable:

```bash
VITE_API_BASE_URL=https://api.recraftlife.com
```

5. Add custom domain `admin.recraftlife.com`.

## 4) Customer website deployment

Optionally deploy a marketing site or redirect to admin or app download page on Vercel or Netlify.

## 5) Android app

- Build the Android app with signing keys.
- Distribute via GitHub Releases or Firebase App Distribution.
- Configure backend base URL to `https://api.recraftlife.com`.

## 6) Go-Live checklist

- HTTPS works on all domains
- Database migrations executed
- Admin login works
- Customer registration works
- Submission flow works
- Offer workflow works
- Notification email/SMS templates tested
- Stripe/Firebase/Twilio credentials are in production secrets
- Backup/monitoring configured

## 7) Monitoring

- UptimeRobot for domain checks
- Railway logs for API logs
- Vercel logs for admin dashboard errors
- Sentry (optional) for structured error monitoring
