module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { niche, lines, style } = req.body;

  const nichePrompts = {
    "💰 Wealth & Money": "cinematic luxury lifestyle, money, financial success, city skyline at night, gold aesthetic",
    "🧠 Mindset & Growth": "cinematic motivational, person meditating at sunrise, nature, focus, achievement",
    "💪 Fitness & Health": "cinematic fitness, athlete training, gym, running at sunrise, strong body movement",
    "🎬 Content Creation": "cinematic social media creator, phone screen, creative workspace, digital world",
    "📜 History & Facts": "cinematic ancient ruins, historical scenes, dramatic lighting, epic landscape",
    "👑 Luxury Lifestyle": "cinematic luxury cars, penthouse, watches, travel, private jet, success lifestyle",
  };

  const stylePrompts = {
    "🎬 Cinematic": "cinematic, dramatic lighting, film grain, dark moody",
    "🔥 Viral Hook": "fast cuts, vibrant colors, energetic, eye-catching",
    "📖 Storytelling": "emotional, warm tones, narrative journey",
    "📚 Educational": "clean, minimal, informative visuals",
    "⚡ Motivational": "epic, sunrise, mountains, achievement",
    "🧠 Brainrot": "chaotic energy, bright colors, fast motion",
  };

  const nicheVisual = nichePrompts[niche] || "cinematic lifestyle, success, motivation";
  const styleVisual = stylePrompts[style] || "cinematic";
  const hook = lines && lines[0] ? lines[0] : "Nobody tells you this secret";

  const videoPrompt = `${styleVisual}, ${nicheVisual}, text overlay saying "${hook}", professional short-form social media reel, vertical 9:16 format, high quality`;

  try {
    const response = await fetch("https://zsky.ai/api/v1/video/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: videoPrompt,
        duration: 8,
        resolution: "1080p",
        audio: true,
        style: "cinematic",
        aspect_ratio: "9:16"
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: `ZSky API error: ${err}` });
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("video")) {
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return res.status(200).json({
        success: true,
        videoData: `data:video/mp4;base64,${base64}`,
        type: "base64"
      });
    } else {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        videoUrl: data.url || data.video_url || data.output,
        type: "url"
      });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
