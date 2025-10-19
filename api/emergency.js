export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://lunatek.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const r = await fetch('https://dubemmmm.app.n8n.cloud/webhook/24e4c41f-79d9-478d-93c5-82990a4fdbb2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', 'https://lunatek.vercel.app');
    res.setHeader('Content-Type', 'application/json');
    res.status(r.status).send(text);
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: 'Proxy to n8n failed', detail: String(e) });
  }
}
