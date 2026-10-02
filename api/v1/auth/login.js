import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-key';

const users = [
  {
    id: 'u_customer_1',
    email: 'customer@recraftlife.com',
    password: 'Customer@2024!',
    role: 'customer',
    name: 'Jane Customer'
  },
  {
    id: 'u_admin_1',
    email: 'admin@recraftlife.com',
    password: 'Admin@2024!',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 'u_collector_1',
    email: 'collector@recraftlife.com',
    password: 'Collector@2024!',
    role: 'collector',
    name: 'John Collector'
  }
];

function createToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createToken(user);

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
}
