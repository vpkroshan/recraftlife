# RecraftLife API

This folder contains the backend API starter. It is intentionally small but functional, with routes for auth, submissions, offers, pickups, payments, and notifications.

## Local development

```bash
cd backend
npm install
cp ../.env.example .env
npm run dev
```

## Endpoints

- `GET /health`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/submissions`
- `POST /api/v1/submissions`
- `GET /api/v1/submissions/:id`
- `POST /api/v1/offers`
- `POST /api/v1/offers/:id/decision`
- `POST /api/v1/pickups`
- `POST /api/v1/payments`
- `GET /api/v1/admin/submissions`
