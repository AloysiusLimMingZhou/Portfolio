/* Shared 3D detail modal — used by Projects, Achievements, Leadership */
const { useRef: useRefD, useEffect: useEffectD } = React;

/* Generic detail modal with 3D tilt + parallax glassmorphism */
function DetailModal({ item, onClose }) {
  const cardRef = useRefD(null);
  const open = !!item;

  // tilt
  function onMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1400px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }
  function onLeave() {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(1400px) rotateY(0deg) rotateX(0deg)";
  }

  if (!item) return <div className="modal-backdrop" onClick={onClose} />;

  const color = item.color || "#00f5ff";
  const left = item.left || {};
  const right = item.right || [];

  return (
    <div className={`modal-backdrop ${open ? "open" : ""}`} onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ perspective: "1400px" }}
      >
        <div ref={cardRef} className="glass-3d" style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          transformStyle: "preserve-3d",
          transition: "transform 320ms cubic-bezier(.2,.7,.2,1)",
          background: "rgba(13, 13, 24, 0.72)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          border: `1px solid ${color}55`,
          boxShadow: `
            0 0 0 1px ${color}22,
            0 60px 120px -30px rgba(0,0,0,0.8),
            0 0 80px -20px ${color}55,
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
        }}>
          {/* spotlight that follows cursor */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(circle 320px at var(--mx, 50%) var(--my, 30%), ${color}24, transparent 60%)`,
            mixBlendMode: "screen",
          }} />
          {/* top neon hairline */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            opacity: 0.7 }} />
          {/* corner brackets */}
          {[
            { top: 8, left: 8, br: "0 1 1 0" },
            { top: 8, right: 8, br: "0 0 1 1" },
            { bottom: 8, left: 8, br: "1 1 0 0" },
            { bottom: 8, right: 8, br: "1 0 0 1" },
          ].map((p, i) => (
            <div key={i} style={{
              position: "absolute", width: 14, height: 14,
              borderColor: color, borderStyle: "solid",
              borderTopWidth: p.br.split(" ")[0] === "1" ? 1 : 0,
              borderRightWidth: p.br.split(" ")[1] === "1" ? 1 : 0,
              borderBottomWidth: p.br.split(" ")[2] === "1" ? 1 : 0,
              borderLeftWidth: p.br.split(" ")[3] === "1" ? 1 : 0,
              opacity: 0.7,
              ...(p.top !== undefined && { top: p.top }),
              ...(p.bottom !== undefined && { bottom: p.bottom }),
              ...(p.left !== undefined && { left: p.left }),
              ...(p.right !== undefined && { right: p.right }),
            }} />
          ))}

          {/* HEADER */}
          <div style={{
            padding: "30px 36px",
            borderBottom: `1px solid ${color}22`,
            display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24,
            position: "relative",
            transform: "translateZ(40px)",
          }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: color, marginBottom: 12, textShadow: `0 0 12px ${color}` }}>
                ◆ {item.eyebrow}
              </div>
              <h2 className="display" style={{ fontSize: 44, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.02em" }}>
                {item.title}
              </h2>
              {item.tagline && (
                <div style={{ color: "var(--ink-dim)", marginTop: 10, fontSize: 16, maxWidth: 640 }}>{item.tagline}</div>
              )}
            </div>
            <button onClick={onClose} data-cursor="hover" className="mono" style={{
              width: 38, height: 38, borderRadius: "50%",
              border: `1px solid ${color}55`, color: color,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 18, lineHeight: 1,
              background: `${color}10`,
            }}>×</button>
          </div>

          {/* BODY — bento grid */}
          <div className="bento-grid" style={{
            padding: 28,
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 16,
            maxHeight: "62vh",
            overflowY: "auto",
            transform: "translateZ(20px)",
          }}>
            {/* LEFT — overview */}
            <div className="glass-pane" style={{ ...paneStyle(color), gridRow: "span 2" }}>
              <PaneHeader label={left.heading || "▸ OVERVIEW"} color={color} />
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink)" }}>{left.body}</p>
              {left.features && (
                <div style={{ marginTop: 24 }}>
                  <PaneHeader label={left.featuresLabel || "▸ HIGHLIGHTS"} color={color} />
                  <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none" }}>
                    {left.features.map((f, i) => (
                      <li key={i} style={{ display: "flex", gap: 12, fontSize: 14 }}>
                        <span style={{ color: color, fontFamily: "JetBrains Mono", fontSize: 11, minWidth: 22 }}>0{i + 1}</span>
                        <span style={{ color: "var(--ink)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT panes */}
            {right.map((pane, i) => (
              <div key={i} className="glass-pane" style={paneStyle(color)}>
                <PaneHeader label={pane.heading} color={color} />
                {pane.kind === "chips" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {pane.items.map((s) => (
                      <span key={s} className="mono" style={{
                        padding: "6px 10px", fontSize: 11,
                        border: `1px solid ${color}40`, color: color,
                        background: `${color}10`, borderRadius: 6,
                      }}>{s}</span>
                    ))}
                  </div>
                )}
                {pane.kind === "kv" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pane.items.map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, paddingBottom: 8, borderBottom: "1px dashed rgba(255,255,255,0.06)" }}>
                        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-faint)", textTransform: "uppercase" }}>{k}</span>
                        <span style={{ fontSize: 13, color: "var(--ink)", textAlign: "right" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {pane.kind === "links" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {pane.items.map(([label, href]) => (
                      <a key={label} href={href || "#"} data-cursor="hover" className="mono" style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", border: `1px solid ${color}33`, borderRadius: 6, fontSize: 12, color: color, background: `${color}06` }}>
                        <span>{label}</span><span>↗</span>
                      </a>
                    ))}
                  </div>
                )}
                {pane.kind === "stat" && (
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <div className="display" style={{ fontSize: 48, lineHeight: 1, color: color, textShadow: `0 0 20px ${color}80` }}>{pane.value}</div>
                    <div className="mono" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.2em", marginTop: 6 }}>{pane.sub}</div>
                  </div>
                )}
                {pane.kind === "image" && (
                  <div style={{
                    width: "100%", aspectRatio: "16/10",
                    borderRadius: 10,
                    border: `1px dashed ${color}55`,
                    background: `repeating-linear-gradient(135deg, ${color}08 0 8px, transparent 8px 16px), radial-gradient(circle at 50% 50%, ${color}18, transparent 70%)`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    color: `${color}aa`,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 8, left: 8, width: 14, height: 14, borderLeft: `1px solid ${color}`, borderTop: `1px solid ${color}` }} />
                    <div style={{ position: "absolute", bottom: 8, right: 8, width: 14, height: 14, borderRight: `1px solid ${color}`, borderBottom: `1px solid ${color}` }} />
                    <div style={{ fontSize: 32, marginBottom: 8 }}>◇</div>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>EVENT IMAGE</div>
                    <div className="mono" style={{ fontSize: 9, marginTop: 4, color: "var(--ink-faint)", letterSpacing: "0.18em" }}>PLACEHOLDER · 1600×1000</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function paneStyle(color) {
  return {
    padding: 22,
    background: "rgba(255, 255, 255, 0.025)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px -8px rgba(0,0,0,0.4)`,
  };
}

function PaneHeader({ label, color }) {
  return (
    <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: color, marginBottom: 12, opacity: 0.85 }}>
      {label}
    </div>
  );
}

/* ===== Adapters: turn project / achievement / leadership data into modal item ===== */
function projectToItem(p) {
  const color = window.DOMAIN_HEX[p.domain];
  return {
    color,
    eyebrow: `${p.id.toUpperCase()} / ${p.domain.toUpperCase()} · ${p.year} · ${p.tag.toUpperCase()}`,
    title: p.name,
    tagline: p.tagline,
    left: { heading: "▸ ABSTRACT", body: p.description, features: p.features, featuresLabel: "▸ KEY FEATURES" },
    right: [
      { heading: "▸ TECH STACK", kind: "chips", items: p.stack },
      { heading: "▸ ENDPOINTS", kind: "links", items: [[`github.com/al/${p.id}`, "#"], [`${p.id}.aloysiuslim.dev`, "#"]] },
    ],
  };
}

function achievementToItem(a) {
  const color = window.CLUSTER_COLORS[a.cluster] || "#00f5ff";
  return {
    color,
    eyebrow: `${a.id.toUpperCase()} / ${a.type.toUpperCase()} · ${a.year} · ${a.cluster.toUpperCase()}`,
    title: a.name,
    tagline: a.note,
    left: {
      heading: "▸ CONTEXT",
      body: a.description || `Recognized milestone in the ${a.cluster.replace("-", " ")} basin. ${a.note}.`,
      features: a.highlights || [
        `Year ${a.year} · Category ${a.type}`,
        "Verified by external organizing body",
        "Listed on neural-profile public ledger",
      ],
      featuresLabel: "▸ HIGHLIGHTS",
    },
    right: [
      { heading: "▸ METADATA", kind: "kv", items: [
        ["YEAR", a.year],
        ["TYPE", a.type.toUpperCase()],
        ["CLUSTER", a.cluster.toUpperCase()],
        ["STATUS", "VERIFIED"],
      ] },
      { heading: "▸ EVIDENCE", kind: "links", items: [
        ["press release ↗", "#"],
        ["proof of work ↗", "#"],
      ] },
    ],
  };
}

function leadershipEventToItem(ev) {
  const color = "#9d00ff";
  return {
    color,
    eyebrow: `${ev.id.toUpperCase()} / ${ev.role.toUpperCase()} · ${ev.year} · ${ev.club.toUpperCase()}`,
    title: ev.name,
    tagline: ev.tagline,
    left: {
      heading: "▸ EVENT OVERVIEW",
      body: ev.overview,
      features: ev.outcomes,
      featuresLabel: "▸ OUTCOMES",
    },
    right: [
      { heading: "▸ EVENT IMAGE", kind: "image" },
      { heading: "▸ DETAILS", kind: "kv", items: [
        ["CLUB", ev.club],
        ["COLLABORATOR", ev.collaborator],
        ["SPEAKER", ev.speaker],
        ["PARTICIPANTS", ev.participants],
        ["DATE", ev.date],
      ] },
      { heading: "▸ LINKS", kind: "links", items: [
        ["LinkedIn recap ↗", ev.linkedin || "#"],
        ["event page ↗", "#"],
      ] },
    ],
  };
}

Object.assign(window, { DetailModal, projectToItem, achievementToItem, leadershipEventToItem });
