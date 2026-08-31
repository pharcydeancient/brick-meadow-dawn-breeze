import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(600);
const loc = page.getByRole("button", { name: "Settings" });
console.log("orb count", await loc.count());
await loc.click();
await page.waitForTimeout(400);
await page.screenshot({ path: "/workspace/screenshots/t-settings-room.png" });
await page.getByRole("button", { name: "Models" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/workspace/screenshots/t-models.png" });
const chips = await page.evaluate(() => {
  return [...document.querySelectorAll(".model-chip")].slice(0, 8).map((el) => {
    const s = getComputedStyle(el);
    return {
      text: el.textContent,
      on: el.classList.contains("on"),
      color: s.color,
      bg: s.backgroundColor,
      border: s.borderTopColor,
      shadow: s.boxShadow,
      accent: el.style.getPropertyValue("--chip-accent"),
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
await browser.close();
