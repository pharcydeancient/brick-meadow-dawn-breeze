import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "/workspace/screenshots/qa-vis";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function shot(page, name) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function forceClick(page, selector, opts = {}) {
  const loc = typeof selector === "string" ? page.locator(selector) : selector;
  const n = await loc.count();
  if (!n) return false;
  try {
    await loc.first().click({ timeout: opts.timeout ?? 2500, force: true });
    return true;
  } catch {
    try {
      await loc.first().evaluate((el) => el.click());
      return true;
    } catch {
      return false;
    }
  }
}

async function collectFonts(page) {
  return page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        sel,
        text: (el.textContent || "").trim().slice(0, 80),
        family: s.fontFamily,
        weight: s.fontWeight,
        size: s.fontSize,
        style: s.fontStyle,
        synthesis: s.fontSynthesis,
        color: s.color,
        vis: r.width > 0 && r.height > 0 && s.opacity !== "0" && s.visibility !== "hidden",
        box: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      };
    };
    const all = [
      ...document.querySelectorAll(
        "body, .card-name, .card-view-title, .card-back, .alert-row, .alert-tab, .app-icon, .app-icon span, .hist-title, .hist-meta, .hist-tag, .surface-label, .years-label, .hub-btn, .model-chip, .chip-name, .ctrl-label, .consensus-name, .prompt-bar input, .alert-title, .row-pill, .cat-row, .cat-option, .bubble, button, h2, h3",
      ),
    ];
    const weights = {};
    const families = {};
    for (const el of all) {
      const s = getComputedStyle(el);
      const w = s.fontWeight;
      const f = s.fontFamily;
      weights[w] = (weights[w] || 0) + 1;
      families[f] = (families[f] || 0) + 1;
    }
    const manropeLoaded = [...document.fonts].map((ff) => ({
      family: ff.family,
      weight: ff.weight,
      style: ff.style,
      status: ff.status,
    }));
    return {
      body: pick("body"),
      cardName: pick(".card-name"),
      cardViewTitle: pick(".card-view-title"),
      cardBack: pick(".card-back"),
      alertRow: pick(".alert-row"),
      alertTab: pick(".alert-tab"),
      appIcon: pick(".app-icon span"),
      histTitle: pick(".hist-title"),
      surfaceLabel: pick(".surface-label"),
      yearsLabel: pick(".years-label"),
      hubBtn: pick(".hub-btn"),
      modelChip: pick(".model-chip"),
      chipName: pick(".chip-name"),
      ctrlLabel: pick(".ctrl-label"),
      consensusName: pick(".consensus-name"),
      promptInput: pick(".prompt-bar input"),
      alertTitle: pick(".alert-title"),
      rowPill: pick(".row-pill"),
      catRow: pick(".cat-row"),
      bubble: pick(".bubble"),
      weights,
      families,
      manropeLoaded,
    };
  });
}

async function collectOrb(page) {
  return page.evaluate(() => {
    const orb = document.querySelector(".prompt-orb");
    const sphere = document.querySelector(".orb-sphere");
    const canvas = document.querySelector(".main-window");
    if (!orb) return { exists: false };
    const os = getComputedStyle(orb);
    const ss = sphere ? getComputedStyle(sphere) : null;
    const or = orb.getBoundingClientRect();
    const sr = sphere ? sphere.getBoundingClientRect() : null;
    const cr = canvas ? canvas.getBoundingClientRect() : null;
    const cx = or.x + or.width / 2;
    const cy = or.y + or.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return {
      exists: true,
      aria: orb.getAttribute("aria-label"),
      class: orb.className,
      opacity: os.opacity,
      visibility: os.visibility,
      pointer: os.pointerEvents,
      orbBox: {
        x: +or.x.toFixed(1),
        y: +or.y.toFixed(1),
        w: +or.width.toFixed(1),
        h: +or.height.toFixed(1),
        bottom: +or.bottom.toFixed(1),
      },
      sphereBox: sr
        ? { x: +sr.x.toFixed(1), y: +sr.y.toFixed(1), w: +sr.width.toFixed(1), h: +sr.height.toFixed(1) }
        : null,
      canvasBox: cr
        ? {
            x: +cr.x.toFixed(1),
            y: +cr.y.toFixed(1),
            w: +cr.width.toFixed(1),
            h: +cr.height.toFixed(1),
            bottom: +cr.bottom.toFixed(1),
          }
        : null,
      underCanvas: cr ? or.top >= cr.bottom - 8 : null,
      overlapCanvas: cr ? or.top < cr.bottom && or.bottom > cr.top : null,
      bg: ss?.backgroundImage?.slice(0, 180),
      glyphText: (orb.textContent || "").trim(),
      hit: hit
        ? { tag: hit.tagName, cls: hit.className?.toString?.().slice(0, 80), aria: hit.getAttribute?.("aria-label") }
        : null,
    };
  });
}

