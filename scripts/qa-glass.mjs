import { chromium } from "playwright";
import fs from "fs";

const dir = "/workspace/screenshots";
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function shot(viewport, name) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${dir}/${name}-home.png` });

  const stats = await page.evaluate(() => {
    const win = document.querySelector(".main-window");
    const cards = [...document.querySelectorAll(".model-card")];
    const ws = win ? getComputedStyle(win) : null;
    const rects = cards.map((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const name = el.querySelector(".card-name")?.textContent;
      return {
        name,
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: s.backgroundColor,
        filter: s.backdropFilter || s.webkitBackdropFilter,
        transform: s.transform,
        accent: s.getPropertyValue("--card-accent").trim(),
        overflow: s.overflow,
      };
    });
    const winRect = win?.getBoundingClientRect();
    const clips = rects.filter((c) => {
      if (!winRect) return false;
      return c.x < winRect.x - 1 || c.y < winRect.y - 1 || c.x + c.w > winRect.x + winRect.width + 1 || c.y + c.h > winRect.y + winRect.height + 1;
    });
    return {
      window: ws
        ? {
            bg: ws.backgroundColor,
            backdrop: ws.backdropFilter,
            overflow: ws.overflow,
          }
        : null,
      cardCount: cards.length,
      rects,
      clips,
    };
  });
  console.log(name, JSON.stringify(stats, null, 2));

  const first = page.locator(".model-card").first();
  if (await first.count()) {
    const before = await first.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, t: getComputedStyle(el).transform };
    });
    await first.hover();
    await page.waitForTimeout(250);
    const after = await first.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, t: getComputedStyle(el).transform };
    });
    console.log(name, "HOVER", { before, after, grew: after.w > before.w + 0.5 || after.h > before.h + 0.5 });
    await page.screenshot({ path: `${dir}/${name}-hover.png` });
  }

  await page.click("nav.leading-ornament .tab-btn, [aria-label='Imagine']").catch(() => {});
  const imagineBtn = page.locator("[aria-label='Imagine']");
  if (await imagineBtn.count()) {
    await imagineBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${dir}/${name}-imagine.png` });
  }

  await page.close();
}

await shot({ width: 390, height: 844 }, "gfix-m");
await shot({ width: 1280, height: 800 }, "gfix-d");
await browser.close();
