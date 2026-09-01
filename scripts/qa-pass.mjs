import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

await mkdir("/workspace/screenshots/pass", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const fails = [];
function fail(msg) {
  fails.push(msg);
  console.log("FAIL", msg);
}
function ok(msg) {
  console.log("OK  ", msg);
}

async function run(name, viewport) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (e) => fail(`${name} pageerror ${e.message}`));
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const hit = async (x, y) =>
    page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return { tag: "none" };
      return {
        tag: el.tagName,
        cls: el.className?.toString?.().slice(0, 80),
        id: el.id,
        aria: el.getAttribute?.("aria-label"),
      };
    }, [x, y]);

  const homeShot = `/workspace/screenshots/pass/${name}-home.png`;
  await page.screenshot({ path: homeShot });

  const nav = await page.locator(".leading-ornament, .nav-seat").count();
  if (nav > 0) fail(`${name} leading nav still in DOM (${nav})`);
  else ok(`${name} no leading nav`);

  const cards = await page.locator(".model-card").count();
  if (cards < 1) fail(`${name} no model cards`);
  else ok(`${name} ${cards} cards`);

  const settingsBtn = page.locator(".settings-orb");
  if (!(await settingsBtn.count())) fail(`${name} no settings orb`);
  await settingsBtn.click({ timeout: 4000 });
  await page.waitForTimeout(400);

  const alert = page.locator(".alert-card");
  if (!(await alert.isVisible())) fail(`${name} settings did not open`);
  else ok(`${name} settings opened`);

  const cancel = await page.locator(".alert-cancel").count();
  if (cancel) fail(`${name} Cancel still present`);
  else ok(`${name} no Cancel`);

  const paneBg = await page.evaluate(() => {
    const el = document.querySelector(".alert-card");
    if (!el) return null;
    return getComputedStyle(el).backgroundColor;
  });
  console.log(`${name} alert bg`, paneBg);

  await page.screenshot({ path: `/workspace/screenshots/pass/${name}-settings-apps.png` });

  const modelsTab = page.locator(".alert-tab").filter({ hasText: "Models" });
  await modelsTab.click();
  await page.waitForTimeout(350);
  if (!(await page.locator(".model-chip").count())) fail(`${name} no model chips`);
  else ok(`${name} model chips`);

  const chipPaint = await page.evaluate(() => {
    const chip = document.querySelector(".model-chip.on") || document.querySelector(".model-chip");
    if (!chip) return null;
    const s = getComputedStyle(chip);
    const ember = chip.querySelector(".ember");
    return {
      bg: s.backgroundImage + " | " + s.backgroundColor,
      shadow: s.boxShadow,
      inline: chip.getAttribute("style"),
      ember: Boolean(ember),
    };
  });
  console.log(`${name} chip`, chipPaint);
  if (chipPaint?.inline?.includes("background:")) fail(`${name} chip still has inline background`);
  if (!chipPaint?.ember) fail(`${name} chip missing ember`);
  else ok(`${name} ember chip, no inline fill`);

  const hBefore = await page.evaluate(() => document.querySelector(".alert-card")?.getBoundingClientRect().height);
  await page.locator(".cat-row").click();
  await page.waitForTimeout(250);
  const overlay = await page.locator(".cat-overlay").count();
  const hAfter = await page.evaluate(() => document.querySelector(".alert-card")?.getBoundingClientRect().height);
  if (!overlay) fail(`${name} category overlay missing`);
  if (Math.abs((hAfter ?? 0) - (hBefore ?? 0)) > 8) fail(`${name} category reflowed pane ${hBefore} -> ${hAfter}`);
  else ok(`${name} category overlays (${hBefore} -> ${hAfter})`);
  await page.screenshot({ path: `/workspace/screenshots/pass/${name}-models-cat.png` });
  await page.locator(".cat-option").filter({ hasText: "Image" }).click();
  await page.waitForTimeout(250);
  if (await page.locator(".cat-overlay").count()) fail(`${name} category menu stayed open`);
  await page.locator(".cat-row").click();
  await page.locator(".cat-option").filter({ hasText: "General" }).click();
  await page.waitForTimeout(200);

  const onBefore = await page.locator(".model-chip.on").count();
  const chip = page.locator(".model-chip").first();
  await chip.click();
  await page.waitForTimeout(450);
  const onAfter = await page.locator(".model-chip.on").count();
  if (onBefore === onAfter) fail(`${name} chip click did not toggle (${onBefore})`);
  else ok(`${name} chip toggled ${onBefore} -> ${onAfter}`);
  await page.screenshot({ path: `/workspace/screenshots/pass/${name}-models.png` });

  await page.locator(".alert-tab").filter({ hasText: "Account" }).click();
  await page.waitForTimeout(200);
  if (!(await page.locator(".alert-action").count())) fail(`${name} account empty`);
  else ok(`${name} account tab`);

  await page.locator(".alert-tab").filter({ hasText: "Settings" }).click();
  await page.waitForTimeout(200);
  if (!(await page.getByText("Tuck after send").count())) fail(`${name} settings prefs missing`);
  else ok(`${name} settings prefs`);

  await page.locator(".alert-dim").click({ position: { x: 8, y: 8 } });
  await page.waitForTimeout(250);
  if (await page.locator(".alert-card").count()) fail(`${name} dim did not dismiss`);
  else ok(`${name} dim dismisses`);

  await settingsBtn.click();
  await page.waitForTimeout(300);
  await page.locator(".app-icon").filter({ hasText: "Files" }).click();
  await page.waitForTimeout(500);
  const files = await page.evaluate(() => document.querySelector(".surface-label, .years-label, .gallery-wrap")?.textContent || document.body.innerText.slice(0, 120));
  console.log(`${name} files surface`, files?.slice(0, 80));
  if (!(await page.locator(".win-x, .gallery-wrap, .surface-label").count())) fail(`${name} Files app did not open`);
  else ok(`${name} Files opened`);
  await page.screenshot({ path: `/workspace/screenshots/pass/${name}-files.png` });

  await page.locator(".win-x").first().click();
  await page.waitForTimeout(400);

  await settingsBtn.click();
  await page.waitForTimeout(250);
  await page.locator(".app-icon").filter({ hasText: "History" }).click();
  await page.waitForTimeout(450);
  if (!(await page.locator(".float-window").count())) fail(`${name} History overlay missing`);
  else ok(`${name} History overlay`);
  const hist = await page.evaluate(() => {
    const sheet = document.querySelector(".float-window");
    const scrim = document.querySelector(".sheet-scrim");
    if (!sheet || !scrim) return null;
    const ss = getComputedStyle(sheet);
    const sc = getComputedStyle(scrim);
    return { sheetBg: ss.backgroundColor, scrimBg: sc.backgroundColor, scrimFilter: sc.backdropFilter };
  });
  console.log(`${name} history material`, hist);
  await page.screenshot({ path: `/workspace/screenshots/pass/${name}-history.png` });
  await page.locator(".sheet-scrim").click({ position: { x: 12, y: 12 } });
  await page.waitForTimeout(400);

  await settingsBtn.click();
  await page.waitForTimeout(250);
  await page.locator(".app-icon").filter({ hasText: "Imagine" }).click();
  await page.waitForTimeout(500);
  if (!(await page.locator(".pin-search, .imagine-masonry, .gallery-wrap").count())) fail(`${name} Imagine did not open`);
  else ok(`${name} Imagine opened`);
  await page.screenshot({ path: `/workspace/screenshots/pass/${name}-imagine.png` });
  await page.locator(".win-x").first().click();
  await page.waitForTimeout(400);

  const card = page.locator(".model-card").first();
  if (await card.count()) {
    await card.click();
    await page.waitForTimeout(500);
    const inCard = await page.locator(".card-view").count();
    if (!inCard) fail(`${name} card tap did not open card view`);
    else ok(`${name} card view`);
    await page.screenshot({ path: `/workspace/screenshots/pass/${name}-card.png` });
    const histBtn = page.getByRole("button", { name: /^History$/i });
    if (await histBtn.count()) {
      await histBtn.click();
      await page.waitForTimeout(400);
      if (!(await page.locator(".float-window").count())) fail(`${name} card History missing`);
      else ok(`${name} card History overlay`);
      await page.locator(".sheet-scrim").click({ position: { x: 12, y: 12 } });
      await page.waitForTimeout(300);
    }
    await page.locator(".win-x").first().click();
    await page.waitForTimeout(400);
  }

  const orb = page.locator(".prompt-orb");
  if (await orb.count()) {
    await orb.click();
    await page.waitForTimeout(400);
    if (!(await page.locator(".prompt-seat.open").count())) fail(`${name} prompt did not open`);
    else ok(`${name} prompt opened`);
    await page.screenshot({ path: `/workspace/screenshots/pass/${name}-prompt.png` });
    const probe = page.locator(".probe");
    if (await probe.count()) {
      await probe.click();
      await page.waitForTimeout(250);
      const tray = await page.locator(".investigate-tray").count();
      if (!tray) fail(`${name} investigation tray did not open`);
      else ok(`${name} investigation tray`);
      const research = page.getByRole("button", { name: /^Research$/i });
      if (await research.count()) {
        await research.click();
        await page.waitForTimeout(200);
        ok(`${name} Research selected`);
      } else fail(`${name} Research row missing`);
    }
    await page.screenshot({ path: `/workspace/screenshots/pass/${name}-investigate.png` });
  } else fail(`${name} no prompt orb`);

  console.log(`${name} center hit`, await hit(viewport.width / 2, viewport.height / 2));
  await page.close();
}

await run("d", { width: 1280, height: 800 });
await run("m", { width: 390, height: 844 });

await browser.close();
console.log("\nRESULT", fails.length ? `FAIL ${fails.length}` : "PASS");
for (const f of fails) console.log(" -", f);
if (fails.length) process.exit(1);
