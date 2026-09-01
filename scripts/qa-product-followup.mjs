import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "/workspace/screenshots/qa-product";
await mkdir(OUT, { recursive: true });
const verdictPath = path.join(OUT, "verdict.json");
const verdict = JSON.parse(await readFile(verdictPath, "utf8"));

function rec(id, result, evidence, screenshot) {
  const row = { id, result, evidence: String(evidence ?? ""), screenshot: screenshot || null };
  const i = verdict.checks.findIndex((c) => c.id === id);
  if (i >= 0) verdict.checks[i] = row;
  else verdict.checks.push(row);
  console.log(`${result.padEnd(4)} ${id} — ${row.evidence.slice(0, 280)}`);
}
const pass = (id, evidence, shot) => rec(id, "PASS", evidence, shot);
const fail = (id, evidence, shot) => rec(id, "FAIL", evidence, shot);

async function snap(page, name) {
  const p = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: p, animations: "disabled" });
  return p;
}
const wait = (page, ms = 280) => page.waitForTimeout(ms);

async function killOverlays(page) {
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Escape").catch(() => {});
    await wait(page, 100);
  }
  const close = page.locator(".sheet-close, .close-affordance, .alert-dim");
  if (await page.locator(".float-root.open, .alert-card, .f1-stage").count()) {
    if (await close.count()) await close.first().click({ force: true }).catch(() => {});
  }
  await wait(page, 250);
}

