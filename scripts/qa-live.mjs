import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("/workspace/screenshots/live", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const fails = [];
const ok = (m) => console.log("OK  ", m);
const fail = (m) => {
  fails.push(m);
  console.log("FAIL", m);
};

const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => fail("pageerror " + e.message));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(900);

await page.screenshot({ path: "/workspace/screenshots/live/01-home.png" });

if (await page.locator(".leading-ornament, .nav-seat").count()) fail("side nav still in DOM");
else ok("no side nav");

const xCount = await page.locator(".win-x").count();
if (xCount) fail("giant win-x still in DOM: " + xCount);
else ok("no giant X in DOM");

if (await page.getByText(/^Cancel$/i).count()) fail("Cancel label present");
else ok("no Cancel");

const cards = await page.locator(".model-card").count();
if (cards < 1) fail("no cards");
else ok(cards + " cards");

await page.locator(".settings-orb").click();
await page.waitForTimeout(400);
if (!(await page.locator(".alert-card").isVisible())) fail("settings did not open");
else ok("settings opened");
await page.screenshot({ path: "/workspace/screenshots/live/02-settings-apps.png" });

await page.locator(".alert-tab").filter({ hasText: "Models" }).click();
await page.waitForTimeout(400);
const chipInfo = await page.evaluate(() => {
  const chip = document.querySelector(".model-chip.on") || document.querySelector(".model-chip");
  if (!chip) return null;
  const s = getComputedStyle(chip);
  return {
    bg: s.backgroundColor,
    img: s.backgroundImage.slice(0, 80),
    hasLight: Boolean(chip.querySelector(".light-core")),
    hasEdge: Boolean(chip.querySelector(".chip-edge")),
    hasEmber: Boolean(chip.querySelector(".ember")),
  };
});
console.log("chip", chipInfo);
if (!chipInfo?.hasLight || !chipInfo?.hasEdge) fail("chip missing light/edge");
if (chipInfo?.img && chipInfo.img.includes("radial-gradient") && chipInfo.img.includes("130%")) {
  fail("chip still uses filled radial swatch");
}
if (chipInfo?.hasEmber) fail("old ember fill still present");
else ok("light-toggle chips");
await page.screenshot({ path: "/workspace/screenshots/live/03-models.png" });

const hBefore = await page.evaluate(() => document.querySelector(".alert-card")?.getBoundingClientRect().height);
await page.locator(".cat-row").click();
await page.waitForTimeout(250);
const overlayPos = await page.evaluate(() => {
  const el = document.querySelector(".cat-overlay");
  if (!el) return null;
  return { pos: getComputedStyle(el).position, count: 1 };
});
const hAfter = await page.evaluate(() => document.querySelector(".alert-card")?.getBoundingClientRect().height);
console.log("cat", overlayPos, hBefore, hAfter);
if (!overlayPos) fail("category overlay missing");
if (overlayPos?.pos !== "fixed") fail("category not fixed portal, pos=" + overlayPos?.pos);
if (Math.abs((hAfter ?? 0) - (hBefore ?? 0)) > 8) fail("category reflowed " + hBefore + " -> " + hAfter);
else ok("category overlays, no reflow");
await page.screenshot({ path: "/workspace/screenshots/live/04-cat.png" });
await page.locator(".cat-option").filter({ hasText: "General" }).click();
await page.waitForTimeout(200);

const onBefore = await page.locator(".model-chip.on").count();
await page.locator(".model-chip").first().click();
await page.waitForTimeout(450);
const onAfter = await page.locator(".model-chip.on").count();
if (onBefore === onAfter) fail("chip did not toggle " + onBefore);
else ok("chip toggled " + onBefore + " -> " + onAfter);

await page.locator(".alert-dim").click({ position: { x: 8, y: 8 } });
await page.waitForTimeout(250);
if (await page.locator(".alert-card").count()) fail("dim did not dismiss");
else ok("dim dismisses");

