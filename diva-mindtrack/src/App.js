import { useState, useEffect } from "react";

const habits = [
  { id: 1, name: "Morning Meditation", icon: "🧘", streak: 12, done: true },
  { id: 2, name: "Read 30 mins", icon: "📚", streak: 7, done: true },
  { id: 3, name: "Drink 8 glasses", icon: "💧", streak: 3, done: false },
  { id: 4, name: "Exercise", icon: "🏃", streak: 5, done: false },
];

const tasks = [
  { id: 1, title: "Design landing page", priority: "High", status: "done", tag: "Work" },
  { id: 2, title: "Review pull requests", priority: "Medium", status: "inprogress", tag: "Dev" },
  { id: 3, title: "Write weekly report", priority: "High", status: "todo", tag: "Work" },
  { id: 4, title: "Plan next sprint", priority: "Low", status: "todo", tag: "Dev" },
  { id: 5, title: "Call with client", priority: "Medium", status: "inprogress", tag: "Work" },
];

const weekData = [
  { day: "Mon", score: 80 }, { day: "Tue", score: 65 }, { day: "Wed", score: 90 },
  { day: "Thu", score: 55 }, { day: "Fri", score: 75 }, { day: "Sat", score: 40 }, { day: "Sun", score: 85 },
];

const heatmapData = Array.from({ length: 35 }, () => ({
  active: Math.random() > 0.35, intensity: Math.floor(Math.random() * 4),
}));

const initialChats = [
  { id: 1, title: "How to build better habits?", time: "Today, 9:12 AM", messages: [
    { from: "user", text: "How do I build better habits?" },
    { from: "bot", text: "Start small! Pick one habit and do it daily for 21 days. Consistency beats intensity every time. 🔥" },
  ]},
  { id: 2, title: "Best morning routine tips", time: "Yesterday", messages: [
    { from: "user", text: "What's a good morning routine?" },
    { from: "bot", text: "Wake up at the same time, hydrate, meditate for 5 mins, then tackle your top priority task first. 🌅" },
  ]},
  { id: 3, title: "Staying focused while working", time: "Mar 6", messages: [
    { from: "user", text: "How do I stay focused?" },
    { from: "bot", text: "Try the Pomodoro technique — 25 mins focus, 5 mins break. Turn off notifications and use MindTrack to track your sessions! ⏱️" },
  ]},
];

