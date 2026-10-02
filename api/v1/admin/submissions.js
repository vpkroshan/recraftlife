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
    offer: { id: 'of_001', value: 45, currency: 'USD', status: 'sent' },
    createdAt: new Date().toISOString()
  }
];

function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    verifyToken(req.headers.authorization);
    res.status(200).json({ data: submissions, total: submissions.length });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
