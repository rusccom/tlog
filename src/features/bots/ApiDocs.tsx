import { useState } from 'react';

interface Props {
  apiUrl: string;
}

export function ApiDocs({ apiUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const prompt = `## Tlog API Integration

Integrate logging to Telegram using the Tlog service.

### API Endpoint
POST ${apiUrl}/api/log

### Request Format
Content-Type: multipart/form-data

### Parameters
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| bot       | string | Yes      | Bot name registered in Tlog |
| type      | number | Yes      | 0 = info, 1 = error |
| message   | string | Yes      | Log message text |
| file      | File   | No       | Attachment (image, document) |

### Response
- 200: { "ok": true }
- 400: { "error": "error description" }
- 404: { "error": "Bot not found" }
- 500: { "error": "Failed to send message" }

### Usage Examples

**JavaScript/TypeScript:**
\`\`\`typescript
async function sendLog(bot: string, type: 0 | 1, message: string, file?: File) {
  const form = new FormData();
  form.append('bot', bot);
  form.append('type', String(type));
  form.append('message', message);
  if (file) form.append('file', file);
  
  const res = await fetch('${apiUrl}/api/log', { method: 'POST', body: form });
  if (!res.ok) throw new Error((await res.json()).error);
}

// Info log
sendLog('my-bot', 0, 'User logged in: user@example.com');

// Error log
sendLog('my-bot', 1, 'Payment failed: insufficient funds');
\`\`\`

**Python:**
\`\`\`python
import requests

def send_log(bot: str, log_type: int, message: str, file_path: str = None):
    data = {'bot': bot, 'type': log_type, 'message': message}
    files = {'file': open(file_path, 'rb')} if file_path else None
    r = requests.post('${apiUrl}/api/log', data=data, files=files)
    r.raise_for_status()

# Info log
send_log('my-bot', 0, 'Server started')

# Error with screenshot
send_log('my-bot', 1, 'UI crash detected', './screenshot.png')
\`\`\`

**cURL:**
\`\`\`bash
# Simple log
curl -X POST ${apiUrl}/api/log \\
  -F "bot=my-bot" \\
  -F "type=0" \\
  -F "message=Deployment complete"

# With file attachment
curl -X POST ${apiUrl}/api/log \\
  -F "bot=my-bot" \\
  -F "type=1" \\
  -F "message=Error log attached" \\
  -F "file=@./error.log"
\`\`\``;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="api-docs">
      <div className="api-docs-header">
        <h2>📋 API Integration Prompt</h2>
        <button onClick={handleCopy} className="copy-btn">
          {copied ? '✓ Скопировано!' : 'Копировать'}
        </button>
      </div>
      <p className="api-docs-desc">
        Скопируй этот промпт и вставь в ChatGPT/Claude для генерации кода интеграции
      </p>
      <pre className="api-docs-code">{prompt}</pre>
    </section>
  );
}