const priorityColors = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };
const statusText = { todo: "#64748b", inprogress: "#2563eb", done: "#16a34a" };
const statusLabel = { todo: "To Do", inprogress: "In Progress", done: "Done" };

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="11" fill="#F59E0B"/>
      <rect width="40" height="40" rx="11" fill="url(#logoGrad)"/>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCD34D"/>
          <stop offset="100%" stopColor="#D97706"/>
        </linearGradient>
      </defs>
      {/* Professional brain/mind icon - two arcs representing mind/thought */}
      <path d="M13 24 C13 18 17 13 20 13 C23 13 27 18 27 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M16 24 C16 20 18 17 20 17 C22 17 24 20 24 24" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Base line */}
      <line x1="11" y1="27" x2="29" y2="27" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Small upward tick - growth */}
      <path d="M17 27 L17 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 27 L20 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M23 27 L23 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ProgressRing({ percent, size = 80, stroke = 7, color = "#2563eb", label, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s ease" }}/>
        <text x="50%" y="50%" textAnchor="middle" dy=".35em" style={{ fontSize: 15, fontWeight: 700, fill: "#1e293b", fontFamily: "'DM Sans', sans-serif" }}>{percent}%</text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{label}</div>
        <div style={{ fontSize: 10, color: "#94a3b8" }}>{sublabel}</div>
      </div>
    </div>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter → tagline → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2400);
    const t3 = setTimeout(() => onDone(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #92400e 0%, #D97706 45%, #F59E0B 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      transition: "opacity 0.6s ease",
      opacity: phase === "exit" ? 0 : 1,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        @keyframes popIn {
          0% { transform: scale(0.4) rotate(-10deg); opacity: 0; }
          70% { transform: scale(1.12) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .logo-pop { animation: popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .tagline-in { animation: fadeUp 0.5s ease forwards; }
        .pulse { position: absolute; width: 90px; height: 90px; border-radius: 22px; background: rgba(255,255,255,0.25); animation: pulse-ring 1.4s ease-out infinite; }
      `}</style>

      {/* Glowing background dots */}
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: "10%", left: "15%" }}/>
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: "15%", right: "10%" }}/>

      {/* Logo area */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
        {phase !== "enter" && <div className="pulse"/>}
        <div className="logo-pop" style={{ position: "relative", zIndex: 2 }}>
          <svg width="88" height="88" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="14" fill="white" fillOpacity="0.2"/>
            <rect width="40" height="40" rx="14" stroke="white" strokeWidth="0.8" fill="none"/>
            <defs>
              <linearGradient id="splashLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="white" stopOpacity="1"/>
                <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            {/* Mind/brain double arc */}
            <path d="M13 24 C13 18 17 13 20 13 C23 13 27 18 27 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <path d="M16 24 C16 20 18 17 20 17 C22 17 24 20 24 24" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            {/* Base line */}
            <line x1="11" y1="27" x2="29" y2="27" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            {/* Upward bars */}
            <path d="M17 27 L17 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 27 L20 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M23 27 L23 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* App name */}
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: "white",
        letterSpacing: "-1px", marginBottom: 10,
        opacity: phase === "enter" ? 0 : 1,
        transform: phase === "enter" ? "translateY(12px)" : "translateY(0)",
        transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
      }}>
        Mind<span style={{ color: "#FEF08A" }}>Track</span>
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 14, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5,
        opacity: phase === "tagline" || phase === "exit" ? 1 : 0,
        transform: phase === "tagline" || phase === "exit" ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        Build habits. Track progress. Grow daily.
      </div>

      {/* Loading dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 48 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.5)",
            animation: `pulse-ring 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

// ─── EMAILJS CONFIG — paste your IDs here after setting up emailjs.com ───────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

async function sendSignupEmail(username, email) {
  try {
    if (!window.emailjs) return;
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      user_name:   username,
      user_email:  email,
      signup_time: new Date().toLocaleString(),
    }, EMAILJS_PUBLIC_KEY);
    console.log("✅ Signup notification sent!");
  } catch (err) {
    console.warn("EmailJS error:", err);
  }
}

// ─── LOGIN PAGE with Gmail Account Picker ─────────────────────────────────────
function LoginPage({ onLogin }) {
  const [view, setView] = useState("picker"); // picker | addAccount | email
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Diva", email: "diva@gmail.com", color: "#F59E0B" },
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass]   = useState("");
  const [newName, setNewName]   = useState("");
  const [error, setError]       = useState("");
  const [sending, setSending]   = useState(false);
  const [hoverId, setHoverId]   = useState(null);

  const avatarColors = ["#F59E0B","#D97706","#EF4444","#8B5CF6","#10B981","#3B82F6","#EC4899","#14B8A6"];

  const pickAccount = async (acc) => {
    await sendSignupEmail(acc.name, acc.email);
    onLogin(acc.name, acc.email, "");
  };

  const addAccount = async () => {
    if (!newEmail.includes("@")) { setError("Enter a valid Gmail address."); return; }
    if (newPass.length < 4)      { setError("Password must be 4+ characters."); return; }
    const name = newName.trim() || newEmail.split("@")[0];
    const color = avatarColors[accounts.length % avatarColors.length];
    setSending(true);
    await sendSignupEmail(name, newEmail);
    setSending(false);
    const acc = { id: Date.now(), name, email: newEmail, color };
    setAccounts(prev => [...prev, acc]);
    setNewEmail(""); setNewPass(""); setNewName(""); setError("");
    setView("picker");
  };

  const removeAccount = (id, e) => {
    e.stopPropagation();
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.5 2.6 13.6l7.9 6.1C12.4 13.4 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
      <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.5L2.4 13.4A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8-6z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-3.9-13.5-9.3l-8 6.1C6.6 42.5 14.6 48 24 48z"/>
    </svg>
  );

  useEffect(() => {
    if (!document.getElementById("emailjs-sdk")) {
      const s = document.createElement("script");
      s.id = "emailjs-sdk";
      s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #fefce8 0%, #f8fafc 50%, #fef9c3 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .inp { width: 100%; padding: 11px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; outline: none; transition: border 0.2s; background: white; color: #1e293b; }
        .inp:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px #fef9c3; }
        .inp::placeholder { color: #94a3b8; }
        .btn-primary { width: 100%; padding: 12px; background: #F59E0B; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .btn-primary:hover { background: #D97706; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .acc-row { display: flex; align-items: center; gap: 13px; padding: 11px 14px; border-radius: 12px; cursor: pointer; transition: background 0.15s; border: 1.5px solid transparent; position: relative; }
        .acc-row:hover { background: #fef9c3; border-color: #FDE68A; }
        .acc-row.hovered .remove-btn { opacity: 1; }
        .remove-btn { opacity: 0; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: #fef2f2; border: none; color: #ef4444; border-radius: 6px; padding: 3px 8px; font-size: 11px; cursor: pointer; transition: opacity 0.15s; font-family: 'DM Sans', sans-serif; font-weight: 600; }
        .add-row { display: flex; align-items: center; gap: 13px; padding: 11px 14px; border-radius: 12px; cursor: pointer; transition: background 0.15s; border: 1.5px dashed #e2e8f0; color: #64748b; }
        .add-row:hover { background: #f8fafc; border-color: #F59E0B; color: #D97706; }
        .back-btn { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 5px; padding: 0; margin-bottom: 4px; }
        .back-btn:hover { color: #1e293b; }
      `}</style>

      <div style={{ display: "flex", width: "100%", maxWidth: 900, minHeight: 540, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}>

        {/* Left panel */}
        <div style={{
          flex: 1, background: "linear-gradient(160deg, #92400e 0%, #D97706 50%, #F59E0B 100%)",
          padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={38}/>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "white", fontWeight: 700 }}>MindTrack</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 14 }}>
              Build habits.<br/>Track progress.<br/>Grow daily.
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
              Join thousands of people who use MindTrack to stay consistent and achieve their goals.
            </div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[["🔥","12-day","avg streak"],["✅","94%","habit rate"],["💬","Chat","AI support"]].map(([icon,val,lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 420, background: "white", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>

          {/* ── ACCOUNT PICKER VIEW ── */}
          {view === "picker" && (
            <>
              {/* Google branding header */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 4 }}>
                <GoogleIcon/>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginTop: 10, fontFamily: "'Playfair Display', serif" }}>
                  Choose an account
                </div>
                <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3 }}>to continue to MindTrack</div>
              </div>

              {/* Account list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {accounts.map(acc => (
                  <div
                    key={acc.id}
                    className={`acc-row${hoverId === acc.id ? " hovered" : ""}`}
                    onClick={() => pickAccount(acc)}
                    onMouseEnter={() => setHoverId(acc.id)}
                    onMouseLeave={() => setHoverId(null)}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: acc.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: 700, fontSize: 15, flexShrink: 0,
                    }}>
                      {acc.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b" }}>{acc.name}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{acc.email}</div>
                    </div>
                    <button className="remove-btn" onClick={(e) => removeAccount(acc.id, e)}>✕ Remove</button>
                  </div>
                ))}

                {/* Add another account */}
                <div className="add-row" onClick={() => { setView("addAccount"); setError(""); }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", background: "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                  }}>+</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>Add another account</div>
                </div>

                {/* Use email instead */}
                <div className="add-row" onClick={() => { setView("email"); setError(""); }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", background: "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                  }}>✉️</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>Use email & password</div>
                </div>
              </div>

              <div style={{ textAlign: "center", fontSize: 11.5, color: "#94a3b8", marginTop: 4, lineHeight: 1.6 }}>
                Hover over an account and click <strong>✕ Remove</strong> to remove it
              </div>
            </>
          )}

          {/* ── ADD ACCOUNT VIEW ── */}
          {view === "addAccount" && (
            <>
              <button className="back-btn" onClick={() => { setView("picker"); setError(""); }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", fontFamily: "'Playfair Display', serif" }}>Add account</div>
                <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3 }}>Sign in with your Gmail to add it</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Your Name</label>
                  <input className="inp" placeholder="e.g. Diva" value={newName} onChange={e => setNewName(e.target.value)}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Gmail Address</label>
                  <input className="inp" type="email" placeholder="you@gmail.com" value={newEmail} onChange={e => setNewEmail(e.target.value)}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Password</label>
                  <input className="inp" type="password" placeholder="••••••••" value={newPass} onChange={e => setNewPass(e.target.value)}/>
                </div>
                {error && <div style={{ fontSize: 12, color: "#ef4444", background: "#fef2f2", padding: "8px 12px", borderRadius: 8 }}>{error}</div>}
                <button className="btn-primary" onClick={addAccount} disabled={sending}>
                  {sending ? "Adding... ⏳" : "Add Account"}
                </button>
              </div>
            </>
          )}

          {/* ── EMAIL LOGIN VIEW ── */}
          {view === "email" && (
            <>
              <button className="back-btn" onClick={() => { setView("picker"); setError(""); }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", fontFamily: "'Playfair Display', serif" }}>Sign in</div>
                <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3 }}>Use your email & password</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Email</label>
                  <input className="inp" type="email" placeholder="you@gmail.com" value={newEmail} onChange={e => setNewEmail(e.target.value)}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5 }}>Password</label>
                  <input className="inp" type="password" placeholder="••••••••" value={newPass} onChange={e => setNewPass(e.target.value)}/>
                </div>
                {error && <div style={{ fontSize: 12, color: "#ef4444", background: "#fef2f2", padding: "8px 12px", borderRadius: 8 }}>{error}</div>}
                <button className="btn-primary" onClick={() => {
                  if (!newEmail.includes("@")) { setError("Enter a valid email."); return; }
                  if (newPass.length < 4) { setError("Password must be 4+ characters."); return; }
                  onLogin(newEmail.split("@")[0], newEmail, "");
                }}>Sign In</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MindTrack() {
  const [screen, setScreen] = useState("splash");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPic, setUserPic] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [habitList, setHabitList] = useState(habits);
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(1);
  const [chatInput, setChatInput] = useState("");

  const toggleHabit = (id) => setHabitList(h => h.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const doneHabits = habitList.filter(h => h.done).length;
  const doneTasks = tasks.filter(t => t.status === "done").length;

  const activeChat = chats.find(c => c.id === activeChatId);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    const replies = [
      "Great question! Consistency is the key to building lasting habits. 💪",
      "I'd recommend starting with just 5 minutes a day and scaling up gradually!",
      "Track your progress daily — small wins add up to big results. 🎯",
      "Remember: done is better than perfect. Keep going! 🚀",
    ];
    const botReply = replies[Math.floor(Math.random() * replies.length)];
    setChats(prev => prev.map(c => c.id === activeChatId
      ? { ...c, messages: [...c.messages, { from: "user", text: msg }, { from: "bot", text: botReply }] }
      : c
    ));
  };

  const newChat = () => {
    const id = Date.now();
    setChats(prev => [{ id, title: "New conversation", time: "Just now", messages: [] }, ...prev]);
    setActiveChatId(id);
  };

  if (screen === "splash") return <SplashScreen onDone={() => setScreen("login")} />;
  if (screen === "login") return <LoginPage onLogin={(u, email, pic) => { setUsername(u); setUserEmail(email); setUserPic(pic); setScreen("app"); }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .nav-item { cursor: pointer; padding: 9px 13px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: #64748b; transition: all 0.15s; }
        .nav-item:hover { background: #fefce8; color: #1e293b; }
        .nav-item.active { background: #fef9c3; color: #92400e; font-weight: 600; }
        .card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 1px 8px rgba(0,0,0,0.04); }
        .habit-row { display: flex; align-items: center; gap: 12px; padding: 11px 13px; border-radius: 12px; transition: background 0.15s; cursor: pointer; }
        .habit-row:hover { background: #fefce8; }
        .check { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
        .check.checked { background: #F59E0B; border-color: #F59E0B; }
        .bar { border-radius: 4px; transition: height 0.5s ease; }
        .tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
        .heat { width: 13px; height: 13px; border-radius: 3px; transition: transform 0.1s; }
        .heat:hover { transform: scale(1.3); }
        .stat-card { background: white; border-radius: 14px; border: 1px solid #f1f5f9; padding: 16px 18px; box-shadow: 0 1px 6px rgba(0,0,0,0.03); }
        .chat-row { padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s; }
        .chat-row:hover { background: #fefce8; }
        .chat-row.active { background: #fef9c3; }
        .chat-inp { flex: 1; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; }
        .chat-inp:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px #fef9c3; }
        .send-btn { background: #F59E0B; color: white; border: none; border-radius: 10px; padding: 10px 16px; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; }
        .send-btn:hover { background: #D97706; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: "white", borderRight: "1px solid #f1f5f9", padding: "24px 14px", display: "flex", flexDirection: "column", gap: 3, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingLeft: 4 }}>
          <Logo size={30}/>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.3px" }}>
              Mind<span style={{ color: "#D97706" }}>Track</span>
            </div>
          </div>
        </div>

        {[
          { id: "dashboard", icon: "⬡", label: "Dashboard" },
          { id: "tasks", icon: "✓", label: "Tasks" },
          { id: "habits", icon: "◎", label: "Habits" },
          { id: "analytics", icon: "▦", label: "Analytics" },
          { id: "chat", icon: "💬", label: "AI Chat" },
        ].map(n => (
          <div key={n.id} className={`nav-item${activeNav === n.id ? " active" : ""}`} onClick={() => setActiveNav(n.id)}>
            <span style={{ fontSize: 15 }}>{n.icon}</span> {n.label}
          </div>
        ))}

        {/* Chat History in sidebar */}
        {activeNav === "chat" && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", marginBottom: 6 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>History</div>
              <div onClick={newChat} style={{ fontSize: 16, color: "#2563eb", cursor: "pointer", fontWeight: 700 }} title="New chat">+</div>
            </div>
            {chats.map(c => (
              <div key={c.id} className={`chat-row${activeChatId === c.id ? " active" : ""}`} onClick={() => setActiveChatId(c.id)}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: activeChatId === c.id ? "#2563eb" : "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{c.time}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "auto", padding: "11px 13px", borderRadius: 12, background: "#f8fafc", display: "flex", alignItems: "center", gap: 10 }}>
          {userPic
            ? <img src={userPic} alt="avatar" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}/>
            : <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#D97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12 }}>
                {username.charAt(0).toUpperCase()}
              </div>
          }
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{username}</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>Free plan</div>
          </div>
          <div onClick={() => setScreen("login")} title="Logout" style={{ fontSize: 14, cursor: "pointer", color: "#94a3b8" }}>⏻</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {/* Header */}
        {activeNav !== "chat" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1e293b" }}>
                {activeNav === "dashboard" && `Good morning, ${username} ☀️`}
                {activeNav === "tasks" && "My Tasks"}
                {activeNav === "habits" && "Daily Habits"}
                {activeNav === "analytics" && "Analytics"}
              </div>
              <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3 }}>Sunday, March 8 · 2026</div>
            </div>
            <button style={{ background: "#F59E0B", color: "white", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Task</button>
          </div>
        )}

        {/* Dashboard */}
        {activeNav === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {[
                { label: "Tasks Done", value: `${doneTasks}/${tasks.length}`, sub: "Today", color: "#F59E0B", bg: "#fef9c3" },
                { label: "Habit Streak", value: "🔥 12", sub: "Days in a row", color: "#D97706", bg: "#fffbeb" },
                { label: "Focus Score", value: "87", sub: "Above average", color: "#22c55e", bg: "#f0fdf4" },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: s.color, fontWeight: 600, marginTop: 4, background: s.bg, display: "inline-block", padding: "2px 8px", borderRadius: 20 }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 14 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", marginBottom: 18 }}>Today's Progress</div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <ProgressRing percent={Math.round((doneTasks/tasks.length)*100)} color="#F59E0B" label="Tasks" sublabel={`${doneTasks} done`}/>
                  <ProgressRing percent={Math.round((doneHabits/habitList.length)*100)} color="#D97706" label="Habits" sublabel={`${doneHabits} done`}/>
                </div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", marginBottom: 14 }}>Weekly Productivity</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 76 }}>
                  {weekData.map(w => (
                    <div key={w.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div className="bar" style={{ width: "100%", height: `${w.score*0.72}px`, background: w.day==="Sun" ? "#F59E0B" : "#FDE68A" }}/>
                      <div style={{ fontSize: 10, color: w.day==="Sun" ? "#D97706" : "#94a3b8", fontWeight: w.day==="Sun" ? 700 : 400 }}>{w.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Today's Habits</div>
              {habitList.map(h => (
                <div key={h.id} className="habit-row" onClick={() => toggleHabit(h.id)}>
                  <div className={`check${h.done ? " checked" : ""}`}>
                    {h.done && <svg width="11" height="11" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 17 }}>{h.icon}</span>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: h.done ? "#94a3b8" : "#1e293b", textDecoration: h.done ? "line-through" : "none" }}>{h.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", background: "#fffbeb", padding: "2px 8px", borderRadius: 20 }}>🔥 {h.streak}d</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {activeNav === "tasks" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {["todo","inprogress","done"].map(status => (
              <div key={status}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: statusText[status], marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{statusLabel[status]} · {tasks.filter(t=>t.status===status).length}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {tasks.filter(t=>t.status===status).map(t => (
                    <div key={t.id} className="card" style={{ padding: "13px 15px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 10, lineHeight: 1.3 }}>{t.title}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span className="tag" style={{ background: `${priorityColors[t.priority]}18`, color: priorityColors[t.priority] }}>{t.priority}</span>
                        <span className="tag" style={{ background: "#f1f5f9", color: "#64748b" }}>{t.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Habits */}
        {activeNav === "habits" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 520 }}>
            {habitList.map(h => (
              <div key={h.id} className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }} onClick={() => toggleHabit(h.id)}>
                <div style={{ fontSize: 26 }}>{h.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "#1e293b", marginBottom: 3 }}>{h.name}</div>
                  <div style={{ fontSize: 11.5, color: "#94a3b8" }}>Daily · {h.streak} day streak</div>
                  <div style={{ marginTop: 7, height: 4, borderRadius: 4, background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(h.streak*7,100)}%`, background: "#F59E0B", borderRadius: 4 }}/>
                  </div>
                </div>
                <div className={`check${h.done ? " checked" : ""}`} style={{ width: 26, height: 26 }}>
                  {h.done && <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics */}
        {activeNav === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", marginBottom: 14 }}>Weekly Overview</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 96 }}>
                  {weekData.map(w => (
                    <div key={w.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 9, color: "#94a3b8" }}>{w.score}</div>
                      <div className="bar" style={{ width: "100%", height: `${w.score}px`, background: "linear-gradient(to top, #D97706, #FCD34D)" }}/>
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>{w.day}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", marginBottom: 14 }}>Habit Completion Rate</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {habitList.map(h => (
                    <div key={h.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#64748b", marginBottom: 4 }}>
                        <span>{h.icon} {h.name}</span>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{Math.min(h.streak*7,95)}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 4, background: "#f1f5f9" }}>
                        <div style={{ height: "100%", width: `${Math.min(h.streak*7,95)}%`, background: "#F59E0B", borderRadius: 4 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Habit Heatmap</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 15px)", gap: 4 }}>
                {heatmapData.map((d,i) => (
                  <div key={i} className="heat" style={{ background: d.active ? d.intensity===3?"#92400e":d.intensity===2?"#D97706":d.intensity===1?"#FCD34D":"#FEF08A" : "#f1f5f9" }}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Chat */}
        {activeNav === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
              💬 {activeChat?.title || "New Chat"}
            </div>
            <div className="card" style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 0, overflowY: "auto", marginBottom: 14 }}>
              {activeChat?.messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 40 }}>
                  👋 Start a conversation! Ask me anything about habits, productivity, or focus.
                </div>
              )}
              {activeChat?.messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                  {m.from === "bot" && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#D97706)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, fontSize: 13 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: "70%", padding: "10px 14px", borderRadius: m.from==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.from==="user" ? "#F59E0B" : "#f8fafc",
                    color: m.from==="user" ? "white" : "#1e293b",
                    fontSize: 13.5, lineHeight: 1.5,
                    border: m.from==="bot" ? "1px solid #f1f5f9" : "none",
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input className="chat-inp" placeholder="Ask me about habits, focus, or productivity..." value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}/>
              <button className="send-btn" onClick={sendMessage}>Send ↑</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
