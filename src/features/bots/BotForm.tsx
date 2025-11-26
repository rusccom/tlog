import { useState } from 'react';
import type { BotInput } from './bot.types';

interface BotFormProps {
  onSubmit: (bot: BotInput) => Promise<void>;
}

export function BotForm({ onSubmit }: BotFormProps) {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({ name, token, chat_id: chatId });
      setName('');
      setToken('');
      setChatId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bot-form" onSubmit={handleSubmit}>
      <h2>Добавить бота</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Название</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="payment-alerts"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="token">Токен бота</label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="123456789:ABC-xyz..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="chatId">Chat ID</label>
        <input
          id="chatId"
          type="text"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="-100123456789"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : 'Добавить'}
      </button>
    </form>
  );
}

