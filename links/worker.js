// sim-explorer short links: a Cloudflare Worker with one KV namespace bound as LINKS.
//   POST /save        body = the model.js text  ->  { id }        (only from the explorer's own site)
//   GET  /m/<id>      ->  the model.js text, or 404
// Nothing else exists: no listing, no deleting, no overwriting. An id is derived from the code itself,
// so saving the same model twice gives the same link and costs no extra write.
// Guards: size cap, the text must define MODELS, a per-visitor hourly save limit, and every entry expires.

const MAX_BYTES = 200 * 1024;          // a model is usually 10-15 KB
const SAVES_PER_HOUR = 20;             // per visitor (IP address)
const KEEP_SECONDS = 365 * 24 * 3600;  // links stop working one year after the model was first saved
const ALLOWED_ORIGINS = ['https://carolynjfu.com', 'https://lynjfu.github.io'];

function cors(origin, methods) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
const json = (obj, status, headers) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });

async function idFor(code) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code)));
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';   // no look-alikes (l, o, 0, 1)
  let id = '';
  for (let i = 0; i < 12; i++) id += alphabet[digest[i] % alphabet.length];
  return id;                                              // 32^12 ≈ 10^18 possible links
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const siteOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    // read a model: anyone holding the link may read it
    const m = url.pathname.match(/^\/m\/([a-z2-9]{12})$/);
    if (m && request.method === 'GET') {
      const code = await env.LINKS.get('m:' + m[1]);
      if (code == null) return json({ error: 'This link does not exist or has expired.' }, 404, cors('*', 'GET'));
      return new Response(code, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300', ...cors('*', 'GET') } });
    }

    if (url.pathname === '/save') {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(siteOrigin, 'POST, OPTIONS') });
      if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405, cors(siteOrigin, 'POST, OPTIONS'));
      const h = cors(siteOrigin, 'POST, OPTIONS');
      if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: 'Links can only be made from the explorer page.' }, 403, h);

      const code = await request.text();
      if (new TextEncoder().encode(code).length > MAX_BYTES) return json({ error: 'This model is too large to link (over 200 KB).' }, 413, h);
      if (!/const\s+MODELS\s*=/.test(code)) return json({ error: 'This does not look like a model.js (it does not define MODELS).' }, 400, h);

      const id = await idFor(code);
      const key = 'm:' + id;
      if (await env.LINKS.get(key) != null) return json({ id }, 200, h);   // already saved: same link, no write

      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const hour = Math.floor(Date.now() / 3600000);
      const rlKey = `rl:${ip}:${hour}`;
      const used = parseInt(await env.LINKS.get(rlKey) || '0', 10);
      if (used >= SAVES_PER_HOUR) return json({ error: `Too many links made from here this hour (limit ${SAVES_PER_HOUR}). Try again later.` }, 429, h);

      await env.LINKS.put(key, code, { expirationTtl: KEEP_SECONDS });
      await env.LINKS.put(rlKey, String(used + 1), { expirationTtl: 3700 });
      return json({ id }, 201, h);
    }

    return json({ error: 'Not found.' }, 404, cors('*', 'GET'));
  },
};