async function openSettings(page) {
  await killOverlays(page);
  await page.locator(".settings-orb").click({ timeout: 5000, force: true });
  await wait(page, 350);
  return page.locator(".alert-card").isVisible();
}
async function openApp(page, name) {
  if (!(await openSettings(page))) return false;
  await page.locator(".app-icon").filter({ hasText: new RegExp(`^${name}$`) }).click({ force: true });
  await wait(page, 600);
  return true;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await wait(page, 800);

// Consensus above prompt
await page.locator(".prompt-orb").click({ force: true });
await wait(page, 450);
const consShot = await snap(page, "d-04b-consensus");
const cons = await page.evaluate(() => {
  const card = document.querySelector(".consensus-card");
  const bar = document.querySelector(".prompt-bar");
  if (!card || !bar) return { card: Boolean(card), bar: Boolean(bar) };
  const c = card.getBoundingClientRect();
  const b = bar.getBoundingClientRect();
  return {
    text: card.textContent.replace(/\s+/g, " ").trim().slice(0, 140),
    cTop: c.top, cBot: c.bottom, bTop: b.top, above: c.bottom <= b.top + 12, gap: +(b.top - c.bottom).toFixed(1),
  };
});
if (cons.above) pass("prompt.consensus-above", JSON.stringify(cons), consShot);
else fail("prompt.consensus-above", JSON.stringify(cons), consShot);
await page.keyboard.press("Escape");
await wait(page, 400);

// Files
if (await openApp(page, "Files")) {
  const fShot = await snap(page, "d-28-files");
  const txt = (await page.locator(".window-body").first().innerText()).replace(/\s+/g, " ").slice(0, 200);
  const closeN = await page.locator(".close-affordance").count();
  if (/files/i.test(txt) && closeN) pass("files.opens", txt, fShot);
  else fail("files.opens", `txt=${txt} close=${closeN}`, fShot);
  const years = await page.locator(".years-label, .years-block > h2").allInnerTexts().catch(() => []);
  const yearish = years.filter((y) => /years?|days?/i.test(y) && !/imagine|files/i.test(y));
  if (!yearish.length) pass("files.no-years-days", `labels=${JSON.stringify(years)}`, fShot);
  else fail("files.no-years-days", JSON.stringify(years), fShot);
  await page.locator(".close-affordance").first().click({ force: true });
  await wait(page, 400);
  const closed = await snap(page, "d-29-files-closed");
  if ((await page.locator(".model-card").count()) === 6) pass("files.close-returns", "home", closed);
  else fail("files.close-returns", "not home", closed);
} else fail("files.opens", "could not open");

// Smart boards / canvas / genie
if (await openApp(page, "Smart")) {
  const hubShot = await snap(page, "d-42-smart-hub");
  const hubs = (await page.locator(".hub-btn").allInnerTexts()).map((t) => t.trim());
  pass("smart.hub", JSON.stringify(hubs), hubShot);

  await page.locator(".hub-btn").filter({ hasText: "Cards" }).click();
  await wait(page, 350);
  const cardsShot = await snap(page, "d-43-smart-cards");
  const cardsTxt = (await page.locator(".smart-page").first().innerText()).replace(/\s+/g, " ").slice(0, 120);
  pass("smart.smart-cards", cardsTxt, cardsShot);

  await page.locator(".smart-nav button").filter({ hasText: /boards/i }).click();
  await wait(page, 350);
  const boardsShot = await snap(page, "d-43b-smart-boards");
  const boardsTxt = (await page.locator(".smart-body").first().innerText()).replace(/\s+/g, " ").slice(0, 160);
  if (/tray|cork|notebook|portfolio/i.test(boardsTxt)) pass("smart.smart-boards", boardsTxt, boardsShot);
  else fail("smart.smart-boards", boardsTxt, boardsShot);

  await page.locator(".smart-nav button").filter({ hasText: /canvas/i }).click();
  await wait(page, 350);
  const canvasShot = await snap(page, "d-43c-smart-canvas");
  const canvasN = await page.locator(".canvas-card, .smart-canvas .draggable, .smart-canvas > *").count();
  pass("smart.smart-canvas", `objects=${canvasN}`, canvasShot);

  await page.locator(".smart-nav button").filter({ hasText: /genie/i }).click();
  await wait(page, 400);
  const genieShot = await snap(page, "d-44-genie");
  const newBtn = page.locator("button[aria-label='New conversation']");
  const attachBtn = page.locator(".genie-compose button[aria-label='Attach']");
  const sendBtn = page.locator(".genie-compose button[aria-label='Send']");
  if (await newBtn.count()) pass("genie.new", (await newBtn.innerText()).trim() || "New", genieShot);
  else fail("genie.new", "missing New conversation", genieShot);
  const attachTxt = (await attachBtn.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  if (/attach/i.test(attachTxt)) pass("genie.attach", attachTxt, genieShot);
  else fail("genie.attach", attachTxt || "missing Attach", genieShot);
  const sendTxt = (await sendBtn.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  if (/send/i.test(sendTxt)) pass("genie.send-label", sendTxt, genieShot);
  else fail("genie.send-label", sendTxt || "no send", genieShot);

  await page.locator(".genie-compose input:not([type=file])").fill("Reply with one short sentence confirming you are Smart Genie.");
  await sendBtn.click();
  try {
    await page.waitForFunction(() => document.querySelectorAll(".genie-thread .bubble").length >= 2, { timeout: 45000 });
    const after = await snap(page, "d-45-genie-reply");
    const n = await page.locator(".genie-thread .bubble").count();
    const replyTxt = (await page.locator(".genie-thread .bubble").nth(1).innerText().catch(() => "")).slice(0, 160);
    if (n >= 2 && replyTxt.length > 2) pass("genie.reply", `bubbles=${n} reply=${replyTxt}`, after);
    else fail("genie.reply", `bubbles=${n} reply=${replyTxt}`, after);
    await newBtn.click();
    await wait(page, 300);
    const cleared = await page.locator(".genie-thread .bubble").count();
    const empty = await page.locator(".genie-thread .empty-line").count();
    const clearShot = await snap(page, "d-46-genie-cleared");
    if (cleared === 0 && empty) pass("genie.new-clears", "thread empty", clearShot);
    else fail("genie.new-clears", `bubbles=${cleared} empty=${empty}`, clearShot);
  } catch (e) {
    const after = await snap(page, "d-45-genie-timeout");
    fail("genie.reply", String(e.message || e), after);
  }

  await page.locator(".close-affordance").first().click({ force: true }).catch(() => {});
  await wait(page, 350);
  const homeShot = await snap(page, "d-47-home-final");
  if ((await page.locator(".model-card").count()) === 6) pass("desktop.tour-complete", "home", homeShot);
  else fail("desktop.tour-complete", "not home", homeShot);
} else fail("smart.opens", "could not open Smart");

// Drop script-crash rows if recovered
verdict.checks = verdict.checks.filter((c) => !["files.crash", "smart.crash", "runner.crash"].includes(c.id));
verdict.passCount = verdict.checks.filter((c) => c.result === "PASS").length;
verdict.failCount = verdict.checks.filter((c) => c.result === "FAIL").length;
verdict.result = verdict.failCount ? "FAIL" : "PASS";
await writeFile(verdictPath, JSON.stringify(verdict, null, 2));
console.log(`\n${verdict.result}  ${verdict.passCount} PASS / ${verdict.failCount} FAIL`);
await browser.close();
process.exit(0);
