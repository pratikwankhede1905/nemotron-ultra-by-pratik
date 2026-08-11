# Nemotron Ultra — Deployable Render Project

This version serves the frontend directly from the Express backend.

## Structure

```text
Nemotron_Ultra_Project/
├── frontend/
│   └── index.html                 # source frontend copy
├── backend/
│   ├── public/
│   │   └── index.html             # frontend actually served by Express
│   ├── src/
│   │   └── server.js              # web server + AI proxy
│   ├── package.json
│   ├── render.yaml
│   ├── .env.example
│   └── .gitignore
├── docs/
└── README.md
```

## Render deployment

Create a Render Web Service from this repository.

Use:

- Root Directory: `backend`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

```text
HF_TOKEN=YOUR_NEW_TOKEN
HF_CHAT_URL=https://router.huggingface.co/v1/chat/completions
HF_IMAGE_URL=https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0
```

After deployment, open:

```text
https://YOUR-SERVICE.onrender.com/
```

The `/` route serves `backend/public/index.html`.

Health check:

```text
https://YOUR-SERVICE.onrender.com/health
```

Expected response:

```json
{"ok":true,"service":"nemotron-ultra-backend"}
```

## Important

Do not put the Hugging Face token into browser JavaScript.
Use Render Environment Variables.

If you previously exposed a Hugging Face token in the original HTML, revoke/rotate it before production deployment.