async function collectHome(page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll(".model-card")].map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        name: el.querySelector(".card-name")?.textContent?.trim(),
        bg: s.backgroundColor,
        filter: s.backdropFilter || s.webkitBackdropFilter,
        border: s.borderRadius,
        ratio: r.height && r.width ? +(r.height / r.width).toFixed(2) : 0,
        box: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      };
    });
    const win = document.querySelector(".main-window");
    const ws = win ? getComputedStyle(win) : null;
    const veil = document.querySelector(".env-veil");
    const vs = veil ? getComputedStyle(veil) : null;
    const env = document.querySelector(".env-photo");
    const bodyText = document.body.innerText;
    const reds = [...document.querySelectorAll(".sheet-close, .close-affordance, .win-close")].map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        cls: el.className,
        aria: el.getAttribute("aria-label"),
        bg: s.backgroundColor,
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        vis: r.width > 0 && r.height > 0 && s.opacity !== "0" && s.display !== "none",
      };
    });
    const unlabeled = [...document.querySelectorAll("button")]
      .filter((b) => {
        const t = (b.textContent || "").trim();
        const a = b.getAttribute("aria-label") || "";
        const r = b.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return false;
        const s = getComputedStyle(b);
        if (s.opacity === "0" || s.visibility === "hidden" || s.pointerEvents === "none") return false;
        return !t && !a;
      })
      .map((b) => ({ cls: b.className?.toString?.().slice(0, 60), w: +b.getBoundingClientRect().width.toFixed(1) }));
    return {
      cards,
      winBg: ws?.backgroundColor,
      winFilter: ws?.backdropFilter || ws?.webkitBackdropFilter,
      veilBg: vs?.backgroundImage?.slice(0, 220),
      veilOp: vs?.opacity,
      envSrc: env?.getAttribute("src"),
      room: /Room/.test(bodyText),
      yearsDays: /\b(Years|Days)\b/.test(bodyText),
      reds,
      unlabeled,
      promptSeat: (() => {
        const el = document.querySelector(".prompt-seat");
        if (!el) return null;
        const s = getComputedStyle(el);
        return { op: s.opacity, pointer: s.pointerEvents, class: el.className, transform: s.transform };
      })(),
    };
  });
}

async function sampleMotion(page) {
  const seat = document.querySelector(".prompt-seat");
  const orb = document.querySelector(".prompt-orb");
  const ss = seat ? getComputedStyle(seat) : null;
  const os = orb ? getComputedStyle(orb) : null;
  return {
    seatOp: ss?.opacity,
    seatTf: ss?.transform,
    seatFilter: ss?.filter,
    orbOp: os?.opacity,
    orbTf: os?.transform,
    orbFilter: os?.filter,
    seatOpen: seat?.classList.contains("open") ?? false,
    orbAway: orb?.classList.contains("away") ?? false,
  };
}

