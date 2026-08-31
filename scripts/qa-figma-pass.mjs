import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];

async function shot(page, name) {
  await page.waitForTimeout(500);
  await page.screenshot({ path: `/workspace/screenshots/${name}.png` });
}

async function run(viewport, prefix) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (e) => errors.push(`${prefix} ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${prefix} console ${m.text()}`);
  });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, `${prefix}-home`);

  const metrics = await page.evaluate(() => {
    const win = document.querySelector(".main-window");
    const card = document.querySelector(".model-card");
    const orb = document.querySelector(".prompt-orb");
    const nav = document.querySelector(".leading-ornament");
    const bar = document.querySelector(".window-bar");
    const shadow = document.querySelector(".window-shadow");
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const w = cs(win);
    const c = cs(card);
    const n = cs(nav);
    return {
      windowBg: w?.backgroundImage || w?.backgroundColor,
      windowBlur: w?.backdropFilter || w?.webkitBackdropFilter,
      windowRadius: w?.borderRadius,
      cardName: document.querySelector(".card-name")?.textContent,
      cardColor: c ? cs(document.querySelector(".card-name"))?.color : null,
      cardCount: document.querySelectorAll(".model-card").length,
      navDisplay: n?.display,
      navWidth: n?.width,
      barH: cs(bar)?.height,
      shadow: Boolean(shadow),
      orb: Boolean(orb),
    };
  });
  console.log(prefix, "home", JSON.stringify(metrics));

  await page.click('button[aria-label="Settings"]');
  await page.waitForTimeout(400);
  await shot(page, `${prefix}-settings-room`);

  const alert = await page.evaluate(() => {
    const el = document.querySelector(".alert-card");
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      bg: s.backgroundColor,
      color: s.color,
      radius: s.borderRadius,
      blur: s.backdropFilter || s.webkitBackdropFilter,
    };
  });
  console.log(prefix, "alert", JSON.stringify(alert));

  await page.click("button.alert-tab", { force: true });
  const tabs = page.locator("button.alert-tab");
  const count = await tabs.count();
  for (let i = 0; i < count; i++) {
    const label = ((await tabs.nth(i).textContent()) || `tab${i}`).trim().toLowerCase();
    await tabs.nth(i).click({ force: true });
    await page.waitForTimeout(280);
    await shot(page, `${prefix}-settings-${label}`);
  }

  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  await page.close();
}

await run({ width: 1280, height: 800 }, "f");
await run({ width: 390, height: 844 }, "fm");

console.log("ERRORS", errors);
await browser.close();
if (errors.length) process.exit(1);
