module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { apiKey, niche, lines } = req.body;
  if (!apiKey) return res.status(400).json({ error: "Missing apiKey" });

  const scriptLines = lines && lines.length ? lines : [
    "Nobody tells you this secret.",
    "Most people miss this completely.",
    "Here is what actually works.",
    "Save this. You will need it."
  ];

  const nicheVideos = {
    "💰 Wealth & Money": "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
    "🧠 Mindset & Growth": "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
    "💪 Fitness & Health": "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
    "🎬 Content Creation": "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
    "📜 History & Facts": "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
    "👑 Luxury Lifestyle": "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
  };

  const videoSrc = nicheVideos[niche] || "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4";
  const clipLength = 3;
  const totalLength = scriptLines.length * clipLength;

  const titleClips = scriptLines.map((line, i) => ({
    asset: { type: "title", text: line, style: "minimal", color: "#ffffff", size: "medium", position: "center" },
    start: i * clipLength,
    length: clipLength
  }));

  const payload = {
    timeline: {
      background: "#000000",
      soundtrack: {
        src: "https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/disco.mp3",
        effect: "fadeOut",
        volume: 0.5
      },
      tracks: [
        { clips: titleClips },
        { clips: [{ asset: { type: "video", src: videoSrc, volume: 0 }, start: 0, length: totalLength }] }
      ]
    },
    output: { format: "mp4", resolution: "sd" }
  };

  try {
    const response = await fetch("https://api.shotstack.io/edit/stage/render", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || "Shotstack error" });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
