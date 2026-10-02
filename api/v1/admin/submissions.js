import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-key';

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
      status: 'sent'
    },
    createdAt: new Date().toISOString()
  }
];

function verifyToken(header) {
  if (!header || !header.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  try {
    return jwt.verify(header.slice(7), JWT_SECRET);
  } catch {
    throw new Error('Invalid token');
  }
}

export default function handler(req, res) {
  const allowedOrigins = [
    'https://recraftlife.vercel.app',
    'http://localhost:5173',
    'https://recraftlife.com',
    'http://recraftlife.com'
  ];

  const origin = req.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : 'https://recraftlife.vercel.app';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    verifyToken(req.headers.authorization);

    return res.status(200).json({
      data: submissions,
      total: submissions.length
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}
