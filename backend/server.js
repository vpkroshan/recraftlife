require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const users = [
  {
    id: 'u_customer_1',
    email: 'customer@recraftlife.com',
    password: 'Demo123!',
    role: 'customer',
    name: 'Jane Customer',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u_admin_1',
    email: 'admin@recraftlife.com',
    password: 'Demo123!',
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u_collector_1',
    email: 'collector@recraftlife.com',
    password: 'Demo123!',
    role: 'collector',
    name: 'John Collector',
    createdAt: new Date().toISOString()
  }
];

const submissions = [
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
];

const notifications = [
  {
    id: 'n_01',
    title: 'Offer ready',
    body: 'Your offer is ready for review.',
    userId: 'u_customer_1',
    createdAt: new Date().toISOString(),
    read: false
  }
];

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return function (req, res, next) {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    return next();
  };
}

function generateRequestId() {
  const stamp = Date.now().toString().slice(-6);
  return `RCL-${stamp}`;
}

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'recraftlife-api', timestamp: new Date().toISOString() });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({
    token: createToken(user),
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, name, role = 'customer' } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  if (users.some((item) => item.email === email)) {
    return res.status(409).json({ message: 'A user with this email already exists' });
  }

  const user = {
    id: `u_${Date.now()}`,
    email,
    password,
    role,
    name,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  return res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
    message: 'Registration successful'
  });
});

app.post('/api/v1/auth/reset-password', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email is required' });

  return res.json({ message: `Password reset instructions sent to ${email}` });
});

app.get('/api/v1/submissions', requireAuth, (req, res) => {
  const status = req.query.status;
  const filtered = status ? submissions.filter((item) => item.status === status) : submissions;
  return res.json({ data: filtered, total: filtered.length });
});

app.post('/api/v1/submissions', requireAuth, (req, res) => {
  const payload = req.body || {};
  const submission = {
    id: `s_${Date.now()}`,
    requestId: generateRequestId(),
    customerId: req.user.sub,
    status: 'submitted',
    category: payload.category || 'Laptop',
    brand: payload.brand || 'Dell',
    model: payload.model || 'Latitude',
    description: payload.description || 'Submitted through the app',
    condition: payload.condition || 'good',
    createdAt: new Date().toISOString(),
    timeline: [{ type: 'submission_received', timestamp: new Date().toISOString() }]
  };

  submissions.unshift(submission);
  return res.status(201).json(submission);
});

app.get('/api/v1/submissions/:id', requireAuth, (req, res) => {
  const item = submissions.find((submission) => submission.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  return res.json(item);
});

app.post('/api/v1/offers', requireAuth, requireRole('admin'), (req, res) => {
  const { submissionId, value, currency = 'USD', validityDays = 7 } = req.body || {};
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
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

  return res.status(201).json(submission.offer);
});

app.post('/api/v1/offers/:id/decision', requireAuth, (req, res) => {
  const { decision, chosenAction } = req.body || {};
  const submission = submissions.find((item) => item.id === req.params.id || item.offer?.id === req.params.id);

  if (!submission) {
    return res.status(404).json({ message: 'Offer not found' });
  }

  const normalizedDecision = decision === 'accepted' ? 'accepted' : 'rejected';
  submission.status = normalizedDecision === 'accepted' ? 'offer_accepted' : 'offer_rejected';
  submission.offer.status = normalizedDecision;
  submission.offer.chosenAction = chosenAction || 'sell';
  submission.timeline.push({ type: normalizedDecision, timestamp: new Date().toISOString() });

  return res.json({ ok: true, decision: normalizedDecision, chosenAction: submission.offer.chosenAction });
});

app.post('/api/v1/pickups', requireAuth, (req, res) => {
  const { submissionId, date, slot } = req.body || {};
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  submission.status = 'pickup_scheduled';
  submission.pickup = {
    id: `pick_${Date.now()}`,
    date,
    slot,
    status: 'scheduled'
  };
  submission.timeline.push({ type: 'pickup_scheduled', timestamp: new Date().toISOString() });

  return res.status(201).json(submission.pickup);
});

app.post('/api/v1/payments', requireAuth, (req, res) => {
  const { submissionId, amount, currency = 'USD' } = req.body || {};
  const submission = submissions.find((item) => item.id === submissionId);

  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  submission.payment = {
    id: `pay_${Date.now()}`,
    status: 'completed',
    amount,
    currency
  };
  submission.status = 'payment_completed';
  submission.timeline.push({ type: 'payment_completed', timestamp: new Date().toISOString() });

  return res.json(submission.payment);
});

app.get('/api/v1/admin/submissions', requireAuth, requireRole('admin'), (req, res) => {
  return res.json({ data: submissions, total: submissions.length });
});

app.get('/api/v1/notifications', requireAuth, (req, res) => {
  const items = notifications.filter((item) => item.userId === req.user.sub || req.user.role === 'admin');
  return res.json({ data: items, total: items.length });
});

app.post('/api/v1/notifications', requireAuth, (req, res) => {
  const notification = {
    id: uuidv4(),
    userId: req.user.sub,
    title: req.body.title || 'New update',
    body: req.body.body || 'We have an update for your submission.',
    createdAt: new Date().toISOString(),
    read: false
  };

  notifications.unshift(notification);
  return res.status(201).json(notification);
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`RecraftLife API running on http://localhost:${PORT}`);
});
