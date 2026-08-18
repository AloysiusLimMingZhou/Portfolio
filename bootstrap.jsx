import React from "react";
import { createRoot } from "react-dom/client";
import emailjs from "@emailjs/browser";

// The existing components share a small browser-global interface. Dependencies
// are bundled locally by Vite, so none of these values come from a runtime CDN.
globalThis.React = React;
globalThis.ReactDOM = { createRoot };
globalThis.emailjs = emailjs;

async function bootstrap() {
  await import("./data.jsx");
  await import("./leadership-data.jsx");
  await import("./chrome.jsx");
  await import("./hero-projects.jsx");
  await import("./achievements-contact.jsx");
  await import("./leadership.jsx");
  await import("./career.jsx");
  await import("./detail-modal.jsx");
  await import("./app.jsx");
}

bootstrap().catch(() => {
  const root = document.getElementById("root");
  if (root) root.textContent = "Portfolio failed to initialize. Please refresh the page.";
});
