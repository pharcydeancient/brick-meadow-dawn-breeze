import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const DIR = "/workspace/screenshots/fix3";
mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

const shots = [];
async function shot(name) {
  const p = `${DIR}/${name}.png`;
  await page.screenshot({ path: p, fullPage: false });
  shots.push(name);
  console.log("shot", name);
}

await shot("01-home");

const orb = page.locator(".prompt-orb");
const orbBox = await orb.boundingBox();
const orbStyle = await orb.evaluate((el) => {
  const s = getComputedStyle(el);
  return {
    w: el.getBoundingClientRect().width,
    h: el.getBoundingClientRect().height,
    opacity: s.opacity,
    z: s.zIndex,
    display: s.display,
    visible: el.getClientRects().length > 0,
    label: el.getAttribute("aria-label"),
    away: el.className,
  };
});
console.log("ORB", JSON.stringify({ box: orbBox, ...orbStyle }));

await orb.click({ force: true });
await page.waitForTimeout(120);
await shot("02-prompt-t120");
await page.waitForTimeout(400);
await shot("03-prompt-open");

const seat = await page.locator(".prompt-seat").evaluate((el) => {
  const s = getComputedStyle(el);
  return { opacity: s.opacity, transform: s.transform, className: el.className };
});
console.log("SEAT", JSON.stringify(seat));

const fonts = await page.evaluate(() => {
  const body = getComputedStyle(document.body).fontFamily;
  const card = document.querySelector(".card-name");
  return { body, card: card ? getComputedStyle(card).fontFamily : null };
});
console.log("FONTS", JSON.stringify(fonts));

await page.keyboard.press("Escape");
await page.waitForTimeout(400);
await shot("04-prompt-closed");

const card = page.locator(".card-slot").first();
await card.click();
await page.waitForTimeout(400);
await shot("05-card-view");

const header = await page.locator(".card-view-head").innerText().catch(() => "MISSING");
const hasFiles = header.includes("Files");
const hasHistory = header.includes("History");
const hasBack = await page.locator(".card-back").count();
const titleFont = await page.locator(".card-view-title").evaluate((el) => {
  const s = getComputedStyle(el);
  return { font: s.fontFamily, weight: s.fontWeight, size: s.fontSize, color: s.color, text: el.textContent };
}).catch(() => null);
console.log("CARD HEADER", JSON.stringify({ header, hasFiles, hasHistory, hasBack, titleFont }));

await page.locator(".card-back").click();
await page.waitForTimeout(350);
await shot("06-back-home");

await page.locator(".settings-orb").click();
await page.waitForTimeout(300);
await shot("07-settings-apps");
await page.locator(".alert-tab", { hasText: "Settings" }).click();
await page.waitForTimeout(250);
await shot("08-settings-prefs");
const rows = await page.locator(".row-pills").innerText().catch(() => "MISSING");
console.log("ROWS", rows);

await page.locator(".row-pill").nth(2).click();
await page.waitForTimeout(200);
await shot("09-rows-3");

await page.locator(".alert-dim").click({ force: true }).catch(() => {});
await page.waitForTimeout(200);
await page.locator(".settings-orb").click();
await page.waitForTimeout(250);
await page.getByRole("button", { name: "History" }).click();
await page.waitForTimeout(400);
await shot("10-history");
const sheetClose = await page.locator(".sheet-close").count();
console.log("HISTORY CLOSE", sheetClose);
await page.locator(".sheet-close").click();
await page.waitForTimeout(400);
await shot("11-history-closed");

writeFileSync(`${DIR}/notes.json`, JSON.stringify({ orbStyle, seat, fonts, header, hasFiles, hasHistory, hasBack, titleFont, rows, sheetClose }, null, 2));
await browser.close();
console.log("DONE", shots.length);
