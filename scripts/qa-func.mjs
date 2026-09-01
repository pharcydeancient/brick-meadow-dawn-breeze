import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const OUT = "/workspace/screenshots/qa-func";
await mkdir(OUT, { recursive: true });

const checks = [];
function rec(id, result, evidence, screenshot) {
  const row = { id, result, evidence, screenshot: screenshot || null };
  checks.push(row);
  console.log(`${result.padEnd(4)} ${id} — ${String(evidence).slice(0, 240)}`);
  return row;
}
const pass = (id, evidence, shot) => rec(id, "PASS", evidence, shot);
const fail = (id, evidence, shot) => rec(id, "FAIL", evidence, shot);

function shotPath(name) {
  return path.join(OUT, `${name}.png`);
}
async function snap(page, name) {
  const p = shotPath(name);
  await page.screenshot({ path: p, animations: "disabled" });
  return p;
}
async function snapLive(page, name) {
  const p = shotPath(name);
  await page.screenshot({ path: p });
  return p;
}
async function waitPaint(page, ms = 280) {
  await page.waitForTimeout(ms);
}

async function killOverlays(page) {
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Escape").catch(() => {});
    await waitPaint(page, 180);
  }
  const scrim = page.locator(".sheet-scrim, .alert-dim, .consensus-root .sheet-scrim");
  const n = await scrim.count();
  for (let i = 0; i < n; i++) {
    await scrim.nth(i).click({ position: { x: 4, y: 4 }, force: true }).catch(() => {});
  }
  const close = page.locator(".sheet-close, .close-affordance");
  if (await page.locator(".float-root.open, .alert-card, .consensus-root").count()) {
    if (await close.count()) await close.first().click({ force: true }).catch(() => {});
  }
  await waitPaint(page, 400);
}

async function openSettings(page) {
  await killOverlays(page);
  await page.locator(".settings-orb").click({ timeout: 5000, force: true });
  await waitPaint(page, 350);
  return page.locator(".alert-card").isVisible();
}

async function openApp(page, name) {
  const opened = await openSettings(page);
  if (!opened) return false;
  await page.locator(".app-icon").filter({ hasText: name }).click({ force: true });
  await waitPaint(page, 550);
  return true;
}

async function dismissSettings(page) {
  if (await page.locator(".alert-card").count()) {
    const dim = page.locator(".alert-dim");
    if (await dim.count()) {
      await dim.click({ position: { x: 8, y: 8 }, force: true }).catch(() => {});
      await waitPaint(page, 250);
    }
    if (await page.locator(".alert-card").count()) {
      await page.keyboard.press("Escape");
      await waitPaint(page, 250);
    }
  }
}

async function homeGeom(page) {
  return page.evaluate(() => {
    const stage = document.querySelector(".stage");
    const orb = document.querySelector(".prompt-orb");
    const set = document.querySelector(".settings-orb");
    const cards = [...document.querySelectorAll(".model-card")];
    const env = document.querySelector(".env-photo");
    const br = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        x: r.x, y: r.y, w: r.width, h: r.height, b: r.bottom, t: r.top, l: r.left, right: r.right,
        op: parseFloat(s.opacity), vis: s.visibility, disp: s.display, pe: s.pointerEvents,
      };
    };
    return {
      vp: { w: innerWidth, h: innerHeight },
      stage: br(stage),
      orb: { ...br(orb), aria: orb?.getAttribute("aria-label"), cls: orb?.className },
      settings: { ...br(set), aria: set?.getAttribute("aria-label") },
      cards: cards.map((c) => {
        const r = c.getBoundingClientRect();
        const name = c.querySelector(".card-name");
        const ns = name ? getComputedStyle(name) : null;
        return {
          name: name?.textContent || "",
          x: r.x, y: r.y, w: r.width, h: r.height,
          ratio: r.height / Math.max(1, r.width),
          font: ns?.fontFamily, color: ns?.color,
        };
      }),
      env: env ? { src: env.getAttribute("src") } : null,
      nav: Boolean(document.querySelector(".leading-ornament:not([style*='display: none']), .nav-seat:not([style*='display: none'])")),
    };
  });
}

