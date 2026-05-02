/* Achievements graph + Contact node + Footer */
const { useEffect: useEffectA, useRef: useRefA, useState: useStateA, useMemo: useMemoA } = React;

const CLUSTER_COLORS = {
  research: "#00f5ff",
  competitions: "#ff2bd6",
  "open-source": "#9d00ff",
  press: "#ffc857",
};

function AchievementsGraph({ data, onSelect }) {
  const wrapRef = useRefA(null);
  const [size, setSize] = useStateA({ w: 1200, h: 880 });
  const [hover, setHover] = useStateA(null);
  const [isMobile, setIsMobile] = useStateA(window.innerWidth <= 720);

  useEffectA(() => {
    function measure() {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
      setIsMobile(window.innerWidth <= 720);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // cluster centers
  const clusters = ["research", "competitions", "open-source", "press"];
  const positions = useMemoA(() => {
    const out = {};
    const cx = size.w / 2;
    const cy = size.h / 2;
    // pull cluster centers tighter to vertical center, more vertical spread
    clusters.forEach((c, ci) => {
      const angle = (ci / clusters.length) * Math.PI * 2 - Math.PI / 2;
      const cxC = cx + Math.cos(angle) * Math.min(size.w * 0.34, 380);
      const cyC = cy + Math.sin(angle) * Math.min(size.h * 0.28, 230);
      const inCluster = data.achievements.filter((a) => a.cluster === c);
      inCluster.forEach((a, i) => {
        const r = 100 + (inCluster.length > 2 ? 40 : 0);
        const subAngle = (i / inCluster.length) * Math.PI * 2;
        out[a.id] = {
          x: cxC + Math.cos(subAngle) * r * (inCluster.length > 1 ? 1 : 0),
          y: cyC + Math.sin(subAngle) * r * (inCluster.length > 1 ? 1 : 0),
          cluster: c,
          centerX: cxC,
          centerY: cyC,
        };
      });
    });
    return out;
  }, [size, data.achievements]);

  /* ── Mobile: stacked card layout ── */
  if (isMobile) {
    return (
      <div ref={wrapRef} style={{ padding: "20px 0" }}>
        {clusters.map((c) => {
          const items = data.achievements.filter((a) => a.cluster === c);
          if (!items.length) return null;
          const color = CLUSTER_COLORS[c];
          return (
            <div key={c} style={{ marginBottom: 28 }}>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
                color: color, marginBottom: 12, textShadow: `0 0 12px ${color}`,
              }}>
                ◆ {c}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((a) => {
                  const isHover = hover === a.id;
                  return (
                    <div key={a.id} data-cursor="hover"
                      onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}
                      onClick={() => onSelect && onSelect(a)}>
                      <div className="glass mono" style={{
                        padding: "12px 16px",
                        borderRadius: 8,
                        border: `1px solid ${isHover ? color : "rgba(255,255,255,0.12)"}`,
                        background: isHover ? `${color}14` : "rgba(10, 10, 18, 0.85)",
                        boxShadow: isHover ? `0 0 24px ${color}80` : `0 0 8px ${color}20`,
                        transition: "all 220ms cubic-bezier(.2,.7,.2,1)",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9, letterSpacing: "0.16em" }}>
                          <span style={{ color: color }}>◆ {a.type.toUpperCase()}</span>
                          <span style={{ color: "var(--ink-faint)" }}>{a.year}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ink)", fontWeight: 600, marginBottom: 2, wordBreak: "break-word" }}>{a.name}</div>
                        <div style={{ fontSize: 10, color: "var(--ink-dim)", wordBreak: "break-word" }}>{a.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ── Desktop: SVG graph layout ── */
  return (
    <div className="graph-wrap" ref={wrapRef} style={{ height: 980, paddingTop: 96 }}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
        <defs>
          <filter id="aglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* cluster halos */}
        {clusters.map((c, i) => {
          const items = data.achievements.filter((a) => a.cluster === c);
          if (!items.length) return null;
          const p = positions[items[0].id];
          if (!p) return null;
          const color = CLUSTER_COLORS[c];
          return (
            <g key={c}>
              <circle cx={p.centerX} cy={p.centerY} r={items.length > 1 ? 150 : 90}
                fill={`${color}10`} stroke={`${color}55`} strokeWidth="1.5" strokeDasharray="2 6" />
              <circle cx={p.centerX} cy={p.centerY} r={items.length > 1 ? 158 : 98}
                fill="none" stroke={`${color}22`} strokeWidth="1" />
              <text x={p.centerX} y={p.centerY - (items.length > 1 ? 168 : 108)}
                fill={color} fontSize="13" fontFamily="JetBrains Mono"
                letterSpacing="4" textAnchor="middle"
                style={{ textTransform: "uppercase", textShadow: `0 0 12px ${color}` }}>
                ◆ {c}
              </text>
            </g>
          );
        })}

        {/* edges to cluster center */}
        {data.achievements.map((a) => {
          const p = positions[a.id];
          if (!p || (p.x === p.centerX && p.y === p.centerY)) return null;
          const color = CLUSTER_COLORS[a.cluster];
          const active = hover === a.id;
          return (
            <line key={a.id} x1={p.centerX} y1={p.centerY} x2={p.x} y2={p.y}
              stroke={color} strokeOpacity={active ? 0.7 : 0.18}
              strokeWidth={active ? 1.4 : 0.8}
              filter={active ? "url(#aglow)" : ""}
            />
          );
        })}

        {/* cross-cluster edges (progression) */}
        {[
          ["a5", "a3"], ["a3", "a4"], ["a4", "a2"], ["a2", "a1"],
          ["a7", "a6"], ["a8", "a6"], ["a7", "a9"], ["a2", "a10"],
        ].map(([x, y], i) => {
          const A = positions[x], B = positions[y];
          if (!A || !B) return null;
          return (
            <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="#ffffff" strokeOpacity="0.06" strokeWidth="0.8"
              strokeDasharray="2 4" />
          );
        })}
      </svg>

      {data.achievements.map((a) => {
        const p = positions[a.id];
        if (!p) return null;
        const color = CLUSTER_COLORS[a.cluster];
        const isHover = hover === a.id;
        return (
          <div key={a.id} className="node-card" data-cursor="hover"
            style={{ left: p.x, top: p.y, zIndex: isHover ? 5 : 2 }}
            onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}
            onClick={() => onSelect && onSelect(a)}>
            <div className="glass mono" style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${isHover ? color : "rgba(255,255,255,0.12)"}`,
              background: isHover ? `${color}14` : "rgba(10, 10, 18, 0.85)",
              boxShadow: isHover ? `0 0 24px ${color}80` : `0 0 8px ${color}20`,
              minWidth: 150,
              maxWidth: 220,
              transform: isHover ? "scale(1.05)" : "scale(1)",
              transition: "all 220ms cubic-bezier(.2,.7,.2,1)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9, letterSpacing: "0.16em" }}>
                <span style={{ color: color }}>◆ {a.type.toUpperCase()}</span>
                <span style={{ color: "var(--ink-faint)" }}>{a.year}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink)", fontWeight: 600, marginBottom: 2, wordBreak: "break-word" }}>{a.name}</div>
              <div style={{ fontSize: 10, color: "var(--ink-dim)", wordBreak: "break-word" }}>{a.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== Contact Node ===== */

// ─── EmailJS config — fill in your values ───────────────────────────────────
const EMAILJS_SERVICE_ID = "service_hyasekt";   // e.g. "service_xxxxxxx"
const EMAILJS_TEMPLATE_ID = "template_t3sfurj";  // e.g. "template_xxxxxxx"
const EMAILJS_PUBLIC_KEY = "bP9JSr0ZRnSU-9K2w";   // e.g. "xxxxxxxxxxxxxxxxxxxx"
const RECAPTCHA_SITE_KEY = "6LeKRdUsAAAAAMHSzc8RTJUW4bJN-xmRyaAj6-8e"; // from console.cloud.google.com
// ────────────────────────────────────────────────────────────────────────────

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
  const [form, setForm] = useStateA({ email: "", subject: "", message: "" });
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
      subject: sanitize(form.subject),
      message: sanitize(form.message.trim()),
      reply_to: sanitize(form.email.trim())
      // to_email is hardcoded inside the EmailJS template — not passed here
    };

    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, { publicKey: EMAILJS_PUBLIC_KEY });
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
    setForm({ email: "", subject: "", message: "" });
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
          {["github", "twitter", "linkedin", "scholar"].map((s) => (
            <a key={s} data-cursor="hover" className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-dim)" }}>{s} ↗</a>
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
