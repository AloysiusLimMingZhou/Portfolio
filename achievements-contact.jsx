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

  useEffectA(() => {
    function measure() {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
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
              transform: isHover ? "scale(1.05)" : "scale(1)",
              transition: "all 220ms cubic-bezier(.2,.7,.2,1)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9, letterSpacing: "0.16em" }}>
                <span style={{ color: color }}>◆ {a.type.toUpperCase()}</span>
                <span style={{ color: "var(--ink-faint)" }}>{a.year}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink)", fontWeight: 600, marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: "var(--ink-dim)" }}>{a.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== Contact Node ===== */
function ContactNode() {
  const [stage, setStage] = useStateA("idle"); // idle | open | sending | sent
  const [form, setForm] = useStateA({ email: "", subject: "", message: "" });

  function open() { setStage("open"); }
  function send(e) {
    e.preventDefault();
    setStage("sending");
    setTimeout(() => setStage("sent"), 1400);
  }
  function reset() {
    setStage("idle");
    setForm({ email: "", subject: "", message: "" });
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      {stage === "idle" && (
        <button onClick={open} data-cursor="hover" style={{ position: "relative", padding: 0 }}>
          <div style={{ position: "absolute", inset: -60, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,245,255,0.25), transparent 70%)",
            animation: "breathe 2.6s ease-in-out infinite" }} />
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

      {(stage === "open" || stage === "sending") && (
        <form onSubmit={send} className="glass brackets" style={{
          width: "100%", maxWidth: 640, padding: 32,
          opacity: stage === "sending" ? 0.6 : 1,
          transition: "opacity 220ms ease",
        }}>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 10, letterSpacing: "0.22em", color: "var(--cyan)" }}>
            <span>● CHANNEL OPEN · ENCRYPTED</span>
            <span>{stage === "sending" ? "TX..." : "RX READY"}</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label">▸ Origin (your email)</label>
            <input className="field" type="email" required placeholder="you@domain.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">▸ Intent</label>
            <select className="field" required value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              style={{ appearance: "none" }}>
              <option value="">Select packet type...</option>
              <option value="coffee">◇ Coffee chat</option>
              <option value="collab">◆ Collaboration</option>
              <option value="hire">▸ Hire / contract</option>
              <option value="other">∴ Something else</option>
            </select>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label className="field-label">▸ Payload</label>
            <textarea className="field" required placeholder="Begin transmission..."
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
              {form.message.length} BYTES · AES-256
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
