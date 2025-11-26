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

export function ApiDocs({ apiUrl }: Props) {
  const [platform, setPlatform] = useState<Platform>('javascript');
  const [copied, setCopied] = useState(false);

  const getCode = (p: Platform): string => {
    const codes: Record<Platform, string> = {
      javascript: `// Tlog - Telegram Logger
// API: POST ${apiUrl}/api/log (multipart/form-data)

async function sendLog(bot: string, type: 0 | 1, message: string, file?: File) {
  const form = new FormData();
  form.append('bot', bot);
  form.append('type', String(type));
  form.append('message', message);
  if (file) form.append('file', file);
  
  const res = await fetch('${apiUrl}/api/log', { method: 'POST', body: form });
  if (!res.ok) throw new Error((await res.json()).error);
}

// Usage:
sendLog('my-bot', 0, 'User logged in');        // info
sendLog('my-bot', 1, 'Payment failed');        // error`,

      python: `# Tlog - Telegram Logger
# API: POST ${apiUrl}/api/log (multipart/form-data)

import requests

def send_log(bot: str, log_type: int, message: str, file_path: str = None):
    """Send log to Telegram. type: 0=info, 1=error"""
    data = {'bot': bot, 'type': log_type, 'message': message}
    files = {'file': open(file_path, 'rb')} if file_path else None
    r = requests.post('${apiUrl}/api/log', data=data, files=files)
    r.raise_for_status()

# Usage:
send_log('my-bot', 0, 'Server started')
send_log('my-bot', 1, 'Error occurred', './error.log')`,

      curl: `# Tlog - Telegram Logger
# API: POST ${apiUrl}/api/log (multipart/form-data)

# Info log
curl -X POST ${apiUrl}/api/log \\
  -F "bot=my-bot" \\
  -F "type=0" \\
  -F "message=Deployment complete"

# Error log with file
curl -X POST ${apiUrl}/api/log \\
  -F "bot=my-bot" \\
  -F "type=1" \\
  -F "message=Error log attached" \\
  -F "file=@./error.log"`,

      php: `<?php
// Tlog - Telegram Logger
// API: POST ${apiUrl}/api/log (multipart/form-data)

function sendLog(string $bot, int $type, string $message, ?string $filePath = null): void {
    $data = ['bot' => $bot, 'type' => $type, 'message' => $message];
    
    if ($filePath && file_exists($filePath)) {
        $data['file'] = new CURLFile($filePath);
    }
    
    $ch = curl_init('${apiUrl}/api/log');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
}

// Usage:
sendLog('my-bot', 0, 'User registered');
sendLog('my-bot', 1, 'Database error', './debug.log');`,

      csharp: `// Tlog - Telegram Logger
// API: POST ${apiUrl}/api/log (multipart/form-data)

using System.Net.Http;

public static async Task SendLog(string bot, int type, string message, string? filePath = null)
{
    using var client = new HttpClient();
    using var form = new MultipartFormDataContent();
    
    form.Add(new StringContent(bot), "bot");
    form.Add(new StringContent(type.ToString()), "type");
    form.Add(new StringContent(message), "message");
    
    if (filePath != null)
        form.Add(new ByteArrayContent(File.ReadAllBytes(filePath)), "file", Path.GetFileName(filePath));
    
    var response = await client.PostAsync("${apiUrl}/api/log", form);
    response.EnsureSuccessStatusCode();
}

// Usage:
await SendLog("my-bot", 0, "App started");
await SendLog("my-bot", 1, "Crash detected", "./crash.log");`,
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
      <h2>📋 Интеграция API</h2>
      <p className="api-docs-desc">
        Выбери платформу и скопируй готовый код для отправки логов
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

      <div className="api-response">
        <h3>Ответы API</h3>
        <table className="response-table">
          <thead>
            <tr><th>Статус</th><th>Ответ</th><th>Описание</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>200</code></td>
              <td><code>{'{ ok: true }'}</code></td>
              <td>Лог отправлен</td>
            </tr>
            <tr>
              <td><code>400</code></td>
              <td><code>{'{ error: "..." }'}</code></td>
              <td>Не переданы обязательные поля</td>
            </tr>
            <tr>
              <td><code>404</code></td>
              <td><code>{'{ error: "..." }'}</code></td>
              <td>Бот не найден</td>
            </tr>
            <tr>
              <td><code>500</code></td>
              <td><code>{'{ error: "...", details: "..." }'}</code></td>
              <td>Ошибка Telegram/сервера</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

