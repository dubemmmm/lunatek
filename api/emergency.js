// api/emergency.js

// Force a modern Node runtime with global fetch
export const config = { runtime: 'nodejs18.x' };

export default async function handler(req, res) {
  try {
    // Basic CORS (covers previews too)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method === 'GET') return res.status(200).json({ ok: true, message: 'Function is up' });
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Echo back the JSON so we know POST parsing works
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    return res.status(200).send(body);
  } catch (err) {
    console.error('Emergency function error:', err);
    return res.status(500).json({ error: 'FUNCTION_FAILED', detail: String(err) });
  }
}
