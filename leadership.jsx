/* Leadership section — roles grid + events graph */
const { useEffect: useEffectL, useRef: useRefL, useState: useStateL, useMemo: useMemoL } = React;

const LEAD_PURPLE = "#9d00ff";
const LEAD_PINK = "#ff2bd6";

function LeadershipRoles() {
  const data = window.LEADERSHIP_DATA;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 18,
      marginBottom: 80,
    }}>
      {data.roles.map((r, i) => (
        <RoleCard key={r.id} role={r} idx={i} />
      ))}
    </div>
  );
}

function RoleCard({ role, idx }) {
  const ref = useRefL(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  }
  const accent = idx % 2 === 0 ? LEAD_PURPLE : LEAD_PINK;
  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: "900px" }} data-cursor="hover">
      <div ref={ref} style={{
        position: "relative",
        padding: 24,
        borderRadius: 14,
        background: "rgba(13, 13, 24, 0.55)",
        backdropFilter: "blur(20px) saturate(160%)",
        border: `1px solid ${accent}33`,
        boxShadow: `0 0 0 1px ${accent}11, 0 24px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)`,
        transformStyle: "preserve-3d",
        transition: "transform 320ms cubic-bezier(.2,.7,.2,1)",
        overflow: "hidden",
        minHeight: 220,
      }}>
        {/* spotlight */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(circle 220px at var(--mx, 50%) var(--my, 30%), ${accent}26, transparent 60%)`,
          mixBlendMode: "screen",
        }} />
        {/* corner ticks */}
        <div style={{ position: "absolute", top: 8, left: 8, width: 12, height: 12, borderLeft: `1px solid ${accent}`, borderTop: `1px solid ${accent}`, opacity: 0.7 }} />
        <div style={{ position: "absolute", bottom: 8, right: 8, width: 12, height: 12, borderRight: `1px solid ${accent}`, borderBottom: `1px solid ${accent}`, opacity: 0.7 }} />

        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: accent, marginBottom: 18, textShadow: `0 0 12px ${accent}` }}>
          ◆ ROLE.{role.id.toUpperCase()}
        </div>
        <div className="display" style={{ fontSize: 24, lineHeight: 1.15, fontWeight: 500, marginBottom: 6 }}>
          {role.title}
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-dim)", letterSpacing: "0.04em", marginBottom: 14 }}>
          {role.org}
        </div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.18em", marginBottom: 16 }}>
          ▸ {role.term}
        </div>
        <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.55, marginBottom: 18 }}>{role.summary}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 14, borderTop: `1px dashed ${accent}33` }}>
          <span className="display" style={{ fontSize: 32, color: accent, lineHeight: 1, textShadow: `0 0 16px ${accent}80` }}>{role.stat}</span>
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--ink-faint)", textTransform: "uppercase" }}>{role.statLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* ===== Leadership events graph — grouped by YEAR hubs ===== */
function LeadershipGraph({ onSelect }) {
  const data = window.LEADERSHIP_DATA;
  const wrapRef = useRefL(null);
  const [size, setSize] = useStateL({ w: 1200, h: 720 });
  const [hover, setHover] = useStateL(null); // { kind: 'year'|'event', id }
  const [tick, setTick] = useStateL(0);

  useEffectL(() => {
    function measure() {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffectL(() => {
    let raf, t = 0;
    function loop() { t += 0.02; setTick(t); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // build year buckets — normalize "2023→" to "2023+"
  const yearBuckets = useMemoL(() => {
    const out = {};
    data.events.forEach((e) => {
      const y = (e.year || "").replace("→", "+");
      if (!out[y]) out[y] = [];
      out[y].push(e);
    });
    return out;
  }, [data.events]);
  const years = Object.keys(yearBuckets).sort();

  // hubs: year nodes laid out horizontally
  const hubs = useMemoL(() => {
    const cy = size.h / 2;
    const margin = 180;
    const usable = Math.max(size.w - margin * 2, 1);
    const step = years.length > 1 ? usable / (years.length - 1) : 0;
    return years.map((y, i) => ({
      id: y,
      label: y,
      px: margin + step * i,
      py: cy,
      color: ["#9d00ff", "#ff2bd6", "#00f5ff", "#5eead4", "#ffc857"][i % 5],
    }));
  }, [years, size]);
  const hubIdx = Object.fromEntries(hubs.map((h) => [h.id, h]));

  // events orbit their year hub
  const events = useMemoL(() => {
    const out = [];
    years.forEach((y) => {
      const hub = hubIdx[y];
      const items = yearBuckets[y];
      const radius = 150 + (items.length > 2 ? 30 : 0);
      items.forEach((ev, i) => {
        const total = items.length;
        // semi-circle distribution: alternating top/bottom around hub
        const sign = i % 2 === 0 ? -1 : 1;
        const tier = Math.floor(i / 2);
        const angle = sign * (Math.PI / 2) + sign * (tier * 0.45) - (sign * (total > 1 ? 0.25 : 0));
        // jitter angle deterministically
        const a = angle;
        out.push({
          ...ev,
          yearKey: y,
          px: hub.px + Math.cos(a) * radius,
          py: hub.py + Math.sin(a) * radius,
          color: hub.color,
        });
      });
    });
    return out;
  }, [years, yearBuckets, hubs, size]);

  return (
    <div className="graph-wrap" ref={wrapRef} style={{ height: 720 }}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
        <defs>
          <filter id="lglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* timeline spine connecting year hubs */}
        {hubs.length > 1 && (
          <line x1={hubs[0].px} y1={hubs[0].py} x2={hubs[hubs.length-1].px} y2={hubs[hubs.length-1].py}
            stroke="rgba(157, 0, 255, 0.25)" strokeWidth="1.5" strokeDasharray="4 8" />
        )}
        {/* event → year edges */}
        {events.map((ev) => {
          const hub = hubIdx[ev.yearKey];
          const active = (hover && hover.kind === "event" && hover.id === ev.id)
                      || (hover && hover.kind === "year" && hover.id === ev.yearKey);
          const dim = hover && !active;
          return (
            <line key={ev.id} x1={hub.px} y1={hub.py} x2={ev.px} y2={ev.py}
              stroke={ev.color}
              strokeOpacity={active ? 0.9 : 0.35}
              strokeWidth={active ? 1.6 : 1}
              strokeDasharray={active ? "4 4" : "none"}
              strokeDashoffset={active ? -tick * 30 : 0}
              opacity={dim ? 0.1 : 1}
              filter={active ? "url(#lglow)" : ""} />
          );
        })}
      </svg>

      {/* year hubs */}
      {hubs.map((h) => {
        const isHover = hover && hover.kind === "year" && hover.id === h.id;
        const dim = hover && !(isHover || (hover.kind === "event" && events.find(e => e.id === hover.id)?.yearKey === h.id));
        return (
          <div key={h.id} className="node-card" data-cursor="hover"
            style={{ left: h.px, top: h.py, opacity: dim ? 0.35 : 1, zIndex: isHover ? 6 : 3 }}
            onMouseEnter={() => setHover({ kind: "year", id: h.id })}
            onMouseLeave={() => setHover(null)}>
            <div style={{ position: "relative", transform: `scale(${isHover ? 1.06 : 1})`, transition: "transform 200ms" }}>
              <div style={{
                position: "absolute", inset: -28, borderRadius: "50%",
                background: `radial-gradient(circle, ${h.color}40, transparent 70%)`,
                opacity: isHover ? 1 : 0.55, pointerEvents: "none",
              }} />
              <svg width="140" height="140" style={{ position: "absolute", left: -20, top: -20, pointerEvents: "none" }}>
                <circle cx="70" cy="70" r="64" fill="none" stroke={h.color}
                  strokeOpacity={isHover ? 0.7 : 0.22} strokeWidth="1" strokeDasharray="2 8"
                  style={{ transformOrigin: "70px 70px", animation: "spin 22s linear infinite" }} />
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
                <div style={{ fontSize: 9, opacity: 0.65, letterSpacing: "0.22em" }}>YEAR</div>
                <div className="display" style={{ fontSize: 22, fontWeight: 600, marginTop: 2, color: "var(--ink)", textShadow: `0 0 12px ${h.color}` }}>
                  {h.label}
                </div>
                <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7, letterSpacing: "0.16em" }}>
                  · {yearBuckets[h.id].length} ·
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* event leaves */}
      {events.map((n) => {
        const isHover = hover && hover.kind === "event" && hover.id === n.id;
        const inHL = (hover && hover.kind === "year" && hover.id === n.yearKey) || isHover;
        const dim = hover && !inHL;
        const color = n.color;
        const pulse = 1 + Math.sin(tick * 1.1 + n.px * 0.01) * 0.04;
        return (
          <div key={n.id} className="node-card" data-cursor="hover"
            style={{ left: n.px, top: n.py, opacity: dim ? 0.25 : 1, transition: "opacity 220ms ease", zIndex: isHover ? 7 : 4 }}
            onMouseEnter={() => setHover({ kind: "event", id: n.id })}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect(n)}>
            <div style={{ position: "relative", transform: `scale(${isHover ? 1.08 : pulse})`, transition: "transform 220ms cubic-bezier(.2,.7,.2,1)" }}>
              <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: `radial-gradient(circle, ${color}33, transparent 70%)`, opacity: isHover ? 1 : 0.5, pointerEvents: "none" }} />
              <div className="glass mono" style={{
                width: 56, height: 56, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${isHover ? color : `${color}77`}`,
                background: isHover ? `${color}1a` : "rgba(10, 10, 18, 0.85)",
                boxShadow: isHover ? `0 0 24px ${color}aa, inset 0 0 12px ${color}40` : `0 0 10px ${color}30`,
                color, fontSize: 11, fontWeight: 600,
              }}>
                {n.id.slice(1)}
              </div>
              <div style={{ position: "absolute", top: 64, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", pointerEvents: "none", textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 11, color: isHover ? color : "var(--ink)", textShadow: isHover ? `0 0 10px ${color}` : "none", fontWeight: 600 }}>
                  {n.name}
                </div>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.1em", marginTop: 2 }}>
                  {n.role} · {n.club}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="glass mono" style={{
        position: "absolute", top: 16, right: 16, padding: "10px 14px",
        fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
        color: "var(--ink-dim)",
      }}>
        ◆ {data.events.length} EVENTS · {years.length} YEARS
      </div>
    </div>
  );
}

Object.assign(window, { LeadershipRoles, LeadershipGraph });
