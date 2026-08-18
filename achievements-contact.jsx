/* Achievements pie chart + Contact node + Footer */
const { useEffect: useEffectA, useRef: useRefA, useState: useStateA, useMemo: useMemoA } = React;

const CLUSTER_COLORS = {
  competitions: "#ff2bd6",
};

/* ── Pie-slice color palette — keyed by exact type strings from data.jsx ── */
const TYPE_COLORS = {
  "Capture The Flag":  "#00f5ff",   // cyan
  "Hackathon":         "#ff2bd6",   // pink
  "AI Competition":    "#9d00ff",   // purple
  "Project Showcasing":"#ffc857",   // amber
  // add more types here as needed
  default:             "#5eead4",   // teal fallback
};

function getTypeColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS.default;
}

// Transitional module bridge for the existing multi-file component layout.
globalThis.AchievementsGraph = AchievementsGraph;
globalThis.ContactNode = ContactNode;
globalThis.Footer = Footer;

/* ── SVG arc path helper ── */
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle) };
  const end   = { x: cx + r * Math.cos(endAngle),   y: cy + r * Math.sin(endAngle) };
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

function AchievementsGraph({ data, onSelect }) {
  const wrapRef = useRefA(null);
  const [hover, setHover] = useStateA(null);
  const [animProg, setAnimProg] = useStateA(0);     // 0→1 mount animation
  const [isMobile, setIsMobile] = useStateA(window.innerWidth <= 720);

  // Only competitions
  const items = useMemoA(
    () => data.achievements.filter((a) => a.cluster === "competitions"),
    [data.achievements]
  );

  // Aggregate by type for the pie
  const slices = useMemoA(() => {
    const counts = {};
    items.forEach((a) => { counts[a.type] = (counts[a.type] || 0) + 1; });
    const total = items.length || 1;
    let cursor = -Math.PI / 2; // start at 12 o'clock
    return Object.entries(counts).map(([type, count]) => {
      const sweep = (count / total) * Math.PI * 2;
      const slice = { type, count, pct: Math.round((count / total) * 100), start: cursor, end: cursor + sweep, color: getTypeColor(type) };
      cursor += sweep;
      return slice;
    });
  }, [items]);

  // mount animation
  useEffectA(() => {
    let raf; let t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 900, 1);
      // ease-out cubic
      setAnimProg(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffectA(() => {
    function onResize() { setIsMobile(window.innerWidth <= 720); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const RADIUS = isMobile ? 130 : 220;
  const INNER  = isMobile ? 70  : 120;   // donut hole
  const SVG    = (RADIUS + 40) * 2;
  const CX     = SVG / 2;
  const CY     = SVG / 2;

  /* ── Mobile: simple card + mini donut ── */
  if (isMobile) {
    return (
      <div ref={wrapRef} style={{ padding: "20px 0" }}>
        {/* mini donut */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`} style={{ maxWidth: "90vw" }}>
            <defs>
              <filter id="pie-glow-m" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>
            {/* glow underlayer */}
            {slices.map((s, i) => {
              const aSweep = (s.end - s.start) * animProg;
              const aEnd   = s.start + aSweep;
              return <path key={`gm${i}`} d={describeArc(CX, CY, RADIUS, s.start, aEnd)} fill={s.color} opacity="0.18" filter="url(#pie-glow-m)" />;
            })}
            {slices.map((s, i) => {
              const aSweep = (s.end - s.start) * animProg;
              const aEnd   = s.start + aSweep;
              const isHov  = hover === s.type;
              const r      = isHov ? RADIUS + 8 : RADIUS;
              return (
                <path key={`sm${i}`} d={describeArc(CX, CY, r, s.start, aEnd)}
                  fill={s.color} opacity={isHov ? 1 : 0.85}
                  stroke="rgba(10,10,18,0.9)" strokeWidth="2"
                  style={{ transition: "all 220ms ease", cursor: "pointer" }}
                  onMouseEnter={() => setHover(s.type)} onMouseLeave={() => setHover(null)}
                />
              );
            })}
            {/* donut hole */}
            <circle cx={CX} cy={CY} r={INNER} fill="rgba(10,10,18,0.95)" />
            <circle cx={CX} cy={CY} r={INNER} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* center label */}
            <text x={CX} y={CY - 10} textAnchor="middle" fill="#ffffff" fontSize="22" fontFamily="'Outfit', sans-serif" fontWeight="700">{items.length}</text>
            <text x={CX} y={CY + 12} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="'JetBrains Mono', monospace" letterSpacing="3">COMPETITIONS</text>
          </svg>
        </div>

        {/* cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((a) => {
            const color = getTypeColor(a.type);
            // A hovered pie slice stores its achievement type, while a hovered
            // card stores its id. Support both so mobile cards mirror desktop.
            const isHov = hover === a.id || hover === a.type;
            return (
              <div key={a.id} data-cursor="hover"
                onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}
                onClick={() => onSelect && onSelect(a)}>
                <div className="glass mono" style={{
                  padding: "12px 16px", borderRadius: 8,
                  border: `1px solid ${isHov ? color : "rgba(255,255,255,0.12)"}`,
                  background: isHov ? `${color}14` : "rgba(10, 10, 18, 0.85)",
                  boxShadow: isHov ? `0 0 24px ${color}80` : `0 0 8px ${color}20`,
                  transition: "all 220ms cubic-bezier(.2,.7,.2,1)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9, letterSpacing: "0.16em" }}>
                    <span style={{ color }}>◆ {a.type.toUpperCase()}</span>
                    <span style={{ color: "var(--ink-faint)" }}>{a.year}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink)", fontWeight: 600, marginBottom: 2 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: "var(--ink-dim)" }}>{a.note}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Desktop: large centered pie chart ── */
  return (
    <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
      {/* PIE */}
      <div style={{ position: "relative", width: SVG, height: SVG }}>
        <svg width={SVG} height={SVG} viewBox={`0 0 ${SVG} ${SVG}`}>
          <defs>
            <filter id="pie-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="pie-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            {/* rotating dashed ring */}
            <clipPath id="donut-clip">
              <circle cx={CX} cy={CY} r={RADIUS + 30} />
            </clipPath>
          </defs>

          {/* outer decorative rings */}
          <circle cx={CX} cy={CY} r={RADIUS + 28} fill="none" stroke="rgba(255,43,214,0.10)" strokeWidth="1" strokeDasharray="3 8" style={{ animation: "spin-slow 60s linear infinite" }} />
          <circle cx={CX} cy={CY} r={RADIUS + 22} fill="none" stroke="rgba(0,245,255,0.06)" strokeWidth="1" strokeDasharray="1 12" style={{ animation: "spin-slow 90s linear infinite reverse" }} />

          {/* glow underlayer */}
          {slices.map((s, i) => {
            const aSweep = (s.end - s.start) * animProg;
            const aEnd   = s.start + aSweep;
            return <path key={`g${i}`} d={describeArc(CX, CY, RADIUS, s.start, aEnd)} fill={s.color} opacity="0.15" filter="url(#pie-glow)" />;
          })}

          {/* main slices */}
          {slices.map((s, i) => {
            const aSweep = (s.end - s.start) * animProg;
            const aEnd   = s.start + aSweep;
            const isHov  = hover === s.type;
            const r      = isHov ? RADIUS + 14 : RADIUS;
            return (
              <path key={`s${i}`} d={describeArc(CX, CY, r, s.start, aEnd)}
                fill={s.color} opacity={isHov ? 1 : 0.82}
                stroke="rgba(10,10,18,0.9)" strokeWidth="2.5"
                style={{ transition: "all 260ms cubic-bezier(.2,.7,.2,1)", cursor: "pointer" }}
                onMouseEnter={() => setHover(s.type)} onMouseLeave={() => setHover(null)}
                data-cursor="hover"
              />
            );
          })}

          {/* bright edge highlights */}
          {slices.map((s, i) => {
            const aSweep = (s.end - s.start) * animProg;
            const aEnd   = s.start + aSweep;
            const isHov  = hover === s.type;
            if (!isHov) return null;
            const r = RADIUS + 14;
            return <path key={`h${i}`} d={describeArc(CX, CY, r, s.start, aEnd)} fill="none" stroke={s.color} strokeWidth="2" filter="url(#pie-glow-sm)" />;
          })}

          {/* donut hole */}
          <circle cx={CX} cy={CY} r={INNER} fill="rgba(10,10,18,0.92)" />
          <circle cx={CX} cy={CY} r={INNER} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r={INNER - 6} fill="none" stroke="rgba(255,43,214,0.08)" strokeWidth="1" strokeDasharray="2 6" />

          {/* center label */}
          <text x={CX} y={CY - 16} textAnchor="middle" fill="#ffffff" fontSize="42" fontFamily="'Outfit', sans-serif" fontWeight="700"
            style={{ opacity: animProg }}>{items.length}</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="'JetBrains Mono', monospace"
            letterSpacing="4" style={{ opacity: animProg, textTransform: "uppercase" }}>competitions</text>
          <text x={CX} y={CY + 30} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="'JetBrains Mono', monospace"
            letterSpacing="2" style={{ opacity: animProg * 0.7 }}>◆ HOVER TO INSPECT</text>

          {/* slice labels */}
          {slices.map((s, i) => {
            const aSweep = (s.end - s.start) * animProg;
            const aEnd   = s.start + aSweep;
            const mid    = s.start + aSweep / 2;
            const lr     = RADIUS * 0.72;
            const lx     = CX + Math.cos(mid) * lr;
            const ly     = CY + Math.sin(mid) * lr;
            const isHov  = hover === s.type;
            if (animProg < 0.5) return null;
            return (
              <g key={`l${i}`} style={{ opacity: (animProg - 0.5) * 2, pointerEvents: "none" }}>
                <text x={lx} y={ly - 6} textAnchor="middle" fill="#ffffff" fontSize="14" fontFamily="'Outfit', sans-serif" fontWeight="700"
                  style={{ textShadow: `0 0 10px ${s.color}` }}>{s.pct}%</text>
                <text x={lx} y={ly + 10} textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="2" style={{ textShadow: `0 0 8px ${s.color}`, textTransform: "uppercase" }}>{s.type}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend + detail cards ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", maxWidth: 860, width: "100%" }}>
        {items.map((a) => {
          const color  = getTypeColor(a.type);
          const isHov  = hover === a.id || hover === a.type;
          return (
            <div key={a.id} data-cursor="hover"
              style={{ flex: "1 1 220px", maxWidth: 280, opacity: animProg }}
              onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}
              onClick={() => onSelect && onSelect(a)}>
              <div className="glass mono" style={{
                padding: "14px 18px", borderRadius: 10,
                border: `1px solid ${isHov ? color : "rgba(255,255,255,0.10)"}`,
                background: isHov ? `${color}14` : "rgba(10, 10, 18, 0.85)",
                boxShadow: isHov ? `0 0 32px ${color}60` : `0 0 8px ${color}15`,
                transform: isHov ? "translateY(-4px) scale(1.03)" : "none",
                transition: "all 260ms cubic-bezier(.2,.7,.2,1)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 9, letterSpacing: "0.18em" }}>
                  <span style={{ color }}>◆ {a.type.toUpperCase()}</span>
                  <span style={{ color: "var(--ink-faint)" }}>{a.year}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600, marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontSize: 10, color: "var(--ink-dim)", lineHeight: 1.5 }}>{a.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin-slow { from { transform-origin: ${CX}px ${CY}px; transform: rotate(0deg); } to { transform-origin: ${CX}px ${CY}px; transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ===== Contact Node ===== */
const EMAILJS_SERVICE_ID = "service_hyasekt";
const EMAILJS_TEMPLATE_ID = "template_t3sfurj";
const EMAILJS_PUBLIC_KEY = "bP9JSr0ZRnSU-9K2w";
const RECAPTCHA_SITE_KEY = "6Le8UIwtAAAAAM3bRCZuBKFpP2G7pqY8a_KHpvTi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MSG = 1000;
const COOLDOWN = 60; // seconds

function sanitize(str) {
  // Strip script-like patterns; do NOT use innerHTML — plain string ops only
  return str
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

function ContactNode() {
  const [stage, setStage] = useStateA("idle"); // idle | open | sending | sent | error | cooldown
  const [form, setForm] = useStateA({ email: "", title: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useStateA("");   // must stay empty
  const [fieldErr, setFieldErr] = useStateA({});   // per-field validation errors
  const [errMsg, setErrMsg] = useStateA("");      // global error message (stage === "error")
  const [coolLeft, setCoolLeft] = useStateA(0);    // seconds remaining in cooldown
  const lastSentRef = useRefA(0);                  // timestamp of last successful send
  const captchaRef = useRefA(null);               // div for reCAPTCHA widget
  const widgetIdRef = useRefA(null);               // grecaptcha widget id

  // Render reCAPTCHA widget once the form opens
  useEffectA(() => {
    if (stage !== "open") return;
    if (!window.grecaptcha || widgetIdRef.current !== null) return;
    const interval = setInterval(() => {
      if (!window.grecaptcha || !captchaRef.current) return;
      clearInterval(interval);
      try {
        widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: "dark",
          size: "normal",
        });
      } catch (_) { /* already rendered */ }
    }, 200);
    return () => clearInterval(interval);
  }, [stage]);

  // Cooldown countdown ticker
  useEffectA(() => {
    if (stage !== "cooldown") return;
    const id = setInterval(() => {
      const left = Math.ceil((lastSentRef.current + COOLDOWN * 1000 - Date.now()) / 1000);
      if (left <= 0) {
        setCoolLeft(0);
        setStage("open");
        clearInterval(id);
      } else {
        setCoolLeft(left);
      }
    }, 500);
    return () => clearInterval(id);
  }, [stage]);

  function open() {
    widgetIdRef.current = null; // allow re-render on reopen
    setStage("open");
  }

  function validate() {
    const errs = {};
    const email = form.email.trim();
    const message = form.message.trim();

    if (!EMAIL_RE.test(email)) errs.email = "Invalid email address.";
    if (!form.title.trim()) errs.title = "Title cannot be empty.";
    else if (form.title.trim().length > 120) errs.title = "Max 120 characters.";
    if (!form.subject) errs.subject = "Please select an intent.";
    if (!message) errs.message = "Message cannot be empty.";
    else if (message.length > MAX_MSG) errs.message = `Max ${MAX_MSG} characters.`;

    setFieldErr(errs);
    return Object.keys(errs).length === 0;
  }

  async function send(e) {
    e.preventDefault();

    // Honeypot — silently reject bots that fill this field
    if (honeypot) return;

    // Double-submit guard
    if (stage === "sending") return;

    // Client-side rate limit
    const elapsed = Date.now() - lastSentRef.current;
    if (lastSentRef.current && elapsed < COOLDOWN * 1000) {
      setCoolLeft(Math.ceil((COOLDOWN * 1000 - elapsed) / 1000));
      setStage("cooldown");
      return;
    }

    // Validation
    if (!validate()) return;

    // reCAPTCHA token
    let captchaToken = "";
    try {
      captchaToken = window.grecaptcha.getResponse(widgetIdRef.current);
    } catch (_) { }
    if (!captchaToken) {
      setFieldErr((p) => ({ ...p, captcha: "Please complete the CAPTCHA." }));
      return;
    }

    setStage("sending");
    setErrMsg("");

    const payload = {
      from_email: sanitize(form.email.trim()),
      title: sanitize(form.title.trim()),
      subject: sanitize(form.subject),
      message: sanitize(form.message.trim()),
      reply_to: sanitize(form.email.trim()),
      // EmailJS verifies this token against the template's reCAPTCHA secret.
      "g-recaptcha-response": captchaToken,
      // to_email is hardcoded inside the EmailJS template — not passed here
    };

    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, {
        publicKey: EMAILJS_PUBLIC_KEY,
        blockHeadless: true,
        limitRate: { id: "portfolio-contact", throttle: COOLDOWN * 1000 },
      });
      lastSentRef.current = Date.now();
      setStage("sent");
    } catch (_) {
      // Error detail intentionally suppressed — do not expose SDK internals
      setErrMsg("Transmission failed. Please try again later or contact directly.");
      setStage("error");
      try { window.grecaptcha.reset(widgetIdRef.current); } catch (_e) { }
    }
  }

  function reset() {
    setStage("idle");
    setForm({ email: "", title: "", subject: "", message: "" });
    setHoneypot("");
    setFieldErr({});
    setErrMsg("");
    setCoolLeft(0);
    try { window.grecaptcha.reset(widgetIdRef.current); } catch (_) { }
    widgetIdRef.current = null;
  }

  const errStyle = { fontSize: 10, color: "var(--pink)", letterSpacing: "0.12em", marginTop: 5, fontFamily: "'JetBrains Mono', monospace" };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      {stage === "idle" && (
        <button onClick={open} data-cursor="hover" style={{ position: "relative", padding: 0 }}>
          <div style={{
            position: "absolute", inset: -60, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,245,255,0.25), transparent 70%)",
            animation: "breathe 2.6s ease-in-out infinite"
          }} />
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              position: "absolute", inset: -i * 22,
              border: "1px solid var(--cyan)", borderRadius: "50%", opacity: 0.4 / i,
              animation: `ping ${2 + i * 0.4}s ease-out infinite`,
            }} />
          ))}
          <div className="glass mono" style={{
            position: "relative",
            width: 220, height: 220, borderRadius: "50%",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: "1px solid var(--cyan)",
            background: "rgba(0, 245, 255, 0.06)",
            boxShadow: "0 0 80px rgba(0, 245, 255, 0.4), inset 0 0 40px rgba(0, 245, 255, 0.08)",
            color: "var(--cyan)",
            gap: 8,
          }}>
            <div style={{ fontSize: 36 }}>◇</div>
            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}>Initiate</div>
            <div style={{ fontSize: 14, color: "var(--ink)", letterSpacing: "0.04em" }}>open channel</div>
            <div style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.2em" }}>0xA17B · LISTENING</div>
          </div>
        </button>
      )}

      {(stage === "open" || stage === "sending" || stage === "error") && (
        <form onSubmit={send} noValidate className="glass brackets" style={{
          width: "100%", maxWidth: 640, padding: 32,
          opacity: stage === "sending" ? 0.6 : 1,
          transition: "opacity 220ms ease",
        }}>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 10, letterSpacing: "0.22em", color: "var(--cyan)" }}>
            <span>● CHANNEL OPEN · ENCRYPTED</span>
            <span>{stage === "sending" ? "TX..." : "RX READY"}</span>
          </div>

          {/* ── Honeypot — hidden from real users, visible to bots ── */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="hp_company">Company</label>
            <input id="hp_company" name="company" type="text" tabIndex="-1" autoComplete="off"
              value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          {/* ── Email ── */}
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">▸ Origin (your email)</label>
            <input className="field" type="email" required placeholder="you@domain.com"
              maxLength={254}
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setFieldErr((p) => ({ ...p, email: "" })); }} />
            {fieldErr.email && <div style={errStyle}>▸ {fieldErr.email}</div>}
          </div>

          {/* ── Title ── */}
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">▸ Title</label>
            <input className="field" type="text" required placeholder="Brief subject line..."
              maxLength={120}
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setFieldErr((p) => ({ ...p, title: "" })); }} />
            {fieldErr.title && <div style={errStyle}>▸ {fieldErr.title}</div>}
          </div>

          {/* ── Intent ── */}
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">▸ Intent</label>
            <select className="field" required value={form.subject}
              onChange={(e) => { setForm({ ...form, subject: e.target.value }); setFieldErr((p) => ({ ...p, subject: "" })); }}
              style={{ appearance: "none" }}>
              <option value="">Select packet type...</option>
              <option value="coffee chat">◇ Coffee chat</option>
              <option value="collaboration">◆ Collaboration</option>
              <option value="hire / contract">▸ Hire / contract</option>
              <option value="others">∴ Something else</option>
            </select>
            {fieldErr.subject && <div style={errStyle}>▸ {fieldErr.subject}</div>}
          </div>

          {/* ── Message ── */}
          <div style={{ marginBottom: 22 }}>
            <label className="field-label">▸ Payload</label>
            <textarea className="field" required placeholder="Begin transmission..."
              maxLength={MAX_MSG}
              value={form.message}
              onChange={(e) => { setForm({ ...form, message: e.target.value }); setFieldErr((p) => ({ ...p, message: "" })); }} />
            {fieldErr.message && <div style={errStyle}>▸ {fieldErr.message}</div>}
          </div>

          {/* ── reCAPTCHA ── */}
          <div style={{ marginBottom: 20 }}>
            <div ref={captchaRef} />
            {fieldErr.captcha && <div style={{ ...errStyle, marginTop: 8 }}>▸ {fieldErr.captcha}</div>}
          </div>

          {/* ── Error banner (stage === "error") ── */}
          {stage === "error" && errMsg && (
            <div className="mono" style={{
              marginBottom: 16, padding: "10px 14px",
              borderRadius: 8, border: "1px solid var(--pink)",
              background: "rgba(255,43,214,0.06)",
              fontSize: 11, color: "var(--pink)", letterSpacing: "0.1em", lineHeight: 1.6,
            }}>
              ▸ {errMsg}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
              {form.message.length}/{MAX_MSG} BYTES · AES-256
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={reset} className="btn" style={{ color: "var(--ink-dim)" }}>Abort</button>
              <button type="submit" className="btn btn-pink" disabled={stage === "sending"}>
                {stage === "sending" ? "▸ Transmitting..." : "▸ Transmit"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Cooldown screen ── */}
      {stage === "cooldown" && (
        <div className="glass brackets" style={{ width: "100%", maxWidth: 520, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: "var(--pink)" }}>⏳</div>
          <div className="mono" style={{ color: "var(--pink)", letterSpacing: "0.22em", fontSize: 12, marginBottom: 12 }}>
            ▸ RATE LIMIT ACTIVE
          </div>
          <div style={{ color: "var(--ink)", fontSize: 16, marginBottom: 8 }}>Channel cooling down.</div>
          <div style={{ color: "var(--ink-dim)", fontSize: 14, marginBottom: 24 }}>
            Please wait <span style={{ color: "var(--cyan)", fontFamily: "'JetBrains Mono', monospace" }}>{coolLeft}s</span> before retransmitting.
          </div>
          <button onClick={reset} className="btn">▸ Back to idle</button>
        </div>
      )}

      {stage === "sent" && (
        <div className="glass brackets" style={{ width: "100%", maxWidth: 520, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }} className="glow-cyan">◆</div>
          <div className="mono" style={{ color: "var(--cyan)", letterSpacing: "0.22em", fontSize: 12, marginBottom: 12 }}>
            ▸ TRANSMISSION RECEIVED
          </div>
          <div style={{ color: "var(--ink)", fontSize: 16, marginBottom: 8 }}>Packet acknowledged.</div>
          <div style={{ color: "var(--ink-dim)", fontSize: 14, marginBottom: 24 }}>
            I'll respond within 48h on the same channel.
          </div>
          <button onClick={reset} className="btn">▸ Open new channel</button>
        </div>
      )}

      <style>{`
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 1; } }
        @keyframes ping { 0% { transform: scale(0.8); opacity: 0.4; } 100% { transform: scale(1.6); opacity: 0; } }
      `}</style>
    </div>
  );
}

function Footer() {
  const socialLinks = [
    { label: "github", href: "https://github.com/AloysiusLimMingZhou" },
    { label: "linkedin", href: "https://www.linkedin.com/in/aloysius-lim-ming-zhou/" },
    { label: "instagram", href: "https://www.instagram.com/aloysius.lim.xiii/" },
  ];

  return (
    <footer style={{ padding: "60px 7vw 40px", borderTop: "1px solid var(--hairline)", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div className="display" style={{ fontSize: 22, marginBottom: 6 }}>aloysius<span style={{ color: "var(--pink)" }}>.</span>lim</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.2em" }}>
            NEURAL.INTERFACE · BUILT 2026 · v3.4.2
          </div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {socialLinks.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-dim)" }}>{label} ↗</a>
          ))}
        </div>
      </div>
      <div className="mono" style={{ marginTop: 40, fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.22em", display: "flex", justifyContent: "space-between" }}>
        <span>© 2026 ALOYSIUS LIM · ALL NODES RESERVED</span>
        <span>● SYSTEM ACTIVE</span>
      </div>
    </footer>
  );
}

Object.assign(window, { AchievementsGraph, ContactNode, Footer, CLUSTER_COLORS });
