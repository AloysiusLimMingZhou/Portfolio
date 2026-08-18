/* Main App */
const { useEffect: useEffectM, useState: useStateM, useRef: useRefM } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "revealEnabled": true,
  "replayReveal": false,
  "revealThreshold": 0.12,
  "revealDuration": 500
}/*EDITMODE-END*/;

function App() {
  const tweaks = TWEAK_DEFAULTS;
  const [bootDone, setBootDone] = useStateM(false);
  const [activeItem, setActiveItem] = useStateM(null);
  const [activeSection, setActiveSection] = useStateM("hero");

  // push reveal duration into a CSS variable
  useEffectM(() => {
    document.documentElement.style.setProperty('--reveal-duration', tweaks.revealDuration + 'ms');
  }, [tweaks.revealDuration]);

  // section observer
  useEffectM(() => {
    if (!bootDone) return;
    const ids = ["hero", "projects", "achievements", "leadership", "career", "skills", "testimonials", "contact"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveSection(e.target.id);
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [bootDone]);

  // reveal-on-scroll for .reveal elements
  // - one-shot if replayReveal is off (classic behavior)
  // - replay every time element enters/leaves viewport when replayReveal is on
  // - if revealEnabled is off, force everything visible
  useEffectM(() => {
    if (!bootDone) return;
    const els = document.querySelectorAll(".reveal");

    // disabled → force-show, no observer
    if (!tweaks.revealEnabled) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const replay = !!tweaks.replayReveal;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          if (!replay) obs.unobserve(e.target);
        } else if (replay) {
          e.target.classList.remove("in");
        }
      });
    }, { threshold: tweaks.revealThreshold, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => {
      if (!replay) {
        // start hidden so it can re-fire only on first entry
        el.classList.remove("in");
      }
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [bootDone, tweaks.revealEnabled, tweaks.replayReveal, tweaks.revealThreshold]);

  // close modal on esc
  useEffectM(() => {
    function key(e) { if (e.key === "Escape") setActiveItem(null); }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const data = window.PORTFOLIO_DATA;

  return (
    <React.Fragment>
      {/* fixed bg */}
      <div className="bg-layer bg-vignette" />
      <div className="bg-layer bg-grid" />
      <NeuralBackground density={70} />
      <div className="bg-layer bg-noise" />

      <CustomCursor />
      {!bootDone && <BootScreen onDone={() => setBootDone(true)} />}

      <Nav activeSection={activeSection} />

      <main>
        <Hero data={data} />

        <section id="projects" className="deck">
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="section-tag">section · 01 / projects</span>
              <h2 className="section-title">A graph of <span className="glow-cyan">things made</span>.</h2>
              <p className="section-sub">
                Each node is a project. Edges are shared tech, shared UX, or shared infra — hover any node to trace its dependencies.
              </p>
            </div>
            <div className="mono glass" style={{ padding: "10px 14px", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-dim)" }}>
              {data.projects.length} NODES · {(() => {
                const used = new Set();
                data.projects.forEach((p) => (p.fields || []).forEach((f) => used.add(f)));
                return used.size;
              })()} FIELDS
            </div>
          </div>
          <div className="reveal delay-1">
            <ProjectGraph data={data} onSelect={(p) => setActiveItem(window.projectToItem(p))} />
          </div>
          <div className="reveal delay-2 mono" style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
            ▸ HOVER TO INSPECT · CLICK TO EXPAND
          </div>
        </section>

        <section id="achievements" className="deck">
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="section-tag" style={{ color: "var(--pink)", borderColor: "rgba(255, 43, 214, 0.3)", background: "rgba(255, 43, 214, 0.05)" }}>
                section · 02 / competitions
              </span>
              <h2 className="section-title">Where I <span className="glow-pink">competed</span>.</h2>
              <p className="section-sub">
                Hackathons, challenges, and ranked events — broken down by outcome in one chart.
              </p>
            </div>
          </div>
          <div className="reveal delay-1">
            <AchievementsGraph data={data} onSelect={(a) => setActiveItem(window.achievementToItem(a))} />
          </div>
          <div className="reveal delay-2 mono" style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
            ▸ HOVER SLICES TO INSPECT · CLICK CARDS TO EXPAND
          </div>
        </section>

        <section id="leadership" className="deck">
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="section-tag" style={{ color: "var(--purple)", borderColor: "rgba(157, 0, 255, 0.3)", background: "rgba(157, 0, 255, 0.05)" }}>
                section · 03 / leadership
              </span>
              <h2 className="section-title">Roles I <span className="glow-purple">hold</span>, events I've <span className="glow-pink">led</span>.</h2>
              <p className="section-sub">
                Active commitments above. Below, every event I've led — connected by shared organizers, sponsors, and the communities they feed.
              </p>
            </div>
          </div>
          <div className="reveal delay-1">
            <LeadershipRoles />
          </div>
          <div className="reveal delay-2 mono" style={{ marginBottom: 24, fontSize: 11, letterSpacing: "0.22em", color: "var(--ink-faint)" }}>
            ▸ EVENT.GRAPH / PAST PRODUCTIONS
          </div>
          <div className="reveal delay-3">
            <LeadershipGraph onSelect={(ev) => setActiveItem(window.leadershipEventToItem(ev))} />
          </div>
          <div className="reveal delay-4 mono" style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
            ▸ HOVER TO TRACE · CLICK FOR EVENT DETAILS
          </div>
        </section>

        <section id="career" className="deck">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <span className="section-tag" style={{ color: "var(--cyan)" }}>
              section · 04 / career path
            </span>
            <h2 className="section-title">A <span className="glow-cyan">vertical timeline</span> of where I've worked.</h2>
            <p className="section-sub">
              Top is now, bottom is then. Click any role to expand the position, what I shipped, and skills I picked up.
            </p>
          </div>
          <div className="reveal delay-1">
            <CareerPath onSelect={(job) => setActiveItem(window.careerJobToItem(job))} />
          </div>
        </section>

        <section id="skills" className="deck">
          <div className="reveal" style={{ marginBottom: 48 }}>
            <span className="section-tag" style={{ color: "var(--cyan)" }}>
              section · 05 / tech stack
            </span>
            <h2 className="section-title">A <span className="glow-cyan">graph</span> of the tools I reach for.</h2>
            <p className="section-sub">
              Hubs are fields. Leaves are languages, frameworks, and tools. Cross-field dashed edges show what I use across more than one domain.
            </p>
          </div>
          <div className="reveal delay-1">
            <TechSkillsGraph />
          </div>
          <div className="reveal delay-2 mono" style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.18em" }}>
            ▸ HOVER A HUB FOR ITS STACK · HOVER A TOOL FOR LINKED SKILLS
          </div>
        </section>

        <section id="testimonials" className="deck" style={{ minHeight: "auto", paddingTop: 40, paddingBottom: 80 }}>
          <div className="reveal" style={{ marginBottom: 36, textAlign: "center" }}>
            <span className="section-tag" style={{ color: "var(--pink)", borderColor: "rgba(255, 43, 214, 0.3)", background: "rgba(255, 43, 214, 0.05)" }}>
              section · 06 / testimonials
            </span>
            <h2 className="section-title">What <span className="glow-pink">collaborators</span> say.</h2>
          </div>
          <div className="reveal delay-1">
            <Testimonials />
          </div>
        </section>

        <section id="contact" className="deck" style={{ paddingBottom: 60 }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-tag" style={{ color: "var(--purple)", borderColor: "rgba(157, 0, 255, 0.3)", background: "rgba(157, 0, 255, 0.05)" }}>
              section · 07 / connect
            </span>
            <h2 className="section-title">Open a <span className="glow-purple">channel</span>.</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Coffee, collab, or just a hello. The node below is listening.
            </p>
          </div>
          <div className="reveal delay-1">
            <ContactNode />
          </div>
        </section>

        <Footer />
      </main>

      <DetailModal item={activeItem} onClose={() => setActiveItem(null)} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
