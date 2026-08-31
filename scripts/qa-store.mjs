import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.getByRole("button", { name: "Settings" }).click();
await page.waitForTimeout(200);
await page.getByText("Store", { exact: true }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: "/workspace/screenshots/t-store.png" });
const n = await page.locator(".theme-tile").count();
const vids = await page.locator(".theme-tile video").count();
console.log({ tiles: n, videos: vids });
if (n) {
  await page.locator(".theme-tile").first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/workspace/screenshots/t-store-open.png" });
  const tracks = await page.locator(".list-row").count();
  console.log({ tracks });
}
await browser.close();
