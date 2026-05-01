/* Background, cursor, boot screen, nav */
const { useEffect, useRef, useState } = React;

/* ===== Animated neural particle background ===== */
function NeuralBackground({ density = 70 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h, dpr;
    const nodes = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < density; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.4,
        hue: Math.random() < 0.7 ? 188 : Math.random() < 0.5 ? 280 : 320,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function onMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", onMove);

    function tick() {
      ctx.clearRect(0, 0, w, h);
      // edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.15;
            ctx.strokeStyle = `hsla(${a.hue}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // mouse attraction
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 180) {
          const alpha = (1 - md / 180) * 0.5;
          ctx.strokeStyle = `hsla(${a.hue}, 100%, 70%, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      // nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.pulse += 0.02;
        const r = n.r + Math.sin(n.pulse) * 0.4;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 8);
        grad.addColorStop(0, `hsla(${n.hue}, 100%, 70%, 0.9)`);
        grad.addColorStop(1, `hsla(${n.hue}, 100%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${n.hue}, 100%, 80%, 1)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1, opacity: 0.85 }}
    />
  );
}

/* ===== Custom cursor ===== */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0, raf;
    function move(e) { x = e.clientX; y = e.clientY; }
    function tick() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", move);
    tick();

    function over(e) {
      const t = e.target;
      if (t.closest && t.closest("[data-cursor='hover'], a, button, .node-card, input, textarea")) {
        ringRef.current?.classList.add("hover");
      } else {
        ringRef.current?.classList.remove("hover");
      }
    }
    window.addEventListener("mouseover", over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);
  return (
    <React.Fragment>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </React.Fragment>
  );
}

/* ===== Boot screen ===== */
function BootScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const script = [
      { t: 0, text: "> initializing neural system..." },
      { t: 380, text: "  [<span class='ok'>OK</span>] graph-runtime v3.4.2 booted" },
      { t: 720, text: "  [<span class='ok'>OK</span>] establishing backbone connections" },
      { t: 1080, text: "  [<span class='ok'>OK</span>] embedding model loaded · 768d" },
      { t: 1380, text: "> loading aloysius_lim.neural_profile..." },
      { t: 1820, text: "  > parsing 24 project nodes..." },
      { t: 2120, text: "  > parsing 10 achievement nodes..." },
      { t: 2400, text: "  > resolving 38 edge relations..." },
      { t: 2700, text: "  [<span class='ok'>OK</span>] coherence check passed" },
      { t: 3000, text: "> status: <span class='ok'>ACTIVE</span>" },
    ];
    const timers = script.map((s) =>
      setTimeout(() => setLines((prev) => [...prev, s.text]), s.t)
    );
    const finish = setTimeout(() => {
      setDone(true);
      setTimeout(onDone, 700);
    }, 3500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <div id="boot" className={done ? "done" : ""}>
      <div className="boot-frame brackets">
        <div className="mono" style={{ color: "var(--cyan)", fontSize: 11, letterSpacing: "0.2em", marginBottom: 14, textTransform: "uppercase" }}>
          neural.interface · session 0xA17B
        </div>
        {lines.map((l, i) => (
          <div key={i} className="boot-line" dangerouslySetInnerHTML={{ __html: l }} />
        ))}
        {!done && <div className="boot-line cursor-blink" />}
      </div>
    </div>
  );
}

/* ===== Floating glass nav — responsive with hamburger drawer ===== */
function Nav({ activeSection }) {
  const items = [
    { id: "hero", label: "00 / root" },
    { id: "projects", label: "01 / projects" },
    { id: "achievements", label: "02 / achievements" },
    { id: "leadership", label: "03 / leadership" },
    { id: "career", label: "04 / career" },
    { id: "skills", label: "05 / stack" },
    { id: "testimonials", label: "06 / testimonials" },
    { id: "contact", label: "07 / connect" },
  ];
  const [open, setOpen] = useState(false);

  // close on resize past breakpoint, on hash-change, on Escape
  useEffect(() => {
    function onResize() { if (window.innerWidth > 1100) setOpen(false); }
    function onHash() { setOpen(false); }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // lock body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const activeLabel = (items.find((i) => i.id === activeSection) || items[0]).label;

  return (
    <>
      {/* Desktop / wide nav — pure transparent pill, no glass */}
      <nav className="np-nav np-nav-desk mono" aria-label="Primary">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`np-link${activeSection === it.id ? " is-active" : ""}`}
          >
            <span className="np-dot" />
            {it.label}
          </a>
        ))}
      </nav>

      {/* Compact bar — visible on tablet/mobile */}
      <div className="np-nav-bar mono" role="navigation" aria-label="Primary">
        <a href="#hero" className="np-brand">
          <span className="np-brand-mark" />
          <span className="np-brand-text">aloysius_lim</span>
        </a>
        <div className="np-current">
          <span className="np-dot is-on" />
          {activeLabel}
        </div>
        <button
          type="button"
          className={`np-burger${open ? " is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Drawer — full-screen overlay menu for tablet/mobile */}
      <div
        className={`np-drawer${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <nav className="np-drawer-list mono" onClick={(e) => e.stopPropagation()}>
          <div className="np-drawer-head">
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--ink-faint)", textTransform: "uppercase" }}>▸ Sections</span>
            <button type="button" className="np-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
          </div>
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`np-drawer-link${activeSection === it.id ? " is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="np-dot" />
              <span>{it.label}</span>
              <span className="np-arrow">↗</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

/* expose */
Object.assign(window, { NeuralBackground, CustomCursor, BootScreen, Nav });

/* ===== Smooth eased scroll for all anchor links ===== */
(function () {
  if (window.__smoothScrollInstalled) return;
  window.__smoothScrollInstalled = true;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration = 1100) {
    const startY = window.scrollY || window.pageYOffset;
    const dist = targetY - startY;
    if (Math.abs(dist) < 4) return;
    let startT = null;
    let cancelled = false;
    function onWheel() { cancelled = true; }
    function onTouch() { cancelled = true; }
    window.addEventListener("wheel", onWheel, { passive: true, once: true });
    window.addEventListener("touchstart", onTouch, { passive: true, once: true });

    function step(now) {
      if (cancelled) return;
      if (!startT) startT = now;
      const elapsed = now - startT;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, startY + dist * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.addEventListener("click", function (e) {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const rect = target.getBoundingClientRect();
    const top = rect.top + window.scrollY - 20;
    smoothScrollTo(top, 1200);
    history.pushState(null, "", href);
  }, false);
})();
