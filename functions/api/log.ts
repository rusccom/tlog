interface Env {
  DB: D1Database;
}

interface Bot {
  id: number;
  name: string;
  token: string;
  chat_id: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    
    const botName = formData.get('bot') as string;
    const type = formData.get('type') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;

    if (!botName || !message) {
      return Response.json(
        { error: 'Missing required fields: bot, message' },
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
    const typeLabel = type === '1' ? 'ERROR' : 'INFO';
    const text = `${icon} *${typeLabel}*\n\n${message}`;

    const telegramUrl = `https://api.telegram.org/bot${bot.token}`;

    if (file && file.size > 0) {
      const telegramForm = new FormData();
      telegramForm.append('chat_id', bot.chat_id);
      telegramForm.append('caption', text);
      telegramForm.append('parse_mode', 'Markdown');
      telegramForm.append('document', file, file.name);

      const response = await fetch(`${telegramUrl}/sendDocument`, {
        method: 'POST',
        body: telegramForm
      });

      if (!response.ok) {
        const err = await response.text();
        return Response.json({ error: 'Telegram error', details: err }, { status: 500 });
      }
    } else {
      const response = await fetch(`${telegramUrl}/sendMessage`, {
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
        return Response.json({ error: 'Telegram error', details: err }, { status: 500 });
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
};

