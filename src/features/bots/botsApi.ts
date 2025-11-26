import type { Bot, BotInput } from './bot.types';

export async function fetchBots(): Promise<Bot[]> {
  const response = await fetch('/api/bots');
  const data = await response.json();
  return data.bots || [];
}

export async function createBot(bot: BotInput): Promise<void> {
  const response = await fetch('/api/bots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bot)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create bot');
  }
}

export async function deleteBot(id: number): Promise<void> {
  const response = await fetch(`/api/bots/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete bot');
  }
}

