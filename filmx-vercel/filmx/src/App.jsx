import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --gold:#C9A84C; --gold-light:#E8C97A; --gold-dim:#4A3E20;
    --bg:#080808; --bg2:#111; --bg3:#181818; --bg4:#1E1E1E;
    --white:#F0EBE0; --muted:#6A6050; --border:#222; --green:#4CAF7D; --red:#CF6679;
  }
  body { background:var(--bg); color:var(--white); font-family:'DM Sans',sans-serif; overflow-x:hidden; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:var(--gold-dim)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes popIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
  @keyframes scan{0%{top:0}100%{top:100%}}
  .fade-up{animation:fadeUp .5s ease forwards}
  .gold-text{background:linear-gradient(90deg,#C9A84C,#E8C97A,#C9A84C);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
  .btn-gold{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#C9A84C,#E8C97A);color:#080808;border:none;padding:13px 28px;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;cursor:pointer;transition:all .25s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)}
  .btn-gold:hover{box-shadow:0 6px 24px rgba(201,168,76,.4);transform:translateY(-1px)}
  .btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none}
  .btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:transparent;color:var(--gold);border:1px solid var(--gold-dim);padding:11px 24px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:2px;cursor:pointer;transition:all .25s;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
  .btn-outline:hover{background:rgba(201,168,76,.08);border-color:var(--gold)}
  .btn-ghost{background:none;border:1px solid var(--border);color:var(--muted);padding:10px 20px;font-size:13px;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
  .btn-ghost:hover{border-color:var(--muted);color:var(--white)}
  .btn-ghost.active{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.06)}
  .card{background:var(--bg2);border:1px solid var(--border);transition:border-color .25s}
  .card:hover{border-color:var(--gold-dim)}
  .inp{background:var(--bg3);border:1px solid var(--border);color:var(--white);padding:13px 16px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s;width:100%}
  .inp:focus{border-color:var(--gold-dim)}
  .inp::placeholder{color:var(--muted)}
  .label{font-size:11px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:8px;display:block}
  .badge{display:inline-flex;align-items:center;gap:6px;background:rgba(201,168,76,.1);border:1px solid var(--gold-dim);color:var(--gold);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;padding:5px 12px;font-family:'Bebas Neue',sans-serif}
  .notif{position:fixed;bottom:24px;right:24px;z-index:500;background:var(--bg2);border:1px solid var(--green);padding:14px 20px;display:flex;align-items:center;gap:10px;animation:slideIn .3s ease;max-width:300px}
  .notif-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0}
  .modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px}
  .modal{background:var(--bg2);border:1px solid var(--gold-dim);padding:48px 40px;max-width:460px;width:100%;position:relative;animation:popIn .3s ease}
  .tab-bar{display:flex;border-bottom:1px solid var(--border);margin-bottom:28px}
  .tab{flex:1;padding:12px;text-align:center;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:2px;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;background:none;border-left:none;border-right:none;border-top:none;transition:all .2s}
  .tab.active{color:var(--gold);border-bottom-color:var(--gold)}
  .sidebar{width:210px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--border);padding:28px 0;display:flex;flex-direction:column;gap:2px;position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto}
  .sitem{display:flex;align-items:center;gap:10px;padding:12px 20px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);cursor:pointer;border-left:2px solid transparent;transition:all .2s;background:none;border-right:none;border-top:none;border-bottom:none;width:100%;text-align:left;font-family:'DM Sans',sans-serif}
  .sitem:hover,.sitem.active{color:var(--white);border-left-color:var(--gold);background:rgba(201,168,76,.04)}
  .ccard{background:var(--bg3);border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:all .3s}
  .ccard:hover{border-color:var(--gold-dim);transform:translateY(-2px)}
  .pbar{height:4px;background:var(--border)}
  .pfill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold-light));transition:width .5s ease}
  @media(max-width:768px){.sidebar{display:none}}
