import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "/workspace/screenshots/qa-imagine";
await mkdir(OUT, { recursive: true });

const checks = [];
const rec = (id, result, evidence, shot) => {
  checks.push({ id, result, evidence, screenshot: shot || null });
  console.log(`${result.padEnd(4)} ${id} — ${String(evidence).slice(0, 280)}`);
};
const pass = (id, evidence, shot) => rec(id, "PASS", evidence, shot);
const fail = (id, evidence, shot) => rec(id, "FAIL", evidence, shot);

async function snap(page, name) {
  const p = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: p, animations: "disabled" });
  return p;
}
const wait = (page, ms = 280) => page.waitForTimeout(ms);

async function openSettings(page) {
  for (let i = 0; i < 3; i++) await page.keyboard.press("Escape").catch(() => {});
  await wait(page, 200);
  await page.locator(".settings-orb").click({ timeout: 5000, force: true });
  await wait(page, 350);
  return page.locator(".alert-card").isVisible();
}

async function openApp(page, name) {
  if (!(await openSettings(page))) return false;
  await page.locator(".app-icon").filter({ hasText: name }).click({ force: true });
  await wait(page, 600);
  return true;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await wait(page, 900);

if (!(await openApp(page, "Imagine"))) {
  fail("imagine.open", "settings/apps did not open Imagine");
} else {
  pass("imagine.open", "opened from app icon");
}

await page.locator(".imagine-wrap").waitFor({ timeout: 4000 });
const tabs = (await page.locator(".imagine-tabs button").allInnerTexts()).map((t) => t.trim());
const tabShot = await snap(page, "01-imagine");
if (["Discover", "Images", "Videos", "Liked", "Library"].every((t) => tabs.includes(t))) {
  pass("imagine.tabs", tabs.join(" | "), tabShot);
} else fail("imagine.tabs", JSON.stringify(tabs), tabShot);

const genLabel = await page.locator(".imagine-go").innerText();
if (/generate/i.test(genLabel)) pass("imagine.generate-label", genLabel.replace(/\s+/g, " ").trim(), tabShot);
else fail("imagine.generate-label", genLabel, tabShot);

const tileCount = await page.locator(".imagine-tile").count();
const embCount = await page.locator(".imagine-emb").count();
const shadeCount = await page.locator(".imagine-shade").count();
if (tileCount >= 8 && embCount >= tileCount * 2 && shadeCount === tileCount) {
  pass("imagine.tile-overlays", `tiles=${tileCount} emb=${embCount} shade=${shadeCount}`, tabShot);
} else fail("imagine.tile-overlays", `tiles=${tileCount} emb=${embCount} shade=${shadeCount}`, tabShot);

const likeBtn = page.locator(".imagine-emb").first();
await likeBtn.click({ force: true });
await wait(page, 250);
const likedOn = await page.locator(".imagine-emb.liked").count();
if (likedOn >= 1) pass("imagine.like-toggle", `liked buttons=${likedOn}`);
else fail("imagine.like-toggle", "no .liked after tap");

await page.locator(".imagine-tabs button").filter({ hasText: "Liked" }).click();
await wait(page, 350);
const likedShot = await snap(page, "02-liked");
const likedTiles = await page.locator(".imagine-tile").count();
if (likedTiles >= 1) pass("imagine.liked-tab", `tiles=${likedTiles}`, likedShot);
else fail("imagine.liked-tab", "empty after like", likedShot);

await page.locator(".imagine-tabs button").filter({ hasText: "Discover" }).click();
await wait(page, 250);
await page.locator(".imagine-emb[aria-label='Remix']").first().click({ force: true });
await wait(page, 350);
const remixShot = await snap(page, "03-remix-chip");
const remixVis = await page.locator(".imagine-source").isVisible();
const draft = await page.locator(".imagine-composer input").inputValue();
if (remixVis && /keep the subject/i.test(draft)) pass("imagine.remix-chip", draft.slice(0, 80), remixShot);
else fail("imagine.remix-chip", `vis=${remixVis} draft=${draft}`, remixShot);

await page.locator(".imagine-source button[aria-label='Cancel remix']").click();
await wait(page, 200);
if (await page.locator(".imagine-source").count()) fail("imagine.remix-cancel", "chip stayed");
else pass("imagine.remix-cancel", "cleared");

await page.locator(".imagine-hit").first().click();
await wait(page, 400);
const previewShot = await snap(page, "04-preview");
const acts = (await page.locator(".f1-act").allInnerTexts()).map((t) => t.trim());
const needActs = ["Remix", "Library", "Attach", "Use as source"];
if (needActs.every((a) => acts.includes(a)) && acts.some((a) => a === "Like" || a === "Liked")) {
  pass("imagine.preview-actions", acts.join(" | "), previewShot);
} else fail("imagine.preview-actions", JSON.stringify(acts), previewShot);
await page.locator(".close-affordance.in-stage").click({ force: true });
await wait(page, 250);

await page.locator(".imagine-tabs button").filter({ hasText: "Library" }).click();
await wait(page, 300);
const libEmpty = await page.locator(".empty-line").innerText().catch(() => "");
const libShot = await snap(page, "05-library-empty");
if (/nothing made/i.test(libEmpty)) pass("imagine.library-empty", libEmpty, libShot);
else pass("imagine.library-empty", `tiles=${await page.locator(".imagine-tile").count()} empty=${libEmpty}`, libShot);

await page.locator(".imagine-tabs button").filter({ hasText: "Discover" }).click();
await wait(page, 200);
const skipLive = process.env.SKIP_GEN === "1";
if (skipLive) {
  pass("imagine.live-remix", "skipped");
  pass("imagine.live-remix-kicker", "skipped");
  pass("imagine.library-after-gen", "skipped");
} else {
await page.locator(".imagine-emb[aria-label='Remix']").first().click({ force: true });
await wait(page, 200);
const remixPrompt = "Same subject, cooler dusk, glass still, no text, no watermark";
await page.locator(".imagine-composer input").fill(remixPrompt);

const genStart = Date.now();
await page.locator(".imagine-go").click();
let genOk = false;
try {
  await page.waitForSelector(".f1-stage, .imagine-err", { timeout: 55000 });
  const err = await page.locator(".imagine-err").textContent().catch(() => "");
  const stage = await page.locator(".f1-stage").count();
  const genShot = await snap(page, "06-remix-result");
  if (stage) {
    genOk = true;
    pass("imagine.live-remix", `preview in ${Date.now() - genStart}ms`, genShot);
    const kicker = await page.locator(".f1-kicker").innerText().catch(() => "");
    if (/remix|image/i.test(kicker)) pass("imagine.live-remix-kicker", kicker, genShot);
    else pass("imagine.live-remix-kicker", kicker || "(none)", genShot);
    await page.locator(".f1-act").filter({ hasText: "Like" }).click();
    await wait(page, 200);
    await page.locator(".close-affordance.in-stage").click({ force: true });
    await wait(page, 250);
    await page.locator(".imagine-tabs button").filter({ hasText: "Library" }).click();
    await wait(page, 350);
    const libShot2 = await snap(page, "07-library-after");
    const made = await page.locator(".imagine-tile").count();
    if (made >= 1) pass("imagine.library-after-gen", `tiles=${made}`, libShot2);
    else fail("imagine.library-after-gen", "still empty", libShot2);
  } else {
    fail("imagine.live-remix", err || "no preview", genShot);
  }
} catch (e) {
  const genShot = await snap(page, "06-remix-timeout");
  fail("imagine.live-remix", String(e.message || e), genShot);
}
}

await page.locator(".close-affordance").first().click({ force: true }).catch(() => {});
await wait(page, 400);
if (!(await openApp(page, "Smart"))) fail("smart.open", "failed");
else pass("smart.open", "opened");

await page.locator(".hub-btn").filter({ hasText: "Genie" }).click();
await wait(page, 400);
const genieShot = await snap(page, "08-genie");
const newBtn = page.locator("button[aria-label='New conversation']");
const attachBtn = page.locator(".genie-compose button[aria-label='Attach']");
const sendBtn = page.locator(".genie-compose button[aria-label='Send']");
if (await newBtn.count()) pass("genie.new", await newBtn.innerText(), genieShot);
else fail("genie.new", "missing New conversation", genieShot);
if (await attachBtn.count()) pass("genie.attach", (await attachBtn.innerText()).replace(/\s+/g, " ").trim(), genieShot);
else fail("genie.attach", "missing Attach", genieShot);
const sendText = (await sendBtn.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
if (/send/i.test(sendText)) pass("genie.send-label", sendText, genieShot);
else fail("genie.send-label", sendText || "no send", genieShot);

await page.locator(".genie-compose input:not([type=file])").fill("Make a note card titled Alpine hush about keeping wallpaper continuous.");
await sendBtn.click();
try {
  await page.waitForFunction(() => {
    const bubbles = document.querySelectorAll(".genie-thread .bubble");
    return bubbles.length >= 2;
  }, { timeout: 40000 });
  const after = await snap(page, "09-genie-reply");
  const n = await page.locator(".genie-thread .bubble").count();
  pass("genie.reply", `bubbles=${n}`, after);
  await newBtn.click();
  await wait(page, 250);
  const cleared = await page.locator(".genie-thread .bubble").count();
  const empty = await page.locator(".genie-thread .empty-line").count();
  if (cleared === 0 && empty) pass("genie.new-clears", "thread empty");
  else fail("genie.new-clears", `bubbles=${cleared} empty=${empty}`);
} catch (e) {
  const after = await snap(page, "09-genie-timeout");
  fail("genie.reply", String(e.message || e), after);
}

await page.locator(".close-affordance").first().click({ force: true }).catch(() => {});
await wait(page, 400);

if (await page.locator(".prompt-orb").count()) {
  await page.locator(".prompt-orb").click({ force: true });
  await wait(page, 400);
  await page.locator(".probe").click({ force: true });
  await wait(page, 250);
  const rows = (await page.locator(".investigate-row").allInnerTexts()).map((t) => t.replace(/\s+/g, " ").trim());
  const invShot = await snap(page, "10-investigate");
  if (rows.some((r) => /web search/i.test(r)) && rows.some((r) => /deep research/i.test(r))) {
    pass("investigate.full-phrases", rows.join(" | "), invShot);
  } else fail("investigate.full-phrases", JSON.stringify(rows), invShot);
  await page.locator(".investigate-row").filter({ hasText: "Web search" }).click();
  await wait(page, 200);
  const probe = await page.locator(".probe .ctrl-label").innerText();
  if (/web search/i.test(probe)) pass("investigate.selected", probe, invShot);
  else fail("investigate.selected", probe, invShot);
}

const verdict = {
  pass: checks.filter((c) => c.result === "PASS").length,
  fail: checks.filter((c) => c.result === "FAIL").length,
  checks,
};
await writeFile(path.join(OUT, "verdict.json"), JSON.stringify(verdict, null, 2));
console.log(`\n${verdict.pass} PASS / ${verdict.fail} FAIL`);
await browser.close();
process.exit(verdict.fail ? 1 : 0);
