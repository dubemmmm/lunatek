// api/emergency.js
export const config = { runtime: 'nodejs' }; // <-- valid values: 'nodejs' | 'edge'

const N8N_WEBHOOK =
  'https://dubemmmm.app.n8n.cloud/webhook/24e4c41f-79d9-478d-93c5-82990a4fdbb2';

export default async function handler(req, res) {
  // CORS (permissive; safe since this is your own domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Body can be undefined on Vercel depending on client; fall back to raw read
    let bodyText;
    if (typeof req.body === 'string') {
      bodyText = req.body;
    } else if (req.body && Object.keys(req.body).length) {
      bodyText = JSON.stringify(req.body);
    } else {
      bodyText = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => resolve(data || '{}'));
        req.on('error', reject);
      });
    }

    const r = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyText,
    });

    const text = await r.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(r.status).send(text);
  } catch (err) {
    console.error('Proxy to n8n failed:', err);
    return res.status(502).json({ error: 'Proxy to n8n failed', detail: String(err) });
  }
}
