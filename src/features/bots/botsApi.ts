import type { Bot, BotInput } from './bot.types';

type BotsResponse = { bots?: Bot[] };
type ErrorResponse = { error?: string };

export async function fetchBots(): Promise<Bot[]> {
  const response = await fetch('/api/bots');
  const data: BotsResponse = await response.json();
  return data.bots || [];
}

export async function createBot(bot: BotInput): Promise<void> {
  const response = await fetch('/api/bots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bot)
  });
  
  if (!response.ok) {
    const err: ErrorResponse = await response.json();
    throw new Error(err.error || 'Failed to create bot');
  }
}

export async function deleteBot(id: number): Promise<void> {
  const response = await fetch(`/api/bots/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const err: ErrorResponse = await response.json();
    throw new Error(err.error || 'Failed to delete bot');
  }
}

