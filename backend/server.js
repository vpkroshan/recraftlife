const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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
    status: 'submitted',
    category: 'Smartphone',
    brand: 'Apple',
    model: 'iPhone 12',
    description: 'Cracked screen, charger included',
    condition: 'good',
    offer: {
      value: 45,
      currency: 'USD',
      status: 'sent',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    pickup: {
      date: '2026-10-08',
      slot: '12-16',
      status: 'scheduled'
    },
    payment: { status: 'pending', amount: 45, currency: 'USD' },
    createdAt: new Date().toISOString(),
    timeline: [
      { type: 'submission_received', timestamp: new Date().toISOString() },
      { type: 'under_review', timestamp: new Date().toISOString() }
    ]
  }
];

const notifications = [];

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
}

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'recraftlife-api', time: new Date().toISOString() });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);

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
    return res.status(400).json({ message: 'Email, password and name are required' });
  }

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'User with this email already exists' });
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

app.get('/api/v1/submissions', (req, res) => {
  const { status } = req.query;
  const items = status ? submissions.filter((s) => s.status === status) : submissions;
  res.json({ data: items, total: items.length });
});

app.post('/api/v1/submissions', (req, res) => {
  const payload = req.body || {};
  const newItem = {
    id: `s_${Date.now()}`,
    requestId: `RCL-${Date.now().toString().slice(-5)}`,
    customerId: payload.customerId || 'u_customer_1',
    status: 'submitted',
    category: payload.category || 'Laptop',
    brand: payload.brand || 'Dell',
    model: payload.model || 'Latitude',
    description: payload.description || 'Submitted through the app',
    condition: payload.condition || 'good',
    createdAt: new Date().toISOString(),
    timeline: [{ type: 'submission_received', timestamp: new Date().toISOString() }]
  };

  submissions.unshift(newItem);
  res.status(201).json(newItem);
});

app.get('/api/v1/submissions/:id', (req, res) => {
  const item = submissions.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Submission not found' });
  res.json(item);
});

app.post('/api/v1/offers', (req, res) => {
  const { submissionId, value, currency = 'USD', validityDays = 7 } = req.body || {};
  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) return res.status(404).json({ message: 'Submission not found' });

  submission.offer = {
    value,
    currency,
    status: 'sent',
    expiresAt: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString()
  };
  submission.status = 'offer_sent';
  submission.timeline.push({ type: 'offer_sent', timestamp: new Date().toISOString() });

  return res.status(201).json(submission.offer);
});

app.post('/api/v1/offers/:id/decision', (req, res) => {
  const { decision, chosenAction } = req.body || {};
  const submission = submissions.find((s) => s.offer && s.id === req.params.id);

  if (!submission) return res.status(404).json({ message: 'Offer not found' });

  submission.status = decision === 'accepted' ? 'offer_accepted' : 'offer_rejected';
  submission.offer.status = decision;
  submission.offer.chosenAction = chosenAction || 'sell';
  submission.timeline.push({ type: decision, timestamp: new Date().toISOString() });

  return res.json({ ok: true, decision, chosenAction: submission.offer.chosenAction });
});

app.post('/api/v1/pickups', (req, res) => {
  const { submissionId, date, slot } = req.body || {};
  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) return res.status(404).json({ message: 'Submission not found' });

  submission.status = 'pickup_scheduled';
  submission.pickup = { date, slot, status: 'scheduled' };
  submission.timeline.push({ type: 'pickup_scheduled', timestamp: new Date().toISOString() });

  res.status(201).json(submission.pickup);
});

app.post('/api/v1/payments', (req, res) => {
  const { submissionId, amount } = req.body || {};
  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) return res.status(404).json({ message: 'Submission not found' });

  submission.payment = { status: 'completed', amount, currency: 'USD' };
  submission.status = 'payment_completed';
  submission.timeline.push({ type: 'payment_completed', timestamp: new Date().toISOString() });

  return res.json(submission.payment);
});

app.get('/api/v1/admin/submissions', (req, res) => {
  res.json({ data: submissions, total: submissions.length });
});

app.get('/api/v1/notifications', (req, res) => {
  res.json({ data: notifications, total: notifications.length });
});

app.post('/api/v1/notifications', (req, res) => {
  const notification = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  notifications.unshift(notification);
  res.status(201).json(notification);
});

app.listen(PORT, () => {
  console.log(`RecraftLife API listening on http://localhost:${PORT}`);
});
