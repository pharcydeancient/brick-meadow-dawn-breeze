import { chromium } from "playwright";
import fs from "fs";

const dir = "/workspace/screenshots";
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text()); });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${dir}/t-home.png`, fullPage: false });

const cards = await page.evaluate(() => {
  const names = [...document.querySelectorAll(".card-name")].map((el) => {
    const s = getComputedStyle(el);
    return { text: el.textContent, size: s.fontSize, color: s.color, weight: s.fontWeight };
  });
  const dots = document.querySelectorAll(".card-dot").length;
  const blooms = document.querySelectorAll(".card-bloom").length;
  const empty = [...document.querySelectorAll(".card-empty")].map((el) => el.textContent);
  const wells = document.querySelectorAll(".card-well").length;
  return { names, dots, blooms, empty, wells, cardCount: document.querySelectorAll(".model-card").length };
});
console.log("CARDS", JSON.stringify(cards, null, 2));

// open settings
await page.click(".settings-orb, [aria-label='Settings'], button.settings-orb", { timeout: 4000 }).catch(() => {});
const orb = await page.$(".settings-orb");
if (orb) await orb.click();
await page.waitForTimeout(400);
const modelsTab = page.getByRole("button", { name: /^Models$/i });
if (await modelsTab.count()) await modelsTab.click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/t-models.png` });

const chips = await page.evaluate(() => {
  return [...document.querySelectorAll(".model-chip")].slice(0, 6).map((el) => {
    const s = getComputedStyle(el);
    return {
      text: el.textContent,
      on: el.classList.contains("on"),
      color: s.color,
      bg: s.backgroundColor,
      border: s.borderColor,
      shadow: s.boxShadow,
      accent: el.style.getPropertyValue("--chip-accent") || getComputedStyle(el).getPropertyValue("--chip-accent"),
    };
  });
});
console.log("CHIPS", JSON.stringify(chips, null, 2));

const alert = await page.evaluate(() => {
  const el = document.querySelector(".alert-card");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height), models: el.classList.contains("models") };
});
console.log("ALERT", alert);

await page.getByRole("button", { name: /^Cancel$/i }).click().catch(() => {});
await page.waitForTimeout(200);

// Imagine
await page.click(".settings-orb");
await page.waitForTimeout(300);
await page.getByRole("button", { name: /^Room$/i }).click().catch(() => {});
await page.waitForTimeout(200);
const imagine = page.getByText("Imagine", { exact: true });
if (await imagine.count()) await imagine.click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${dir}/t-imagine.png` });
const videos = await page.evaluate(() => document.querySelectorAll(".imagine-tile video").length);
console.log("IMAGINE_VIDEOS", videos);

await browser.close();
