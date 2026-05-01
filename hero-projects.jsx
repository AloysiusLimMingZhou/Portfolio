/* Hero, Project Graph, Project Modal */
const { useEffect: useEffectH, useRef: useRefH, useState: useStateH, useMemo } = React;

/* ===== HERO ===== */
function Hero({ data }) {
  const { identity } = data;
  const [typed, setTyped] = useStateH("");
  const fullText = identity.summary;

  useEffectH(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [fullText]);

  return (
    <section id="hero" className="deck" style={{ paddingTop: 140, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 56, alignItems: "center" }}>
        <div>
          <div className="mono" style={{ color: "var(--cyan)", fontSize: 12, letterSpacing: "0.22em", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 28, height: 1, background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }} />
            NEURAL.PROFILE / 0xA17B-LIM
          </div>
          <h1 className="display" style={{ fontSize: "clamp(48px, 7.2vw, 112px)", lineHeight: 0.95, fontWeight: 500, letterSpacing: "-0.035em", marginBottom: 24 }}>
            <span style={{ display: "block", color: "var(--ink)" }}>Aloysius</span>
            <span style={{ display: "block", background: "linear-gradient(90deg, var(--cyan), var(--purple) 60%, var(--pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Lim<span style={{ color: "var(--pink)" }}>.</span></span>
          </h1>
          <div className="mono" style={{ color: "var(--ink-dim)", fontSize: 14, marginBottom: 28, letterSpacing: "0.04em" }}>
            ▸ {identity.title}
            <span style={{ margin: "0 12px", color: "var(--ink-faint)" }}>//</span>
            {identity.location}
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--ink)", maxWidth: 560, minHeight: 90, marginBottom: 32 }}>
            {typed}
            <span className="cursor-blink" />
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#projects" className="btn">▸ Explore the graph</a>
            <a href="#contact" className="btn btn-pink">◇ Open channel</a>
          </div>
        </div>

        {/* Profile image placeholder — right side */}
        <ProfilePlaceholder />
      </div>

      {/* Horizontal telemetry — full width below */}
      <div className="glass brackets" style={{ padding: "20px 28px", marginTop: 56, position: "relative" }}>
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink-dim)", marginBottom: 18 }}>
          <span>▸ SYS.TELEMETRY · 0xA17B</span>
          <span style={{ display: "flex", gap: 16, color: "var(--ink-faint)" }}>
            <span>COHERENCE <span style={{ color: "var(--cyan)" }}>98.4%</span></span>
            <span>LATENCY <span style={{ color: "var(--cyan)" }}>14ms</span></span>
            <span>CONTEXT <span style={{ color: "var(--cyan)" }}>184K</span></span>
            <span style={{ color: "var(--cyan)" }}>● LIVE</span>
          </span>
        </div>
        <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: `repeat(${identity.stats.length}, 1fr) 2fr`, gap: 14, alignItems: "stretch" }}>
          {identity.stats.map((s) => (
            <div key={s.label} style={{ padding: "14px 18px", border: "1px solid var(--hairline)", borderRadius: 8, background: "rgba(0, 245, 255, 0.025)" }}>
              <div className="display" style={{ fontSize: 32, lineHeight: 1, color: "var(--ink)", marginBottom: 4 }}>{s.value}</div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>{s.label}</div>
            </div>
          ))}
          {/* equalizer */}
          <div style={{ padding: "14px 18px", border: "1px solid var(--hairline)", borderRadius: 8, background: "rgba(157, 0, 255, 0.025)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-faint)", marginBottom: 6 }}>NEURAL.SIGNAL</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 28 }}>
              {Array.from({ length: 56 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, background: `hsla(${188 + (i % 3) * 40}, 100%, 60%, 0.7)`,
                  height: `${20 + Math.abs(Math.sin(i * 0.6)) * 80}%`,
                  animation: `eqBar 1.${i % 9}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 30}ms`,
                  borderRadius: 1,
                  boxShadow: "0 0 6px currentColor",
                  color: `hsla(${188 + (i % 3) * 40}, 100%, 60%, 0.8)`,
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--ink-faint)" }}>SCROLL</div>
        <div style={{ width: 1, height: 36, background: "linear-gradient(180deg, var(--cyan), transparent)" }} />
      </div>

      <style>{`@keyframes eqBar { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
    </section>
  );
}

/* ===== Profile placeholder — animated portrait frame ===== */
function ProfilePlaceholder() {
  const ref = useRefH(null);
  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  }
  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: "1000px" }}>
      <div ref={ref} className="glass brackets" style={{
        position: "relative",
        aspectRatio: "4 / 5",
        padding: 14,
        transition: "transform 320ms cubic-bezier(.2,.7,.2,1)",
        transformStyle: "preserve-3d",
        boxShadow: "0 0 60px rgba(0, 245, 255, 0.15), 0 30px 80px -20px rgba(0,0,0,0.7)",
      }}>
        {/* image area */}
        <div style={{
          position: "relative",
          height: "100%",
          borderRadius: 10,
          overflow: "hidden",
          background: `
            repeating-linear-gradient(45deg, rgba(0, 245, 255, 0.04) 0 12px, transparent 12px 24px),
            radial-gradient(circle at 50% 35%, rgba(157, 0, 255, 0.18), transparent 60%),
            linear-gradient(180deg, #0d0d18, #07070b)
          `,
          border: "1px solid var(--hairline)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 12,
        }}>
          {/* corner ticks */}
          {[
            { top: 10, left: 10 }, { top: 10, right: 10 },
            { bottom: 10, left: 10 }, { bottom: 10, right: 10 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: "absolute", width: 14, height: 14, borderColor: "var(--cyan)", borderStyle: "solid", borderWidth: 0,
              borderTopWidth: pos.top !== undefined ? 1 : 0,
              borderBottomWidth: pos.bottom !== undefined ? 1 : 0,
              borderLeftWidth: pos.left !== undefined ? 1 : 0,
              borderRightWidth: pos.right !== undefined ? 1 : 0,
              opacity: 0.6, ...pos,
            }} />
          ))}
          {/* avatar silhouette */}
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ opacity: 0.7 }}>
            <defs>
              <linearGradient id="avatarG" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="44" r="22" fill="none" stroke="url(#avatarG)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 20 110 Q 60 70 100 110" fill="none" stroke="url(#avatarG)" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ink-faint)", textAlign: "center", padding: "0 16px" }}>
            ▸ DROP PORTRAIT.PNG<br />
            <span style={{ color: "var(--cyan)", fontSize: 9 }}>1024 × 1280 · TRANSPARENT BG</span>
          </div>
          {/* scanline */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
            boxShadow: "0 0 12px var(--cyan)",
            animation: "scanline 4s linear infinite",
            opacity: 0.6,
          }} />
        </div>
        {/* HUD strip */}
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-faint)" }}>
          <span>◆ ID.0xA17B</span>
          <span style={{ color: "var(--cyan)" }}>● VERIFIED</span>
        </div>
        <style>{`@keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }`}</style>
      </div>
    </div>
  );
}

/* ===== Project Graph — field hubs + project leaves ===== */
const DOMAIN_HEX = {
  AI: "#00f5ff",
  ML: "#00f5ff",
  Web: "#9d00ff",
  Cyber: "#ff2bd6",
  DevOps: "#ffc857",
  Cloud: "#7dd3fc",
  Agentic: "#5eead4",
};
const DOMAIN_COLORS = DOMAIN_HEX;

function ProjectGraph({ data, onSelect }) {
  const wrapRef = useRefH(null);
  const [size, setSize] = useStateH({ w: 1200, h: 720 });
  const [hover, setHover] = useStateH(null); // { kind, id }
  const [tick, setTick] = useStateH(0);

  useEffectH(() => {
    function measure() {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffectH(() => {
    let raf, t = 0;
    function loop() { t += 0.02; setTick(t); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fields = window.PROJECT_FIELDS;

  // hub positions: arranged on a ring around the canvas center
  const hubs = useMemo(() => {
    const cx = size.w / 2, cy = size.h / 2;
    const rx = Math.min(size.w * 0.32, 360);
    const ry = Math.min(size.h * 0.34, 250);
    return fields.map((f) => ({
      ...f,
      px: cx + Math.cos(f.angle) * rx,
      py: cy + Math.sin(f.angle) * ry,
    }));
  }, [size]);
  const hubIdx = Object.fromEntries(hubs.map((h) => [h.id, h]));

  // project positions: seed by field-average, then relax with min-distance constraint
  const projects = useMemo(() => {
    const cx = size.w / 2, cy = size.h / 2;
    // seed
    const placed = data.projects.map((p, i) => {
      const fs = (p.fields || []).map((fid) => hubIdx[fid]).filter(Boolean);
      if (!fs.length) return { ...p, px: cx, py: cy };
      let x = 0, y = 0;
      fs.forEach((f) => { x += f.px; y += f.py; });
      x /= fs.length; y /= fs.length;
      // singleton-field projects: push OUTWARD (away from center) to the edges
      if (fs.length === 1) {
        const dx = x - cx, dy = y - cy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const push = 110;
        x += (dx / len) * push;
        y += (dy / len) * push;
      } else {
        // multi-field: pull a touch inward so the overlap reads
        x = x * 0.82 + cx * 0.18;
        y = y * 0.82 + cy * 0.18;
      }
      // small deterministic jitter so co-located projects break ties
      const seed = (i * 9301 + 49297) % 233280 / 233280;
      const seed2 = (i * 7919 + 12553) % 233280 / 233280;
      x += (seed - 0.5) * 24;
      y += (seed2 - 0.5) * 24;
      return { ...p, px: x, py: y };
    });

    // min-distance relaxation: nodes vs nodes, and nodes vs hubs
    const NODE_R = 92;          // min center-to-center between projects (node + label below)
    const HUB_R = 132;         // min center-to-center to a hub (hubs are big)
    const PAD_X = 48, PAD_Y = 40;

    for (let pass = 0; pass < 60; pass++) {
      let moved = 0;
      // node↔node
      for (let a = 0; a < placed.length; a++) {
        for (let b = a + 1; b < placed.length; b++) {
          const A = placed[a], B = placed[b];
          let dx = B.px - A.px, dy = B.py - A.py;
          let d = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.001) { dx = (a - b) || 1; dy = 1; d = 1; }
          if (d < NODE_R) {
            const push = (NODE_R - d) / 2;
            const ux = dx / d, uy = dy / d;
            A.px -= ux * push; A.py -= uy * push;
            B.px += ux * push; B.py += uy * push;
            moved++;
          }
        }
      }
      // node↔hub
      for (let a = 0; a < placed.length; a++) {
        for (const h of hubs) {
          const A = placed[a];
          let dx = A.px - h.px, dy = A.py - h.py;
          let d = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.001) { dx = 1; dy = 1; d = 1; }
          if (d < HUB_R) {
            const push = (HUB_R - d);
            const ux = dx / d, uy = dy / d;
            A.px += ux * push; A.py += uy * push;
            moved++;
          }
        }
      }
      // bounds
      for (const A of placed) {
        if (A.px < PAD_X) A.px = PAD_X;
        if (A.px > size.w - PAD_X) A.px = size.w - PAD_X;
        if (A.py < PAD_Y) A.py = PAD_Y;
        if (A.py > size.h - PAD_Y) A.py = size.h - PAD_Y;
      }
      if (moved === 0) break;
    }
    return placed;
  }, [data.projects, hubs, size]);

  function isHubHover(id) { return hover && hover.kind === "hub" && hover.id === id; }
  function isProjHover(id) { return hover && hover.kind === "proj" && hover.id === id; }

  // when hovering a hub: highlight that hub + all its projects
  // when hovering a project: highlight project + its fields
  const highlight = useMemo(() => {
    const hubs = new Set(), projs = new Set();
    if (!hover) return { hubs, projs };
    if (hover.kind === "hub") {
      hubs.add(hover.id);
      projects.forEach((p) => { if ((p.fields || []).includes(hover.id)) projs.add(p.id); });
    } else {
      projs.add(hover.id);
      const p = projects.find((x) => x.id === hover.id);
      (p?.fields || []).forEach((f) => hubs.add(f));
    }
    return { hubs, projs };
  }, [hover, projects]);

  return (
    <div className="graph-wrap" ref={wrapRef} style={{ height: 820 }}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* edges: each project to each of its fields */}
        {projects.map((p) =>
          (p.fields || []).map((fid, i) => {
            const h = hubIdx[fid];
            if (!h) return null;
            const active = highlight.projs.has(p.id) || highlight.hubs.has(fid);
            const dim = hover && !active;
            const dx = h.px - p.px, dy = h.py - p.py;
            const nx = -dy, ny = dx;
            const len = Math.sqrt(nx * nx + ny * ny) || 1;
            const cx = (p.px + h.px) / 2 + (nx / len) * 18;
            const cy = (p.py + h.py) / 2 + (ny / len) * 18;
            const path = `M ${p.px} ${p.py} Q ${cx} ${cy} ${h.px} ${h.py}`;
            return (
              <path key={p.id + "-" + fid + "-" + i} d={path} fill="none"
                stroke={active ? h.color : `${h.color}55`}
                strokeWidth={active ? 1.6 : 0.9}
                strokeDasharray={active ? "4 4" : "none"}
                strokeDashoffset={active ? -tick * 30 : 0}
                opacity={dim ? 0.06 : 1}
                filter={active ? "url(#glow)" : ""}
              />
            );
          })
        )}
      </svg>

      {/* hubs */}
      {hubs.map((h) => {
        const isHover = isHubHover(h.id);
        const inHL = highlight.hubs.has(h.id);
        const dim = hover && !inHL;
        const pulse = 1 + Math.sin(tick * 0.9 + h.angle) * 0.03;
        return (
          <div key={h.id} className="node-card" data-cursor="hover"
            style={{ left: h.px, top: h.py, opacity: dim ? 0.35 : 1, zIndex: isHover ? 6 : 3 }}
            onMouseEnter={() => setHover({ kind: "hub", id: h.id })}
            onMouseLeave={() => setHover(null)}>
            <div style={{
              position: "relative",
              transform: `scale(${isHover ? 1.08 : pulse})`,
              transition: "transform 220ms cubic-bezier(.2,.7,.2,1)",
            }}>
              <div style={{
                position: "absolute", inset: -34, borderRadius: "50%",
                background: `radial-gradient(circle, ${h.color}40, transparent 70%)`,
                opacity: isHover ? 1 : 0.55, pointerEvents: "none",
              }} />
              <svg width="156" height="156" style={{ position: "absolute", left: -18, top: -18, pointerEvents: "none" }}>
                <circle cx="78" cy="78" r="72" fill="none" stroke={h.color}
                  strokeOpacity={isHover ? 0.7 : 0.22} strokeWidth="1" strokeDasharray="2 8"
                  style={{ transformOrigin: "78px 78px", animation: "spin 22s linear infinite" }} />
                <circle cx="78" cy="78" r="64" fill="none" stroke={h.color}
                  strokeOpacity={isHover ? 0.45 : 0.14} strokeWidth="1" strokeDasharray="3 4"
                  style={{ transformOrigin: "78px 78px", animation: "spinRev 28s linear infinite" }} />
              </svg>
              <div className="glass mono" style={{
                width: 120, height: 120, borderRadius: "50%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                border: `1.5px solid ${h.color}`,
                background: `radial-gradient(circle at 30% 30%, ${h.color}26, rgba(10,10,18,0.85) 70%)`,
                boxShadow: isHover
                  ? `0 0 60px ${h.color}aa, inset 0 0 32px ${h.color}40`
                  : `0 0 26px ${h.color}55, inset 0 0 18px ${h.color}25`,
                color: h.color,
                position: "relative",
              }}>
                <div style={{ fontSize: 9, opacity: 0.65, letterSpacing: "0.22em" }}>FIELD</div>
                <div className="display" style={{ fontSize: 22, fontWeight: 600, marginTop: 2, color: "var(--ink)", textShadow: `0 0 14px ${h.color}` }}>
                  {h.label}
                </div>
                <div style={{ fontSize: 9, marginTop: 4, letterSpacing: "0.18em", opacity: 0.7 }}>
                  · {projects.filter((p) => (p.fields || []).includes(h.id)).length} ·
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* project leaves */}
      {projects.map((p) => {
        const isHover = isProjHover(p.id);
        const inHL = highlight.projs.has(p.id);
        const dim = hover && !inHL;
        const primary = (p.fields || [])[0];
        const color = (hubIdx[primary] && hubIdx[primary].color) || "#00f5ff";
        const overlap = (p.fields || []).length > 1;
        return (
          <div key={p.id} className="node-card" data-cursor="hover"
            style={{ left: p.px, top: p.py, opacity: dim ? 0.25 : 1, transition: "opacity 220ms ease", zIndex: isHover ? 7 : 4 }}
            onMouseEnter={() => setHover({ kind: "proj", id: p.id })}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect(p)}>
            <div style={{ position: "relative", transform: `scale(${isHover ? 1.08 : 1})`, transition: "transform 200ms" }}>
              <div style={{
                position: "absolute", inset: -14, borderRadius: "50%",
                background: `radial-gradient(circle, ${color}33, transparent 70%)`,
                opacity: isHover ? 1 : 0.6, pointerEvents: "none",
              }} />
              <div className="glass mono" style={{
                width: 46, height: 46, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${isHover ? color : `${color}77`}`,
                background: isHover ? `${color}1a` : "rgba(10, 10, 18, 0.85)",
                boxShadow: isHover
                  ? `0 0 22px ${color}aa, inset 0 0 12px ${color}40`
                  : `0 0 10px ${color}30`,
                color, fontSize: 10, fontWeight: 600,
                position: "relative",
              }}>
                {p.id.slice(1)}
                {overlap && (
                  <span style={{
                    position: "absolute", bottom: -3, right: -3,
                    width: 10, height: 10, borderRadius: "50%",
                    background: (hubIdx[(p.fields || [])[1]] && hubIdx[(p.fields || [])[1]].color) || color,
                    border: "1px solid rgba(10,10,18,0.9)",
                    boxShadow: `0 0 6px ${color}`,
                  }} />
                )}
              </div>
              <div style={{
                position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)",
                whiteSpace: "nowrap", pointerEvents: "none", textAlign: "center",
              }}>
                <div className="mono" style={{
                  fontSize: 10, color: isHover ? color : "var(--ink)",
                  textShadow: isHover ? `0 0 10px ${color}` : "none",
                  fontWeight: 600,
                }}>{p.name}</div>
                <div className="mono" style={{ fontSize: 8, color: "var(--ink-faint)", letterSpacing: "0.12em", marginTop: 2 }}>
                  {p.year} · {p.tag}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* legend */}
      <div className="glass mono" style={{
        position: "absolute", top: 16, right: 16, padding: "10px 14px",
        fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
        display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", maxWidth: 460,
      }}>
        {fields.map((f) => (
          <span key={f.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-dim)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
            {f.label}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinRev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
}

/* ===== Project Modal ===== */
function ProjectModal({ project, onClose }) {
  const open = !!project;
  if (!project) {
    return <div className="modal-backdrop" onClick={onClose} />;
  }
  const color = DOMAIN_HEX[project.domain];
  return (
    <div className={`modal-backdrop ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal-card glass" onClick={(e) => e.stopPropagation()} style={{ overflow: "auto" }}>
        {/* header */}
        <div style={{ padding: "28px 36px", borderBottom: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: color, marginBottom: 12 }}>
              ◆ {project.id.toUpperCase()} / {project.domain.toUpperCase()} · {project.year} · {project.tag.toUpperCase()}
            </div>
            <h2 className="display" style={{ fontSize: 44, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.02em" }}>
              {project.name}
            </h2>
            <div style={{ color: "var(--ink-dim)", marginTop: 10, fontSize: 16 }}>{project.tagline}</div>
          </div>
          <button onClick={onClose} className="mono" style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1px solid var(--hairline)", color: "var(--ink-dim)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>×</button>
        </div>

        {/* bento body */}
        <div className="bento-grid" style={{ padding: 28, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
          {/* description */}
          <div className="glass" style={{ padding: 22, gridRow: "span 2" }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ink-faint)", marginBottom: 12 }}>
              ▸ ABSTRACT
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink)" }}>{project.description}</p>
            <div style={{ marginTop: 22 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ink-faint)", marginBottom: 12 }}>
                ▸ KEY FEATURES
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none" }}>
                {project.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, fontSize: 14 }}>
                    <span style={{ color: color, fontFamily: "JetBrains Mono", fontSize: 11, minWidth: 22 }}>0{i + 1}</span>
                    <span style={{ color: "var(--ink)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* stack */}
          <div className="glass" style={{ padding: 22 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ink-faint)", marginBottom: 14 }}>
              ▸ TECH STACK
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {project.stack.map((s) => (
                <span key={s} className="mono" style={{
                  padding: "6px 10px", fontSize: 11,
                  border: `1px solid ${color}40`, color: color,
                  background: `${color}10`, borderRadius: 6,
                }}>{s}</span>
              ))}
            </div>
          </div>
          {/* links */}
          <div className="glass" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ink-faint)", marginBottom: 6 }}>
              ▸ ENDPOINTS
            </div>
            <a className="mono" data-cursor="hover" style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", border: "1px solid var(--hairline)", borderRadius: 6, fontSize: 12, color: "var(--cyan)" }}>
              <span>github.com/al/{project.id}</span><span>↗</span>
            </a>
            <a className="mono" data-cursor="hover" style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", border: "1px solid var(--hairline)", borderRadius: 6, fontSize: 12, color: "var(--cyan)" }}>
              <span>{project.id}.aloysiuslim.dev</span><span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Hero, ProjectGraph, ProjectModal, DOMAIN_HEX, DOMAIN_COLORS });
