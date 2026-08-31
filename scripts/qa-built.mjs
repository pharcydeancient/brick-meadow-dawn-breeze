import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => console.log("ERR", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("C", m.text()); });
await page.goto("http://127.0.0.1:8081/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const info = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      w: Math.round(b.width),
      h: Math.round(b.height),
      x: Math.round(b.x),
      y: Math.round(b.y),
      display: s.display,
      bg: s.backgroundColor,
      overflow: s.overflow,
    };
  };
  return {
    html: r(document.documentElement),
    body: r(document.body),
    app: r(q("#app") || q("#root")),
    root: r(q(".app-root")),
    env: r(q(".env-root")),
    scene: r(q(".scene")),
    stage: r(q(".stage")),
    win: r(q(".main-window")),
    canvas: r(q(".card-canvas")),
    cards: document.querySelectorAll(".model-card").length,
    text: (document.body.innerText || "").slice(0, 200),
    htmlLen: document.body.innerHTML.length,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "/workspace/screenshots/built-desktop-late.png" });
await browser.close();
