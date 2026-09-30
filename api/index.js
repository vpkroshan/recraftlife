import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-key-change-this-in-production';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ⚠️  CHANGE THESE PASSWORDS BEFORE PRODUCTION ⚠️
// These are demo accounts for testing only
const db = {
  users: [
    {
      id: 'u_customer_1',
      email: 'customer@recraftlife.com',
      password: 'Customer@2024!', // CHANGE THIS
      role: 'customer',
      name: 'Jane Customer',
      createdAt: new Date().toISOString()
    },
    {
      id: 'u_admin_1',
      email: 'admin@recraftlife.com',
      password: 'Admin@2024!', // CHANGE THIS
      role: 'admin',
      name: 'Admin User',
      createdAt: new Date().toISOString()
    },
    {
      id: 'u_collector_1',
      email: 'collector@recraftlife.com',
      password: 'Collector@2024!', // CHANGE THIS
      role: 'collector',
      name: 'John Collector',
      createdAt: new Date().toISOString()
    }
  ],
  submissions: [
    {
      id: 's_1001',
      requestId: 'RCL-001',
      customerId: 'u_customer_1',
      status: 'offer_sent',
      category: 'Smartphone',
      brand: 'Apple',
      model: 'iPhone 12',
      description: 'Cracked screen and charger included',
      condition: 'good',
      images: [],
      offer: {
        id: 'of_001',
        value: 45,
        currency: 'USD',
        status: 'sent',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      pickup: {
        id: 'pick_001',
        date: '2026-10-08',
        slot: '12-16',
        status: 'scheduled'
      },
      payment: { id: 'pay_001', status: 'pending', amount: 45, currency: 'USD' },
      createdAt: new Date().toISOString(),
      timeline: [
        { type: 'submission_received', timestamp: new Date().toISOString() },
        { type: 'under_review', timestamp: new Date().toISOString() },
        { type: 'offer_sent', timestamp: new Date().toISOString() }
      ]
    }
  ],
  notifications: []
};

function createToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'recraftlife-api', timestamp: new Date().toISOString() });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    token: createToken(user),
    user: { id: user.id, email: user.email, role: user.role, name: user.name }
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, name, role = 'customer' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (db.users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const user = {
    id: `u_${Date.now()}`,
    email,
    password,
    role,
    name,
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

app.get('/api/v1/submissions', requireAuth, (req, res) => {
  const status = req.query.status;
  const filtered = status
    ? db.submissions.filter((s) => s.status === status)
    : db.submissions;
  res.json({ data: filtered, total: filtered.length });
});

app.post('/api/v1/submissions', requireAuth, (req, res) => {
  const submission = {
    id: `s_${Date.now()}`,
    requestId: `RCL-${Date.now().toString().slice(-6)}`,
    customerId: req.user.sub,
    status: 'submitted',
    ...req.body,
    createdAt: new Date().toISOString(),
    timeline: [{ type: 'submission_received', timestamp: new Date().toISOString() }]
  };

  db.submissions.unshift(submission);
  res.status(201).json(submission);
});

app.get('/api/v1/submissions/:id', requireAuth, (req, res) => {
  const submission = db.submissions.find((s) => s.id === req.params.id);
  if (!submission) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(submission);
});

app.post('/api/v1/offers', requireAuth, requireRole('admin'), (req, res) => {
  const { submissionId, value, currency = 'USD', validityDays = 7 } = req.body;
  const submission = db.submissions.find((s) => s.id === submissionId);

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  submission.offer = {
    id: `of_${Date.now()}`,
    value,
    currency,
    status: 'sent',
    expiresAt: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString()
  };
  submission.status = 'offer_sent';
  submission.timeline.push({ type: 'offer_sent', timestamp: new Date().toISOString() });

  res.status(201).json(submission.offer);
});

app.post('/api/v1/offers/:id/decision', requireAuth, (req, res) => {
  const { decision, chosenAction } = req.body;
  const submission = db.submissions.find((s) => s.id === req.params.id);

  if (!submission) {
    return res.status(404).json({ error: 'Not found' });
  }

  submission.status = decision === 'accepted' ? 'offer_accepted' : 'offer_rejected';
  submission.offer.status = decision;
  submission.timeline.push({ type: decision, timestamp: new Date().toISOString() });

  res.json({ ok: true, decision, chosenAction });
});

app.post('/api/v1/pickups', requireAuth, (req, res) => {
  const { submissionId, date, slot } = req.body;
  const submission = db.submissions.find((s) => s.id === submissionId);

  if (!submission) {
    return res.status(404).json({ error: 'Not found' });
  }

  submission.status = 'pickup_scheduled';
  submission.pickup = { id: `pick_${Date.now()}`, date, slot, status: 'scheduled' };
  submission.timeline.push({ type: 'pickup_scheduled', timestamp: new Date().toISOString() });

  res.status(201).json(submission.pickup);
});

app.post('/api/v1/payments', requireAuth, (req, res) => {
  const { submissionId, amount, currency = 'USD' } = req.body;
  const submission = db.submissions.find((s) => s.id === submissionId);

  if (!submission) {
    return res.status(404).json({ error: 'Not found' });
  }

  submission.payment = { id: `pay_${Date.now()}`, status: 'completed', amount, currency };
  submission.status = 'payment_completed';
  submission.timeline.push({ type: 'payment_completed', timestamp: new Date().toISOString() });

  res.json(submission.payment);
});

app.get('/api/v1/admin/submissions', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ data: db.submissions, total: db.submissions.length });
});

app.get('/api/v1/notifications', requireAuth, (req, res) => {
  const notifications = db.notifications.filter(
    (n) => n.userId === req.user.sub || req.user.role === 'admin'
  );
  res.json({ data: notifications, total: notifications.length });
});

app.post('/api/v1/notifications', requireAuth, (req, res) => {
  const notification = {
    id: uuidv4(),
    userId: req.user.sub,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notification);
  res.status(201).json(notification);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`RecraftLife API running on port ${PORT}`);
});

export default app;
