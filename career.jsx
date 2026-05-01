/* Career Path + Tech Skills + Testimonials */
const { useEffect: useEffectC, useRef: useRefC, useState: useStateC, useMemo: useMemoC } = React;

/* ===== Career data ===== */
window.CAREER_DATA = [
  {
    id: "c1",
    company: "Lorem Ipsum Labs",
    position: "Senior Lorem Engineer",
    term: "2025 — present",
    year: "2025",
    location: "Remote · SG",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
    achievements: [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit",
      "Sed do eiusmod tempor incididunt ut labore et dolore",
      "Ut enim ad minim veniam quis nostrud exercitation",
    ],
    skills: ["Rust", "PyTorch", "LangGraph", "Neo4j", "Kubernetes", "FAISS", "Distributed systems"],
    color: "#00f5ff",
  },
  {
    id: "c2",
    company: "Dolor Sit Corp",
    position: "Amet Platform Engineer",
    term: "2023 — 2025",
    year: "2023",
    location: "Singapore",
    summary: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    achievements: [
      "Duis aute irure dolor in reprehenderit in voluptate",
      "Velit esse cillum dolore eu fugiat nulla pariatur",
      "Excepteur sint occaecat cupidatat non proident",
    ],
    skills: ["Python", "Go", "Kubernetes", "Triton", "Prometheus", "Grafana", "MLflow"],
    color: "#9d00ff",
  },
  {
    id: "c3",
    company: "Consectetur Group",
    position: "Software Engineer · Infra",
    term: "2022 — 2023",
    year: "2022",
    location: "Singapore",
    summary: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    achievements: [
      "Sed quia consequuntur magni dolores eos qui ratione",
      "Voluptatem sequi nesciunt neque porro quisquam est",
      "Qui dolorem ipsum quia dolor sit amet consectetur",
    ],
    skills: ["Go", "Envoy", "Kafka", "ClickHouse", "Linux", "AWS", "GCP"],
    color: "#ff2bd6",
  },
  {
    id: "c4",
    company: "Adipiscing University",
    position: "Research Assistant · Lorem ML",
    term: "2021 — 2022",
    year: "2021",
    location: "Singapore",
    summary: "Adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore.",
    achievements: [
      "Nam libero tempore cum soluta nobis est eligendi",
      "Optio cumque nihil impedit quo minus id quod",
      "Maxime placeat facere possimus omnis voluptas",
    ],
    skills: ["PyTorch", "PyTorch Geometric", "Linux", "Slurm", "Python"],
    color: "#5eead4",
  },
  {
    id: "c5",
    company: "Elit Corp",
    position: "SWE Intern · Lorem",
    term: "2020",
    year: "2020",
    location: "Singapore",
    summary: "Assumenda est omnis dolor repellendus temporibus autem quibusdam et aut officiis.",
    achievements: [
      "Debitis aut rerum necessitatibus saepe eveniet",
      "Ut et voluptates repudiandae sint et molestiae",
    ],
    skills: ["Java", "Elasticsearch", "Python"],
    color: "#ffc857",
  },
];

/* ===== Career Path — vertical chronological ===== */
function CareerPath({ onSelect }) {
  const data = window.CAREER_DATA;
  return (
    <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", padding: "20px 0" }}>
      {/* spine */}
      <div className="career-spine" style={{
        position: "absolute", left: "50%", top: 0, bottom: 0, width: 2,
        transform: "translateX(-50%)",
        background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.6), rgba(157,0,255,0.6), rgba(255,43,214,0.6), transparent)",
        boxShadow: "0 0 20px rgba(0,245,255,0.3)",
      }} />
      {data.map((job, i) => (
        <CareerNode key={job.id} job={job} side={i % 2 === 0 ? "left" : "right"} onSelect={onSelect} />
      ))}
    </div>
  );
}

