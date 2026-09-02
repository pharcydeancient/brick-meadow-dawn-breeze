import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "/workspace/screenshots/qa-lines";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);

const long = Array.from({ length: 8 }, (_, i) => [
  { id: `t-u-${i}`, role: "user", text: `Turn ${i + 1}: what should sit on the canvas?`, createdAt: Date.now() - (8 - i) * 60_000 },
  { id: `t-a-${i}`, role: "assistant", text: `Turn ${i + 1}: cards over a tinted wallpaper. The thread is the same one you open in detail.`, createdAt: Date.now() - (8 - i) * 60_000 + 1000 },
]).flat();

await page.evaluate((msgs) => {
  const id = document.querySelector(".model-card") && [...document.querySelectorAll(".model-card .card-name")].map((n) => n.textContent);
  const storeKey = Object.keys(localStorage).find((k) => k.includes("collider") || k.includes("aether") || k.includes("spatial"));
  console.log("store", storeKey, id);
}, long);

const store = await page.evaluate(() => {
  const keys = Object.keys(localStorage);
  return keys.map((k) => [k, localStorage.getItem(k)?.slice(0, 80)]);
});
console.log("ls", store);

await page.evaluate((msgs) => {
  const rawKey = Object.keys(localStorage).find((k) => /collider|aether|spatial/i.test(k));
  if (!rawKey) return;
  const parsed = JSON.parse(localStorage.getItem(rawKey) || "{}");
  const state = parsed.state ?? parsed;
  const ids = Object.keys(state.conversations || {});
  const first = (state.enabledModelIds && state.enabledModelIds[0]) || ids[0];
  if (first && state.conversations[first]) {
    state.conversations[first].messages = msgs;
    localStorage.setItem(rawKey, JSON.stringify(parsed));
  }
}, long);

await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/home.png`, animations: "disabled" });

const preview = await page.evaluate(() => {
  const log = document.querySelector(".card-log");
  if (!log) return null;
  const you = document.querySelector(".card-mini.you");
  const them = document.querySelector(".card-mini.them");
  const ys = you ? getComputedStyle(you) : null;
  const ts = them ? getComputedStyle(them) : null;
  return {
    scrollHeight: log.scrollHeight,
    clientHeight: log.clientHeight,
    canScroll: log.scrollHeight - log.clientHeight > 12,
    count: log.querySelectorAll(".card-mini").length,
    you: ys ? { color: ys.color, size: ys.fontSize, weight: ys.fontWeight, family: ys.fontFamily } : null,
    them: ts ? { color: ts.color, size: ts.fontSize, weight: ts.fontWeight, family: ts.fontFamily } : null,
  };
});

await page.locator(".card-log").first().evaluate((el) => {
  el.scrollTop = 0;
});
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/home-scrolled-top.png`, animations: "disabled" });

await page.locator(".card-name").first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/card.png`, animations: "disabled" });

const thread = await page.evaluate(() => {
  const el = document.querySelector(".card-view-thread");
  if (!el) return null;
  return {
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    canScroll: el.scrollHeight - el.clientHeight > 12,
    count: el.querySelectorAll(".line").length,
  };
});

console.log(JSON.stringify({ preview, thread }, null, 2));
await browser.close();
