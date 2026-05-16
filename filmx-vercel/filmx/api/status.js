// api/status.js — Vercel serverless function
// Polls Shotstack render status from the server side

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id, apiKey } = req.query;

  if (!id || !apiKey) {
    return res.status(400).json({ error: "Missing id or apiKey" });
  }

  try {
    const response = await fetch(`https://api.shotstack.io/edit/stage/render/${id}`, {
      headers: { "x-api-key": apiKey },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Shotstack error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
