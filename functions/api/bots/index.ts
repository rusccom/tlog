interface Env {
  DB: D1Database;
}

interface BotInput {
  name: string;
  token: string;
  chat_id: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const result = await env.DB.prepare(
      'SELECT id, name, chat_id, created_at FROM bots ORDER BY created_at DESC'
    ).all();

    return Response.json({ bots: result.results });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch bots', details: String(error) },
      { status: 500 }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = await request.json() as BotInput;
    const { name, token, chat_id } = body;

    if (!name || !token || !chat_id) {
      return Response.json(
        { error: 'Missing required fields: name, token, chat_id' },
        { status: 400 }
      );
    }

    await env.DB.prepare(
      'INSERT INTO bots (name, token, chat_id) VALUES (?, ?, ?)'
    ).bind(name, token, chat_id).run();

    return Response.json({ ok: true });
  } catch (error) {
    const errorMsg = String(error);
    if (errorMsg.includes('UNIQUE constraint')) {
      return Response.json(
        { error: 'Bot with this name already exists' },
        { status: 409 }
      );
    }
    return Response.json(
      { error: 'Failed to create bot', details: errorMsg },
      { status: 500 }
    );
  }
};

