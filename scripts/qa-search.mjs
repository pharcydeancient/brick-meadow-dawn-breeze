import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "/workspace/screenshots/qa-imagine";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

await page.locator(".model-card").first().click();
await page.waitForTimeout(400);
await page.locator(".prompt-orb").click({ force: true });
await page.waitForTimeout(400);
await page.locator(".probe").click();
await page.waitForTimeout(200);
await page.locator(".investigate-row").filter({ hasText: "Web search" }).click();
await page.waitForTimeout(200);
await page.locator(".prompt-bar input:not([type=file])").fill("What city is xAI headquartered in? One sentence.");
await page.locator(".prompt-bar .send-btn").click();

const started = Date.now();
try {
  await page.waitForFunction(() => {
    const bubbles = [...document.querySelectorAll(".bubble")];
    return bubbles.some((b) => /palo alto|headquarter/i.test(b.textContent || "") && !b.classList.contains("you"));
  }, { timeout: 45000 });
  const text = await page.locator(".bubble:not(.you)").last().innerText();
  await page.screenshot({ path: `${OUT}/11-websearch.png`, animations: "disabled" });
  console.log("PASS websearch", `${Date.now() - started}ms`, text.slice(0, 220));
} catch (e) {
  await page.screenshot({ path: `${OUT}/11-websearch-fail.png`, animations: "disabled" });
  const text = await page.locator(".window-body").innerText().catch(() => "");
  console.log("FAIL websearch", String(e.message || e).slice(0, 200), text.slice(0, 400));
  process.exitCode = 1;
}
await browser.close();
