# Neural Portfolio

A single-page neural-interface portfolio. Static HTML/CSS with React and Babel loaded from a CDN — **no build step**, no `npm install`. Edit a `.jsx` file, refresh the browser, done.

---

## Run it locally

From this folder:

```bash
# Python (anywhere with Python 3)
python -m http.server 5500

# or Node
npx serve .
```

Then open http://localhost:5500/. Opening `index.html` directly via `file://` will not work — the browser blocks the JSX `<script>` requests under that scheme.

---

## File map

| File | What it owns |
|---|---|
| `index.html` | Page shell. Loads fonts, React/Babel from CDN, then each `.jsx` module in order. |
| `styles.css` | Design tokens (colors, glass, hairlines), nav styles, responsive breakpoints, reveal-on-scroll keyframes. |
| `app.jsx` | Root `<App>`. Section observer, reveal-on-scroll observer, modal state. |
| `data.jsx` | **Identity, projects, project field hubs, achievements.** |
| `leadership-data.jsx` | **Current leadership roles + past events.** |
| `career.jsx` | **Career timeline data**, **tech-skill graph data**, **testimonials data**, plus the components that render them. |
| `chrome.jsx` | Animated background canvas, custom cursor, boot screen, top nav (desktop pill + mobile drawer), smooth-scroll anchor handler. |
| `hero-projects.jsx` | Hero section, profile placeholder, project graph (field hubs + min-distance relaxation). |
| `achievements-contact.jsx` | Achievements graph, contact form, footer. |
| `leadership.jsx` | Roles grid + events graph (year hubs). |
| `detail-modal.jsx` | Shared 3D-tilt glass modal used by projects, achievements, leadership events, and career. |
| `vercel.json` | HTTP security headers applied to every response. |

---

## Editing content

All content lives in plain JS arrays/objects on `window.*`. After any edit, refresh the browser tab.

### 1. Identity (hero name, title, summary, stats)

`data.jsx` → `window.PORTFOLIO_DATA.identity`:

```js
identity: {
  handle: "aloysius_lim",
  title: "AI Systems Engineer / Interface Architect",
  location: "Singapore — Remote",
  summary: "...typed bio under the hero name...",
  stats: [
    { label: "PROJECTS", value: "24" },
    // up to ~4 stats render in the telemetry strip
  ],
},
```

### 2. Projects

`data.jsx` → `window.PORTFOLIO_DATA.projects[]`. Each entry:

```js
{
  id: "p12",                          // unique; "p" + number is the convention
  name: "MY.project",
  domain: "AI",                       // free text; shown in the modal eyebrow
  year: "2026",
  tag: "Production",                  // free text; shown next to year
  tagline: "One-line pitch.",
  description: "Paragraph for the modal.",
  stack: ["TypeScript", "React"],     // chips in the modal
  features: ["Bullet 1", "Bullet 2"], // numbered list in the modal
  fields: ["web", "ml"],              // MUST match IDs in PROJECT_FIELDS below
  x: 0.5, y: 0.5,                     // (legacy seed; positioning is now auto)
}
```

**To add a new field hub** (e.g. "Robotics"), edit `window.PROJECT_FIELDS` at the top of `data.jsx`:

```js
{ id: "robotics", label: "Robotics", color: "#a78bfa", angle: Math.PI * 0.3 },
```

`angle` is the radial position around the canvas center (0 = right, π/2 = down). Spread hubs around the circle so they don't overlap. Then reference the new id in any project's `fields[]`.

**Removing a project**: delete its object from `projects[]`. The min-distance relaxation in `hero-projects.jsx` re-lays everything out automatically.

### 3. Achievements

`data.jsx` → `window.PORTFOLIO_DATA.achievements[]`:

```js
{
  id: "a11",
  name: "ICML 2026",
  year: "2026",
  type: "paper",                       // shown as label in the chip
  note: "Co-author, retrieval methods",
  cluster: "research",                 // MUST be one of the cluster keys
}
```

Valid `cluster` values are the keys of `CLUSTER_COLORS` in `achievements-contact.jsx`: `research | competitions | open-source | press`. To add a new cluster, add an entry to `CLUSTER_COLORS` (e.g. `mentorship: "#a78bfa"`) and the layout adds a halo for it automatically.

### 4. Leadership — current roles

`leadership-data.jsx` → `window.LEADERSHIP_DATA.roles[]`. These render as the glass-card grid above the events graph:

```js
{
  id: "r5",
  title: "Vice President",
  org: "Some Club",
  term: "2026 — present",
  summary: "What you do there.",
  stat: "120",          // big number bottom-left of the card
  statLabel: "members", // small label bottom-right
}
```

