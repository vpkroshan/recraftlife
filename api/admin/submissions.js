import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-key-change-this-in-production';

// In-memory storage (replace with database in production)
const submissions = [
  {
    id: 's_1001',
    requestId: 'RCL-001',
    customerId: 'u_customer_1',
    status: 'offer_sent',
    category: 'Smartphone',
    brand: 'Apple',
    model: 'iPhone 12',
    description: 'Cracked screen, charger included',
    condition: 'good',
    offer: {
      id: 'of_001',
      value: 45,
      currency: 'USD',
      status: 'sent',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    createdAt: new Date().toISOString(),
    timeline: [
      { type: 'submission_received', timestamp: new Date().toISOString() },
      { type: 'offer_sent', timestamp: new Date().toISOString() }
    ]
  }
];

function requireAuth(token) {
  if (!token || !token.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  try {
    return jwt.verify(token.slice(7), JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization;
    const user = requireAuth(token);
    
    res.status(200).json({
      data: submissions,
      total: submissions.length
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