async function inspectSettings(page, prefix) {
  const notes = {};
  await forceClick(page, ".settings-orb");
  await page.waitForTimeout(450);
  notes.account = await page.evaluate(() => {
    const card = document.querySelector(".alert-card");
    const s = card ? getComputedStyle(card) : null;
    const tabs = [...document.querySelectorAll(".alert-tab")].map((t) => t.textContent.trim());
    const apps = [...document.querySelectorAll(".app-icon")].map((t) => t.textContent.trim());
    const room = /Room/.test(document.body.innerText);
    const cancel = document.querySelector(".alert-cancel");
    const rows = [...document.querySelectorAll(".alert-row")].map((r) => {
      const cs = getComputedStyle(r);
      return { text: r.textContent.trim().slice(0, 60), family: cs.fontFamily, weight: cs.fontWeight, size: cs.fontSize };
    });
    const goldPurple = [...document.querySelectorAll("*")]
      .slice(0, 400)
      .filter((el) => {
        const s = getComputedStyle(el);
        const blob = `${s.color} ${s.backgroundColor} ${s.outlineColor} ${s.borderColor}`;
        return /245, 224, 0|255, 215, 0|167, 139, 250|168, 85, 247|128, 0, 128|212, 175, 55/.test(blob);
      })
      .slice(0, 10)
      .map((el) => el.className?.toString?.().slice(0, 40));
    return {
      vis: !!card,
      bg: s?.backgroundColor,
      filter: s?.backdropFilter || s?.webkitBackdropFilter,
      tabs,
      apps,
      room,
      cancel: !!cancel,
      rows,
      goldPurple,
      tabFont: (() => {
        const t = document.querySelector(".alert-tab");
        if (!t) return null;
        const cs = getComputedStyle(t);
        return { family: cs.fontFamily, weight: cs.fontWeight, size: cs.fontSize };
      })(),
    };
  });
  await shot(page, `${prefix}-settings-account`);

  await forceClick(page, page.locator(".alert-tab").filter({ hasText: "Models" }));
  await page.waitForTimeout(400);
  notes.models = await page.evaluate(() => {
    const chips = [...document.querySelectorAll(".model-chip")].map((c) => {
      const s = getComputedStyle(c);
      return {
        name: c.textContent.trim(),
        bg: s.backgroundColor,
        img: s.backgroundImage.slice(0, 80),
        weight: s.fontWeight,
        family: s.fontFamily,
        on: c.classList.contains("on"),
      };
    });
    const gold = getComputedStyle(document.querySelector(".tier-band.elite") || document.body);
    const pro = getComputedStyle(document.querySelector(".tier-band.pro") || document.body);
    const cat = document.querySelector(".cat-row");
    const cs = cat ? getComputedStyle(cat) : null;
    return {
      chips,
      eliteBg: gold.backgroundColor,
      eliteOutline: gold.outline,
      eliteBorder: gold.borderColor,
      proBg: pro.backgroundColor,
      catFamily: cs?.fontFamily,
      catWeight: cs?.fontWeight,
      catText: cat?.textContent?.trim(),
      locks: [...document.querySelectorAll(".tier-lock")].length,
    };
  });
  await shot(page, `${prefix}-settings-models`);

  const catBtn = page.locator(".cat-row");
  if (await catBtn.count()) {
    await forceClick(page, catBtn);
    await page.waitForTimeout(250);
    notes.catOpen = await page.evaluate(() => {
      const ov = document.querySelector(".cat-overlay");
      const s = ov ? getComputedStyle(ov) : null;
      return {
        vis: !!ov,
        pos: s?.position,
        opts: [...document.querySelectorAll(".cat-option")].map((o) => o.textContent.trim()),
        nativeSelect: document.querySelectorAll("select").length,
      };
    });
    await shot(page, `${prefix}-settings-cat`);
    await forceClick(page, page.locator(".cat-option").filter({ hasText: "General" }));
    await page.waitForTimeout(200);
  }

  await forceClick(page, page.locator(".alert-tab").filter({ hasText: /^Settings$/ }));
  await page.waitForTimeout(350);
  notes.settings = await page.evaluate(() => {
    const rows = [...document.querySelectorAll(".alert-row")].map((r) => {
      const cs = getComputedStyle(r);
      return {
        text: r.textContent.trim().replace(/\s+/g, " "),
        family: cs.fontFamily,
        weight: cs.fontWeight,
        size: cs.fontSize,
      };
    });
    const pills = [...document.querySelectorAll(".row-pill")].map((p) => p.textContent.trim());
    const picker = !!document.querySelector(".row-pills");
    return { rows, pills, picker };
  });
  await shot(page, `${prefix}-settings-settings`);
  return notes;
}

