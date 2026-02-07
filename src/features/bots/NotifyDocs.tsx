import { useState } from 'react';

type Platform = 'javascript' | 'python' | 'curl' | 'php' | 'csharp';

interface Props {
  apiUrl: string;
}

const platforms: { id: Platform; label: string }[] = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'curl', label: 'cURL' },
  { id: 'php', label: 'PHP' },
  { id: 'csharp', label: 'C#' },
];

export function NotifyDocs({ apiUrl }: Props) {
  const [platform, setPlatform] = useState<Platform>('javascript');
  const [copied, setCopied] = useState(false);

  const getCode = (p: Platform): string => {
    const base = `${apiUrl}/api/notify`;
    const codes: Record<Platform, string> = {
      javascript: `// One-liner: отправка уведомления в Telegram
// GET ${base}?bot=BOT_NAME&message=TEXT&type=0|1
//
// Параметры:
//   bot     — название бота (обязательно)
//   message — текст сообщения (обязательно)
//   type    — 0 = info (по умолчанию), 1 = error
//
// Ответы:
//   200: { ok: true }
//   400: { error: "..." }  — не переданы обязательные параметры
//   404: { error: "..." }  — бот не найден
//   500: { error, details } — ошибка Telegram

// Одна строка — info:
fetch('${base}?bot=my-bot&message=User+logged+in');

// Одна строка — error:
fetch('${base}?bot=my-bot&type=1&message=Payment+failed');`,

      python: `# One-liner: отправка уведомления в Telegram
# GET ${base}?bot=BOT_NAME&message=TEXT&type=0|1
#
# Параметры:
#   bot     — название бота (обязательно)
#   message — текст сообщения (обязательно)
#   type    — 0 = info (по умолчанию), 1 = error

import requests

# Одна строка — info:
requests.get('${base}?bot=my-bot&message=Server+started')

# Одна строка — error:
requests.get('${base}?bot=my-bot&type=1&message=DB+connection+lost')`,

      curl: `# One-liner: отправка уведомления в Telegram
# GET ${base}?bot=BOT_NAME&message=TEXT&type=0|1
#
# Параметры:
#   bot     — название бота (обязательно)
#   message — текст сообщения (обязательно)
#   type    — 0 = info (по умолчанию), 1 = error

# Info:
curl "${base}?bot=my-bot&message=Deployment+complete"

# Error:
curl "${base}?bot=my-bot&type=1&message=Build+failed"`,

      php: `<?php
// One-liner: отправка уведомления в Telegram
// GET ${base}?bot=BOT_NAME&message=TEXT&type=0|1
//
// Параметры:
//   bot     — название бота (обязательно)
//   message — текст сообщения (обязательно)
//   type    — 0 = info (по умолчанию), 1 = error

// Info:
file_get_contents('${base}?bot=my-bot&message=User+registered');

// Error:
file_get_contents('${base}?bot=my-bot&type=1&message=Database+error');`,

      csharp: `// One-liner: отправка уведомления в Telegram
// GET ${base}?bot=BOT_NAME&message=TEXT&type=0|1
//
// Параметры:
//   bot     — название бота (обязательно)
//   message — текст сообщения (обязательно)
//   type    — 0 = info (по умолчанию), 1 = error

// Info:
new HttpClient().GetAsync("${base}?bot=my-bot&message=App+started");

// Error:
new HttpClient().GetAsync("${base}?bot=my-bot&type=1&message=Crash+detected");`,
    };
    return codes[p];
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCode(platform));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="api-docs">
      <h2>⚡ Quick Notify (one-liner)</h2>
      <p className="api-docs-desc">
        Одна строка кода — уведомление в Telegram. Вставь в любой проект.
      </p>

      <div className="platform-tabs">
        {platforms.map((p) => (
          <button
            key={p.id}
            className={`platform-tab ${platform === p.id ? 'active' : ''}`}
            onClick={() => setPlatform(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="code-block">
        <button onClick={handleCopy} className="copy-btn">
          {copied ? '✓ Скопировано!' : 'Копировать'}
        </button>
        <pre className="api-docs-code">{getCode(platform)}</pre>
      </div>
    </section>
  );
}
