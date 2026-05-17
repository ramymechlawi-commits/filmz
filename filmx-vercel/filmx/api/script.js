module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { niche, topic } = req.body;

  const scripts = {
    "💰 Wealth & Money": {
      title: "5 Money Secrets They Never Taught You",
      hook: "Nobody tells you this...",
      lines: ["The rich think differently about money.", "Most people work for money.", "The wealthy make money work for them.", "Start with one income stream.", "Then build the next one."],
      caption: "Money secrets that change everything. #wealth #money #viral #filmx #fyp"
    },
    "🧠 Mindset & Growth": {
      title: "The Mindset Shift That Changes Everything",
      hook: "Your mind is lying to you...",
      lines: ["Your biggest enemy is yourself.", "The stories you tell matter.", "Discipline beats motivation every time.", "Small steps compound into big results.", "Start today. Not tomorrow."],
      caption: "Mindset shifts that hit different. #mindset #growth #viral #filmx #fyp"
    },
    "💪 Fitness & Health": {
      title: "The Morning Routine That Transforms Your Body",
      hook: "Stop wasting your mornings...",
      lines: ["Most people skip this one thing.", "Your morning sets your entire day.", "Ten minutes is all you need.", "Consistency beats intensity always.", "Your future self will thank you."],
      caption: "Fitness facts that actually work. #fitness #health #viral #filmx #fyp"
    },
    "🎬 Content Creation": {
      title: "How I Hit 100K Without Showing My Face",
      hook: "No face needed to go viral...",
      lines: ["Faceless content is exploding right now.", "You do not need to be on camera.", "The algorithm rewards consistency.", "Pick one niche and stick to it.", "Post daily and watch it grow."],
      caption: "Content creation secrets. #contentcreator #viral #faceless #filmx #fyp"
    },
    "📜 History & Facts": {
      title: "Facts So Shocking You Will Question Everything",
      hook: "This will blow your mind...",
      lines: ["History is stranger than fiction.", "Most textbooks got this wrong.", "The truth has been hidden for years.", "Once you see it you cannot unsee it.", "Share this before it gets removed."],
      caption: "Mind blowing history facts. #history #facts #viral #filmx #fyp"
    },
    "👑 Luxury Lifestyle": {
      title: "What the Ultra Rich Do Differently",
      hook: "The rich live by different rules...",
      lines: ["Wealthy people think in decades.", "They buy assets not liabilities.", "Time is their most valued currency.", "They pay for results not hours.", "This is the mindset you need."],
      caption: "Luxury lifestyle secrets revealed. #luxury #wealth #viral #filmx #fyp"
    }
  };

  const script = scripts[niche] || scripts["💰 Wealth & Money"];
  
  if (topic) {
    script.title = topic;
  }

  return res.status(200).json(script);
};