function CareerNode({ job, side, onSelect }) {
  const left = side === "left";
  return (
    <div className={`career-row career-row-${left ? "left" : "right"}`} style={{
      display: "grid",
      gridTemplateColumns: "1fr 80px 1fr",
      alignItems: "center",
      marginBottom: 36,
    }}>
      {/* card */}
      <div style={{ gridColumn: left ? 1 : 3, gridRow: 1 }}>
        <button onClick={() => onSelect(job)} data-cursor="hover" style={{
          width: "100%", textAlign: left ? "right" : "left",
          padding: 18,
          borderRadius: 12,
          background: "rgba(13,13,24,0.55)",
          backdropFilter: "blur(16px) saturate(160%)",
          border: `1px solid ${job.color}44`,
          boxShadow: `0 0 0 1px ${job.color}11, 0 18px 40px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)`,
          transition: "transform 220ms cubic-bezier(.2,.7,.2,1), box-shadow 220ms",
          cursor: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = `0 0 0 1px ${job.color}33, 0 28px 60px -18px rgba(0,0,0,0.7), 0 0 40px -10px ${job.color}66, inset 0 1px 0 rgba(255,255,255,0.06)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 0 0 1px ${job.color}11, 0 18px 40px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)`;
        }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: job.color, marginBottom: 8, textShadow: `0 0 10px ${job.color}` }}>
            ▸ {job.term} · {job.location}
          </div>
          <div className="display" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.15, marginBottom: 4 }}>
            {job.position}
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-dim)", marginBottom: 10 }}>
            {job.company}
          </div>
          <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.5, marginBottom: 12 }}>
            {job.summary}
          </div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-faint)" }}>
            ▸ CLICK FOR DETAILS
          </div>
        </button>
      </div>
      {/* spine node */}
      <div style={{ gridColumn: 2, gridRow: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: job.color, textShadow: `0 0 8px ${job.color}` }}>
          {job.year}
        </div>
        <div style={{
          width: 18, height: 18, borderRadius: "50%",
          background: `radial-gradient(circle, ${job.color}, ${job.color}33)`,
          border: `2px solid ${job.color}`,
          boxShadow: `0 0 16px ${job.color}, inset 0 0 6px ${job.color}aa`,
        }} />
      </div>
      {/* connector arm */}
      <div style={{
        gridColumn: left ? 2 : 2, gridRow: 1,
        height: 1,
        background: `linear-gradient(${left ? 270 : 90}deg, ${job.color}, transparent)`,
        opacity: 0.5,
        marginTop: 32,
        position: "relative",
        zIndex: -1,
      }} />
    </div>
  );
}

function careerJobToItem(job) {
  return {
    color: job.color,
    eyebrow: `${job.id.toUpperCase()} / CAREER · ${job.term} · ${job.location.toUpperCase()}`,
    title: job.position,
    tagline: `${job.company} — ${job.summary}`,
    left: {
      heading: "▸ ROLE OVERVIEW",
      body: job.summary,
      features: job.achievements,
      featuresLabel: "▸ KEY ACHIEVEMENTS",
    },
    right: [
      { heading: "▸ SKILLS GAINED", kind: "chips", items: job.skills },
      { heading: "▸ TIMELINE", kind: "kv", items: [
        ["COMPANY", job.company],
        ["POSITION", job.position],
        ["TERM", job.term],
        ["LOCATION", job.location],
      ] },
    ],
  };
}

/* ===== Tech Skills Graph ===== */
window.SKILL_FIELDS = [
  { id: "ml",      label: "AI / ML",  color: "#00f5ff", angle: -Math.PI * 0.5 },
  { id: "agentic", label: "Agentic",  color: "#5eead4", angle: -Math.PI * 0.166 },
  { id: "web",     label: "Web",      color: "#9d00ff", angle:  Math.PI * 0.166 },
  { id: "devops",  label: "DevOps",   color: "#ffc857", angle:  Math.PI * 0.5 },
  { id: "cloud",   label: "Cloud",    color: "#7dd3fc", angle:  Math.PI * 0.833 },
  { id: "cyber",   label: "Cyber",    color: "#ff2bd6", angle: -Math.PI * 0.833 },
];

