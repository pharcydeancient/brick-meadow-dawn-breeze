import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.removeItem("collider-spatial-v7"));
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(700);

async function shot(name) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/workspace/screenshots/${name}.png` });
}

const tint = await page.evaluate(() => {
  const w = getComputedStyle(document.querySelector(".main-window"));
  return {
    bg: w.backgroundColor,
    blur: w.backdropFilter || w.webkitBackdropFilter,
    cards: document.querySelectorAll(".model-card").length,
    names: [...document.querySelectorAll(".card-name")].map((n) => n.textContent).slice(0, 3),
  };
});
console.log("home tint", JSON.stringify(tint));
await shot("map-home");

await page.click('button[aria-label="Files"]');
await page.waitForTimeout(500);
const files = await page.evaluate(() => ({
  years: [...document.querySelectorAll(".years-label")].map((n) => n.textContent),
  tiles: document.querySelectorAll(".years-tile").length,
  search: Boolean(document.querySelector(".pin-search")),
}));
console.log("files", JSON.stringify(files));
await shot("map-files");

const tile = page.locator(".years-tile").first();
if (await tile.count()) {
  await tile.click();
  await page.waitForTimeout(400);
  await shot("map-file-preview");
  await page.click(".f1-stage .win-x");
  await page.waitForTimeout(250);
}

await page.click('button[aria-label="Imagine"]');
await page.waitForTimeout(500);
const imagine = await page.evaluate(() => ({
  search: Boolean(document.querySelector(".pin-search")),
  tabs: [...document.querySelectorAll(".imagine-tabs button")].map((n) => n.textContent),
  tiles: document.querySelectorAll(".imagine-tile").length,
}));
console.log("imagine", JSON.stringify(imagine));
await shot("map-imagine");
const pin = page.locator(".imagine-tile").first();
if (await pin.count()) {
  await pin.click();
  await page.waitForTimeout(400);
  await shot("map-imagine-preview");
  await page.click(".f1-stage .win-x");
  await page.waitForTimeout(250);
}

await page.click('button[aria-label="Themes"]');
await page.waitForTimeout(500);
const themes = await page.evaluate(() => ({
  years: [...document.querySelectorAll(".years-label")].map((n) => n.textContent),
  tiles: document.querySelectorAll(".years-tile").length,
}));
console.log("themes", JSON.stringify(themes));
await shot("map-themes");

await page.locator("button.chip", { hasText: "Store" }).click();
await page.waitForTimeout(500);
const store = await page.evaluate(() => ({
  hero: Boolean(document.querySelector(".tv-hero")),
  shelves: [...document.querySelectorAll(".tv-row h3")].map((n) => n.textContent),
  cards: document.querySelectorAll(".tv-card").length,
}));
console.log("store", JSON.stringify(store));
await shot("map-store");
const hero = page.locator(".tv-hero");
if (await hero.count()) {
  await hero.click({ force: true });
  await page.waitForTimeout(400);
  await shot("map-store-preview");
  await page.click(".f1-stage .win-x");
  await page.waitForTimeout(250);
}

await page.click('button[aria-label="Smart"]');
await page.waitForTimeout(500);
const smart = await page.evaluate(() => ({
  nav: [...document.querySelectorAll(".smart-nav button")].map((n) => n.textContent).filter(Boolean),
  cards: document.querySelectorAll(".mem-card").length,
}));
console.log("smart cards", JSON.stringify(smart));
await shot("map-smart-cards");

await page.locator(".smart-nav button", { hasText: "Boards" }).click();
await page.waitForTimeout(400);
await shot("map-smart-boards");
await page.locator(".smart-nav button", { hasText: "Canvas" }).click();
await page.waitForTimeout(400);
await shot("map-smart-canvas");
await page.locator(".smart-nav button", { hasText: "Genie" }).click();
await page.waitForTimeout(400);
await shot("map-smart-genie");

await page.click('button[aria-label="Settings"]');
await page.waitForTimeout(350);
await shot("map-settings-room");

console.log("ERRORS", errors);
await browser.close();
if (errors.length) process.exit(1);
