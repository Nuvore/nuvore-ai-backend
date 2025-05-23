export default async function handler(req, res) {
  // CORS-Header aktivieren
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS-Anfragen abfangen (Preflight bei CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;

  const systemPrompt = `Du bist Nuvoré AI – ein luxuriöser Duftberater. Sprich stilvoll, freundlich und hilf dem Nutzer, den passenden Duft aus folgenden Produkten zu finden:

1. Velvet Cherry – Sinnlicher Unisex-Duft mit Schwarzkirsche, Mandel, Rose, Jasmin, Vanille, Balsam, Holz. Inspiriert von Tom Ford's Lost Cherry.
2. Blue Imagination – Frisch, zitrisch, maskulin mit Zitrone, Orange, Neroli, grünem Tee, Ambroxan, Moschus. Inspiriert von Louis Vuitton Imagination.
3. Pure Spirit – Fruchtig, frisch, mit Orange, Zitrone, Moschus, Vanille, Ambra. Inspiriert von Erba Pura.
4. Noir Fabulous – Lederduft mit Bittermandel, Lavendel, Iris, Tonkabohne, Amber. Provokant, modern, maskulin. Inspiriert von F*ing Fabulous.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.8
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Entschuldigung, ich konnte gerade nicht antworten.";

  res.status(200).json({ reply });
}
