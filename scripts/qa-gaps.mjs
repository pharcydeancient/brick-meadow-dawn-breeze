import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "/workspace/screenshots/qa-next";
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);

await page.getByRole("button", { name: "Settings" }).click();
await page.waitForTimeout(200);
await page.getByRole("button", { name: "Files" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/files.png`, animations: "disabled" });
const filesCopy = await page.locator(".gallery-wrap").innerText();
const yearsDays = /Years|Days|2024|2025|2026/.test(filesCopy);
const kinds = await page.locator(".files-kinds button").allInnerTexts();
const tiles = await page.locator(".files-tile").count();

await page.locator(".close-affordance").click();
await page.waitForTimeout(250);
await page.getByRole("button", { name: "Settings" }).click();
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Smart" }).click();
await page.waitForTimeout(350);
await page.screenshot({ path: `${OUT}/smart-hub.png`, animations: "disabled" });
await page.getByRole("button", { name: "Smart Cards" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/smart-cards.png`, animations: "disabled" });
const cardTiles = await page.locator(".mem-card").count();
await page.getByRole("button", { name: "Genie" }).click();
await page.waitForTimeout(300);
const dock = await page.locator(".genie-dock").count();
await page.screenshot({ path: `${OUT}/smart-cards-dock.png`, animations: "disabled" });
await page.locator(".smart-nav").getByRole("button", { name: "Boards", exact: true }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/smart-boards.png`, animations: "disabled" });
await page.locator(".smart-nav").getByRole("button", { name: "Canvas", exact: true }).click();
await page.waitForTimeout(300);
const scenes = await page.locator(".canvas-scenes button").allInnerTexts();
await page.screenshot({ path: `${OUT}/smart-canvas.png`, animations: "disabled" });

console.log(JSON.stringify({ yearsDays, kinds, tiles, cardTiles, dock, scenes }, null, 2));
await browser.close();