### 5. Leadership — past events

`leadership-data.jsx` → `window.LEADERSHIP_DATA.events[]`:

```js
{
  id: "e7",
  name: "Event Name",
  role: "Lead Organizer",
  club: "Org Name",
  collaborator: "Partner co.",
  speaker: "Speaker Name",
  participants: "180",
  date: "March 2026",
  year: "2026",                          // groups events under a year hub
  tagline: "One-liner shown in the modal subtitle.",
  overview: "Long-form paragraph for the modal left column.",
  outcomes: ["Outcome 1", "Outcome 2"],  // numbered list in the modal
  linkedin: "#",                          // optional URL
  x: 0.5, y: 0.5,                         // (legacy seed; positioning is auto by year)
}
```

`year` controls which hub the event orbits. New years auto-create a new hub.

### 6. Career timeline

`career.jsx` → `window.CAREER_DATA[]`. **Order matters: index 0 is at the top of the spine (latest job).** Each entry:

```js
{
  id: "c6",
  company: "Some Co.",
  position: "Title",
  term: "2026 — present",
  year: "2026",
  location: "Singapore",
  summary: "What you did.",
  achievements: ["Shipped X", "Cut Y by Z%"],
  skills: ["Skill 1", "Skill 2"],   // chips in the modal
  color: "#00f5ff",                  // accent color
}
```

### 7. Tech stack graph

Three arrays in `career.jsx`:

- **`window.SKILL_FIELDS[]`** — hubs (the big circles): `{ id, label, color, angle }`. Same `angle` semantics as `PROJECT_FIELDS`.
- **`window.SKILL_NODES[]`** — leaves: `{ id, name, icon, fields: [...] }`. `icon` is a single character/glyph rendered before the name (emoji, math symbol, or 1–2 letter mark like `"TS"`). Multi-field nodes auto-render the small overlap dot.
- **`window.SKILL_EDGES[]`** — extra dashed cross-skill connections, e.g. `["k8s", "aws"]`. Pure visual hint that two tools are commonly paired.

### 8. Testimonials

`career.jsx` → `window.TESTIMONIALS[]`:

```js
{ name: "Person Name", role: "Title · Company", date: "Mar 2026", text: "Quote..." }
```

The cards auto-loop. Code duplicates the array internally so the scroll is seamless — don't duplicate manually.

---

## Other things to know

### Reveal-on-scroll defaults

Top of `app.jsx`:

```js
const TWEAK_DEFAULTS = {
  revealEnabled: true,        // turn off to disable the float-up effect
  replayReveal: false,        // true = re-fires every time a section enters the viewport
  revealThreshold: 0.12,      // 0..1, how much of the element must be visible to trigger
  revealDuration: 500,        // ms
};
```

### Adding external links safely

When you add `<a target="_blank" href="...">` for an external link (LinkedIn, GitHub, etc.), always include `rel="noopener noreferrer"`. Without it, the linked page can navigate the opener tab via `window.opener` (reverse tabnabbing).

### Contact form

The contact form is **UI only** — submits trigger a `setTimeout` that fades to "sent". No email is actually delivered. If you want real submissions, point it at a free service like [Formspree](https://formspree.io/) or [Web3Forms](https://web3forms.com/), or wire it to a Vercel serverless function. Edit `ContactNode` in `achievements-contact.jsx` (the `send()` function).

### Boot screen

The boot lines in `chrome.jsx` use `dangerouslySetInnerHTML` against a hardcoded array so the inline `<span class='ok'>` markup renders. **Do not** pipe user-supplied or fetched content into that array — it's the one place in the codebase where HTML is injected.

---

## Deploy

Hosted on **Vercel** with auto-deploys from `main`:

```bash
git add .
git commit -m "Update portfolio content"
git push
```

Vercel watches the GitHub repo, runs no build, and serves the static files. Each push to `main` updates production; pushes to other branches create preview deploys at `*-<branch>.vercel.app`.

To redeploy without changes: Vercel dashboard → project → Deployments → Redeploy.

---

## Future hardening (optional)

The current setup compiles JSX in the browser via Babel-standalone — fine for a portfolio, but it forces the page to ship a 2MB+ Babel bundle and rules out a strict Content-Security-Policy (Babel needs `'unsafe-eval'`). If you ever want to tighten it:

1. Migrate to **Vite** or **Next.js**: precompile the JSX, drop the CDN scripts.
2. Add a strict `Content-Security-Policy` header in `vercel.json`.
3. Re-enable Subresource Integrity (SRI) on whatever third-party scripts remain — the dev-build SRI hashes were dropped during the prod-build switch and not recomputed.

None of this is required to run or maintain the site. Edit content, push, ship.