async function run(prefix, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  page.setDefaultTimeout(5000);
  const log = { prefix, viewport, fails: [], notes: {} };
  page.on("pageerror", (e) => log.fails.push(`pageerror ${e.message}`));

  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  log.notes.home = await collectHome(page);
  log.notes.orb = await collectOrb(page);
  log.notes.fontsHome = await collectFonts(page);
  await shot(page, `${prefix}-home`);

  const samples = [];
  samples.push({ t: "before", ...(await page.evaluate(sampleMotion)) });
  await forceClick(page, ".prompt-orb");
  await shot(page, `${prefix}-prompt-t0`);
  samples.push({ t: "t0", ...(await page.evaluate(sampleMotion)) });
  await page.waitForTimeout(150);
  await shot(page, `${prefix}-prompt-t150`);
  samples.push({ t: "t150", ...(await page.evaluate(sampleMotion)) });
  await page.waitForTimeout(250);
  await shot(page, `${prefix}-prompt-t400`);
  samples.push({ t: "t400", ...(await page.evaluate(sampleMotion)) });
  await page.waitForTimeout(200);
  samples.push({ t: "t600", ...(await page.evaluate(sampleMotion)) });
  log.notes.motion = samples;

  log.notes.promptOpen = await page.evaluate(() => {
    const seat = document.querySelector(".prompt-seat");
    const bar = document.querySelector(".prompt-bar");
    const cons = document.querySelector(".consensus-card");
    const probe = document.querySelector(".probe");
    const ss = seat ? getComputedStyle(seat) : null;
    const cr = cons?.getBoundingClientRect();
    const br = bar?.getBoundingClientRect();
    const pr = probe?.getBoundingClientRect();
    const hit = pr ? document.elementFromPoint(pr.x + pr.width / 2, pr.y + pr.height / 2) : null;
    return {
      seatOp: ss?.opacity,
      seatOpen: seat?.classList.contains("open"),
      consensus: !!cons,
      consAbove: cr && br ? cr.bottom <= br.top + 8 : null,
      probeText: probe?.textContent?.trim(),
      probeHit: hit
        ? { tag: hit.tagName, cls: hit.className?.toString?.().slice(0, 80), aria: hit.getAttribute?.("aria-label") }
        : null,
      probeBox: pr ? { x: +pr.x.toFixed(1), y: +pr.y.toFixed(1), w: +pr.width.toFixed(1), h: +pr.height.toFixed(1) } : null,
      labels: [...document.querySelectorAll(".ctrl-label")].map((l) => {
        const s = getComputedStyle(l);
        return { t: l.textContent.trim(), family: s.fontFamily, weight: s.fontWeight, size: s.fontSize };
      }),
    };
  });
  await shot(page, `${prefix}-prompt-open`);

  const probeClicked = await forceClick(page, ".probe");
  await page.waitForTimeout(350);
  log.notes.invest = {
    clicked: probeClicked,
    ...(await page.evaluate(() => {
      const tray = document.querySelector(".investigate-tray");
      const s = tray ? getComputedStyle(tray) : null;
      return {
        open: tray?.classList.contains("open"),
        op: s?.opacity,
        transform: s?.transform,
        rows: [...document.querySelectorAll(".investigate-row")].map((r) => r.textContent.trim()),
      };
    })),
  };
  await shot(page, `${prefix}-prompt-invest`);
  await forceClick(page, ".probe");
  await page.waitForTimeout(200);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(120);
  log.notes.promptClosing = await page.evaluate(sampleMotion);
  await shot(page, `${prefix}-prompt-closing`);
  await page.waitForTimeout(500);
  await shot(page, `${prefix}-prompt-closed`);

  await forceClick(page, ".model-card");
  await page.waitForTimeout(450);
  log.notes.card = await page.evaluate(() => {
    const head = document.querySelector(".card-view-head");
    const title = document.querySelector(".card-view-title");
    const back = document.querySelector(".card-back");
    const files = [...document.querySelectorAll("button, a")].filter((b) =>
      /^(Files|History)$/i.test((b.textContent || "").trim()),
    );
    const ts = title ? getComputedStyle(title) : null;
    const bs = back ? getComputedStyle(back) : null;
    const bubble = document.querySelector(".bubble");
    const bus = bubble ? getComputedStyle(bubble) : null;
    const win = document.querySelector(".main-window");
    const ws = win ? getComputedStyle(win) : null;
    return {
      title: title?.textContent?.trim(),
      titleFamily: ts?.fontFamily,
      titleWeight: ts?.fontWeight,
      titleSize: ts?.fontSize,
      backText: back?.textContent?.trim(),
      backFamily: bs?.fontFamily,
      backWeight: bs?.fontWeight,
      filesHistoryInHeader: files.map((f) => ({
        t: f.textContent.trim(),
        parent: f.closest(".card-view-head") ? "header" : f.closest("header") ? "header2" : "elsewhere",
      })),
      headerHTML: head?.innerText,
      bubbleBg: bus?.backgroundColor,
      winBg: ws?.backgroundColor,
      winFilter: ws?.backdropFilter || ws?.webkitBackdropFilter,
    };
  });
  log.notes.fontsCard = await collectFonts(page);
  await shot(page, `${prefix}-card`);

  await forceClick(page, ".card-back");
  await page.waitForTimeout(350);

  log.notes.settings = await inspectSettings(page, prefix);
  await forceClick(page, ".alert-dim");
  await page.waitForTimeout(300);

  async function openApp(label) {
    await forceClick(page, ".settings-orb");
    await page.waitForTimeout(350);
    await forceClick(page, page.locator(".app-icon").filter({ hasText: new RegExp(`^${label}$`) }));
    await page.waitForTimeout(500);
  }

  await openApp("History");
  log.notes.history = await page.evaluate(() => {
    const sheet = document.querySelector(".float-window");
    const s = sheet ? getComputedStyle(sheet) : null;
    const scrim = document.querySelector(".sheet-scrim");
    const sc = scrim ? getComputedStyle(scrim) : null;
    const avatars = [...document.querySelectorAll(".hist-avatar, .avatar, .letter-avatar")];
    const rows = [...document.querySelectorAll(".hist-row")].map((r) => r.innerText.replace(/\s+/g, " ").trim());
    const close = document.querySelector(".sheet-close");
    const cs = close ? getComputedStyle(close) : null;
    const cr = close?.getBoundingClientRect();
    return {
      sheetBg: s?.backgroundColor,
      sheetFilter: s?.backdropFilter || s?.webkitBackdropFilter,
      scrimBg: sc?.backgroundColor,
      scrimFilter: sc?.backdropFilter || sc?.webkitBackdropFilter,
      avatars: avatars.length,
      rows,
      close: close
        ? {
            bg: cs.backgroundColor,
            w: cr.width,
            h: cr.height,
            aria: close.getAttribute("aria-label"),
            text: close.textContent.trim(),
          }
        : null,
      yearsDays: /\b(Years|Days)\b/.test(document.body.innerText),
      room: /Room/.test(document.body.innerText),
    };
  });
  log.notes.fontsHist = await collectFonts(page);
  await shot(page, `${prefix}-history`);
  await forceClick(page, ".sheet-scrim");
  await page.waitForTimeout(400);

  await openApp("Files");
  log.notes.files = await page.evaluate(() => {
    const labels = [...document.querySelectorAll(".years-label, .surface-label, h2, h3")].map((el) =>
      el.textContent.trim(),
    );
    const close = document.querySelector(".close-affordance");
    const cs = close ? getComputedStyle(close) : null;
    const cr = close?.getBoundingClientRect();
    return {
      labels,
      yearsDays: /\b(Years|Days)\b/.test(document.body.innerText),
      close: close
        ? { bg: cs.backgroundColor, w: cr.width, h: cr.height, vis: cr.width > 0, aria: close.getAttribute("aria-label") }
        : null,
      workFrost: !!document.querySelector(".work-frost"),
    };
  });
  await shot(page, `${prefix}-files`);
  await forceClick(page, ".close-affordance");
  await page.waitForTimeout(400);

  await openApp("Imagine");
  log.notes.imagine = await page.evaluate(() => {
    return {
      text: document.querySelector(".imagine-wrap, .window-body")?.innerText?.slice(0, 400),
      yearsDays: /\b(Years|Days)\b/.test(document.body.innerText),
      close: (() => {
        const close = document.querySelector(".close-affordance");
        if (!close) return null;
        const cs = getComputedStyle(close);
        const cr = close.getBoundingClientRect();
        return { bg: cs.backgroundColor, w: cr.width, h: cr.height, aria: close.getAttribute("aria-label") };
      })(),
    };
  });
  await shot(page, `${prefix}-imagine`);
  await forceClick(page, ".close-affordance");
  await page.waitForTimeout(400);

  await openApp("Smart");
  log.notes.smart = await page.evaluate(() => {
    const btns = [...document.querySelectorAll(".hub-btn")].map((b) => {
      const s = getComputedStyle(b);
      return { t: b.textContent.trim(), family: s.fontFamily, weight: s.fontWeight, w: +b.getBoundingClientRect().width.toFixed(1) };
    });
    return { btns, text: document.querySelector(".smart-hub, .smart-shell")?.innerText?.slice(0, 300) };
  });
  await shot(page, `${prefix}-smart-hub`);
  await forceClick(page, page.locator(".hub-btn").filter({ hasText: /Smart Cards/ }));
  await page.waitForTimeout(400);
  await shot(page, `${prefix}-smart-cards`);
  await forceClick(page, ".close-affordance");
  await page.waitForTimeout(400);

  await openApp("Themes");
  log.notes.themes = await page.evaluate(() => {
    const labels = [...document.querySelectorAll(".years-label")].map((el) => el.textContent.trim());
    return {
      labels,
      yearsDays: /\b(Years|Days)\b/.test(document.body.innerText),
      heading: document.querySelector(".surface-label")?.textContent?.trim(),
    };
  });
  await shot(page, `${prefix}-themes`);
  await forceClick(page, ".close-affordance");
  await page.waitForTimeout(300);

  await page.close();
  return log;
}

