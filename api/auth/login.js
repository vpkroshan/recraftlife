import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-key-change-this-in-production';

// Demo users
const users = [
  {
    id: 'u_customer_1',
    email: 'customer@recraftlife.com',
    password: 'Demo123!',
    role: 'customer',
    name: 'Jane Customer'
  },
  {
    id: 'u_admin_1',
    email: 'admin@recraftlife.com',
    password: 'Demo123!',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 'u_collector_1',
    email: 'collector@recraftlife.com',
    password: 'Demo123!',
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  try {
    const token = createToken(user);
    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create token' });
  }
}
