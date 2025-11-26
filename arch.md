# Tlog — Архитектура

## Обзор
Сервис для отправки логов в Telegram через ботов. Веб-интерфейс для управления ботами + внешний API для приёма логов.

## Технологии
- Frontend: Vite + React + TypeScript
- Backend: Cloudflare Pages Functions
- Database: Cloudflare D1 (SQLite)

## Структура

```
Tlog/
├── src/                        # Frontend
│   ├── App.tsx                 # Главный компонент
│   ├── main.tsx                # Точка входа
│   ├── index.css               # Стили
│   └── features/bots/          # Фича управления ботами
│       ├── BotList.tsx         # Таблица ботов
│       ├── BotForm.tsx         # Форма добавления
│       ├── botsApi.ts          # API функции
│       └── bot.types.ts        # Типы
├── functions/api/              # Backend
│   ├── log.ts                  # POST /api/log
│   └── bots/
│       ├── index.ts            # GET, POST /api/bots
│       └── [id].ts             # DELETE /api/bots/:id
├── migrations/
│   └── 0001_create_bots.sql    # Схема БД
└── wrangler.toml               # Конфиг Cloudflare
```

## База данных

### Таблица `bots`
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Primary key |
| name | TEXT | Уникальное имя бота |
| token | TEXT | Токен Telegram бота |
| chat_id | TEXT | ID чата для отправки |
| created_at | TEXT | Дата создания |

## API

### POST /api/log
Внешний API для отправки логов.

Параметры (multipart/form-data):
- `bot` — название бота
- `type` — 0 (info) или 1 (error)
- `message` — текст сообщения
- `file` — вложение (опционально)

### GET /api/bots
Список всех ботов (для UI).

### POST /api/bots
Добавление бота. Body: `{ name, token, chat_id }`

### DELETE /api/bots/:id
Удаление бота по ID.

## Деплой

1. Создать D1 базу: `npx wrangler d1 create tlog-db`
2. Вставить `database_id` в `wrangler.toml`
3. Миграция: `npx wrangler d1 execute tlog-db --remote --file=./migrations/0001_create_bots.sql`
4. Деплой: `npm run deploy`