window.SKILL_NODES = [
  // ML / AI
  { id: "pytorch",    name: "PyTorch",     icon: "🔥", fields: ["ml", "agentic"] },
  { id: "tf",         name: "TensorFlow",  icon: "▲", fields: ["ml"] },
  { id: "huggingface",name: "HuggingFace", icon: "🤗", fields: ["ml", "agentic"] },
  { id: "sklearn",    name: "scikit-learn",icon: "◉", fields: ["ml"] },
  // Agentic
  { id: "langgraph",  name: "LangGraph",   icon: "⌬", fields: ["agentic"] },
  { id: "langchain",  name: "LangChain",   icon: "⛓", fields: ["agentic"] },
  { id: "rag",        name: "RAG",         icon: "❖", fields: ["agentic", "ml"] },
  { id: "dspy",       name: "DSPy",        icon: "✦", fields: ["agentic", "ml"] },
  // Web
  { id: "nextjs",     name: "Next.js",     icon: "▲", fields: ["web"] },
  { id: "nestjs",     name: "NestJS",      icon: "◈", fields: ["web"] },
  { id: "react",      name: "React",       icon: "⚛", fields: ["web"] },
  { id: "ts",         name: "TypeScript",  icon: "TS", fields: ["web"] },
  // DevOps
  { id: "k8s",        name: "Kubernetes",  icon: "⎈", fields: ["devops", "cloud"] },
  { id: "linux",      name: "Linux",       icon: "🐧", fields: ["devops", "cyber"] },
  { id: "playwright", name: "Playwright",  icon: "▶", fields: ["devops", "web"] },
  { id: "prometheus", name: "Prometheus",  icon: "🔥", fields: ["devops"] },
  { id: "grafana",    name: "Grafana",     icon: "📊", fields: ["devops"] },
  // Cloud
  { id: "aws",        name: "AWS",         icon: "☁", fields: ["cloud", "devops"] },
  { id: "gcp",        name: "GCP",         icon: "◐", fields: ["cloud", "devops"] },
  { id: "terraform",  name: "Terraform",   icon: "⬡", fields: ["cloud", "devops"] },
  // Cyber
  { id: "wireshark",  name: "Wireshark",   icon: "🦈", fields: ["cyber"] },
  { id: "burp",       name: "Burp Suite",  icon: "✦", fields: ["cyber"] },
  { id: "nmap",       name: "Nmap",        icon: "◎", fields: ["cyber"] },
];

// cross-field shared connections
window.SKILL_EDGES = [
  ["pytorch", "huggingface"],
  ["langgraph", "langchain"],
  ["rag", "huggingface"],
  ["dspy", "langchain"],
  ["nextjs", "react"],
  ["nestjs", "ts"],
  ["k8s", "linux"],
  ["k8s", "aws"],
  ["k8s", "gcp"],
  ["terraform", "aws"],
  ["terraform", "gcp"],
  ["prometheus", "grafana"],
  ["linux", "wireshark"],
  ["nmap", "linux"],
  ["playwright", "ts"],
];

