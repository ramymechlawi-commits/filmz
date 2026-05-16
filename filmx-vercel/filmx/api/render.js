// api/render.js — Vercel serverless function
// This runs on the SERVER so no CORS issues with Shotstack

export default async function handler(req, res) {
  // Allow frontend to call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { payload, apiKey } = req.body;

  if (!apiKey || !payload) {
    return res.status(400).json({ error: "Missing apiKey or payload" });
  }

  try {
    const response = await fetch("https://api.shotstack.io/edit/stage/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
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