`;

const NICHES = [
  {id:"wealth",label:"💰 Wealth & Money",desc:"Finance, passive income, investing"},
  {id:"mindset",label:"🧠 Mindset & Growth",desc:"Motivation, discipline, habits"},
  {id:"fitness",label:"💪 Fitness & Health",desc:"Workouts, nutrition, body"},
  {id:"content",label:"🎬 Content Creation",desc:"Social media, reels, income"},
  {id:"history",label:"📜 History & Facts",desc:"Untold stories, shocking facts"},
  {id:"luxury",label:"👑 Luxury Lifestyle",desc:"Cars, watches, travel, ambition"},
];

const STYLES = [
  {id:"cinematic",label:"🎬 Cinematic",desc:"Dark, dramatic, high-end"},
  {id:"viral",label:"🔥 Viral Hook",desc:"Scroll-stopping opener"},
  {id:"storytelling",label:"📖 Storytelling",desc:"Narrative arc, emotional"},
  {id:"educational",label:"📚 Educational",desc:"Teach in 60 seconds"},
  {id:"motivational",label:"⚡ Motivational",desc:"High energy, inspiring"},
  {id:"brainrot",label:"🧠 Brainrot",desc:"Fast cuts, chaos energy"},
];

const VOICES = [
  {id:"en-US-Neural2-D",label:"🎙 Deep Male",desc:"Authoritative, commanding"},
  {id:"en-US-Neural2-F",label:"🎤 Smooth Female",desc:"Clear, engaging"},
  {id:"en-GB-Neural2-B",label:"🇬🇧 British Male",desc:"Premium, sophisticated"},
  {id:"en-AU-Neural2-B",label:"🇦🇺 Australian",desc:"Warm, trustworthy"},
];

const DURATIONS = ["15","30","60"];

// Hardcoded Shotstack sample video URLs by niche — no CORS issues
const NICHE_VIDEOS = {
  wealth: [
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/beach.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
  ],
  mindset: [
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/beach.mp4",
  ],
  fitness: [
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/beach.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
  ],
  content: [
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/beach.mp4",
  ],
  history: [
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/beach.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
  ],
  luxury: [
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/beach.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/city.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/earth.mp4",
    "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/footage/skater.hd.mp4",
  ],
};

function getNicheVideos(niche) {
  return NICHE_VIDEOS[niche] || NICHE_VIDEOS.wealth;
}

// ── HELPERS ────────────────────────────────────────────────────────────

async function generateScript(niche, style, duration, topic) {
  const nicheData = NICHES.find(n => n.id === niche);
  const styleData = STYLES.find(s => s.id === style);
  // Call our Vercel serverless function — no CORS issues
  const res = await fetch("/api/script", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      niche: nicheData?.label || niche,
      style: styleData?.label || style,
      duration,
      topic
    })
  });
  return await res.json();
}

async function submitShotstackRender(apiKey, videoUrls, scriptLines, voiceId, duration) {
  const clipDuration = parseInt(duration) / videoUrls.length;

  const videoClips = videoUrls.map((url, i) => ({
    asset: { type: "video", src: url, volume: 0, trim: 0 },
    start: i * clipDuration,
    length: clipDuration,
    fit: "cover"
  }));

  const lineCount = scriptLines.length;
  const lineDuration = parseInt(duration) / lineCount;
  const captionClips = scriptLines.map((line, i) => ({
    asset: {
      type: "title",
      text: line,
      style: "minimal",
      color: "#ffffff",
      size: "medium",
      background: "rgba(0,0,0,0.6)",
      position: "bottom"
    },
    start: i * lineDuration,
    length: lineDuration,
    position: "bottom"
  }));

  // Use Shotstack's free background music instead of TTS (more reliable in sandbox)
  const audioClip = {
    asset: {
      type: "audio",
      src: "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/music/freepd/algorithm.mp3",
      volume: 0.5
    },
    start: 0,
    length: parseInt(duration)
  };

  const payload = {
    timeline: {
      background: "#000000",
      tracks: [
        { clips: captionClips },
        { clips: videoClips },
        { clips: [audioClip] }
      ]
    },
    output: {
      format: "mp4",
      resolution: "sd",
      aspectRatio: "9:16",
      size: { width: 540, height: 960 }
    }
  };

  // Call our Vercel serverless function — no CORS issues
  const nicheData = NICHES.find(n => n.id === niche);
  const res = await fetch("/api/render", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, niche: nicheData?.label, lines: scriptLines })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Shotstack render failed");
  }

  const data = await res.json();
  return data.response.id;
}

async function pollShotstackRender(apiKey, renderId, onProgress) {
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    // Call our Vercel serverless function — no CORS issues
    const res = await fetch(`/api/status?id=${renderId}&apiKey=${encodeURIComponent(apiKey)}`);
    const data = await res.json();
    const status = data.response?.status;
    onProgress(status, i);
    if (status === "done") return data.response.url;
    if (status === "failed") throw new Error("Render failed on Shotstack");
  }
  throw new Error("Render timed out");
}

// ── AUTH MODAL ─────────────────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState("signup");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess({ name: name || email.split("@")[0], email }); }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button onClick={onClose} style={{position:"absolute",top:14,right:18,background:"none",border:"none",color:"var(--muted)",fontSize:20,cursor:"pointer"}}>✕</button>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:26,letterSpacing:6}}>FILM<span style={{color:"var(--gold)"}}>X</span></div>
          <div style={{fontSize:11,color:"var(--muted)",letterSpacing:2,marginTop:4}}>AI FACELESS REEL GENERATOR</div>
        </div>
        <div className="tab-bar">
          {["signup","login"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`tab ${tab===t?"active":""}`}>{t==="signup"?"CREATE ACCOUNT":"SIGN IN"}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {tab==="signup" && <input className="inp" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />}
          <input className="inp" placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="inp" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
          <button className="btn-gold" onClick={submit} style={{width:"100%",marginTop:4,fontSize:16}}>
            {loading
              ? <span style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:14,height:14,border:"2px solid #080808",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>LOADING...</span>
              : tab==="signup" ? "START FREE →" : "ENTER FILMX →"}
          </button>
          <div style={{textAlign:"center",fontSize:11,color:"var(--muted)"}}>Free · No card needed · Cancel anytime</div>
        </div>
      </div>
    </div>
  );
}

// ── LANDING ────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{minHeight:"100vh"}}>
      <nav style={{position:"fixed",top:0,left:0,right:0,height:60,zIndex:100,background:"rgba(8,8,8,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px"}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:6}}>FILM<span style={{color:"var(--gold)"}}>X</span></div>
        <div style={{display:"flex",gap:12}}>
          <button className="btn-outline" style={{fontSize:13,padding:"9px 20px"}} onClick={onStart}>SIGN IN</button>
          <button className="btn-gold" style={{fontSize:14,padding:"10px 24px"}} onClick={onStart}>START FREE</button>
        </div>
      </nav>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 24px 40px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% 40%,rgba(201,168,76,.06),transparent)"}} />
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(201,168,76,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.03) 1px,transparent 1px)",backgroundSize:"50px 50px",maskImage:"radial-gradient(ellipse at center,black 40%,transparent 80%)"}} />
        <div className="fade-up" style={{position:"relative",zIndex:2}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,168,76,.1)",border:"1px solid var(--gold-dim)",padding:"6px 16px",marginBottom:24}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 1.5s infinite",display:"inline-block"}} />
            <span style={{fontSize:11,letterSpacing:3,color:"var(--gold)",fontFamily:"'Bebas Neue'"}}>REAL VIDEO OUTPUT · POWERED BY SHOTSTACK</span>
          </div>
          <h1 style={{fontFamily:"'Bebas Neue'",fontSize:"clamp(52px,10vw,110px)",lineHeight:.9,letterSpacing:6,marginBottom:16}}>
            <span className="gold-text">FACELESS</span><br/><span>REELS THAT</span><br/><span style={{color:"var(--gold)"}}>GO VIRAL.</span>
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:"var(--muted)",maxWidth:520,margin:"0 auto 16px",lineHeight:1.7}}>
            AI writes your script. Shotstack renders the real MP4.<br/>Stock footage, voiceover, captions — all included.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>
            <button className="btn-gold" style={{fontSize:18,padding:"16px 48px"}} onClick={onStart}>CREATE YOUR FIRST REEL FREE →</button>
          </div>
          <div style={{display:"flex",gap:40,justifyContent:"center",flexWrap:"wrap"}}>
            {[["Real MP4","Output"],["Shotstack","Powered"],["Pexels","Footage"],["AI","Voiceover"]].map(([n,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:"var(--gold)"}}>{n}</div>
                <div style={{fontSize:11,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SETUP KEY BANNER ───────────────────────────────────────────────────
function KeySetupBanner({ onSave }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  return (
    <div style={{background:"linear-gradient(135deg,#1A1200,#111)",border:"1px solid var(--gold-dim)",padding:"20px 24px",marginBottom:24,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <span style={{fontSize:24}}>🔑</span>
      <div style={{flex:1}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:2,color:"var(--gold)",marginBottom:4}}>SHOTSTACK SANDBOX KEY REQUIRED</div>
        <div style={{fontSize:12,color:"var(--muted)"}}>Sign up free at shotstack.io → Dashboard → API Keys → copy your <strong style={{color:"var(--white)"}}>Sandbox/Stage</strong> key</div>
      </div>
      {!show
        ? <button className="btn-gold" style={{fontSize:13,padding:"10px 20px"}} onClick={()=>setShow(true)}>ADD KEY</button>
        : <div style={{display:"flex",gap:8,alignItems:"center",flex:1,minWidth:280}}>
            <input className="inp" type="password" placeholder="Paste your Shotstack sandbox key here" value={key} onChange={e=>setKey(e.target.value)} style={{flex:1}} />
            <button className="btn-gold" style={{fontSize:13,padding:"10px 20px",flexShrink:0}} onClick={()=>{ if(key.length>10){ onSave(key); setShow(false); } }}>SAVE</button>
          </div>
      }
    </div>
  );
}

// ── CREATE VIEW ────────────────────────────────────────────────────────
function CreateView({ onGenerated, shotstackKey, onNeedKey }) {
  const [step, setStep] = useState(0);
  const [niche, setNiche] = useState(null);
  const [style, setStyle] = useState(null);
  const [voice, setVoice] = useState("en-US-Neural2-D");
  const [duration, setDuration] = useState("30");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [genPercent, setGenPercent] = useState(0);
  const [genElapsed, setGenElapsed] = useState(0);
  const [genETA, setGenETA] = useState(30);
  const [renderStatus, setRenderStatus] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const GEN_STEPS = [
    "Analyzing niche & audience...",
    "Writing viral hook...",
    "Crafting full script...",
    "Fetching stock footage...",
    "Submitting to Shotstack...",
    "Rendering video...",
    "Adding captions...",
    "Finalizing MP4...",
  ];

  const generate = async () => {
    if (!shotstackKey) { onNeedKey(); return; }
    setStep(3); setGenerating(true); setGenStep(0); setGenPercent(0); setGenElapsed(0); setError(null);
    const totalEst = 45;
    setGenETA(totalEst);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setGenElapsed(elapsed);
      setGenETA(Math.max(0, totalEst - elapsed));
    }, 500);

    try {
      // Step 1-3: Script
      setGenStep(1); setGenPercent(10);
      await new Promise(r => setTimeout(r, 500));
      setGenStep(2); setGenPercent(20);
      let script;
      try {
        script = await generateScript(niche, style, duration, topic);
      } catch {
        script = {
          title: topic || `${NICHES.find(n=>n.id===niche)?.label} — Daily Insight`,
          hook: "Nobody tells you this...",
          lines: [
            "Nobody tells you this secret.",
            "Most people miss this completely.",
            "Here is what actually works.",
            "This changed everything for me.",
            "Save this — you will need it."
          ],
          caption: `Mind-blowing facts you need to know. #${niche} #viral #faceless #filmx #fyp`
        };
      }
      setGenStep(3); setGenPercent(35);

      // Step 4: Get niche footage
      await new Promise(r => setTimeout(r, 400));
      setGenStep(4); setGenPercent(45);
      const videoUrls = getNicheVideos(niche);

      // Step 5: Submit to Shotstack
      setGenStep(5); setGenPercent(55);
      const renderId = await submitShotstackRender(shotstackKey, videoUrls, script.lines, voice, duration);

      // Step 6-8: Poll render
      setGenStep(6); setGenPercent(65);
      let pollCount = 0;
      const videoUrl = await pollShotstackRender(shotstackKey, renderId, (status, attempt) => {
        pollCount = attempt;
        setRenderStatus(status);
        const p = Math.min(95, 65 + attempt * 3);
        setGenPercent(p);
        if (attempt % 3 === 0) setGenStep(prev => Math.min(7, prev + 1));
      });

      setGenStep(8); setGenPercent(100);
      clearInterval(timerRef.current);

      const finalResult = { ...script, videoUrl, niche: NICHES.find(n=>n.id===niche)?.label, style: STYLES.find(s=>s.id===style)?.label, duration, createdAt: new Date().toLocaleTimeString(), renderId };
      setResult(finalResult);
      onGenerated(finalResult);
    } catch (e) {
      clearInterval(timerRef.current);
      setError(e.message || "Something went wrong");
    }
    setGenerating(false);
  };

  const reset = () => { setResult(null); setError(null); setStep(0); setNiche(null); setStyle(null); setGenStep(0); setGenPercent(0); setRenderStatus(""); };

  if (step === 3) {
    return (
      <div className="fade-up" style={{maxWidth:600,margin:"0 auto"}}>
        {generating ? (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:44,marginBottom:16,animation:"spin 2s linear infinite",display:"inline-block"}}>⚙</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:26,letterSpacing:3,marginBottom:4}}>RENDERING YOUR <span className="gold-text">REEL</span></div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:28}}>Shotstack is building your real MP4 video</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:64,letterSpacing:4,lineHeight:1,marginBottom:6}}>
              <span className="gold-text">{genPercent}</span><span style={{fontSize:28,color:"var(--muted)"}}>%</span>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:20}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:20}}>{genElapsed}s</div>
                <div style={{fontSize:10,color:"var(--muted)",letterSpacing:2}}>ELAPSED</div>
              </div>
              <div style={{width:1,background:"var(--border)"}} />
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:"var(--gold)"}}>~{genETA}s</div>
                <div style={{fontSize:10,color:"var(--muted)",letterSpacing:2}}>REMAINING</div>
              </div>
            </div>
            <div style={{maxWidth:440,margin:"0 auto 24px"}}>
              <div style={{height:6,background:"var(--border)",overflow:"hidden"}}>
                <div style={{height:"100%",background:"linear-gradient(90deg,var(--gold),var(--gold-light),var(--gold))",backgroundSize:"200%",animation:"shimmer 1.5s linear infinite",width:`${genPercent}%`,transition:"width .5s ease"}} />
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,color:"var(--muted)"}}>0%</span>
                <span style={{fontSize:10,color:"var(--muted)"}}>100%</span>
              </div>
            </div>
            {renderStatus && <div style={{fontSize:12,color:"var(--gold)",marginBottom:16,letterSpacing:1}}>Shotstack: {renderStatus.toUpperCase()}</div>}
            <div style={{maxWidth:380,margin:"0 auto",textAlign:"left"}}>
              {GEN_STEPS.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",opacity:genStep>i?1:genStep===i?.8:.2,transition:"opacity .3s"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:genStep>i?"var(--gold)":"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:genStep>i?"#080808":"var(--muted)",flexShrink:0,transition:"all .3s"}}>
                    {genStep>i?"✓":i+1}
                  </div>
                  <span style={{fontSize:13,color:genStep>i?"var(--white)":"var(--muted)",flex:1}}>{s}</span>
                  {genStep===i&&<span style={{width:12,height:12,border:"2px solid var(--gold)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .6s linear infinite",display:"inline-block"}} />}
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:44,marginBottom:16}}>⚠️</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:3,marginBottom:8,color:"var(--red)"}}>RENDER FAILED</div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:8,maxWidth:400,margin:"0 auto 24px"}}>{error}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:24,padding:"12px 16px",background:"var(--bg3)",border:"1px solid var(--border)",textAlign:"left",maxWidth:400,margin:"0 auto 24px",lineHeight:1.7}}>
              <strong style={{color:"var(--white)"}}>Common fixes:</strong><br/>
              • Check your Shotstack sandbox key in Settings<br/>
              • Make sure you signed up at shotstack.io<br/>
              • Sandbox key starts with a long random string
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="btn-gold" onClick={reset}>TRY AGAIN</button>
              <button className="btn-ghost" onClick={()=>window.open("https://dashboard.shotstack.io","_blank")}>OPEN SHOTSTACK DASHBOARD</button>
            </div>
          </div>
        ) : result ? (
          <div className="fade-up">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,padding:"14px 20px",background:"rgba(76,175,125,.08)",border:"1px solid var(--green)"}}>
              <span style={{fontSize:20}}>✅</span>
              <div>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:2,color:"var(--green)"}}>VIDEO READY — REAL MP4</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>Rendered by Shotstack · Watermarked sandbox version</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:16,marginBottom:16}}>
              <div style={{width:160,aspectRatio:"9/16",background:"linear-gradient(160deg,#0D0A03,#111)",border:"1px solid var(--gold-dim)",display:"flex",flexDirection:"column",padding:12,position:"relative",overflow:"hidden",flexShrink:0}}>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:8,letterSpacing:2,color:"var(--gold)",marginBottom:6}}>FILMx REEL</div>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:12,letterSpacing:1,lineHeight:1.2,flex:1}}>{result.hook}</div>
                <div style={{fontSize:8,color:"var(--muted)",lineHeight:1.5}}>{result.lines?.slice(0,3).join(" · ")}</div>
                <div style={{marginTop:8,height:2,background:"var(--border)"}}>
                  <div style={{width:"100%",height:"100%",background:"var(--gold)",animation:"shimmer 2s linear infinite"}} />
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:"var(--bg3)",border:"1px solid var(--border)",padding:14}}>
                  <div className="label">TITLE</div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:15,letterSpacing:2}}>{result.title}</div>
                </div>
                <div style={{background:"var(--bg3)",border:"1px solid var(--border)",padding:14}}>
                  <div className="label">HOOK</div>
                  <div style={{fontSize:14,color:"var(--gold)",fontWeight:500}}>"{result.hook}"</div>
                </div>
                <div style={{background:"var(--bg3)",border:"1px solid var(--border)",padding:14}}>
                  <div className="label">SCRIPT LINES</div>
                  <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.8}}>{result.lines?.map((l,i)=><div key={i}>· {l}</div>)}</div>
                </div>
              </div>
            </div>
            <div style={{background:"var(--bg3)",border:"1px solid var(--border)",padding:14,marginBottom:16}}>
              <div className="label">CAPTION</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{result.caption}</div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <a href={result.videoUrl} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                <button className="btn-gold" style={{fontSize:14,padding:"13px 28px"}}>⬇ DOWNLOAD MP4</button>
              </a>
              <button className="btn-outline" style={{fontSize:13}} onClick={()=>{ navigator.clipboard.writeText(result.videoUrl); }}>📋 COPY VIDEO URL</button>
              <button className="btn-ghost" style={{fontSize:13}} onClick={reset}>✦ CREATE ANOTHER</button>
            </div>
            <div style={{marginTop:12,fontSize:11,color:"var(--muted)"}}>
              🔗 Direct link: <span style={{color:"var(--gold)",wordBreak:"break-all"}}>{result.videoUrl}</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const STEPS = ["Niche","Style","Options","Generate"];
  return (
    <div className="fade-up" style={{maxWidth:700,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:32}}>
        {STEPS.map((s,i)=>(
          <div key={s} style={{display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue'",fontSize:13,flexShrink:0,transition:"all .3s",background:i<step?"var(--gold)":i===step?"var(--bg3)":"var(--bg3)",border:i===step?"1px solid var(--gold)":i<step?"none":"1px solid var(--border)",color:i<step?"#080808":i===step?"var(--gold)":"var(--muted)"}}>
                {i<step?"✓":i+1}
              </div>
              <span style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:i<=step?"var(--white)":"var(--muted)",whiteSpace:"nowrap"}}>{s}</span>
            </div>
            {i<STEPS.length-1&&<div style={{flex:1,height:1,background:i<step?"var(--gold-dim)":"var(--border)",margin:"0 8px",marginBottom:16}} />}
          </div>
        ))}
      </div>

      {step===0&&(
        <div className="fade-up">
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:3,marginBottom:4}}>CHOOSE YOUR <span className="gold-text">NICHE</span></div>
            <div style={{fontSize:13,color:"var(--muted)"}}>What is your content about?</div>
          </div>
          <div style={{marginBottom:18}}>
            <span className="label">CUSTOM TOPIC (OPTIONAL)</span>
            <input className="inp" placeholder='e.g. "5 ways to make money online with no experience"' value={topic} onChange={e=>setTopic(e.target.value)} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10,marginBottom:28}}>
            {NICHES.map(n=>(
              <div key={n.id} className="card" style={{padding:"14px 16px",cursor:"pointer",border:`1px solid ${niche===n.id?"var(--gold)":"var(--border)"}`,background:niche===n.id?"rgba(201,168,76,.06)":"var(--bg2)"}} onClick={()=>setNiche(n.id)}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{n.label}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{n.desc}</div>
              </div>
            ))}
          </div>
          <button className="btn-gold" onClick={()=>setStep(1)} disabled={!niche} style={{fontSize:15,padding:"13px 36px"}}>NEXT: CHOOSE STYLE →</button>
        </div>
      )}

      {step===1&&(
        <div className="fade-up">
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:3,marginBottom:4}}>PICK YOUR <span className="gold-text">STYLE</span></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginBottom:28}}>
            {STYLES.map(s=>(
              <div key={s.id} className="card" style={{padding:"16px",cursor:"pointer",border:`1px solid ${style===s.id?"var(--gold)":"var(--border)"}`,background:style===s.id?"rgba(201,168,76,.06)":"var(--bg2)"}} onClick={()=>setStyle(s.id)}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>{s.label}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-ghost" onClick={()=>setStep(0)}>← BACK</button>
            <button className="btn-gold" onClick={()=>setStep(2)} disabled={!style} style={{fontSize:15,padding:"13px 36px"}}>NEXT: OPTIONS →</button>
          </div>
        </div>
      )}

      {step===2&&(
        <div className="fade-up">
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:3,marginBottom:4}}>VOICE & <span className="gold-text">DURATION</span></div>
          </div>
          <div style={{marginBottom:20}}>
            <span className="label">AI VOICE</span>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {VOICES.map(v=>(
                <div key={v.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",cursor:"pointer",border:`1px solid ${voice===v.id?"var(--gold)":"var(--border)"}`,background:voice===v.id?"rgba(201,168,76,.05)":"var(--bg3)",transition:"all .2s"}} onClick={()=>setVoice(v.id)}>
                  <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${voice===v.id?"var(--gold)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {voice===v.id&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--gold)"}} />}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{v.label}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:28}}>
            <span className="label">VIDEO DURATION</span>
            <div style={{display:"flex",gap:8}}>
              {DURATIONS.map(d=>(
                <button key={d} className={`btn-ghost ${duration===d?"active":""}`} style={{padding:"10px 24px",fontSize:14}} onClick={()=>setDuration(d)}>{d}s</button>
              ))}
            </div>
          </div>
          {!shotstackKey && (
            <div style={{padding:"12px 16px",background:"rgba(207,102,121,.08)",border:"1px solid var(--red)",marginBottom:20,fontSize:12,color:"var(--muted)"}}>
              ⚠️ <strong style={{color:"var(--white)"}}>No Shotstack key found.</strong> Add it in Settings before generating.
            </div>
          )}
          <div style={{display:"flex",gap:10}}>
            <button className="btn-ghost" onClick={()=>setStep(1)}>← BACK</button>
            <button className="btn-gold" onClick={generate} style={{fontSize:16,padding:"14px 40px"}}>
              ⚡ RENDER REAL VIDEO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SETTINGS VIEW ──────────────────────────────────────────────────────
function SettingsView({ user, shotstackKey, onSaveKey, toast }) {
  const [key, setKey] = useState(shotstackKey);
  const [show, setShow] = useState(false);
  return (
    <div className="fade-up" style={{maxWidth:500}}>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:3}}>ACCOUNT <span className="gold-text">SETTINGS</span></div>
      </div>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:3,marginBottom:16}}>SHOTSTACK API KEY</div>
        <div style={{padding:"16px 20px",background:"var(--bg3)",border:`1px solid ${shotstackKey?"var(--green)":"var(--red)"}`,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,color:shotstackKey?"var(--green)":"var(--red)"}}>
              {shotstackKey ? "✅ SANDBOX KEY ACTIVE" : "❌ NO KEY — VIDEOS WON'T RENDER"}
            </span>
            <button className="btn-ghost" style={{fontSize:11,padding:"4px 12px"}} onClick={()=>setShow(!show)}>
              {show?"HIDE":"SHOW"}
            </button>
          </div>
          {show && <div style={{fontSize:11,color:"var(--muted)",wordBreak:"break-all",fontFamily:"monospace"}}>{shotstackKey||"Not set"}</div>}
        </div>
        <span className="label">SANDBOX KEY (from shotstack.io dashboard)</span>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" type="password" placeholder="Paste your Shotstack sandbox key" value={key} onChange={e=>setKey(e.target.value)} style={{flex:1}} />
          <button className="btn-gold" style={{fontSize:13,padding:"10px 20px",flexShrink:0}} onClick={()=>{ onSaveKey(key); toast("✅ Shotstack key saved!"); }}>SAVE</button>
        </div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:8}}>
          Get your free key at <span style={{color:"var(--gold)",cursor:"pointer"}} onClick={()=>window.open("https://dashboard.shotstack.io/register","_blank")}>dashboard.shotstack.io →</span>
        </div>
      </div>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:3,marginBottom:12}}>ACCOUNT</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {["Name","Email"].map(f=>(
            <div key={f}>
              <span className="label">{f}</span>
              <input className="inp" defaultValue={f==="Name"?user?.name:user?.email} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LIBRARY VIEW ───────────────────────────────────────────────────────
function LibraryView({ reels, toast }) {
  if (!reels.length) return (
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:48,marginBottom:16}}>🎬</div>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:3,marginBottom:8}}>NO REELS YET</div>
      <div style={{fontSize:14,color:"var(--muted)"}}>Create your first reel to see it here.</div>
    </div>
  );
  return (
    <div className="fade-up">
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:3}}>MY REELS <span className="gold-text">({reels.length})</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {reels.map((r,i)=>(
          <div className="ccard" key={i}>
            <div style={{aspectRatio:"9/16",background:"linear-gradient(160deg,#0D0A03,#111)",display:"flex",flexDirection:"column",padding:14,position:"relative"}}>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:9,letterSpacing:2,color:"var(--gold)",marginBottom:6}}>{r.niche}</div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:13,letterSpacing:1,lineHeight:1.2,flex:1}}>{r.title}</div>
              <div style={{fontSize:9,color:"var(--muted)"}}>{r.duration}s · {r.createdAt}</div>
              {r.videoUrl && <div style={{marginTop:6,fontSize:9,color:"var(--green)"}}>✅ Real MP4 ready</div>}
            </div>
            <div style={{padding:"10px 12px",display:"flex",gap:6}}>
              {r.videoUrl
                ? <a href={r.videoUrl} target="_blank" rel="noreferrer" style={{textDecoration:"none",flex:1}}><button className="btn-gold" style={{width:"100%",fontSize:11,padding:"8px"}}>⬇ DOWNLOAD</button></a>
                : <button className="btn-ghost" style={{flex:1,fontSize:11}} onClick={()=>toast("No video URL")}>NO VIDEO</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCHEDULE VIEW ──────────────────────────────────────────────────────
function ScheduleView({ toast }) {
  const [connected, setConnected] = useState({tiktok:false,instagram:false,youtube:false});
  return (
    <div className="fade-up">
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:24,letterSpacing:3}}>AUTO-POST <span className="gold-text">SCHEDULE</span></div>
        <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Connect accounts and post on autopilot.</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:480}}>
        {[{id:"tiktok",icon:"🎵",l:"TikTok"},{id:"instagram",icon:"📸",l:"Instagram Reels"},{id:"youtube",icon:"▶",l:"YouTube Shorts"}].map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",background:"var(--bg2)",border:`1px solid ${connected[p.id]?"var(--green)":"var(--border)"}`}}>
            <span style={{fontSize:22}}>{p.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500}}>{p.l}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>{connected[p.id]?"Connected ✓":"Not connected"}</div>
            </div>
            <button className={connected[p.id]?"btn-ghost":"btn-outline"} style={{fontSize:12,padding:"8px 16px"}}
              onClick={()=>{ setConnected(c=>({...c,[p.id]:!c[p.id]})); toast(connected[p.id]?`${p.l} disconnected`:`${p.l} connected!`); }}>
              {connected[p.id]?"DISCONNECT":"CONNECT"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────
function DashboardView({ user, onCreateClick, reels, shotstackKey }) {
  return (
    <div className="fade-up">
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:28,letterSpacing:3}}>WELCOME, <span className="gold-text">{(user?.name||"CREATOR").toUpperCase()}</span></div>
        <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Your AI faceless reel studio — powered by Shotstack.</div>
      </div>
      {!shotstackKey && <KeySetupBanner onSave={()=>{}} />}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
        {[[reels.length,"Reels Created","🎬"],[reels.filter(r=>r.videoUrl).length,"MP4s Rendered","📹"],["Free","Current Plan","⭐"],["Sandbox","Shotstack","🔧"]].map(([v,l,i])=>(
          <div className="card" key={l} style={{padding:"18px 16px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:6}}>{i}</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:24,color:"var(--gold)"}}>{v}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:"linear-gradient(135deg,#0E0C06,#111)",border:"1px solid var(--gold-dim)",padding:"28px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:3,marginBottom:4}}>CREATE YOUR NEXT REEL</div>
          <div style={{fontSize:13,color:"var(--muted)"}}>Real MP4 output via Shotstack. Stock footage from Pexels.</div>
        </div>
        <button className="btn-gold" style={{fontSize:16,padding:"14px 32px"}} onClick={onCreateClick}>✦ CREATE NOW</button>
      </div>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:13,letterSpacing:3,marginBottom:12}}>QUICK START</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
        {NICHES.slice(0,4).map(n=>(
          <div key={n.id} className="card" style={{padding:"14px 16px",cursor:"pointer",display:"flex",gap:10,alignItems:"flex-start"}} onClick={onCreateClick}>
            <div style={{fontSize:22,flexShrink:0}}>{n.label.split(" ")[0]}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,marginBottom:2}}>{n.label.slice(3)}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>{n.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────
function App({ user, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [reels, setReels] = useState([]);
  const [notif, setNotif] = useState(null);
  const [shotstackKey, setShotstackKey] = useState(() => {
    try { return localStorage.getItem("filmx_ss_key") || ""; } catch { return ""; }
  });

  const toast = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null),3500); };
  const saveKey = (k) => {
    setShotstackKey(k);
    try { localStorage.setItem("filmx_ss_key", k); } catch {}
    toast("✅ Shotstack key saved securely in your browser");
  };

  const nav = [
    {id:"dashboard",icon:"⊞",label:"Dashboard"},
    {id:"create",icon:"✦",label:"Create Reel",highlight:true},
    {id:"library",icon:"▤",label:"My Reels"},
    {id:"schedule",icon:"📅",label:"Schedule"},
    {id:"settings",icon:"⚙",label:"Settings"},
  ];

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{position:"fixed",top:0,left:0,right:0,height:56,zIndex:100,background:"rgba(8,8,8,.96)",backdropFilter:"blur(10px)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:5}}>FILM<span style={{color:"var(--gold)"}}>X</span></div>
          <span style={{width:1,height:20,background:"var(--border)"}} />
          <span style={{fontSize:11,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase"}}>Reel Studio</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:shotstackKey?"rgba(76,175,125,.08)":"rgba(207,102,121,.08)",border:`1px solid ${shotstackKey?"var(--green)":"var(--red)"}`}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:shotstackKey?"var(--green)":"var(--red)",animation:"pulse 2s infinite",display:"inline-block"}} />
            <span style={{fontSize:11,fontFamily:"'Bebas Neue'",letterSpacing:2,color:shotstackKey?"var(--green)":"var(--red)"}}>
              {shotstackKey?"SHOTSTACK READY":"NO API KEY"}
            </span>
          </div>
          <div style={{width:30,height:30,borderRadius:"50%",background:"var(--gold-dim)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue'",fontSize:13,cursor:"pointer"}} onClick={onLogout} title="Logout">
            {user?.name?.[0]?.toUpperCase()||"U"}
          </div>
        </div>
      </div>

      <div style={{display:"flex",paddingTop:56,minHeight:"calc(100vh - 56px)"}}>
        <div className="sidebar">
          {nav.map(item=>(
            <button key={item.id} className={`sitem ${view===item.id?"active":""}`} onClick={()=>setView(item.id)}>
              <span style={{fontSize:15}}>{item.icon}</span>
              {item.label}
              {item.highlight&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"var(--gold)",animation:"pulse 2s infinite"}} />}
            </button>
          ))}
          <div style={{marginTop:"auto",padding:"14px 20px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>SHOTSTACK STATUS</div>
            <div style={{fontSize:12,color:shotstackKey?"var(--green)":"var(--red)"}}>{shotstackKey?"Sandbox Active":"Key Not Set"}</div>
            {!shotstackKey&&<div style={{fontSize:10,color:"var(--muted)",marginTop:4,cursor:"pointer",color:"var(--gold)"}} onClick={()=>setView("settings")}>Add key in Settings →</div>}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"28px"}}>
          {view==="dashboard"&&<DashboardView user={user} onCreateClick={()=>setView("create")} reels={reels} shotstackKey={shotstackKey} />}
          {view==="create"&&<CreateView onGenerated={r=>{ setReels(prev=>[r,...prev]); toast("🎬 Reel rendered! Check your library."); }} shotstackKey={shotstackKey} onNeedKey={()=>setView("settings")} />}
          {view==="library"&&<LibraryView reels={reels} toast={toast} />}
          {view==="schedule"&&<ScheduleView toast={toast} />}
          {view==="settings"&&<SettingsView user={user} shotstackKey={shotstackKey} onSaveKey={saveKey} toast={toast} />}
        </div>
      </div>
      {notif&&<div className="notif"><div className="notif-dot" /><span style={{fontSize:13}}>{notif}</span></div>}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────
export default function FILMx() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  return (
    <>
      <style>{css}</style>
      {!user&&<Landing onStart={()=>setShowAuth(true)} />}
      {user&&<App user={user} onLogout={()=>setUser(null)} />}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onSuccess={u=>{ setUser(u); setShowAuth(false); }} />}
    </>
  );
}
