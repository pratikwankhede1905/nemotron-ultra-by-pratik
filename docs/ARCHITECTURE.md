# Architecture

```text
Browser
  |
  |  /api/chat
  |  /api/generate-image
  v
Node/Express Backend
  |
  |  secret API key from environment
  v
Hugging Face / OpenAI-compatible provider

Browser
  |
  +--> PPTX exporter
  +--> PDF exporter
  +--> DOCX exporter
  +--> XLSX exporter
  +--> CSV exporter
  +--> Markdown/TXT exporter
```

## Artifact flow

1. User asks for an artifact.
2. Frontend detects the requested artifact type.
3. Chat request goes to the backend.
4. Model is instructed to return a structured artifact envelope.
5. Frontend validates the envelope.
6. If the model response is not valid JSON, a controlled fallback is used.
7. The appropriate exporter creates the requested file.
8. The user receives the generated artifact.

## Security

API credentials belong only on the server.

Never:

- hard-code API keys in HTML/JavaScript
- commit `.env`
- publish provider tokens to GitHub
- expose unrestricted provider endpoints to the browser

Recommended production additions:

- authentication
- rate limiting
- request-size limits
- usage quotas
- persistent chat storage
- object storage for generated images/files
- antivirus/file validation for uploads
- structured logging
- monitoring
