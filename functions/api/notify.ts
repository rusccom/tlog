interface Env {
  DB: D1Database;
}

interface Bot {
  id: number;
  name: string;
  token: string;
  chat_id: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const botName = url.searchParams.get('bot');
  const type = url.searchParams.get('type') ?? '0';
  const message = url.searchParams.get('message');

  if (!botName || !message) {
    return Response.json(
      { error: 'Missing required params: bot, message' },
      { status: 400 }
    );
  }

  const bot = await env.DB.prepare(
    'SELECT * FROM bots WHERE name = ?'
  ).bind(botName).first<Bot>();

  if (!bot) {
    return Response.json(
      { error: `Bot "${botName}" not found` },
      { status: 404 }
    );
  }

  const icon = type === '1' ? '🔴' : '🔵';
  const label = type === '1' ? 'ERROR' : 'INFO';
  const text = `${icon} *${label}*\n\n${message}`;

  const tgUrl = `https://api.telegram.org/bot${bot.token}`;
  const response = await fetch(`${tgUrl}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: bot.chat_id,
      text,
      parse_mode: 'Markdown'
    })
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json(
      { error: 'Telegram error', details: err },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
};
