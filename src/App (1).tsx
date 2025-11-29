import { useState, useEffect } from 'react';
import { BotForm } from './features/bots/BotForm';
import { BotList } from './features/bots/BotList';
import { fetchBots, createBot, deleteBot } from './features/bots/botsApi';
import type { Bot, BotInput } from './features/bots/bot.types';

export function App() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBots = async () => {
    try {
      const data = await fetchBots();
      setBots(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBots();
  }, []);

  const handleCreate = async (bot: BotInput) => {
    await createBot(bot);
    await loadBots();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Удалить этого бота?')) {
      await deleteBot(id);
      await loadBots();
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Tlog</h1>
        <p>Telegram Logger Service</p>
      </header>

      <main>
        <BotForm onSubmit={handleCreate} />
        
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : (
          <BotList bots={bots} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

