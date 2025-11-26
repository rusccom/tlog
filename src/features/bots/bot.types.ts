export interface Bot {
  id: number;
  name: string;
  chat_id: string;
  created_at: string;
}

export interface BotInput {
  name: string;
  token: string;
  chat_id: string;
}

