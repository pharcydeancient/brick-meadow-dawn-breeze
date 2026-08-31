#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const outDir = process.argv[3] || "/workspace/screenshots/review";
mkdirSync(outDir, { recursive: true });

const findings = [];
function note(ok, id, detail) {
  findings.push({ ok, id, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${id}  ${detail}`);
}

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function shot(page, name) {
  const path = `${outDir}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function bodyHasRoomTab(page) {
  const tabs = await page.locator(".alert-tab").allTextContents();
  return tabs.some((t) => /\broom\b/i.test(t.trim()));
}

async function visibleTextHasRoom(page) {
  const text = await page.locator("body").innerText();
  const hits = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => /\broom\b/i.test(l) && !/classroom|groom|bedroom/i.test(l));
  return hits;
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err?.message || err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  note(resp?.ok() ?? false, "load", `status ${resp?.status()}`);
  await page.waitForTimeout(1200);
  await page.locator(".model-card").first().waitFor({ timeout: 15000 });

  await shot(page, "01-home");
  const cards = await page.locator(".model-card").count();
  note(cards >= 1 && cards <= 6, "H-grid", `${cards} cards on home`);
  const plate = await page.locator(".canvas-plate").count();
  note(plate === 1, "D1-plate", `${plate} canvas plate(s)`);
  const workPlate = await page.locator(".canvas-plate.work").count();
  note(workPlate === 0, "D1-home-clear", `work plate count ${workPlate}`);
  const nav = await page.locator(".leading-ornament").isVisible();
  note(nav, "F5-nav", `leading ornament visible=${nav}`);
  const roomHits = await visibleTextHasRoom(page);
  note(roomHits.length === 0, "L1-home", roomHits.length ? roomHits.join(" | ") : "no Room in body");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  note(!overflow, "overflow-home", `horizontalOverflow=${overflow}`);

  await page.locator(".prompt-orb").click();
  await page.waitForTimeout(500);
  await shot(page, "02-prompt");
  const consensus = await page.locator(".consensus-card").isVisible();
  const plus = await page.locator(".prompt-plus").isVisible();
  const probes = await page.locator(".probe").count();
  note(consensus, "P2-consensus", `consensus visible=${consensus}`);
  note(plus, "P4-plus", `plus visible=${plus}`);
  note(probes === 3, "P5-probes", `${probes} investigation probes`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  await page.locator(".settings-orb").click();
  await page.waitForTimeout(400);
  await shot(page, "03-settings-apps");
  note(!(await bodyHasRoomTab(page)), "F6-no-room-tab", `tabs=${(await page.locator(".alert-tab").allTextContents()).join(",")}`);
  const apps = await page.locator(".app-icon").allTextContents();
  note(apps.some((a) => /themes/i.test(a)) && !apps.some((a) => /\broom\b/i.test(a)), "F6-apps", apps.join(","));

  await page.getByRole("button", { name: "Account" }).click();
  await page.waitForTimeout(250);
  await shot(page, "04-settings-account");
  await page.getByRole("button", { name: "Models" }).click();
  await page.waitForTimeout(250);
  await shot(page, "05-settings-models");
  const align = await page.getByText("Align", { exact: true }).count();
  note(align > 0, "H-align", `Align control count ${align}`);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.waitForTimeout(250);
  await shot(page, "06-settings-prefs");
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.waitForTimeout(300);

  await page.locator(".leading-ornament [aria-label='Themes']").click();
  await page.waitForTimeout(700);
  await shot(page, "07-themes");
  const years = await page.locator(".years-label").count();
  note(years > 0, "D4-years", `${years} year groups`);
  await page.getByRole("button", { name: "Store" }).click();
  await page.waitForTimeout(600);
  await shot(page, "08-store");
  const hero = await page.locator(".tv-hero").count();
  note(hero > 0, "D3-tv-hero", `tv-hero count ${hero}`);

  await page.locator(".leading-ornament [aria-label='Imagine']").click();
  await page.waitForTimeout(700);
  await shot(page, "09-imagine");
  const masonry = await page.locator(".imagine-masonry, .imagine-tile").count();
  note(masonry > 0, "D2-imagine", `imagine tiles ${masonry}`);

  await page.locator(".leading-ornament [aria-label='Files']").click();
  await page.waitForTimeout(700);
  await shot(page, "10-files");

  await page.locator(".leading-ornament [aria-label='Smart']").click();
  await page.waitForTimeout(700);
  await shot(page, "11-smart-cards");
  await page.getByRole("button", { name: "Boards" }).click();
  await page.waitForTimeout(600);
  await shot(page, "12-smart-boards");
  const objects = await page.locator(".board-lane.object-notebook, .board-lane.object-portfolio, .board-lane.object-cork, .board-lane.object-tray").count();
  note(objects === 4, "D6-objects", `${objects} physical board objects`);
  await page.getByRole("button", { name: "Canvas" }).click();
  await page.waitForTimeout(500);
  await shot(page, "13-smart-canvas");
  await page.getByRole("button", { name: "Genie" }).click();
  await page.waitForTimeout(500);
  await shot(page, "14-smart-genie");

  await page.locator(".win-close, .close-affordance").first().click().catch(() => {});
  await page.waitForTimeout(400);
  if (await page.locator(".model-card").count() === 0) {
    await page.locator(".leading-ornament [aria-label='Files']").click().catch(() => {});
    await page.waitForTimeout(200);
    await page.keyboard.press("Escape").catch(() => {});
  }
  await page.evaluate(() => {
    const close = document.querySelector(".win-close");
    if (close) close.click();
  });
  await page.waitForTimeout(500);
  if ((await page.locator(".model-card").count()) === 0) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
  }
  await page.locator(".model-card").first().click();
  await page.waitForTimeout(600);
  await shot(page, "15-card-view");
  const clear = await page.locator(".main-window.clear").count();
  const plateInCard = await page.locator(".canvas-plate").count();
  note(clear === 1 && plateInCard === 0, "card-view-untint", `clear=${clear} plate=${plateInCard}`);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await mobile.waitForTimeout(1200);
  await mobile.locator(".model-card").first().waitFor({ timeout: 15000 });
  await shot(mobile, "16-mobile-home");
  const mobileNav = await mobile.locator(".leading-ornament").isVisible();
  note(mobileNav, "F5-mobile-nav", `mobile leading ornament visible=${mobileNav}`);
  await mobile.locator(".prompt-orb").click();
  await mobile.waitForTimeout(500);
  await shot(mobile, "17-mobile-prompt");
  await mobile.close();

  note(errors.length === 0, "console", errors.length ? errors.slice(0, 6).join(" || ") : "no page/console errors");

  const failed = findings.filter((f) => !f.ok);
  const verdict = {
    ok: failed.length === 0,
    failed: failed.length,
    passed: findings.filter((f) => f.ok).length,
    findings,
    errors,
    outDir,
  };
  writeFileSync(`${outDir}/verdict.json`, JSON.stringify(verdict, null, 2));
  console.log(JSON.stringify({ ok: verdict.ok, passed: verdict.passed, failed: verdict.failed }, null, 2));
  process.exitCode = verdict.ok ? 0 : 1;
} catch (err) {
  console.error(String(err?.message || err));
  process.exitCode = 1;
} finally {
  await browser.close();
}