const d = await run("d", { width: 1280, height: 800 });
const m = await run("m", { width: 390, height: 844 });

await writeFile(`${OUT}/raw.json`, JSON.stringify({ d, m }, null, 2));
console.log("WROTE", `${OUT}/raw.json`);
console.log("DESKTOP orb", JSON.stringify(d.notes.orb, null, 2));
console.log("DESKTOP motion", JSON.stringify(d.notes.motion, null, 2));
console.log("DESKTOP promptOpen", JSON.stringify(d.notes.promptOpen, null, 2));
console.log("DESKTOP promptClosing", JSON.stringify(d.notes.promptClosing, null, 2));
console.log("DESKTOP card", JSON.stringify(d.notes.card, null, 2));
console.log("DESKTOP fonts body", JSON.stringify(d.notes.fontsHome?.body, null, 2));
console.log("DESKTOP cardName", JSON.stringify(d.notes.fontsHome?.cardName, null, 2));
console.log("DESKTOP weights", d.notes.fontsHome?.weights);
console.log("DESKTOP families", d.notes.fontsHome?.families);
console.log("DESKTOP manrope", JSON.stringify(d.notes.fontsHome?.manropeLoaded, null, 2));
console.log("DESKTOP settings account", JSON.stringify(d.notes.settings?.account, null, 2));
console.log("DESKTOP settings models elite/pro", JSON.stringify({
  eliteBg: d.notes.settings?.models?.eliteBg,
  eliteOutline: d.notes.settings?.models?.eliteOutline,
  proBg: d.notes.settings?.models?.proBg,
  chipWeights: [...new Set(d.notes.settings?.models?.chips?.map((c) => c.weight))],
  chipFamily: d.notes.settings?.models?.chips?.[0]?.family,
  locks: d.notes.settings?.models?.locks,
}, null, 2));
console.log("DESKTOP settings settings", JSON.stringify(d.notes.settings?.settings, null, 2));
console.log("DESKTOP history", JSON.stringify(d.notes.history, null, 2));
console.log("DESKTOP files", JSON.stringify(d.notes.files, null, 2));
console.log("DESKTOP themes", JSON.stringify(d.notes.themes, null, 2));
console.log("DESKTOP smart", JSON.stringify(d.notes.smart, null, 2));
console.log("DESKTOP invest", JSON.stringify(d.notes.invest, null, 2));
console.log("DESKTOP home cards", JSON.stringify(d.notes.home?.cards, null, 2));
console.log("MOBILE orb", JSON.stringify(m.notes.orb, null, 2));
console.log("MOBILE motion", JSON.stringify(m.notes.motion, null, 2));
console.log("MOBILE card", JSON.stringify(m.notes.card, null, 2));
console.log("MOBILE promptOpen", JSON.stringify(m.notes.promptOpen, null, 2));
console.log("pageerrors d", d.fails, "m", m.fails);

await browser.close();