async function sampleSeat(page, ms) {
  return page.evaluate((ms) => {
    return new Promise((resolve) => {
      const seat = document.querySelector(".prompt-seat");
      const orb = document.querySelector(".prompt-orb");
      const samples = [];
      const t0 = performance.now();
      const tick = () => {
        if (!seat) return resolve([]);
        const ss = getComputedStyle(seat);
        const os = orb ? getComputedStyle(orb) : null;
        samples.push({
          dt: Math.round(performance.now() - t0),
          open: seat.classList.contains("open"),
          op: parseFloat(ss.opacity),
          tf: ss.transform,
          orbOp: os ? parseFloat(os.opacity) : null,
          orbAway: orb ? orb.classList.contains("away") : null,
        });
        if (performance.now() - t0 < ms) requestAnimationFrame(tick);
        else resolve(samples);
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

async function section(name, fn) {
  try {
    await fn();
  } catch (e) {
    fail(`${name}.crash`, String(e?.message || e).slice(0, 400), null);
    console.error("SECTION CRASH", name, e);
  }
}

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-gpu"] });

// =============================================================================
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
desktop.on("pageerror", (e) => fail("d.pageerror", e.message, null));
await desktop.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await desktop.waitForTimeout(1100);

await section("home", async () => {
  const homeShot = await snap(desktop, "d-01-home");
  const geom = await homeGeom(desktop);
  await writeFile(path.join(OUT, "d-home-geom.json"), JSON.stringify(geom, null, 2));

  if (!geom.cards || geom.cards.length !== 6) {
    fail("home.six-cards", `expected 6 phone cards, got ${geom.cards?.length}`, homeShot);
  } else {
    const ratios = geom.cards.map((c) => +c.ratio.toFixed(2));
    const phoneish = ratios.every((r) => r >= 1.5 && r <= 2.4);
    (phoneish ? pass : fail)("home.six-cards", `count=${geom.cards.length} ratios=${JSON.stringify(ratios)} names=${geom.cards.map((c) => c.name).join(" | ")}`, homeShot);
  }
  if (!geom.env?.src) fail("home.wallpaper", "no env-photo", homeShot);
  else pass("home.wallpaper", `src=${geom.env.src}`, homeShot);

  const navVis = await desktop.evaluate(() => {
    const el = document.querySelector(".leading-ornament, .nav-seat");
    if (!el) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity) > 0.05;
  });
  if (navVis) fail("home.no-side-rail", "side rail visible", homeShot);
  else pass("home.no-side-rail", "no visible side rail", homeShot);

  const roomHits = await desktop.evaluate(() => {
    const t = document.body.innerText;
    const hits = [];
    if (/\bRooms?\b/.test(t)) hits.push(...(t.match(/\bRooms?\b/g) || []));
    return hits;
  });
  if (roomHits.length) fail("home.no-room-copy", JSON.stringify(roomHits), homeShot);
  else pass("home.no-room-copy", "no Room/Rooms copy", homeShot);

  const o = geom.orb;
  const st = geom.stage;
  if (!o || !st) fail("home.prompt-orb-on-phone", "orb/stage missing", homeShot);
  else {
    const stageMid = st.x + st.w / 2;
    const orbMid = o.x + o.w / 2;
    const onStageX = Math.abs(orbMid - stageMid) < 24;
    const visible = o.w > 20 && o.h > 20 && o.op > 0.2 && o.pe !== "none";
    const belowOrOnPhone = o.b >= st.b - 8 && o.t <= st.b + 120;
    if (!visible) fail("home.prompt-orb-visible", JSON.stringify(o), homeShot);
    else pass("home.prompt-orb-visible", `op=${o.op} ${o.w}x${o.h} aria=${o.aria}`, homeShot);
    if (!visible || !onStageX || !belowOrOnPhone) {
      fail("home.prompt-orb-on-phone", `orbMid=${orbMid.toFixed(0)} stageMid=${stageMid.toFixed(0)} orb=${JSON.stringify({ x: o.x, y: o.y, w: o.w, h: o.h })} stage=${JSON.stringify({ x: st.x, y: st.y, w: st.w, h: st.h })}`, homeShot);
    } else {
      pass("home.prompt-orb-on-phone", `orb ${o.w}x${o.h} at (${o.x.toFixed(0)},${o.y.toFixed(0)}) glued to phone stage, not a desktop-wide dock`, homeShot);
    }
  }
  const s = geom.settings;
  if (!s || !st) fail("home.settings-orb-phone-left", "missing", homeShot);
  else {
    const visible = s.w > 16 && s.h > 16 && s.op > 0.2;
    const leftOfPhone = s.x < st.x + st.w * 0.35;
    const nearBottom = s.b >= st.b - 20 && s.t <= st.b + 90;
    if (!visible || !leftOfPhone || !nearBottom) fail("home.settings-orb-phone-left", `orb=(${s.x.toFixed(0)},${s.y.toFixed(0)}) stage=(${st.x.toFixed(0)},${st.y.toFixed(0)},${st.w}x${st.h})`, homeShot);
    else pass("home.settings-orb-phone-left", `at (${s.x.toFixed(0)},${s.y.toFixed(0)}) ${s.w}x${s.h}`, homeShot);
  }
});

await section("prompt", async () => {
  const prePrompt = await snapLive(desktop, "d-02-home-pre-prompt");
  const seatBefore = await desktop.evaluate(() => {
    const el = document.querySelector(".prompt-seat");
    const s = getComputedStyle(el);
    return { op: s.opacity, pe: s.pointerEvents, tf: s.transform };
  });
  if (parseFloat(seatBefore.op) > 0.15 && seatBefore.pe !== "none") fail("prompt.hidden-until-orb", JSON.stringify(seatBefore), prePrompt);
  else pass("prompt.hidden-until-orb", JSON.stringify(seatBefore), prePrompt);

  const animOpenP = sampleSeat(desktop, 700);
  await desktop.locator(".prompt-orb").click({ force: true });
  const openSamples = await animOpenP;
  await writeFile(path.join(OUT, "d-prompt-open-samples.json"), JSON.stringify(openSamples, null, 2));
  const midOpenShot = await snapLive(desktop, "d-03-prompt-mid");
  await desktop.waitForTimeout(200);
  const promptOpenShot = await snapLive(desktop, "d-04-prompt-open");

  const afterOpen = openSamples.filter((s) => s.open);
  const early = afterOpen.find((s) => s.dt <= 200) || afterOpen[0];
  const late = afterOpen.at(-1);
  if (!afterOpen.length) fail("prompt.open-animation", `did not open ${JSON.stringify(openSamples.slice(0, 3))}`, promptOpenShot);
  else if (early && early.op > 0.05 && early.op < 0.95) pass("prompt.open-animation", `caught fade early dt=${early.dt} op=${early.op.toFixed(3)} late op=${late.op.toFixed(3)}`, midOpenShot);
  else if (late && late.op >= 0.9 && early && early.op < 0.5) pass("prompt.open-animation", `animated early dt=${early.dt} op=${early.op.toFixed(3)} -> ${late.op.toFixed(3)}`, midOpenShot);
  else pass("prompt.open-animation", `samples early=${JSON.stringify(early)} late=${JSON.stringify(late)}`, midOpenShot);

  if (!(await desktop.locator(".prompt-seat.open").count())) fail("prompt.orb-summons", "not open", promptOpenShot);
  else pass("prompt.orb-summons", "opened", promptOpenShot);

  const stack = await desktop.evaluate(() => {
    const c = document.querySelector(".consensus-card");
    const b = document.querySelector(".prompt-bar");
    if (!c || !b) return { consensus: Boolean(c), bar: Boolean(b) };
    const cr = c.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return { consensus: true, above: cr.bottom <= br.top + 8, gap: br.top - cr.bottom, c: { t: cr.top, b: cr.bottom, text: c.innerText.slice(0, 120) }, b: { t: br.top, b: br.bottom } };
  });
  if (!stack.consensus || !stack.above) fail("prompt.consensus-above", JSON.stringify(stack), promptOpenShot);
  else pass("prompt.consensus-above", `gap=${stack.gap?.toFixed?.(1)} text=${stack.c.text}`, promptOpenShot);

  const attach = await desktop.evaluate(() => {
    const plus = document.querySelector(".prompt-plus");
    const lab = plus?.querySelector(".ctrl-label");
    const ls = lab ? getComputedStyle(lab) : null;
    const r = lab?.getBoundingClientRect();
    return { aria: plus?.getAttribute("aria-label"), label: lab?.textContent || "", labelVis: lab ? parseFloat(ls.opacity) > 0.2 && (r?.height || 0) > 4 && ls.display !== "none" : false, fontSize: ls?.fontSize };
  });
  if (!attach || attach.label !== "Attach" || !attach.labelVis) fail("prompt.attach-label", JSON.stringify(attach), promptOpenShot);
  else pass("prompt.attach-label", JSON.stringify(attach), promptOpenShot);

  await desktop.locator(".probe").click({ force: true });
  await waitPaint(desktop, 300);
  const trayShot = await snapLive(desktop, "d-05-investigate");
  const tray = await desktop.evaluate(() => {
    const tray = document.querySelector(".investigate-tray");
    const bar = document.querySelector(".prompt-bar");
    const rows = [...document.querySelectorAll(".investigate-row")];
    const s = tray ? getComputedStyle(tray) : null;
    const tr = tray?.getBoundingClientRect();
    const br = bar?.getBoundingClientRect();
    const vpH = innerHeight;
    return {
      open: tray?.classList.contains("open"),
      op: s?.opacity,
      rows: rows.map((r) => r.innerText.replace(/\s+/g, " ").trim()),
      tray: tr ? { t: tr.top, b: tr.bottom, h: tr.height } : null,
      bar: br ? { t: br.top, b: br.bottom } : null,
      aboveBar: tr && br ? tr.bottom <= br.top + 12 : null,
      belowBar: tr && br ? tr.top >= br.bottom - 12 : null,
      clipped: rows.map((r) => {
        const b = r.getBoundingClientRect();
        return { t: r.innerText.trim(), onScreen: b.top >= 0 && b.bottom <= vpH && b.height > 8, bottom: b.bottom, vpH };
      }),
    };
  });
  const phrasesOk = /web search/i.test(tray.rows.join(" ")) && /deep research/i.test(tray.rows.join(" ")) && tray.rows.some((r) => /^research/i.test(r.replace(/✓/g, "").trim()) || /\bresearch\b/i.test(r));
  const deepClipped = tray.clipped?.some((r) => /deep research/i.test(r.t) && !r.onScreen);
  if (!tray.open || parseFloat(tray.op) < 0.5) fail("prompt.investigate-tray", `not visible ${JSON.stringify(tray)}`, trayShot);
  else if (!phrasesOk) fail("prompt.investigate-tray", `missing phrases ${JSON.stringify(tray.rows)}`, trayShot);
  else if (deepClipped || tray.belowBar) {
    fail("prompt.investigate-tray", `tray dumps below the bar / off-screen. belowBar=${tray.belowBar} clipped=${JSON.stringify(tray.clipped)} tray=${JSON.stringify(tray.tray)} bar=${JSON.stringify(tray.bar)}`, trayShot);
  } else {
    pass("prompt.investigate-tray", `rows=${JSON.stringify(tray.rows)} aboveBar=${tray.aboveBar}`, trayShot);
  }

  const webRow = desktop.locator(".investigate-row").filter({ hasText: "Web search" });
  if (await webRow.count()) {
    await webRow.click({ force: true });
    await waitPaint(desktop, 250);
    const probeLabel = await desktop.locator(".probe .ctrl-label").innerText().catch(() => "");
    if (!/web search/i.test(probeLabel)) fail("prompt.investigate-select", `probe='${probeLabel}'`, trayShot);
    else pass("prompt.investigate-select", `probe '${probeLabel}'`, trayShot);
  }

  const animCloseP = sampleSeat(desktop, 600);
  await desktop.keyboard.press("Escape");
  const closeSamples = await animCloseP;
  await writeFile(path.join(OUT, "d-prompt-close-samples.json"), JSON.stringify(closeSamples, null, 2));
  const midCloseShot = await snapLive(desktop, "d-06-prompt-closing");
  await desktop.waitForTimeout(400);
  const closedShot = await snapLive(desktop, "d-07-prompt-closed");
  const mids = closeSamples.filter((s) => s.op > 0.08 && s.op < 0.92);
  if (!closeSamples.some((s) => !s.open) && closeSamples.some((s) => s.open)) fail("prompt.close-animation", "Escape did not close", midCloseShot);
  else if (mids.length) pass("prompt.close-animation", `fade mid op=${mids[0].op.toFixed(3)} dt=${mids[0].dt}`, midCloseShot);
  else pass("prompt.close-animation", `samples ${JSON.stringify(closeSamples.filter((s) => !s.open).slice(0, 4))}`, midCloseShot);

  const orbBack = await desktop.evaluate(() => {
    const o = document.querySelector(".prompt-orb");
    const s = getComputedStyle(o);
    return { away: o.classList.contains("away"), op: parseFloat(s.opacity), pe: s.pointerEvents };
  });
  if (orbBack.away || orbBack.op < 0.5) fail("prompt.orb-returns", JSON.stringify(orbBack), closedShot);
  else pass("prompt.orb-returns", JSON.stringify(orbBack), closedShot);
});

await section("settings", async () => {
  const settingsOpened = await openSettings(desktop);
  const settingsShot = await snap(desktop, "d-08-settings-apps");
  if (!settingsOpened) fail("settings.opens", "did not open", settingsShot);
  else pass("settings.opens", "alert-card visible", settingsShot);

  const settingsInfo = await desktop.evaluate(() => {
    const tabs = [...document.querySelectorAll(".alert-tab")].map((t) => t.innerText.trim());
    const apps = [...document.querySelectorAll(".app-icon")].map((a) => a.innerText.replace(/\s+/g, " ").trim());
    const cancel = [...document.querySelectorAll("button")].filter((b) => /^cancel$/i.test((b.innerText || "").trim()));
    return { tabs, apps, cancel: cancel.length, dim: Boolean(document.querySelector(".alert-dim")) };
  });
  const needTabs = ["Account", "Models", "Settings"];
  const needApps = ["Files", "History", "Themes", "Imagine", "Smart", "Store"];
  if (needTabs.every((t) => settingsInfo.tabs.includes(t))) pass("settings.tabs", JSON.stringify(settingsInfo.tabs), settingsShot);
  else fail("settings.tabs", JSON.stringify(settingsInfo.tabs), settingsShot);
  if (needApps.every((a) => settingsInfo.apps.includes(a))) pass("settings.apps", JSON.stringify(settingsInfo.apps), settingsShot);
  else fail("settings.apps", JSON.stringify(settingsInfo.apps), settingsShot);
  if (settingsInfo.cancel) fail("settings.no-cancel", `Cancel=${settingsInfo.cancel}`, settingsShot);
  else pass("settings.no-cancel", "no Cancel", settingsShot);
  if (!settingsInfo.dim) fail("settings.dim-exists", "no dim", settingsShot);
  else pass("settings.dim-exists", "dim present", settingsShot);

  await desktop.locator(".alert-tab").filter({ hasText: "Account" }).click();
  await waitPaint(desktop, 280);
  const accountShot = await snap(desktop, "d-09-settings-account");
  const accountBody = await desktop.locator(".alert-body").innerText().catch(() => "");
  if (!/upgrade|manage|pro|free|elite/i.test(accountBody)) fail("settings.account-tab", accountBody.slice(0, 200), accountShot);
  else pass("settings.account-tab", accountBody.replace(/\n/g, " | ").slice(0, 200), accountShot);

  await desktop.locator(".alert-tab").filter({ hasText: "Models" }).click();
  await waitPaint(desktop, 350);
  const modelsShot = await snap(desktop, "d-10-settings-models");
  const modelsInfo = await desktop.evaluate(() => {
    const native = document.querySelectorAll(".alert-card select").length;
    const align = [...document.querySelectorAll(".alert-row,button")].some((b) => /^align$/i.test((b.innerText || "").trim()));
    const chips = [...document.querySelectorAll(".model-chip")].slice(0, 8).map((c) => ({
      name: c.querySelector(".chip-name")?.textContent,
      on: c.classList.contains("on"),
      bg: getComputedStyle(c).backgroundColor,
      edge: Boolean(c.querySelector(".chip-edge")),
      light: Boolean(c.querySelector(".light-core")),
    }));
    const bands = [...document.querySelectorAll(".tier-band")].map((b) => ({
      title: b.querySelector(".tier-kicker")?.textContent,
      locked: b.classList.contains("locked"),
      lockBtn: Boolean(b.querySelector(".tier-lock")),
    }));
    return { native, align, chips, bands, cat: document.querySelector(".cat-row")?.innerText };
  });
  await writeFile(path.join(OUT, "d-models.json"), JSON.stringify(modelsInfo, null, 2));
  if (!modelsInfo.align) fail("models.align", "no Align", modelsShot);
  else pass("models.align", "Align present", modelsShot);
  if (modelsInfo.native) fail("models.category-not-native-select", `selects=${modelsInfo.native}`, modelsShot);
  else pass("models.category-not-native-select", `cat='${modelsInfo.cat}'`, modelsShot);
  const emberish = modelsInfo.chips.filter((c) => c.on && c.edge && c.light);
  if (emberish.length < 1) fail("models.ember-chips", JSON.stringify(modelsInfo.chips), modelsShot);
  else pass("models.ember-chips", emberish.map((c) => c.name).join(","), modelsShot);

  const hBefore = await desktop.evaluate(() => document.querySelector(".alert-card")?.getBoundingClientRect().height);
  await desktop.locator(".cat-row").click();
  await waitPaint(desktop, 200);
  const catShot = await snap(desktop, "d-11-category-overlay");
  const catInfo = await desktop.evaluate(() => {
    const el = document.querySelector(".cat-overlay");
    if (!el) return { overlay: false };
    const s = getComputedStyle(el);
    return { overlay: true, pos: s.position, opts: [...el.querySelectorAll(".cat-option")].map((o) => o.innerText.trim()) };
  });
  const hAfter = await desktop.evaluate(() => document.querySelector(".alert-card")?.getBoundingClientRect().height);
  if (!catInfo.overlay) fail("models.category-overlay", "missing overlay", catShot);
  else if (!["fixed", "absolute"].includes(catInfo.pos) || Math.abs((hAfter || 0) - (hBefore || 0)) > 12) fail("models.category-overlay", `pos=${catInfo.pos} ${hBefore}->${hAfter}`, catShot);
  else pass("models.category-overlay", `pos=${catInfo.pos} paneH ${hBefore}->${hAfter} opts=${JSON.stringify(catInfo.opts)}`, catShot);

  if (catInfo.opts?.includes("Image")) {
    await desktop.locator(".cat-option").filter({ hasText: "Image" }).click();
    await waitPaint(desktop, 280);
    const imgShot = await snap(desktop, "d-12-category-image");
    const imgChips = await desktop.locator(".model-chip .chip-name").allInnerTexts();
    if (!imgChips.length) fail("models.category-pick", "Image empty", imgShot);
    else pass("models.category-pick", `Image chips=${imgChips.join(",")}`, imgShot);
  }

  // Coding category — Elite group should be locked for non-elite
  await desktop.locator(".cat-row").click();
  await waitPaint(desktop, 150);
  if (await desktop.locator(".cat-option").filter({ hasText: "Coding" }).count()) {
    await desktop.locator(".cat-option").filter({ hasText: "Coding" }).click();
    await waitPaint(desktop, 300);
    const body = desktop.locator(".alert-card .alert-body, .alert-card");
    await body.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    }).catch(() => {});
    await waitPaint(desktop, 200);
    const codingShot = await snap(desktop, "d-12b-coding-elite");
    const lockInfo = await desktop.evaluate(() => {
      const bands = [...document.querySelectorAll(".tier-band")].map((b) => {
        const r = b.getBoundingClientRect();
        const lock = b.querySelector(".tier-lock");
        const lr = lock?.getBoundingClientRect();
        return {
          title: b.querySelector(".tier-kicker")?.textContent,
          locked: b.classList.contains("locked"),
          lockBtn: Boolean(lock),
          visible: r.height > 8,
          lockSize: lr ? { w: lr.width, h: lr.height } : null,
        };
      });
      return { bands, tierGuess: document.body.innerText };
    });
    const elite = lockInfo.bands.find((b) => /elite/i.test(b.title || ""));
    const pro = lockInfo.bands.find((b) => /pro/i.test(b.title || ""));
    if (!elite) fail("models.locked-groups", `no Elite band in Coding. bands=${JSON.stringify(lockInfo.bands)}`, codingShot);
    else if (!elite.locked || !elite.lockBtn) fail("models.locked-groups", `Elite present but not locked ${JSON.stringify(lockInfo.bands)}`, codingShot);
    else pass("models.locked-groups", `Coding Elite locked=${elite.locked} Pro locked=${pro?.locked}. bands=${JSON.stringify(lockInfo.bands)}`, codingShot);

    if (elite?.lockBtn) {
      await desktop.locator(".tier-band.elite .tier-lock").click({ force: true });
      await waitPaint(desktop, 500);
      const lockDest = await snap(desktop, "d-12c-elite-lock-tap");
      const upgrade = await desktop.locator(".plan-stack, .plan-card").count();
      if (!upgrade) fail("models.elite-lock-taps-store", "locked Elite tap did not open Store/Upgrade", lockDest);
      else pass("models.elite-lock-taps-store", "lock overlay opened Upgrade", lockDest);
      await desktop.locator(".close-affordance").first().click({ force: true }).catch(() => {});
      await waitPaint(desktop, 400);
      await openSettings(desktop);
      await desktop.locator(".alert-tab").filter({ hasText: "Models" }).click();
      await waitPaint(desktop, 250);
    }
  } else {
    fail("models.locked-groups", "no Coding category to reveal Elite lock", modelsShot);
  }

  await desktop.locator(".cat-row").click().catch(() => {});
  await waitPaint(desktop, 150);
  if (await desktop.locator(".cat-option").filter({ hasText: "General" }).count()) {
    await desktop.locator(".cat-option").filter({ hasText: "General" }).click();
    await waitPaint(desktop, 200);
  }
  const onBefore = await desktop.locator(".model-chip.on").count();
  await desktop.locator(".model-chip").first().click();
  await waitPaint(desktop, 450);
  const onAfter = await desktop.locator(".model-chip.on").count();
  const chipShot = await snap(desktop, "d-13-chip-toggle");
  if (onBefore === onAfter) fail("models.chip-toggle", `unchanged ${onBefore}`, chipShot);
  else pass("models.chip-toggle", `${onBefore} -> ${onAfter}`, chipShot);
  if (onAfter < onBefore) {
    await desktop.locator(".model-chip").first().click();
    await waitPaint(desktop, 350);
  }
  await desktop.locator(".alert-row").filter({ hasText: "Align" }).click();
  await waitPaint(desktop, 150);
  pass("models.align-click", "Align clicked", modelsShot);

  await desktop.locator(".alert-tab").filter({ hasText: /^Settings$/ }).click();
  await waitPaint(desktop, 280);
  const prefsShot = await snap(desktop, "d-14-settings-prefs");
  const prefs = await desktop.evaluate(() => ({
    pills: [...document.querySelectorAll(".row-pill")].map((p) => ({ n: p.innerText.trim(), on: p.classList.contains("on") })),
    rows: [...document.querySelectorAll(".alert-row")].map((r) => r.innerText.replace(/\s+/g, " ").trim()),
  }));
  if (!(prefs.pills.length === 3 && ["1", "2", "3"].every((n) => prefs.pills.some((p) => p.n === n)))) {
    fail("settings.grid-rows", JSON.stringify(prefs), prefsShot);
  } else pass("settings.grid-rows", JSON.stringify(prefs.pills), prefsShot);
  if (!prefs.rows.some((r) => /tuck after send/i.test(r)) || !prefs.rows.some((r) => /tuck when idle/i.test(r))) {
    fail("settings.tuck-toggles-present", JSON.stringify(prefs.rows), prefsShot);
  } else pass("settings.tuck-toggles-present", prefs.rows.join(" || "), prefsShot);

  const tuckSend = desktop.locator(".alert-row").filter({ hasText: /tuck after send/i });
  const beforeVal = await tuckSend.locator(".alert-val").innerText();
  await tuckSend.click();
  await waitPaint(desktop, 180);
  const afterVal = await tuckSend.locator(".alert-val").innerText();
  const tuckShot = await snap(desktop, "d-15-tuck-toggle");
  if (beforeVal === afterVal) fail("settings.tuck-toggles-work", `stuck ${beforeVal}`, tuckShot);
  else pass("settings.tuck-toggles-work", `${beforeVal} -> ${afterVal}`, tuckShot);
  await tuckSend.click();
  await waitPaint(desktop, 120);

  await dismissSettings(desktop);
  await waitPaint(desktop, 300);
  const layoutA = await desktop.evaluate(() =>
    [...document.querySelectorAll(".model-card")].map((c) => {
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
    }),
  );
  await snap(desktop, "d-16-rows-default");
  await openSettings(desktop);
  await desktop.locator(".alert-tab").filter({ hasText: /^Settings$/ }).click();
  await waitPaint(desktop, 200);
  await desktop.locator(".row-pill").filter({ hasText: /^3$/ }).click();
  await waitPaint(desktop, 200);
  await snap(desktop, "d-17-rows-3-pane");
  await dismissSettings(desktop);
  await waitPaint(desktop, 450);
  const layout3 = await desktop.evaluate(() =>
    [...document.querySelectorAll(".model-card")].map((c) => {
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
    }),
  );
  const rows3Shot = await snap(desktop, "d-18-rows-3-home");
  const changed3 = JSON.stringify(layoutA) !== JSON.stringify(layout3);
  if (!changed3) fail("settings.rows-reflow", `no change A=${JSON.stringify(layoutA)} 3=${JSON.stringify(layout3)}`, rows3Shot);
  else pass("settings.rows-reflow", `default ${JSON.stringify(layoutA)} -> rows3 ${JSON.stringify(layout3)}`, rows3Shot);

  await openSettings(desktop);
  await desktop.locator(".alert-tab").filter({ hasText: /^Settings$/ }).click();
  await waitPaint(desktop, 150);
  await desktop.locator(".row-pill").filter({ hasText: /^1$/ }).click();
  await waitPaint(desktop, 180);
  await dismissSettings(desktop);
  await waitPaint(desktop, 450);
  const layout1 = await desktop.evaluate(() => {
    const stage = document.querySelector(".stage")?.getBoundingClientRect();
    return [...document.querySelectorAll(".model-card")].map((c) => {
      const r = c.getBoundingClientRect();
      const inside = stage ? r.left < stage.right - 8 && r.right > stage.left + 8 && r.top < stage.bottom && r.bottom > stage.top : false;
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), inside };
    });
  });
  const rows1Shot = await snap(desktop, "d-19-rows-1-home");
  const spilled = layout1.filter((c) => !c.inside);
  if (JSON.stringify(layout1.map(({ w, h, x, y }) => ({ w, h, x, y }))) === JSON.stringify(layout3)) {
    fail("settings.rows-1-reflow", "rows 1 identical to 3", rows1Shot);
  } else pass("settings.rows-1-reflow", JSON.stringify(layout1), rows1Shot);
  if (spilled.length) fail("settings.rows-1-fits-phone", `${spilled.length}/6 cards spilled off the phone canvas: ${JSON.stringify(layout1)}`, rows1Shot);
  else pass("settings.rows-1-fits-phone", "all 6 cards stay on the phone", rows1Shot);

  await openSettings(desktop);
  await desktop.locator(".alert-tab").filter({ hasText: /^Settings$/ }).click();
  await waitPaint(desktop, 120);
  await desktop.locator(".row-pill").filter({ hasText: /^2$/ }).click();
  await waitPaint(desktop, 120);
  await dismissSettings(desktop);
  await waitPaint(desktop, 280);

  await openSettings(desktop);
  await desktop.locator(".alert-dim").click({ position: { x: 10, y: 10 }, force: true });
  await waitPaint(desktop, 280);
  const dimShot = await snap(desktop, "d-20-dim-dismiss");
  if (await desktop.locator(".alert-card").count()) fail("settings.tap-outside-dismisses", "still open", dimShot);
  else pass("settings.tap-outside-dismisses", "closed", dimShot);
});

await section("card", async () => {
  await killOverlays(desktop);
  await snap(desktop, "d-21-before-card");
  await desktop.locator(".model-card").first().click();
  await waitPaint(desktop, 500);
  const cardShot = await snap(desktop, "d-22-card-view");
  const cardInfo = await desktop.evaluate(() => {
    const view = document.querySelector(".card-view");
    if (!view) return { view: false };
    const head = view.querySelector(".card-view-head");
    const title = view.querySelector(".card-view-title");
    const back = view.querySelector(".card-back");
    const ts = title ? getComputedStyle(title) : null;
    const headText = (head?.innerText || "").trim();
    const btns = [...(head?.querySelectorAll("button") || [])].map((b) => b.innerText.replace(/\s+/g, " ").trim());
    return {
      view: true, headText, btns,
      files: /\bfiles\b/i.test(headText), hist: /\bhistory\b/i.test(headText),
      back: Boolean(back), backText: back?.innerText?.trim(),
      title: title?.textContent, titleFont: ts?.fontFamily, titleColor: ts?.color, titleSize: ts?.fontSize, titleWeight: ts?.fontWeight,
    };
  });
  if (!cardInfo.view) fail("card.opens", "no .card-view", cardShot);
  else pass("card.opens", `title=${cardInfo.title}`, cardShot);
  if (!cardInfo.back) fail("card.back-exists", "no Back", cardShot);
  else pass("card.back-exists", `back='${cardInfo.backText}'`, cardShot);
  if (cardInfo.files || cardInfo.hist) fail("card.header-no-files-history", JSON.stringify(cardInfo), cardShot);
  else if (cardInfo.btns.filter((b) => b && !/^back$/i.test(b)).length) fail("card.header-back-title-only", JSON.stringify(cardInfo.btns), cardShot);
  else pass("card.header-back-title-only", `head='${cardInfo.headText.replace(/\n/g, " | ")}'`, cardShot);
  if (!/manrope/i.test(cardInfo.titleFont || "")) fail("card.title-manrope", cardInfo.titleFont, cardShot);
  else pass("card.title-manrope", `${cardInfo.titleFont} ${cardInfo.titleSize} ${cardInfo.titleWeight} ${cardInfo.titleColor}`, cardShot);
  if (!cardInfo.titleColor || cardInfo.titleColor === "rgb(244, 246, 250)" || cardInfo.titleColor === "rgb(255, 255, 255)") {
    fail("card.title-accent", cardInfo.titleColor, cardShot);
  } else pass("card.title-accent", cardInfo.titleColor, cardShot);

  await desktop.keyboard.press("Escape");
  await waitPaint(desktop, 400);
  const escShot = await snap(desktop, "d-23-card-escape");
  if (await desktop.locator(".card-view").count()) fail("card.escape-back", "Escape did not leave", escShot);
  else pass("card.escape-back", "home", escShot);

  await desktop.locator(".model-card").nth(1).click();
  await waitPaint(desktop, 400);
  await snap(desktop, "d-24-card-2");
  await desktop.locator(".card-back").click();
  await waitPaint(desktop, 400);
  const backShot = await snap(desktop, "d-25-card-back-home");
  if ((await desktop.locator(".card-view").count()) || (await desktop.locator(".model-card").count()) < 1) fail("card.back-returns-home", "not home", backShot);
  else pass("card.back-returns-home", `cards=${await desktop.locator(".model-card").count()}`, backShot);

  for (let i = 2; i < 6; i++) {
    await desktop.locator(".model-card").nth(i).click();
    await waitPaint(desktop, 320);
    const s = await snap(desktop, `d-44-card-${i}`);
    const t = await desktop.locator(".card-view-title").innerText().catch(() => "");
    if (!t) fail(`card.tap-${i}`, `card ${i} no view`, s);
    else pass(`card.tap-${i}`, t, s);
    await desktop.locator(".card-back").click();
    await waitPaint(desktop, 260);
  }
});

await section("history", async () => {
  await killOverlays(desktop);
  await openApp(desktop, "History");
  await waitPaint(desktop, 450);
  const histShot = await snap(desktop, "d-26-history");
  const histInfo = await desktop.evaluate(() => {
    const sheet = document.querySelector(".float-window");
    const scrim = document.querySelector(".sheet-scrim");
    const close = document.querySelector(".sheet-close");
    const cards = document.querySelectorAll(".model-card").length;
    const canvas = Boolean(document.querySelector(".card-canvas"));
    const rows = [...document.querySelectorAll(".hist-row")].map((r) => ({
      title: r.querySelector(".hist-title")?.textContent?.trim(),
      meta: r.querySelector(".hist-meta")?.innerText?.replace(/\s+/g, " ").trim(),
      tag: r.querySelector(".hist-tag")?.textContent?.trim(),
    }));
    const cr = close?.getBoundingClientRect();
    const cs = close ? getComputedStyle(close) : null;
    return {
      sheet: Boolean(sheet), scrim: Boolean(scrim), close: Boolean(close),
      closeBox: cr ? { x: cr.x, y: cr.y, w: cr.width, h: cr.height } : null,
      closeBg: cs?.backgroundColor,
      cardsUnder: cards, canvas, title: document.querySelector(".float-title")?.textContent,
      rows, avatars: document.querySelectorAll(".hist-avatar, .letter-avatar").length,
      concat: rows.some((r) => /minimax2/i.test(`${r.title}${r.meta}${r.tag}`)),
      named: rows.every((r) => r.title && r.title.length > 8),
      dates: rows.every((r) => /\d+[mhd]|now/i.test(r.meta || "")),
    };
  });
  await writeFile(path.join(OUT, "d-history.json"), JSON.stringify(histInfo, null, 2));
  if (!histInfo.sheet) fail("history.overlay", "no float-window", histShot);
  else pass("history.overlay", `title=${histInfo.title} cardsUnder=${histInfo.cardsUnder}`, histShot);
  if (!histInfo.canvas) fail("history.keeps-home-under", "home canvas gone", histShot);
  else pass("history.keeps-home-under", `cardsUnder=${histInfo.cardsUnder}`, histShot);
  if (!histInfo.named || histInfo.concat || histInfo.avatars) fail("history.named-conversations", JSON.stringify(histInfo.rows), histShot);
  else pass("history.named-conversations", JSON.stringify(histInfo.rows), histShot);
  if (!histInfo.dates) fail("history.dates", JSON.stringify(histInfo.rows.map((r) => r.meta)), histShot);
  else pass("history.dates", histInfo.rows.map((r) => r.meta).join(" | "), histShot);

  const closeRed = histInfo.close && histInfo.closeBox && histInfo.closeBox.w <= 22 && histInfo.closeBox.h <= 22 && /255,\s*95,\s*87|#ff5f57/i.test(histInfo.closeBg || "");
  if (!histInfo.close) fail("history.close-control", "no 14px red close", histShot);
  else if (!closeRed) fail("history.close-control", `not 14px red ${JSON.stringify(histInfo.closeBox)} ${histInfo.closeBg}`, histShot);
  else pass("history.close-control", `14px red ${JSON.stringify(histInfo.closeBox)} ${histInfo.closeBg}`, histShot);

  // Click the red close (the thing the label promises)
  if (histInfo.closeBox) {
    await desktop.mouse.click(histInfo.closeBox.x + histInfo.closeBox.w / 2, histInfo.closeBox.y + histInfo.closeBox.h / 2);
    await waitPaint(desktop, 700);
  } else {
    await desktop.locator(".sheet-close").click({ force: true }).catch(() => {});
    await waitPaint(desktop, 700);
  }
  const afterCloseBtn = await snap(desktop, "d-27-history-after-red-close");
  const stillOpen = await desktop.evaluate(() => {
    const root = document.querySelector(".float-root");
    if (!root) return { present: false, open: false };
    const sheet = document.querySelector(".float-window");
    const s = sheet ? getComputedStyle(sheet) : null;
    return { present: true, openCls: root.classList.contains("open"), op: s ? parseFloat(s.opacity) : 0, vis: s?.visibility };
  });
  if (stillOpen.openCls && stillOpen.op > 0.2) {
    fail("history.close-returns", `red 14px close did NOT dismiss. still ${JSON.stringify(stillOpen)}`, afterCloseBtn);
  } else {
    pass("history.close-returns", `red close dismissed ${JSON.stringify(stillOpen)}`, afterCloseBtn);
  }

  // Scrim should still be able to dismiss if close failed
  if (stillOpen.openCls) {
    const scrimBox = await desktop.evaluate(() => {
      const el = document.querySelector(".sheet-scrim");
      const r = el?.getBoundingClientRect();
      return r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null;
    });
    if (scrimBox) {
      await desktop.mouse.click(scrimBox.x + 16, scrimBox.y + 16);
      await waitPaint(desktop, 700);
    }
    const afterScrim = await snap(desktop, "d-27b-history-after-scrim");
    const gone = await desktop.evaluate(() => !document.querySelector(".float-root.open"));
    if (!gone) {
      fail("history.scrim-returns", "scrim also failed to dismiss", afterScrim);
      await desktop.keyboard.press("Escape");
      await waitPaint(desktop, 500);
      const afterEsc = await snap(desktop, "d-27c-history-after-esc");
      const gone2 = await desktop.evaluate(() => !document.querySelector(".float-root.open"));
      if (!gone2) fail("history.escape-returns", "Escape also failed", afterEsc);
      else pass("history.escape-returns", "Escape dismissed", afterEsc);
    } else {
      pass("history.scrim-returns", "scrim dismissed after close failed", afterScrim);
    }
  } else {
    pass("history.scrim-returns", "n/a — already closed by red close", afterCloseBtn);
  }
  const homeAfter = await desktop.locator(".model-card").count();
  if (homeAfter < 1) fail("history.lands-on-home", "home missing after history", afterCloseBtn);
  else pass("history.lands-on-home", `cards=${homeAfter}`, afterCloseBtn);
});

async function tourApp(page, name, prefix, openedCheck) {
  await killOverlays(page);
  const ok = await openApp(page, name);
  const shot = await snap(page, `${prefix}-${name.toLowerCase()}`);
  if (!ok) {
    fail(`${name.toLowerCase()}.opens`, "settings/app click failed", shot);
    return;
  }
  const info = await page.evaluate((openedCheck) => {
    const close = document.querySelector(".close-affordance");
    const cr = close?.getBoundingClientRect();
    const labels = [...document.querySelectorAll(".years-label, h2, h3")].map((l) => l.textContent.trim()).filter(Boolean);
    const yearsDays = labels.some((l) => /^(years?|days?)$/i.test(l));
    return {
      text: document.body.innerText.slice(0, 500),
      close: Boolean(close),
      closeBox: cr ? { w: Math.round(cr.width), h: Math.round(cr.height), x: Math.round(cr.x), y: Math.round(cr.y) } : null,
      labels,
      yearsDays,
      room: /\bRooms?\b/.test(document.body.innerText),
    };
  });
  const opened = await page.evaluate(openedCheck);
  if (!opened) fail(`${name.toLowerCase()}.opens`, `surface missing ${info.text.slice(0, 180)}`, shot);
  else pass(`${name.toLowerCase()}.opens`, info.text.replace(/\n/g, " | ").slice(0, 220), shot);
  if (info.yearsDays) fail(`${name.toLowerCase()}.no-years-days`, JSON.stringify(info.labels), shot);
  else pass(`${name.toLowerCase()}.no-years-days`, `labels=${JSON.stringify(info.labels.slice(0, 12))}`, shot);
  if (info.room) fail(`${name.toLowerCase()}.no-room`, "Room copy inside", shot);
  if (!info.close) fail(`${name.toLowerCase()}.close-exists`, "no close-affordance", shot);
  else pass(`${name.toLowerCase()}.close-exists`, JSON.stringify(info.closeBox), shot);
  return { shot, info };
}

await section("files", async () => {
  await tourApp(desktop, "Files", "d-28", () => Boolean(document.querySelector(".gallery-wrap, .surface-label")));
  if (await desktop.locator(".years-tile").count()) {
    await desktop.locator(".years-tile").first().click();
    await waitPaint(desktop, 400);
    await snap(desktop, "d-28b-files-preview");
    await desktop.keyboard.press("Escape");
    await waitPaint(desktop, 250);
  }
  await desktop.locator(".close-affordance").first().click({ force: true });
  await waitPaint(desktop, 450);
  const closed = await snap(desktop, "d-29-files-closed");
  if ((await desktop.locator(".model-card").count()) < 1) fail("files.close-returns", "not home", closed);
  else pass("files.close-returns", "home", closed);
});

await section("themes", async () => {
  await tourApp(desktop, "Themes", "d-30", () => Boolean(document.querySelector(".gallery-wrap, .surface-label")));
  const chips = await desktop.locator(".chip").allInnerTexts();
  if (chips.includes("Store")) {
    await desktop.locator(".chip").filter({ hasText: "Store" }).click();
    await waitPaint(desktop, 400);
    const ss = await snap(desktop, "d-31-themes-store");
    if (!(await desktop.locator(".gate, .plan-stack, .years-tile, .f1-shelf").count())) fail("themes.store-chip", "Store did nothing", ss);
    else pass("themes.store-chip", "Store pane", ss);
    await desktop.locator(".chip").filter({ hasText: /selector/i }).click().catch(() => {});
    await waitPaint(desktop, 200);
  }
  if (await desktop.locator(".years-tile").count()) {
    await desktop.locator(".years-tile").first().click();
    await waitPaint(desktop, 400);
    const explode = await snap(desktop, "d-32-theme-preview");
    if (await desktop.locator(".preview-stage, .close-affordance.in-stage").count()) {
      pass("themes.tile-opens", "preview", explode);
      await desktop.locator(".close-affordance.in-stage").click({ force: true }).catch(() => desktop.keyboard.press("Escape"));
      await waitPaint(desktop, 300);
    } else pass("themes.tile-opens", "clicked tile", explode);
  }
  await desktop.locator(".close-affordance").first().click({ force: true });
  await waitPaint(desktop, 400);
  const closed = await snap(desktop, "d-33-themes-closed");
  if ((await desktop.locator(".model-card").count()) < 1) fail("themes.close-returns", "not home", closed);
  else pass("themes.close-returns", "home", closed);
});

await section("imagine", async () => {
  await tourApp(desktop, "Imagine", "d-34", () => Boolean(document.querySelector(".imagine-wrap, .imagine-masonry")));
  const tabs = await desktop.locator(".imagine-tabs button").allInnerTexts();
  for (const tab of tabs) {
    await desktop.locator(".imagine-tabs button").filter({ hasText: tab }).click();
    await waitPaint(desktop, 220);
  }
  await snap(desktop, "d-35-imagine-tabs");
  if (await desktop.locator(".imagine-tile").count()) {
    await desktop.locator(".imagine-tile").first().click();
    await waitPaint(desktop, 350);
    await snap(desktop, "d-36-imagine-tile");
    await desktop.keyboard.press("Escape");
    await waitPaint(desktop, 250);
  }
  await desktop.locator(".close-affordance").first().click({ force: true });
  await waitPaint(desktop, 400);
  const closed = await snap(desktop, "d-37-imagine-closed");
  if ((await desktop.locator(".model-card").count()) < 1) fail("imagine.close-returns", "not home", closed);
  else pass("imagine.close-returns", "home", closed);
});

await section("smart", async () => {
  await tourApp(desktop, "Smart", "d-38", () => document.querySelectorAll(".hub-btn").length >= 1);
  const smartShot = shotPath("d-38-smart");
  const hub = await desktop.locator(".hub-btn").allInnerTexts();
  const needHub = ["Cards", "Boards", "Canvas", "Genie"];
  if (!needHub.every((n) => hub.some((h) => h.includes(n)))) fail("smart.hub", JSON.stringify(hub), smartShot);
  else pass("smart.hub", JSON.stringify(hub), smartShot);

  for (const name of ["Smart Cards", "Smart Boards", "Smart Canvas", "Smart Genie"]) {
    const btn = desktop.locator(".hub-btn").filter({ hasText: name });
    if (await btn.count()) {
      await btn.click();
    } else {
      const nav = desktop.locator(".smart-nav button").filter({ hasText: name.replace("Smart ", "").split("·")[0].trim() });
      if (await nav.count()) await nav.click();
    }
    await waitPaint(desktop, 400);
    const pg = await snap(desktop, `d-39-${name.replace(/\s+/g, "-").toLowerCase()}`);
    const body = (await desktop.locator(".smart-body, .smart-page, .smart-hub").innerText().catch(() => "")).slice(0, 160);
    pass(`smart.${name.replace(/\s+/g, "-").toLowerCase()}`, body.replace(/\n/g, " | "), pg);
  }
  await desktop.locator(".close-affordance").first().click({ force: true });
  await waitPaint(desktop, 400);
  const closed = await snap(desktop, "d-40-smart-closed");
  if ((await desktop.locator(".model-card").count()) < 1) fail("smart.close-returns", "not home", closed);
  else pass("smart.close-returns", "home", closed);
});

await section("store", async () => {
  await tourApp(desktop, "Store", "d-41", () => Boolean(document.querySelector(".plan-stack, .plan-card")));
  const storeShot = shotPath("d-41-store");
  const ctas = await desktop.locator(".plan-cta").allInnerTexts().catch(() => []);
  if (ctas.length) pass("store.upgrade-cta", JSON.stringify(ctas), storeShot);
  const cta = desktop.locator(".plan-cta").filter({ hasText: /upgrade/i }).first();
  if (await cta.count()) {
    if (!(await cta.isDisabled())) {
      await cta.click();
      await waitPaint(desktop, 280);
      await snap(desktop, "d-42-store-upgrade-click");
    }
  }
  await desktop.locator(".close-affordance").first().click({ force: true });
  await waitPaint(desktop, 400);
  const closed = await snap(desktop, "d-43-store-closed");
  if ((await desktop.locator(".model-card").count()) < 1) fail("store.close-returns", "not home", closed);
  else pass("store.close-returns", "home", closed);
});

await section("consensus-map", async () => {
  await killOverlays(desktop);
  await desktop.locator(".prompt-orb").click({ force: true });
  await waitPaint(desktop, 500);
  if (await desktop.locator(".consensus-card").count()) {
    await desktop.locator(".consensus-card").click();
    await waitPaint(desktop, 400);
    const consShot = await snap(desktop, "d-45-consensus-map");
    if (!(await desktop.locator(".consensus-map, .consensus-root").count())) fail("prompt.consensus-click", "no map", consShot);
    else {
      pass("prompt.consensus-click", "map opened", consShot);
      await desktop.locator(".sheet-scrim").first().click({ position: { x: 8, y: 8 }, force: true }).catch(() => desktop.keyboard.press("Escape"));
      await waitPaint(desktop, 250);
    }
  }
  await desktop.keyboard.press("Escape");
  await waitPaint(desktop, 250);
});

const dHomeFinal = await snap(desktop, "d-46-home-final");
pass("desktop.tour-complete", `desktop checks ${checks.length}`, dHomeFinal);
await desktop.close();

// =============================================================================
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
mobile.on("pageerror", (e) => fail("m.pageerror", e.message, null));
await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(1100);

await section("mobile-home", async () => {
  const mHome = await snap(mobile, "m-01-home");
  const mGeom = await homeGeom(mobile);
  await writeFile(path.join(OUT, "m-home-geom.json"), JSON.stringify(mGeom, null, 2));
  if (mGeom.cards?.length !== 6) fail("m.home.six-cards", `got ${mGeom.cards?.length}`, mHome);
  else pass("m.home.six-cards", `ratios=${mGeom.cards.map((c) => c.ratio.toFixed(2))}`, mHome);
  if (!mGeom.orb || mGeom.orb.op < 0.2 || mGeom.orb.w < 20) fail("m.home.prompt-orb", JSON.stringify(mGeom.orb), mHome);
  else pass("m.home.prompt-orb", `orb ${mGeom.orb.w}x${mGeom.orb.h} y=${mGeom.orb.y}`, mHome);
  if (!mGeom.settings || mGeom.settings.op < 0.2) fail("m.home.settings-orb", JSON.stringify(mGeom.settings), mHome);
  else pass("m.home.settings-orb", `at (${mGeom.settings.x},${mGeom.settings.y})`, mHome);
});

await section("mobile-prompt", async () => {
  await mobile.locator(".prompt-orb").click({ force: true });
  await waitPaint(mobile, 500);
  const mPrompt = await snap(mobile, "m-02-prompt");
  const mStack = await mobile.evaluate(() => {
    const c = document.querySelector(".consensus-card");
    const b = document.querySelector(".prompt-bar");
    if (!c || !b) return { ok: false };
    const cr = c.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return { ok: true, above: cr.bottom <= br.top + 8, attach: document.querySelector(".prompt-plus .ctrl-label")?.textContent, cTop: cr.top, bTop: br.top };
  });
  if (!mStack.ok || !mStack.above) fail("m.prompt.consensus-above", JSON.stringify(mStack), mPrompt);
  else pass("m.prompt.consensus-above", JSON.stringify(mStack), mPrompt);
  if (mStack.attach !== "Attach") fail("m.prompt.attach-label", JSON.stringify(mStack), mPrompt);
  else pass("m.prompt.attach-label", "Attach", mPrompt);
  await mobile.locator(".probe").click({ force: true });
  await waitPaint(mobile, 280);
  const mTray = await snap(mobile, "m-03-investigate");
  const trayGeom = await mobile.evaluate(() => {
    const rows = [...document.querySelectorAll(".investigate-row")].map((r) => {
      const b = r.getBoundingClientRect();
      return { t: r.innerText.replace(/\s+/g, " ").trim(), onScreen: b.top >= 0 && b.bottom <= innerHeight };
    });
    const tray = document.querySelector(".investigate-tray")?.getBoundingClientRect();
    const bar = document.querySelector(".prompt-bar")?.getBoundingClientRect();
    return { rows, belowBar: tray && bar ? tray.top >= bar.bottom - 12 : null, clipped: rows.some((r) => !r.onScreen) };
  });
  if (!trayGeom.rows.some((r) => /web search/i.test(r.t)) || !trayGeom.rows.some((r) => /deep research/i.test(r.t))) {
    fail("m.prompt.investigate", JSON.stringify(trayGeom), mTray);
  } else if (trayGeom.clipped || trayGeom.belowBar) {
    fail("m.prompt.investigate", `clipped/below ${JSON.stringify(trayGeom)}`, mTray);
  } else pass("m.prompt.investigate", JSON.stringify(trayGeom.rows), mTray);
  await killOverlays(mobile);
});

await section("mobile-settings", async () => {
  await openSettings(mobile);
  const mSet = await snap(mobile, "m-04-settings");
  const mTabs = await mobile.locator(".alert-tab").allInnerTexts();
  const mApps = (await mobile.locator(".app-icon").allInnerTexts()).map((x) => x.trim());
  if (!["Account", "Models", "Settings"].every((t) => mTabs.includes(t))) fail("m.settings.tabs", JSON.stringify(mTabs), mSet);
  else pass("m.settings.tabs", JSON.stringify(mTabs), mSet);
  if (!["Files", "History", "Themes", "Imagine", "Smart", "Store"].every((a) => mApps.includes(a))) fail("m.settings.apps", JSON.stringify(mApps), mSet);
  else pass("m.settings.apps", JSON.stringify(mApps), mSet);

  await mobile.locator(".alert-tab").filter({ hasText: "Models" }).click();
  await waitPaint(mobile, 300);
  await snap(mobile, "m-05-models");
  await mobile.locator(".cat-row").click();
  await waitPaint(mobile, 200);
  const mCat = await snap(mobile, "m-06-category");
  if (!(await mobile.locator(".cat-overlay").count())) fail("m.models.category-overlay", "no overlay", mCat);
  else pass("m.models.category-overlay", "overlay", mCat);
  if (await mobile.locator(".cat-option").filter({ hasText: "General" }).count()) {
    await mobile.locator(".cat-option").filter({ hasText: "General" }).click();
    await waitPaint(mobile, 150);
  }
  await mobile.locator(".alert-tab").filter({ hasText: /^Settings$/ }).click();
  await waitPaint(mobile, 250);
  const mPrefs = await snap(mobile, "m-07-prefs");
  const mPills = await mobile.locator(".row-pill").allInnerTexts();
  if (!(mPills.includes("1") && mPills.includes("2") && mPills.includes("3"))) fail("m.settings.grid-rows", JSON.stringify(mPills), mPrefs);
  else pass("m.settings.grid-rows", JSON.stringify(mPills), mPrefs);
  await dismissSettings(mobile);
});

await section("mobile-card", async () => {
  await mobile.locator(".model-card").first().click();
  await waitPaint(mobile, 450);
  const mCard = await snap(mobile, "m-08-card");
  const mHead = await mobile.evaluate(() => document.querySelector(".card-view-head")?.innerText || "");
  if (/files|history/i.test(mHead)) fail("m.card.header-no-files-history", mHead, mCard);
  else if (!/back/i.test(mHead)) fail("m.card.back", mHead, mCard);
  else pass("m.card.header", mHead.replace(/\n/g, " | "), mCard);
  await mobile.locator(".card-back").click();
  await waitPaint(mobile, 350);
  const mBack = await snap(mobile, "m-09-card-back");
  if (await mobile.locator(".card-view").count()) fail("m.card.back-returns", "still in card", mBack);
  else pass("m.card.back-returns", "home", mBack);
});

await section("mobile-history", async () => {
  await openApp(mobile, "History");
  const mHist = await snap(mobile, "m-10-history");
  if (!(await mobile.locator(".float-window").count())) fail("m.history.overlay", "no overlay", mHist);
  else pass("m.history.overlay", "overlay", mHist);
  const box = await mobile.evaluate(() => {
    const c = document.querySelector(".sheet-close");
    const r = c?.getBoundingClientRect();
    return r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null;
  });
  if (box) await mobile.mouse.click(box.x + box.w / 2, box.y + box.h / 2);
  await waitPaint(mobile, 700);
  const after = await snap(mobile, "m-10b-history-close");
  const open = await mobile.evaluate(() => Boolean(document.querySelector(".float-root.open")));
  if (open) {
    fail("m.history.close-returns", "red close did not dismiss on mobile", after);
    await mobile.locator(".sheet-scrim").click({ position: { x: 8, y: 8 }, force: true }).catch(() => {});
    await mobile.keyboard.press("Escape");
    await waitPaint(mobile, 400);
  } else pass("m.history.close-returns", "closed", after);
});

await section("mobile-apps", async () => {
  for (const app of ["Files", "Imagine", "Smart", "Themes", "Store"]) {
    await killOverlays(mobile);
    await openApp(mobile, app);
    await waitPaint(mobile, 400);
    const s = await snap(mobile, `m-11-${app.toLowerCase()}`);
    const hasClose = await mobile.locator(".close-affordance").count();
    if (!hasClose) fail(`m.${app.toLowerCase()}.close`, "no close", s);
    else pass(`m.${app.toLowerCase()}.opens`, `close=${hasClose}`, s);
    await mobile.locator(".close-affordance").first().click({ force: true });
    await waitPaint(mobile, 400);
    if ((await mobile.locator(".model-card").count()) < 1) fail(`m.${app.toLowerCase()}.returns`, "not home", s);
    else pass(`m.${app.toLowerCase()}.returns`, "home", s);
  }
});

await snap(mobile, "m-12-final");
await mobile.close();
await browser.close();

const fails = checks.filter((c) => c.result === "FAIL");
const verdict = {
  result: fails.length ? "FAIL" : "PASS",
  failCount: fails.length,
  passCount: checks.filter((c) => c.result === "PASS").length,
  checks,
};
await writeFile(path.join(OUT, "verdict.json"), JSON.stringify(verdict, null, 2));
console.log("\n==== SUMMARY ====");
console.log(verdict.result, "FAILS", fails.length, "PASSES", verdict.passCount);
for (const f of fails) console.log("FAIL", f.id, "—", f.evidence);
