// Vercel 서버리스 함수 — Claude API 키를 서버에만 보관하고 대신 호출해 줍니다.
// 브라우저는 키 없이 /api/analyze 만 호출 → 키가 외부에 노출되지 않습니다.
// 키는 Vercel 환경변수 ANTHROPIC_API_KEY 에 저장됩니다 (코드/깃에 포함 안 됨).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: '서버에 ANTHROPIC_API_KEY가 설정되지 않았습니다.' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { model, max_tokens, messages } = body;
    if (!Array.isArray(messages) || !messages.length) {
      res.status(400).json({ error: 'messages가 필요합니다.' });
      return;
    }
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-6',
        max_tokens: max_tokens || 1024,
        messages,
      }),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
