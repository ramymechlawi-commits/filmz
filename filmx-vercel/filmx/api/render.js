module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: "Missing apiKey" });

  // Simple proven Shotstack payload - just video + text overlay
  const payload = {
    timeline: {
      background: "#000000",
      tracks: [
        {
          clips: [
            {
              asset: {
                type: "title",
                text: "Nobody tells you this secret.",
                style: "minimal",
                color: "#ffffff",
                size: "medium",
                position: "center"
              },
              start: 0,
              length: 3
            },
            {
              asset: {
                type: "title",
                text: "Most people miss this completely.",
                style: "minimal",
                color: "#ffffff",
                size: "medium",
                position: "center"
              },
              start: 3,
              length: 3
            },
            {
              asset: {
                type: "title",
                text: "Here is what actually works.",
                style: "minimal",
                color: "#ffffff",
                size: "medium",
                position: "center"
              },
              start: 6,
              length: 3
            },
            {
              asset: {
                type: "title",
                text: "Save this. You will need it.",
                style: "minimal",
                color: "#ffffff",
                size: "medium",
                position: "center"
              },
              start: 9,
              length: 3
            }
          ]
        },
        {
          clips: [
            {
              asset: {
                type: "video",
                src: "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
                volume: 0
              },
              start: 0,
              length: 12
            }
          ]
        }
      ]
    },
    output: {
      format: "mp4",
      resolution: "sd"
    }
  };

  try {
    const response = await fetch("https://api.shotstack.io/edit/stage/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Shotstack response:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.message || "Shotstack error",
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
