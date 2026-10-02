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

  return res.status(200).json({
    ok: true,
    service: 'recraftlife-api',
    timestamp: new Date().toISOString()
  });
}
