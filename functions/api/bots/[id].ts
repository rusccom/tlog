interface Env {
  DB: D1Database;
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const id = params.id as string;

  try {
    const result = await env.DB.prepare(
      'DELETE FROM bots WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
      return Response.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete bot', details: String(error) },
      { status: 500 }
    );
  }
};

