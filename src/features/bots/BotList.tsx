import type { Bot } from './bot.types';

interface BotListProps {
  bots: Bot[];
  onDelete: (id: number) => Promise<void>;
}

export function BotList({ bots, onDelete }: BotListProps) {
  if (bots.length === 0) {
    return <p className="empty">Нет добавленных ботов</p>;
  }

  return (
    <div className="bot-list">
      <h2>Список ботов</h2>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Chat ID</th>
            <th>Создан</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <tr key={bot.id}>
              <td>{bot.name}</td>
              <td>{bot.chat_id}</td>
              <td>{new Date(bot.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(bot.id)}
                  title="Удалить"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