function TechSkillsGraph() {
  const wrapRef = useRefC(null);
  const [size, setSize] = useStateC({ w: 1200, h: 720 });
  const [hover, setHover] = useStateC(null);
  const [tick, setTick] = useStateC(0);
  const [isMobile, setIsMobile] = useStateC(window.innerWidth <= 720);

  useEffectC(() => {
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

  useEffectC(() => {
    let raf, t = 0;
    function loop() { t += 0.02; setTick(t); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fields = window.SKILL_FIELDS;
  const hubs = useMemoC(() => {
    const cx = size.w / 2, cy = size.h / 2;
    const rx = Math.min(size.w * 0.35, 420);
    const ry = Math.min(size.h * 0.36, 280);
    return fields.map((f) => ({ ...f, px: cx + Math.cos(f.angle) * rx, py: cy + Math.sin(f.angle) * ry }));
  }, [size]);
  const hubIdx = Object.fromEntries(hubs.map((h) => [h.id, h]));

  const nodes = useMemoC(() => {
    const cx = size.w / 2, cy = size.h / 2;
    // seed by field-average; singletons pushed outward, multi-field pulled inward
    const placed = window.SKILL_NODES.map((n, i) => {
      const fs = (n.fields || []).map((fid) => hubIdx[fid]).filter(Boolean);
      if (!fs.length) return { ...n, px: cx, py: cy };
      let x = 0, y = 0; fs.forEach((f) => { x += f.px; y += f.py; });
      x /= fs.length; y /= fs.length;
      if (fs.length === 1) {
        const dx = x - cx, dy = y - cy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const push = 60;
        x += (dx / len) * push; y += (dy / len) * push;
      } else {
        x = x * 0.82 + cx * 0.18;
        y = y * 0.82 + cy * 0.18;
      }
      const seed = (i * 9301 + 49297) % 233280 / 233280;
      const seed2 = (i * 7919 + 12553) % 233280 / 233280;
      x += (seed - 0.5) * 36;
      y += (seed2 - 0.5) * 36;
      return { ...n, px: x, py: y };
    });

    // min-distance relaxation
    const NODE_R = 78;
    const HUB_R = 118;
    const PAD_X = 60, PAD_Y = 36;
    for (let iter = 0; iter < 60; iter++) {
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
          }
        }
      }
      for (let a = 0; a < placed.length; a++) {
        for (const h of hubs) {
          const A = placed[a];
          let dx = A.px - h.px, dy = A.py - h.py;
          let d = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.001) { dx = 1; dy = 1; d = 1; }
          if (d < HUB_R) {
            const push = HUB_R - d;
            const ux = dx / d, uy = dy / d;
            A.px += ux * push; A.py += uy * push;
          }
        }
      }
      for (const A of placed) {
        if (A.px < PAD_X) A.px = PAD_X;
        if (A.px > size.w - PAD_X) A.px = size.w - PAD_X;
        if (A.py < PAD_Y) A.py = PAD_Y;
        if (A.py > size.h - PAD_Y) A.py = size.h - PAD_Y;
      }
    }
    return placed;
  }, [hubs, size]);
  const nodeIdx = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const highlight = useMemoC(() => {
    const hubsH = new Set(), nodesH = new Set();
    if (!hover) return { hubsH, nodesH };
    if (hover.kind === "hub") {
      hubsH.add(hover.id);
      nodes.forEach((n) => { if ((n.fields || []).includes(hover.id)) nodesH.add(n.id); });
    } else {
      nodesH.add(hover.id);
      const n = nodeIdx[hover.id];
      (n?.fields || []).forEach((f) => hubsH.add(f));
      window.SKILL_EDGES.forEach(([a, b]) => {
        if (a === hover.id) nodesH.add(b);
        if (b === hover.id) nodesH.add(a);
      });
    }
    return { hubsH, nodesH };
  }, [hover, nodes]);

  /* ── Mobile: stacked card layout grouped by skill field ── */
  if (isMobile) {
    const allFields = window.SKILL_FIELDS;
    const allNodes = window.SKILL_NODES;
    return (
      <div ref={wrapRef} style={{ padding: "20px 0" }}>
        {allFields.map((f) => {
          const items = allNodes.filter((n) => (n.fields || []).includes(f.id));
          if (!items.length) return null;
          const color = f.color;
          return (
            <div key={f.id} style={{ marginBottom: 28 }}>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
                color: color, marginBottom: 12, textShadow: `0 0 12px ${color}`,
              }}>
                ◆ {f.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {items.map((n) => {
                  const isHover = hover && hover.id === n.id;
                  return (
                    <div key={n.id} data-cursor="hover"
                      onMouseEnter={() => setHover({ kind: "node", id: n.id })}
                      onMouseLeave={() => setHover(null)}>
                      <div className="glass mono" style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: `1px solid ${isHover ? color : "rgba(255,255,255,0.12)"}`,
                        background: isHover ? `${color}18` : "rgba(10, 10, 18, 0.85)",
                        boxShadow: isHover ? `0 0 18px ${color}70` : `0 0 6px ${color}20`,
                        transition: "all 220ms cubic-bezier(.2,.7,.2,1)",
                        display: "inline-flex", alignItems: "center", gap: 7,
                      }}>
                        <span style={{ fontSize: 13 }}>{n.icon}</span>
                        <span style={{ fontSize: 11, color: isHover ? color : "var(--ink)", fontWeight: 600, letterSpacing: "0.06em" }}>{n.name}</span>
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
    <div className="graph-wrap" ref={wrapRef} style={{ height: 720 }}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
        <defs>
          <filter id="sglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* node→hub edges */}
        {nodes.map((n) =>
          (n.fields || []).map((fid, i) => {
            const h = hubIdx[fid]; if (!h) return null;
            const active = highlight.nodesH.has(n.id) || highlight.hubsH.has(fid);
            const dim = hover && !active;
            return (
              <line key={n.id + "-" + fid + "-" + i} x1={n.px} y1={n.py} x2={h.px} y2={h.py}
                stroke={active ? h.color : `${h.color}44`}
                strokeWidth={active ? 1.4 : 0.8}
                opacity={dim ? 0.06 : 1}
                filter={active ? "url(#sglow)" : ""} />
            );
          })
        )}
        {/* cross-skill edges */}
        {window.SKILL_EDGES.map(([a, b], i) => {
          const A = nodeIdx[a], B = nodeIdx[b]; if (!A || !B) return null;
          const active = hover && hover.kind === "node" && (hover.id === a || hover.id === b);
          const dim = hover && !active;
          return (
            <path key={"e" + i}
              d={`M ${A.px} ${A.py} L ${B.px} ${B.py}`}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={active ? 1.4 : 0.7}
              strokeDasharray="3 5"
              strokeDashoffset={active ? -tick * 24 : 0}
              opacity={dim ? 0.05 : (active ? 1 : 0.6)}
              fill="none" />
          );
        })}
      </svg>

      {/* hubs */}
      {hubs.map((h) => {
        const isHover = hover && hover.kind === "hub" && hover.id === h.id;
        const inHL = highlight.hubsH.has(h.id);
        const dim = hover && !inHL;
        return (
          <div key={h.id} className="node-card" data-cursor="hover"
            style={{ left: h.px, top: h.py, opacity: dim ? 0.35 : 1, zIndex: isHover ? 6 : 3 }}
            onMouseEnter={() => setHover({ kind: "hub", id: h.id })}
            onMouseLeave={() => setHover(null)}>
            <div style={{ position: "relative", transform: `scale(${isHover ? 1.06 : 1})`, transition: "transform 200ms" }}>
              <div style={{
                position: "absolute", inset: -28, borderRadius: "50%",
                background: `radial-gradient(circle, ${h.color}40, transparent 70%)`,
                opacity: isHover ? 1 : 0.55, pointerEvents: "none",
              }} />
              <svg width="132" height="132" style={{ position: "absolute", left: -16, top: -16, pointerEvents: "none" }}>
                <circle cx="66" cy="66" r="60" fill="none" stroke={h.color}
                  strokeOpacity={isHover ? 0.7 : 0.22} strokeWidth="1" strokeDasharray="2 8"
                  style={{ transformOrigin: "66px 66px", animation: "spin 22s linear infinite" }} />
              </svg>
              <div className="glass mono" style={{
                width: 100, height: 100, borderRadius: "50%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                border: `1.5px solid ${h.color}`,
                background: `radial-gradient(circle at 30% 30%, ${h.color}26, rgba(10,10,18,0.85) 70%)`,
                boxShadow: isHover
                  ? `0 0 50px ${h.color}aa, inset 0 0 28px ${h.color}40`
                  : `0 0 22px ${h.color}55, inset 0 0 16px ${h.color}25`,
                color: h.color,
              }}>
                <div style={{ fontSize: 9, opacity: 0.65, letterSpacing: "0.2em" }}>STACK</div>
                <div className="display" style={{ fontSize: 16, fontWeight: 600, marginTop: 2, color: "var(--ink)", textShadow: `0 0 12px ${h.color}` }}>
                  {h.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* skill nodes */}
      {nodes.map((n) => {
        const isHover = hover && hover.kind === "node" && hover.id === n.id;
        const inHL = highlight.nodesH.has(n.id);
        const dim = hover && !inHL;
        const primary = (n.fields || [])[0];
        const color = (hubIdx[primary] && hubIdx[primary].color) || "#00f5ff";
        const overlap = (n.fields || []).length > 1;
        return (
          <div key={n.id} className="node-card" data-cursor="hover"
            style={{ left: n.px, top: n.py, opacity: dim ? 0.25 : 1, transition: "opacity 220ms ease", zIndex: isHover ? 7 : 4 }}
            onMouseEnter={() => setHover({ kind: "node", id: n.id })}
            onMouseLeave={() => setHover(null)}>
            <div style={{ position: "relative", transform: `scale(${isHover ? 1.1 : 1})`, transition: "transform 200ms" }}>
              <div className="glass mono" style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: `1px solid ${isHover ? color : `${color}77`}`,
                background: isHover ? `${color}1a` : "rgba(10, 10, 18, 0.85)",
                boxShadow: isHover
                  ? `0 0 22px ${color}aa, inset 0 0 10px ${color}30`
                  : `0 0 8px ${color}30`,
                color: isHover ? color : "var(--ink)",
                fontSize: 11, fontWeight: 500,
                whiteSpace: "nowrap",
                position: "relative",
                display: "inline-flex", alignItems: "center", gap: 7,
              }}>
                <span aria-hidden="true" style={{
                  fontSize: n.icon && n.icon.length > 1 && n.icon.charCodeAt(0) < 128 ? 9 : 13,
                  lineHeight: 1, color, letterSpacing: 0,
                  fontFamily: n.icon === "TS" ? "JetBrains Mono, monospace" : "inherit",
                  fontWeight: n.icon === "TS" ? 700 : 400,
                  filter: isHover ? `drop-shadow(0 0 4px ${color})` : "none",
                }}>{n.icon || "◇"}</span>
                {n.name}
                {overlap && (
                  <span style={{
                    position: "absolute", top: -3, right: -3,
                    width: 8, height: 8, borderRadius: "50%",
                    background: (hubIdx[(n.fields || [])[1]] && hubIdx[(n.fields || [])[1]].color) || color,
                    border: "1px solid rgba(10,10,18,0.9)",
                    boxShadow: `0 0 6px ${color}`,
                  }} />
                )}
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
    </div>
  );
}

/* ===== Testimonials — infinite scrolling cards ===== */
window.TESTIMONIALS = [
  { name: "Lorem Ipsum",      role: "Principal Dolor · Sit Amet",         date: "Mar 2025", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
  { name: "Dolor Sit",        role: "Director of Amet · Consectetur",    date: "Aug 2024", text: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit." },
  { name: "Amet Consectetur", role: "Co-founder · Adipiscing Co.",       date: "Oct 2025", text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
  { name: "Adipiscing Elit",  role: "Engineering Manager · Sed",         date: "Dec 2023", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam." },
  { name: "Eiusmod Tempor",   role: "Tech Lead · Incididunt",            date: "Nov 2025", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores." },
  { name: "Ut Labore",        role: "Asst. Prof · Dolore Magna",         date: "Jun 2022", text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti." },
  { name: "Magna Aliqua",     role: "Staff SRE · Veniam",                date: "Feb 2025", text: "Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat." },
];

function Testimonials() {
  const list = window.TESTIMONIALS;
  // duplicate for seamless loop
  const doubled = [...list, ...list];
  return (
    <div style={{ position: "relative", marginTop: 24 }}>
      <div className="testimonial-scroller">
        <div className="testimonial-track">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
      {/* fade masks */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 36, background: "linear-gradient(90deg, var(--bg) 20%, transparent)", pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 36, background: "linear-gradient(270deg, var(--bg) 20%, transparent)", pointerEvents: "none", zIndex: 2 }} />
      <style>{`
        .testimonial-scroller { overflow: hidden; width: 100%; }
        .testimonial-track {
          display: flex; gap: 16px; width: max-content;
          animation: tscroll 56s linear infinite;
        }
        .testimonial-track:hover { animation-play-state: paused; }
        @keyframes tscroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="testimonial-card glass" style={{
      width: 360, flexShrink: 0,
      padding: 22,
      borderRadius: 14,
      border: "1px solid rgba(0, 245, 255, 0.18)",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div className="mono" style={{ fontSize: 22, color: "var(--cyan)", lineHeight: 1, opacity: 0.6 }}>"</div>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ink)" }}>{t.text}</p>
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px dashed rgba(0,245,255,0.18)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 10 }}>
        <div>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink)", fontWeight: 600 }}>{t.name}</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 2 }}>{t.role}</div>
        </div>
        <div className="mono" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
          {t.date}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CareerPath, careerJobToItem, TechSkillsGraph, Testimonials });
