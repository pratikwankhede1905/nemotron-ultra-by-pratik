// server.js — secure backend proxy for Nemotron Ultra
// npm i express cors
// Run with: HF_TOKEN=your_token node server.js
// Keep HF_TOKEN in environment variables / hosting secrets.

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));

const HF_TOKEN = process.env.HF_TOKEN;
const HF_CHAT_URL = process.env.HF_CHAT_URL || "https://router.huggingface.co/v1/chat/completions";
const HF_IMAGE_URL = process.env.HF_IMAGE_URL || "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

if (!HF_TOKEN) console.warn("WARNING: HF_TOKEN is not configured.");

async function fetchWithRetry(url, options, retries = 3) {
  let last;
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetch(url, options);
      if (r.ok || ![429, 500, 502, 503, 504].includes(r.status)) return r;
      last = r;
      await new Promise(resolve => setTimeout(resolve, 500 * (2 ** i)));
    } catch (e) {
      last = e;
      await new Promise(resolve => setTimeout(resolve, 500 * (2 ** i)));
    }
  }
  if (last instanceof Response) return last;
  throw last;
}

app.post("/api/chat", async (req, res) => {
  if (!HF_TOKEN) return res.status(500).json({ error: "Server is missing HF_TOKEN" });

  const body = { ...req.body };
  body.max_tokens = Math.min(Number(body.max_tokens || 16384), 16384);

  try {
    const upstream = await fetchWithRetry(HF_CHAT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    res.status(upstream.status);
    upstream.headers.forEach((v, k) => res.setHeader(k, v));
    upstream.body.pipeTo(new WritableStream({
      write(chunk) { res.write(Buffer.from(chunk)); },
      close() { res.end(); },
      abort() { res.end(); }
    })).catch(() => res.end());
  } catch (e) {
    res.status(502).json({ error: "Upstream AI provider failed", requestId: Date.now().toString(36) });
  }
});

app.post("/api/generate-image", async (req, res) => {
  if (!HF_TOKEN) return res.status(500).json({ error: "Server is missing HF_TOKEN" });

  const prompt = String(req.body?.prompt || "").trim();
  if (!prompt || prompt.length > 4000) return res.status(400).json({ error: "Invalid prompt" });

  try {
    const upstream = await fetchWithRetry(HF_IMAGE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: (await upstream.text()).slice(0, 500) });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    const mime = upstream.headers.get("content-type") || "image/png";
    // For a simple deployment, return a data URL. For production, upload to
    // object storage and return a short-lived signed URL instead.
    res.json({ url: `data:${mime};base64,${buffer.toString("base64")}` });
  } catch (e) {
    res.status(502).json({ error: "Image provider failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Nemotron Ultra backend running on port", process.env.PORT || 3000);
});
