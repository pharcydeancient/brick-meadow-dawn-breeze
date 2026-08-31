import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({ path: "/workspace/screenshots/t-home.png" });
const blur = await page.evaluate(() => {
  const el = document.querySelector(".model-card");
  if (!el) return null;
  const s = getComputedStyle(el);
  return { blur: s.backdropFilter || s.webkitBackdropFilter, name: document.querySelector(".card-name")?.textContent };
});
console.log(blur);
await browser.close();
