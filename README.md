# Nemotron Ultra — Advanced AI Workspace

A structured AI chat workspace based on the original Nemotron Ultra HTML project.

## Project structure

```text
Nemotron_Ultra_Project/
├── README.md
├── frontend/
│   └── index.html
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   ├── start-windows.bat
│   └── src/
│       └── server.js
└── docs/
    └── ARCHITECTURE.md
```

## Features

- Streaming AI chat
- Image generation endpoint
- PPTX generation
- PDF generation
- DOCX generation
- XLSX generation
- CSV / Markdown / TXT export
- Document upload and extraction
- Image upload
- Chat history
- Dark/light theme
- Structured artifact envelope
- Artifact validation and fallback export
- Secure server-side API key handling
- Retry handling for transient upstream errors

## Run locally

### 1. Install Node.js 18+

Open a terminal in `backend/`.

```bash
npm install
```

### 2. Configure the secret

Copy:

```text
.env.example
```

to:

```text
.env
```

Then put your Hugging Face token in `.env`.

Do NOT put the token in `frontend/index.html`.

### 3. Start the backend

```bash
npm start
```

The backend listens on port 3000 by default.

### 4. Serve the frontend

The frontend is currently an HTML application. For local development, serve the
`frontend` directory through the same origin as the backend or configure your
deployment/reverse proxy so `/api/*` reaches the Node backend.

Do not rely on opening `index.html` directly with `file://` for the production setup.

## Important

The original uploaded HTML contained an API token in browser-side JavaScript.
That token should be revoked/rotated before deploying this project.

This package keeps the token in the backend environment instead.
