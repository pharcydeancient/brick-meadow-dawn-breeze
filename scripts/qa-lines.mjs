import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "/workspace/screenshots/qa-lines";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/home.png`, animations: "disabled" });

const bubbleCount = await page.locator(".bubble").count();
const coloredMini = await page.evaluate(() => {
  const you = document.querySelector(".card-mini.you");
  if (!you) return null;
  const s = getComputedStyle(you);
  return { bg: s.backgroundColor, radius: s.borderRadius, font: s.fontFamily, color: s.color };
});
const themMini = await page.evaluate(() => {
  const el = document.querySelector(".card-mini.them");
  if (!el) return null;
  const s = getComputedStyle(el);
  return { bg: s.backgroundColor, radius: s.borderRadius, font: s.fontFamily, color: s.color };
});

await page.locator(".model-card").first().click();
await page.waitForTimeout(450);
await page.screenshot({ path: `${OUT}/card.png`, animations: "disabled" });
const lineYou = await page.evaluate(() => {
  const el = document.querySelector(".line.you p");
  if (!el) return null;
  const s = getComputedStyle(el);
  return { bg: getComputedStyle(el.parentElement).backgroundColor, font: s.fontFamily, color: s.color, size: s.fontSize };
});
const lineThem = await page.evaluate(() => {
  const el = document.querySelector(".line.them p");
  if (!el) return null;
  const s = getComputedStyle(el);
  return { bg: getComputedStyle(el.parentElement).backgroundColor, font: s.fontFamily, color: s.color, size: s.fontSize };
});
const who = await page.locator(".line-who").allInnerTexts();

console.log(JSON.stringify({ bubbleCount, coloredMini, themMini, lineYou, lineThem, who }, null, 2));
await browser.close();