async function openApp(name) {
  await page.locator(".settings-orb").click();
  await page.waitForTimeout(280);
  await page.locator(".app-icon").filter({ hasText: name }).click();
  await page.waitForTimeout(500);
}

await openApp("Files");
const filesX = await page.locator(".win-x").count();
if (filesX) fail("Files still has giant X");
else ok("Files no giant X");
if (!(await page.locator(".gallery-wrap, .surface-label").count())) fail("Files did not open");
else ok("Files opened");
await page.screenshot({ path: "/workspace/screenshots/live/05-files.png" });
await page.locator(".close-affordance").click();
await page.waitForTimeout(400);

await openApp("History");
if (!(await page.locator(".float-window").count())) fail("History overlay missing");
else ok("History overlay");
if (await page.locator(".float-window .win-x, .float-head .win-close").count()) fail("History still has close X");
else ok("History no X");
const hist = await page.evaluate(() => {
  const sheet = document.querySelector(".float-window");
  const scrim = document.querySelector(".sheet-scrim");
  if (!sheet || !scrim) return null;
  return {
    sheet: getComputedStyle(sheet).backgroundColor,
    scrim: getComputedStyle(scrim).backgroundColor,
    filter: getComputedStyle(scrim).backdropFilter,
  };
});
console.log("history material", hist);
await page.screenshot({ path: "/workspace/screenshots/live/06-history.png" });
await page.locator(".sheet-scrim").click({ position: { x: 16, y: 16 } });
await page.waitForTimeout(400);

await openApp("Imagine");
if (!(await page.locator(".imagine-masonry, .imagine-wrap, .pin-search").count())) fail("Imagine did not open");
else ok("Imagine opened");
await page.screenshot({ path: "/workspace/screenshots/live/07-imagine.png" });
await page.locator(".close-affordance").click();
await page.waitForTimeout(400);

await openApp("Smart");
const hub = await page.locator(".hub-btn").count();
if (hub < 4) fail("Smart hub missing full-width buttons, got " + hub);
else ok("Smart hub " + hub);
await page.screenshot({ path: "/workspace/screenshots/live/08-smart-hub.png" });
await page.locator(".hub-btn").filter({ hasText: "Smart Cards" }).click();
await page.waitForTimeout(400);
if (!(await page.locator(".mem-card, .mem-grid, .smart-page").count())) fail("Smart Cards did not open");
else ok("Smart Cards opened");
await page.screenshot({ path: "/workspace/screenshots/live/09-smart-cards.png" });
await page.locator(".close-affordance").click();
await page.waitForTimeout(400);

const card = page.locator(".model-card").first();
await card.click();
await page.waitForTimeout(500);
if (!(await page.locator(".card-view").count())) fail("card tap failed");
else ok("card view");
if (await page.locator(".win-x").count()) fail("card view giant X");
else ok("card view no giant X");
await page.screenshot({ path: "/workspace/screenshots/live/10-card.png" });
await page.getByRole("button", { name: /^History$/i }).click();
await page.waitForTimeout(400);
if (!(await page.locator(".float-window").count())) fail("card History missing");
else ok("card History overlay");
await page.locator(".sheet-scrim").click({ position: { x: 16, y: 16 } });
await page.waitForTimeout(300);
await page.locator(".close-affordance").click();
await page.waitForTimeout(400);

const orb = page.locator(".prompt-orb");
if (!(await orb.count())) fail("no prompt orb");
else {
  await orb.click();
  await page.waitForTimeout(400);
  if (!(await page.locator(".prompt-seat.open").count())) fail("prompt did not open");
  else ok("prompt opened");
  await page.screenshot({ path: "/workspace/screenshots/live/11-prompt.png" });
}

await page.screenshot({ path: "/workspace/screenshots/live/12-final-home.png" });
await browser.close();
console.log("\nRESULT", fails.length ? "FAIL " + fails.length : "PASS");
for (const f of fails) console.log(" -", f);
if (fails.length) process.exit(1);
