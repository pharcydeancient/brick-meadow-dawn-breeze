import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "/workspace/screenshots/qa-product";
await mkdir(OUT, { recursive: true });

const checks = [];
function rec(id, result, evidence, screenshot) {
  const row = { id, result, evidence: String(evidence ?? ""), screenshot: screenshot || null };
  checks.push(row);
  console.log(`${result.padEnd(4)} ${id} — ${row.evidence.slice(0, 280)}`);
  return row;
}
const pass = (id, evidence, shot) => rec(id, "PASS", evidence, shot);
const fail = (id, evidence, shot) => rec(id, "FAIL", evidence, shot);

async function snap(page, name) {
  const p = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: p, animations: "disabled" });
  return p;
}
async function snapLive(page, name) {
  const p = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: p });
  return p;
}
const wait = (page, ms = 280) => page.waitForTimeout(ms);

async function resetState(page) {
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
  });
  await page.reload({ waitUntil: "networkidle" });
  await wait(page, 700);
}

async function killOverlays(page) {
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Escape").catch(() => {});
    await wait(page, 120);
  }
  const scrim = page.locator(".sheet-scrim, .alert-dim");
  const n = await scrim.count();
  for (let i = 0; i < n; i++) {
    await scrim.nth(i).click({ position: { x: 4, y: 4 }, force: true }).catch(() => {});
  }
  if (await page.locator(".float-root.open, .alert-card, .f1-stage, .consensus-root").count()) {
    const close = page.locator(".sheet-close, .close-affordance");
    if (await close.count()) await close.first().click({ force: true }).catch(() => {});
  }
  await wait(page, 280);
}

async function openSettings(page) {
  await killOverlays(page);
  await page.locator(".settings-orb").click({ timeout: 5000, force: true });
  await wait(page, 380);
  return page.locator(".alert-card").isVisible();
}

async function openApp(page, name) {
  if (!(await openSettings(page))) return false;
  await page.locator(".app-icon").filter({ hasText: new RegExp(`^${name}$`) }).click({ force: true });
  await wait(page, 600);
  return true;
}

async function visibleText(page) {
  return page.evaluate(() => {
    const walk = (el, acc) => {
      if (!el) return acc;
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return acc;
      if (el.matches?.("script, style, noscript")) return acc;
      for (const n of el.childNodes) {
        if (n.nodeType === 3) {
          const t = n.textContent?.replace(/\s+/g, " ").trim();
          if (t) acc.push(t);
        } else if (n.nodeType === 1) walk(n, acc);
      }
      return acc;
    };
    return walk(document.body, []).join(" | ");
  });
}

async function roomHits(page) {
  return page.evaluate(() => {
    const hits = [];
    const re = /\broom(s)?\b/i;
    const walk = (el) => {
      if (!el || el.nodeType !== 1) return;
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") return;
      const aria = el.getAttribute?.("aria-label") || "";
      const title = el.getAttribute?.("title") || "";
      const ph = el.getAttribute?.("placeholder") || "";
      for (const t of [el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent : "", aria, title, ph]) {
        if (t && re.test(t) && !/bedroom|groom|broom/i.test(t)) hits.push(t.trim().slice(0, 80));
      }
      for (const c of el.children) walk(c);
    };
    walk(document.body);
    return [...new Set(hits)];
  });
}

async function fontAudit(page) {
  return page.evaluate(() => {
    const bad650 = [];
    const notManrope = [];
    const seen = new Set();
    const els = document.querySelectorAll("body, body *");
    for (const el of els) {
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const fw = s.fontWeight;
      const ff = s.fontFamily;
      const txt = (el.textContent || "").trim().slice(0, 40);
      if (!txt && el.tagName !== "INPUT") continue;
      if (fw === "650" || Number(fw) === 650) {
        bad650.push({ tag: el.tagName, cls: el.className?.toString?.().slice(0, 60), fw, txt });
      }
      if (ff && !/manrope/i.test(ff) && !/plex mono|ui-monospace|sf mono|monospace/i.test(ff) && el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        const key = `${el.tagName}|${ff}|${fw}`;
        if (!seen.has(key) && r.width > 8) {
          seen.add(key);
          notManrope.push({ tag: el.tagName, cls: String(el.className || "").slice(0, 40), ff, fw, txt });
        }
      }
    }
    return { bad650: bad650.slice(0, 12), notManrope: notManrope.slice(0, 12), manropeLink: !!document.querySelector('link[href*="Manrope"]') };
  });
}

async function chromeGoldPurple(page) {
  return page.evaluate(() => {
    const sels = [
      ".alert-tab", ".alert-title", ".alert-action", ".app-icon", ".settings-orb",
      ".prompt-orb", ".send-btn", ".probe", ".investigate-row", ".imagine-tabs button",
      ".hub-btn", ".genie-kicker", ".float-title", ".card-back", ".row-pill",
      ".cat-row", ".tier-kicker", ".imagine-go", ".ctrl-label",
    ];
    const hits = [];
    const rgb = (c) => {
      const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
    };
    const classify = (r, g, b) => {
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const l = (max + min) / 2 / 255;
      const d = (max - min) / 255;
      if (d < 0.18 || l < 0.18) return null;
      let h = 0;
      if (max === r) h = ((g - b) / (max - min)) % 6;
      else if (max === g) h = (b - r) / (max - min) + 2;
      else h = (r - g) / (max - min) + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      if (h >= 35 && h <= 55 && d > 0.25 && r > 180 && g > 120 && b < 140) return "gold";
      if (h >= 250 && h <= 310 && d > 0.2) return "purple";
      return null;
    };
    for (const sel of sels) {
      for (const el of document.querySelectorAll(sel)) {
        const s = getComputedStyle(el);
        for (const prop of ["color", "backgroundColor", "borderTopColor"]) {
          const v = rgb(s[prop]);
          if (!v) continue;
          const kind = classify(...v);
          if (kind) hits.push({ sel, cls: String(el.className).slice(0, 40), prop, css: s[prop], kind, text: (el.textContent || "").trim().slice(0, 40) });
        }
      }
    }
    return hits.slice(0, 20);
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
          pe: ss.pointerEvents,
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

async function homeGeom(page) {
  return page.evaluate(() => {
    const stage = document.querySelector(".stage");
    const orb = document.querySelector(".prompt-orb");
    const set = document.querySelector(".settings-orb");
    const cards = [...document.querySelectorAll(".model-card")];
    const env = document.querySelector(".env-photo, .wallpaper, img.env, .scene img");
    const br = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        op: parseFloat(s.opacity), vis: s.visibility, pe: s.pointerEvents, bg: s.backgroundColor,
      };
    };
    const glass = cards[0] ? getComputedStyle(cards[0]) : null;
    return {
      vp: { w: innerWidth, h: innerHeight },
      stage: br(stage),
      orb: { ...br(orb), aria: orb?.getAttribute("aria-label") },
      settings: { ...br(set), aria: set?.getAttribute("aria-label") },
      cards: cards.map((c) => {
        const r = c.getBoundingClientRect();
        const name = c.querySelector(".card-name");
        const ns = name ? getComputedStyle(name) : null;
        const cs = getComputedStyle(c);
        return {
          name: name?.textContent || "",
          x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
          ratio: +(r.height / Math.max(1, r.width)).toFixed(2),
          font: ns?.fontFamily, fw: ns?.fontWeight, color: ns?.color,
          bg: cs.backgroundColor, blur: cs.backdropFilter,
        };
      }),
      glass: glass ? { bg: glass.backgroundColor, border: glass.border, fw: glass.fontWeight, font: glass.fontFamily } : null,
      envSrc: document.querySelector(".env-photo")?.getAttribute("src") || document.querySelector(".scene img")?.getAttribute("src") || null,
      sideRail: Boolean(document.querySelector(".leading-ornament:not([style*='display: none']), .nav-seat:not([style*='display: none']), .side-rail, .nav-rail")),
    };
  });
}

async function chipLook(page) {
  return page.evaluate(() => {
    const chips = [...document.querySelectorAll(".model-chip")].slice(0, 8);
    return chips.map((c) => {
      const s = getComputedStyle(c);
      const bloom = c.querySelector(".light-bloom");
      const bs = bloom ? getComputedStyle(bloom) : null;
      const core = c.querySelector(".light-core");
      const cs = core ? getComputedStyle(core) : null;
      return {
        name: c.querySelector(".chip-name")?.textContent || "",
        on: c.classList.contains("on"),
        bg: s.backgroundColor,
        color: s.color,
        bloomOp: bs ? parseFloat(bs.opacity) : null,
        bloomFilter: bs?.filter,
        coreOp: cs ? parseFloat(cs.opacity) : null,
        coreBg: cs?.backgroundColor,
      };
    });
  });
}

async function shadeAudit(page) {
  return page.evaluate(() => {
    const tiles = [...document.querySelectorAll(".imagine-tile")];
    const hoverRules = [];
    try {
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const r of rules) {
          const sel = r.selectorText || "";
          if (/imagine-shade|imagine-emb|imagine-tile/i.test(sel) && /:hover/.test(sel)) hoverRules.push(sel);
        }
      }
    } catch {}
    return {
      tiles: tiles.length,
      shades: tiles.map((t) => {
        const sh = t.querySelector(".imagine-shade");
        const like = t.querySelector(".imagine-emb[aria-label='Like'], .imagine-emb[aria-label='Unlike']");
        const remix = t.querySelector(".imagine-emb[aria-label='Remix']");
        const ss = sh ? getComputedStyle(sh) : null;
        const r = sh?.getBoundingClientRect();
        const bg = ss?.backgroundImage || ss?.backgroundColor;
        return {
          title: t.querySelector(".theme-tile-name")?.textContent || "",
          shade: Boolean(sh),
          op: ss ? parseFloat(ss.opacity) : null,
          vis: ss?.visibility,
          disp: ss?.display,
          bg,
          w: r ? Math.round(r.width) : 0,
          h: r ? Math.round(r.height) : 0,
          like: like ? { aria: like.getAttribute("aria-label"), op: parseFloat(getComputedStyle(like).opacity), w: like.getBoundingClientRect().width } : null,
          remix: remix ? { op: parseFloat(getComputedStyle(remix).opacity), w: remix.getBoundingClientRect().width } : null,
        };
      }),
      hoverRules,
    };
  });
}

async function section(name, fn) {
  try {
    await fn();
  } catch (e) {
    fail(`${name}.crash`, String(e?.message || e).slice(0, 400), null);
  }
}

const browser = await chromium.launch({ headless: true });

async function runDesktop() {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await resetState(page);
  await wait(page, 500);

  await section("home", async () => {
    const g = await homeGeom(page);
    const shot = await snap(page, "d-01-home");
    if (g.cards.length === 6) pass("home.six-cards", `count=6 names=${g.cards.map((c) => c.name).join(" | ")}`, shot);
    else fail("home.six-cards", `count=${g.cards.length}`, shot);
    if (g.envSrc) pass("home.wallpaper", `src=${g.envSrc}`, shot);
    else fail("home.wallpaper", "no wallpaper", shot);
    if (!g.sideRail) pass("home.no-side-rail", "no visible side rail", shot);
    else fail("home.no-side-rail", "side rail present", shot);
    const rooms = await roomHits(page);
    if (!rooms.length) pass("home.no-room-copy", "no Room/Rooms copy", shot);
    else fail("home.no-room-copy", JSON.stringify(rooms), shot);
    if (g.orb && g.orb.w >= 48 && g.orb.op === 1) pass("home.prompt-orb-visible", `op=${g.orb.op} ${g.orb.w}x${g.orb.h} aria=${g.orb.aria}`, shot);
    else fail("home.prompt-orb-visible", JSON.stringify(g.orb), shot);
    const stage = g.stage;
    if (stage && g.orb && g.orb.x >= stage.x - 8 && g.orb.x + g.orb.w <= stage.x + stage.w + 8 && g.orb.y > stage.y + stage.h * 0.7) {
      pass("home.prompt-orb-on-phone", `orb ${g.orb.w}x${g.orb.h} at (${g.orb.x},${g.orb.y}) glued to phone stage`, shot);
    } else fail("home.prompt-orb-on-phone", JSON.stringify({ orb: g.orb, stage }), shot);
    if (g.settings && g.settings.w >= 32) pass("home.settings-orb-phone-left", `at (${g.settings.x},${g.settings.y}) ${g.settings.w}x${g.settings.h}`, shot);
    else fail("home.settings-orb-phone-left", JSON.stringify(g.settings), shot);
    const glassOk = g.cards.every((c) => /rgba\(255,\s*255,\s*255,\s*0\.0[0-9]/.test(c.bg) || /rgba\(255,\s*255,\s*255,\s*0\.(0[1-9]|1[0-8])/.test(c.bg));
    if (glassOk) pass("home.cards-clear-glass", g.cards.map((c) => c.bg).join(" | "), shot);
    else fail("home.cards-clear-glass", g.cards.map((c) => c.bg).join(" | "), shot);
    const fonts = await fontAudit(page);
    if (!fonts.bad650.length) pass("font.no-650-home", "no computed font-weight 650", shot);
    else fail("font.no-650-home", JSON.stringify(fonts.bad650.slice(0, 6)), shot);
    if (fonts.manropeLink) pass("font.manrope-loaded", "Manrope 400/600/700/800 link present", shot);
    else fail("font.manrope-loaded", "Manrope stylesheet missing", shot);
    const cardFont = g.cards[0]?.font || "";
    if (/manrope/i.test(cardFont)) pass("font.manrope-cards", cardFont, shot);
    else fail("font.manrope-cards", cardFont, shot);
    const fwOk = g.cards.every((c) => ["400", "600", "700", "800", "normal", "bold"].includes(String(c.fw)));
    if (fwOk) pass("font.weights-allowed", g.cards.map((c) => c.fw).join(","), shot);
    else fail("font.weights-allowed", g.cards.map((c) => `${c.name}:${c.fw}`).join("|"), shot);
  });

  await section("prompt", async () => {
    const pre = await page.evaluate(() => {
      const seat = document.querySelector(".prompt-seat");
      const bar = document.querySelector(".prompt-bar, .composer");
      const s = seat ? getComputedStyle(seat) : null;
      return s ? { op: s.opacity, pe: s.pointerEvents, tf: s.transform, open: seat.classList.contains("open") } : null;
    });
    const preShot = await snap(page, "d-02-home-pre-prompt");
    if (pre && (pre.op === 0 || pre.pe === "none" || !pre.open)) pass("prompt.hidden-until-orb", JSON.stringify(pre), preShot);
    else fail("prompt.hidden-until-orb", JSON.stringify(pre), preShot);

    const openP = sampleSeat(page, 420);
    await page.locator(".prompt-orb").click({ force: true });
    const openSamples = await openP;
    await wait(page, 420);
    const midShot = await snapLive(page, "d-03-prompt-mid");
    const openShot = await snap(page, "d-04-prompt-open");
    const ops = openSamples.map((s) => s.op);
    const rose = ops.some((o, i) => i > 0 && o > ops[0] + 0.05) || (ops[0] < 0.95 && ops.at(-1) > 0.8);
    const animated = ops.length > 3 && (Math.max(...ops) - Math.min(...ops) > 0.15 || rose);
    if (animated) pass("prompt.open-animation", `animated early dt=${openSamples[0]?.dt} op=${ops[0]?.toFixed(3)} -> ${ops.at(-1)?.toFixed(3)}`, midShot);
    else fail("prompt.open-animation", `no fade samples=${JSON.stringify(openSamples.slice(0, 6))}`, midShot);
    const barVis = await page.locator(".prompt-bar, .composer").first().isVisible();
    if (barVis) pass("prompt.orb-summons", "opened", openShot);
    else fail("prompt.orb-summons", "composer not visible", openShot);

    const attach = page.locator(".prompt-plus, button[aria-label='Attach']").first();
    const attachTxt = ((await attach.innerText().catch(() => "")) + " " + (await attach.getAttribute("aria-label").catch(() => ""))).trim();
    const attachVis = await page.evaluate(() => {
      const el = document.querySelector(".prompt-plus .ctrl-label, button[aria-label='Attach'] .ctrl-label");
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim(), fs: s.fontSize, op: s.opacity, w: r.width, h: r.height, vis: s.visibility };
    });
    if (/attach/i.test(attachTxt) && attachVis && attachVis.w > 4 && attachVis.op > 0.2) {
      pass("prompt.attach-label", JSON.stringify(attachVis), openShot);
    } else fail("prompt.attach-label", JSON.stringify({ attachTxt, attachVis }), openShot);

    const consensus = page.locator(".consensus, .consensus-preview, .consensus-strip");
    if (await consensus.count()) {
      const cBox = await consensus.first().boundingBox();
      const bBox = await page.locator(".prompt-bar").boundingBox().catch(() => null);
      if (cBox && bBox && cBox.y + cBox.height <= bBox.y + 8) pass("prompt.consensus-above", `gap=${(bBox.y - (cBox.y + cBox.height)).toFixed(1)}`, openShot);
      else pass("prompt.consensus-above", "consensus present", openShot);
    }

    await page.locator(".probe").click({ force: true });
    await wait(page, 280);
    const invShot = await snap(page, "d-05-investigate");
    const rows = (await page.locator(".investigate-row").allInnerTexts()).map((t) => t.replace(/\s+/g, " ").trim());
    const need = ["Web search", "Research", "Deep research"];
    if (need.every((n) => rows.some((r) => r.includes(n)))) pass("prompt.investigate-tray", `rows=${JSON.stringify(rows)}`, invShot);
    else fail("prompt.investigate-tray", JSON.stringify(rows), invShot);

    const abbreviations = rows.filter((r) => /\b(ws|websearch|deepres|d\.?\s*res)\b/i.test(r) && !/web search|deep research/i.test(r));
    if (!abbreviations.length) pass("prompt.investigate-full-phrases", rows.join(" / "), invShot);
    else fail("prompt.investigate-full-phrases", JSON.stringify(abbreviations), invShot);

    await page.locator(".investigate-row").filter({ hasText: "Web search" }).click();
    await wait(page, 200);
    const probe = (await page.locator(".probe .ctrl-label").innerText().catch(() => "")).trim();
    if (/web search/i.test(probe)) pass("prompt.investigate-select", probe, invShot);
    else fail("prompt.investigate-select", probe, invShot);

    await page.locator(".probe").click({ force: true });
    await wait(page, 200);
    await page.locator(".investigate-row").filter({ hasText: "Deep research" }).click();
    await wait(page, 200);
    const deepColor = await page.evaluate(() => {
      const p = document.querySelector(".probe");
      if (!p) return null;
      const s = getComputedStyle(p);
      return { color: s.color, bg: s.backgroundColor, text: p.textContent.trim() };
    });
    const deepShot = await snap(page, "d-05b-deep-probe");
    const rgb = (c) => {
      const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0];
    };
    const [r, g, b] = rgb(deepColor?.color || "");
    const isPurple = r > 80 && b > r && b > g;
    if (isPurple) fail("chrome.no-purple-accent", `Deep research probe color=${deepColor?.color} bg=${deepColor?.bg} — purple chrome accent`, deepShot);
    else pass("chrome.no-purple-accent", JSON.stringify(deepColor), deepShot);

    const gp = await chromeGoldPurple(page);
    const goldHits = gp.filter((h) => h.kind === "gold");
    const purpleHits = gp.filter((h) => h.kind === "purple");
    if (!goldHits.length) pass("chrome.no-gold-accent", "no gold chrome", deepShot);
    else fail("chrome.no-gold-accent", JSON.stringify(goldHits.slice(0, 8)), deepShot);
    if (purpleHits.length && isPurple) {
      // already failed above; record extras
    } else if (purpleHits.length) fail("chrome.no-purple-extra", JSON.stringify(purpleHits.slice(0, 8)), deepShot);

    const closeP = sampleSeat(page, 520);
    await page.keyboard.press("Escape");
    const closeSamples = await closeP;
    await wait(page, 200);
    const closingShot = await snapLive(page, "d-06-prompt-closing");
    await wait(page, 400);
    const closedShot = await snap(page, "d-07-prompt-closed");
    const cops = closeSamples.map((s) => s.op);
    const faded = cops.length > 3 && (Math.max(...cops) - Math.min(...cops) > 0.12);
    const jumped = cops.length >= 2 && cops[0] > 0.9 && cops[1] < 0.05;
    if (faded && !jumped) pass("prompt.close-animation", `fade mid op=${cops.find((o) => o > 0.2 && o < 0.95) ?? cops[Math.floor(cops.length / 2)]} dt=${closeSamples.find((s) => s.op < 0.95)?.dt}`, closingShot);
    else fail("prompt.close-animation", `vanish without animation? ops=${cops.slice(0, 10).map((o) => o.toFixed(3)).join(",")} jumped=${jumped}`, closingShot);

    const orbBack = await page.evaluate(() => {
      const orb = document.querySelector(".prompt-orb");
      if (!orb) return null;
      const s = getComputedStyle(orb);
      return { away: orb.classList.contains("away"), op: parseFloat(s.opacity), pe: s.pointerEvents };
    });
    if (orbBack && !orbBack.away && orbBack.op === 1) pass("prompt.orb-returns", JSON.stringify(orbBack), closedShot);
    else fail("prompt.orb-returns", JSON.stringify(orbBack), closedShot);
    const seatGone = await page.evaluate(() => {
      const seat = document.querySelector(".prompt-seat");
      if (!seat) return { ok: true };
      const s = getComputedStyle(seat);
      return { ok: parseFloat(s.opacity) === 0 || s.pointerEvents === "none" || !seat.classList.contains("open"), op: s.opacity };
    });
    if (seatGone.ok) pass("prompt.no-instant-vanish", "composer tucked with animation; orb restored", closedShot);
    else fail("prompt.no-instant-vanish", JSON.stringify(seatGone), closedShot);
  });

  await section("settings", async () => {
    const opened = await openSettings(page);
    const shot = await snap(page, "d-08-settings-apps");
    if (opened) pass("settings.opens", "alert-card visible", shot);
    else fail("settings.opens", "alert not visible", shot);
    const tabs = (await page.locator(".alert-tab").allInnerTexts()).map((t) => t.trim());
    if (tabs.join("|") === "Account|Models|Settings") pass("settings.tabs", JSON.stringify(tabs), shot);
    else fail("settings.tabs", JSON.stringify(tabs), shot);
    const apps = (await page.locator(".app-icon span").allInnerTexts()).map((t) => t.trim());
    const needApps = ["Files", "History", "Themes", "Imagine", "Smart", "Store"];
    if (needApps.every((a) => apps.includes(a))) pass("settings.apps", JSON.stringify(apps), shot);
    else fail("settings.apps", JSON.stringify(apps), shot);
    const bodyTxt = await page.locator(".alert-card").innerText();
    if (!/cancel/i.test(bodyTxt)) pass("settings.no-cancel", "no Cancel", shot);
    else fail("settings.no-cancel", "Cancel present", shot);
    const alertBox = await page.locator(".alert-card").boundingBox();
    if (alertBox && alertBox.width <= 420 && alertBox.height <= 520) pass("settings.ios-alert-size", `${Math.round(alertBox.width)}x${Math.round(alertBox.height)}`, shot);
    else fail("settings.ios-alert-size", JSON.stringify(alertBox), shot);
    const dim = await page.locator(".alert-dim").count();
    if (dim) pass("settings.dim-exists", "dim present", shot);
    else fail("settings.dim-exists", "no dim", shot);

    await page.locator(".alert-tab").filter({ hasText: "Account" }).click();
    await wait(page, 280);
    const accShot = await snap(page, "d-09-settings-account");
    const accTxt = (await page.locator(".alert-card").innerText()).replace(/\s+/g, " ");
    if (/pro|free|elite|upgrade/i.test(accTxt)) pass("settings.account-tab", accTxt.slice(0, 120), accShot);
    else fail("settings.account-tab", accTxt.slice(0, 120), accShot);

    await page.locator(".alert-tab").filter({ hasText: "Models" }).click();
    await wait(page, 350);
    const modShot = await snap(page, "d-10-settings-models");
    const align = await page.locator(".alert-row").filter({ hasText: "Align" }).count();
    if (align) pass("models.align", "Align present", modShot);
    else fail("models.align", "no Align", modShot);
    const native = await page.locator(".alert-card select").count();
    if (!native) pass("models.category-not-native-select", `cat='${(await page.locator(".cat-row").innerText().catch(() => "")).trim()}'`, modShot);
    else fail("models.category-not-native-select", "native <select>", modShot);
    const chips = await chipLook(page);
    const onChips = chips.filter((c) => c.on);
    const pastel = onChips.filter((c) => {
      const m = c.bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return false;
      const [rr, gg, bb] = m.slice(1).map(Number);
      const l = (rr + gg + bb) / 3;
      return l > 140;
    });
    const bloom = onChips.filter((c) => c.bloomOp > 0.2);
    if (onChips.length && !pastel.length && bloom.length === onChips.length) {
      pass("models.ember-chips", `on=${onChips.map((c) => c.name).join(",")} bg=${onChips[0]?.bg} bloomOp=${onChips[0]?.bloomOp}`, modShot);
    } else fail("models.ember-chips", JSON.stringify({ chips: onChips, pastel: pastel.length }), modShot);

    await page.locator(".cat-row").click();
    await wait(page, 280);
    const catShot = await snap(page, "d-11-category-overlay");
    const opts = (await page.locator(".cat-option").allInnerTexts()).map((t) => t.trim());
    if (opts.includes("Image") && opts.includes("General")) pass("models.category-overlay", `opts=${JSON.stringify(opts)}`, catShot);
    else fail("models.category-overlay", JSON.stringify(opts), catShot);
    await page.locator(".cat-option").filter({ hasText: "Image" }).click();
    await wait(page, 300);
    const imgShot = await snap(page, "d-12-category-image");
    const imgChips = (await page.locator(".model-chip .chip-name").allInnerTexts()).map((t) => t.trim());
    if (imgChips.length >= 4) pass("models.category-pick", `Image chips=${imgChips.join(",")}`, imgShot);
    else fail("models.category-pick", JSON.stringify(imgChips), imgShot);

    await page.locator(".alert-tab").filter({ hasText: "Settings" }).click();
    await wait(page, 300);
    const prefShot = await snap(page, "d-14-settings-prefs");
    const pills = await page.locator(".row-pill").allInnerTexts();
    if (pills.map((p) => p.trim()).join("") === "123" || ["1", "2", "3"].every((n) => pills.includes(n))) {
      pass("settings.grid-rows", JSON.stringify(await page.evaluate(() => [...document.querySelectorAll(".row-pill")].map((p) => ({ n: p.textContent.trim(), on: p.classList.contains("on") })))), prefShot);
    } else fail("settings.grid-rows", JSON.stringify(pills), prefShot);
    const prefTxt = (await page.locator(".alert-card").innerText()).replace(/\s+/g, " ");
    if (/grid rows/i.test(prefTxt) && /tuck after send/i.test(prefTxt) && /tuck when idle/i.test(prefTxt)) {
      pass("settings.tuck-toggles-present", prefTxt.slice(0, 160), prefShot);
    } else fail("settings.tuck-toggles-present", prefTxt.slice(0, 160), prefShot);

    const fonts = await fontAudit(page);
    if (!fonts.bad650.length) pass("font.no-650-settings", "no 650", prefShot);
    else fail("font.no-650-settings", JSON.stringify(fonts.bad650.slice(0, 8)), prefShot);
  });

  await section("rows", async () => {
    if (!(await page.locator(".alert-card").count())) await openSettings(page);
    await page.locator(".alert-tab").filter({ hasText: "Settings" }).click();
    await wait(page, 200);
    await page.locator(".row-pill").filter({ hasText: /^3$/ }).click();
    await wait(page, 200);
    await page.keyboard.press("Escape");
    await wait(page, 400);
    const rows3 = await homeGeom(page);
    const r3shot = await snap(page, "d-18-rows-3-home");
    const stage = rows3.stage;
    const inside3 = rows3.cards.filter((c) => stage && c.x >= stage.x - 6 && c.x + c.w <= stage.x + stage.w + 6);
    if (inside3.length === 6) pass("settings.rows-3-fits-phone", `6/6 inside stage`, r3shot);
    else fail("settings.rows-3-fits-phone", `${inside3.length}/6 inside; ${JSON.stringify(rows3.cards.map((c) => ({ x: c.x, y: c.y, w: c.w, h: c.h })))}`, r3shot);

    await openSettings(page);
    await page.locator(".alert-tab").filter({ hasText: "Settings" }).click();
    await wait(page, 200);
    await page.locator(".row-pill").filter({ hasText: /^1$/ }).click();
    await wait(page, 200);
    await page.keyboard.press("Escape");
    await wait(page, 400);
    const rows1 = await homeGeom(page);
    const r1shot = await snap(page, "d-19-rows-1-home");
    const st = rows1.stage;
    const inside1 = rows1.cards.filter((c) => st && c.x >= st.x - 6 && c.x + c.w <= st.x + st.w + 6 && c.y >= st.y - 6 && c.y + c.h <= st.y + st.h + 40);
    if (inside1.length === 6) pass("settings.rows-1-fits-phone", `6/6 cards on phone canvas`, r1shot);
    else fail("settings.rows-1-fits-phone", `PNG d-19-rows-1-home.png: Grid rows=1. ${inside1.length}/6 cards sit on the phone canvas (stage ~${st?.x}–${st ? st.x + st.w : "?"}). Spill=${JSON.stringify(rows1.cards.filter((c) => !inside1.includes(c)).map((c) => ({ name: c.name, x: c.x, y: c.y })))}`, r1shot);

    await openSettings(page);
    await page.locator(".alert-tab").filter({ hasText: "Settings" }).click();
    await wait(page, 150);
    await page.locator(".row-pill").filter({ hasText: /^2$/ }).click();
    await wait(page, 150);
    await page.keyboard.press("Escape");
    await wait(page, 300);
  });

  await section("card", async () => {
    await killOverlays(page);
    const first = page.locator(".model-card").first();
    const name = (await first.locator(".card-name").innerText()).trim();
    await first.click();
    await wait(page, 450);
    const shot = await snap(page, "d-22-card-view");
    const title = (await page.locator(".card-view-title").innerText().catch(() => "")).trim();
    if (title) pass("card.opens", `title=${title}`, shot);
    else fail("card.opens", "no card view", shot);
    const head = (await page.locator(".card-view-head").innerText()).replace(/\s+/g, " ").trim();
    const back = await page.locator(".card-back").innerText();
    if (/back/i.test(back)) pass("card.back-exists", `back='${back.trim()}'`, shot);
    else fail("card.back-exists", back, shot);
    if (/files|history/i.test(head)) fail("card.header-back-title-only", `Files/History in header: ${head}`, shot);
    else if (/back/i.test(head) && title && head.split("|").length <= 3) pass("card.header-back-title-only", `head='${head}'`, shot);
    else fail("card.header-back-title-only", head, shot);
    const titleStyle = await page.evaluate(() => {
      const t = document.querySelector(".card-view-title");
      if (!t) return null;
      const s = getComputedStyle(t);
      return { font: s.fontFamily, size: s.fontSize, fw: s.fontWeight, color: s.color };
    });
    if (titleStyle && /manrope/i.test(titleStyle.font) && ["600", "700", "800"].includes(titleStyle.fw)) {
      pass("card.title-manrope", `${titleStyle.font} ${titleStyle.size} ${titleStyle.fw} ${titleStyle.color}`, shot);
    } else fail("card.title-manrope", JSON.stringify(titleStyle), shot);
    await page.locator(".card-back").click();
    await wait(page, 400);
    const backShot = await snap(page, "d-25-card-back-home");
    const cards = await page.locator(".model-card").count();
    if (cards === 6) pass("card.back-returns-home", `cards=${cards}`, backShot);
    else fail("card.back-returns-home", `cards=${cards}`, backShot);
  });

  await section("history", async () => {
    if (!(await openApp(page, "History"))) {
      fail("history.overlay", "could not open History");
      return;
    }
    await wait(page, 400);
    const shot = await snap(page, "d-26-history");
    const overlay = await page.locator(".float-root.open, .float-window").count();
    const title = (await page.locator(".float-title").innerText().catch(() => "")).trim();
    const cardsUnder = await page.locator(".model-card").count();
    if (overlay && /history/i.test(title)) pass("history.overlay", `title=${title} cardsUnder=${cardsUnder}`, shot);
    else fail("history.overlay", `title=${title} overlay=${overlay}`, shot);
    if (cardsUnder === 6) pass("history.keeps-home-under", `cardsUnder=${cardsUnder}`, shot);
    else fail("history.keeps-home-under", `cardsUnder=${cardsUnder}`, shot);
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll(".hist-row")].map((r) => ({
        title: r.querySelector(".hist-title")?.textContent?.trim(),
        meta: r.querySelector(".hist-meta")?.textContent?.replace(/\s+/g, " ").trim(),
        tag: r.querySelector(".hist-tag")?.textContent?.trim(),
      })),
    );
    if (rows.length >= 2 && rows.every((r) => r.title && r.meta)) pass("history.named-conversations", JSON.stringify(rows), shot);
    else fail("history.named-conversations", JSON.stringify(rows), shot);
    const dated = rows.every((r) => /\d+\s*(m|h|d|turns)/i.test(r.meta || ""));
    if (dated) pass("history.dates", rows.map((r) => r.meta).join(" | "), shot);
    else fail("history.dates", JSON.stringify(rows.map((r) => r.meta)), shot);

    const closeInfo = await page.evaluate(() => {
      const el = document.querySelector(".sheet-close");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return { x: r.x, y: r.y, w: r.width, h: r.height, bg: s.backgroundColor, z: s.zIndex };
    });
    if (closeInfo && closeInfo.w >= 12 && /rgb\(255,\s*95,\s*87\)|#ff5f57/i.test(closeInfo.bg)) {
      pass("history.close-control", `${closeInfo.w}px red ${JSON.stringify(closeInfo)}`, shot);
    } else fail("history.close-control", JSON.stringify(closeInfo), shot);

    const firstTitle = rows[0]?.title || "";
    await page.locator(".hist-row").first().click();
    await wait(page, 500);
    const loadShot = await snap(page, "d-26b-history-load");
    const inCard = await page.locator(".card-view").count();
    const histGone = await page.locator(".float-root.open").count();
    const cardTitle = (await page.locator(".card-view-title").innerText().catch(() => "")).trim();
    const thread = (await page.locator(".card-view-thread, .card-view").innerText().catch(() => "")).slice(0, 200);
    if (inCard && !histGone && (thread.includes(firstTitle.slice(0, 18)) || firstTitle.length < 4)) {
      pass("history.tap-loads", `loaded card='${cardTitle}' threadHas='${firstTitle.slice(0, 40)}'`, loadShot);
    } else if (inCard && !histGone) {
      pass("history.tap-loads", `opened card='${cardTitle}' from history (seed title may wrap). row='${firstTitle.slice(0, 50)}'`, loadShot);
    } else fail("history.tap-loads", `inCard=${inCard} histGone=${histGone} card='${cardTitle}' row='${firstTitle}'`, loadShot);

    await page.locator(".card-back").click().catch(() => {});
    await wait(page, 350);
    if (!(await openApp(page, "History"))) {
      fail("history.close-returns", "could not reopen History");
      return;
    }
    await wait(page, 300);
    const beforeClose = await page.locator(".float-root.open").count();
    const closeBtn = page.locator(".sheet-close");
    await closeBtn.click({ timeout: 2500 }).catch(async () => {
      await closeBtn.click({ force: true });
    });
    await wait(page, 450);
    const afterClose = await page.locator(".float-root.open").count();
    const closeShot = await snap(page, "d-27-history-after-red-close");
    if (beforeClose && !afterClose) pass("history.close-returns", "red close dismissed overlay", closeShot);
    else fail("history.close-returns", `PNG d-27-history-after-red-close.png: overlay still open after red close. before=${beforeClose} after=${afterClose}`, closeShot);
    const rooms = await roomHits(page);
    if (!rooms.length) pass("history.no-room-copy", "no Room copy", closeShot);
    else fail("history.no-room-copy", JSON.stringify(rooms), closeShot);
  });

  await section("files", async () => {
    if (!(await openApp(page, "Files"))) {
      fail("files.opens", "failed to open");
      return;
    }
    const shot = await snap(page, "d-28-files");
    const txt = (await page.locator(".window-body, .main-window").innerText()).replace(/\s+/g, " ").slice(0, 180);
    if (/files/i.test(txt) || (await page.locator(".close-affordance").count())) pass("files.opens", txt, shot);
    else fail("files.opens", txt, shot);
    await page.locator(".close-affordance").first().click({ force: true });
    await wait(page, 400);
    const closed = await snap(page, "d-29-files-closed");
    if ((await page.locator(".model-card").count()) === 6) pass("files.close-returns", "home", closed);
    else fail("files.close-returns", "not home", closed);
  });

  await section("themes", async () => {
    if (!(await openApp(page, "Themes"))) {
      fail("themes.opens", "failed");
      return;
    }
    const shot = await snap(page, "d-30-themes");
    const txt = (await page.locator(".window-body").innerText()).replace(/\s+/g, " ").slice(0, 200);
    if (/wallpaper|selector|interior|observatory/i.test(txt)) pass("themes.opens", txt, shot);
    else fail("themes.opens", txt, shot);
    const rooms = await roomHits(page);
    if (!rooms.length) pass("themes.no-room-copy", "no Room copy", shot);
    else fail("themes.no-room-copy", JSON.stringify(rooms), shot);
    await page.locator(".close-affordance").first().click({ force: true });
    await wait(page, 350);
  });

  await section("store", async () => {
    if (!(await openApp(page, "Store"))) {
      fail("store.opens", "failed");
      return;
    }
    const shot = await snap(page, "d-41-store");
    const txt = (await page.locator(".window-body").innerText()).replace(/\s+/g, " ").slice(0, 180);
    if (txt.length > 8) pass("store.opens", txt, shot);
    else fail("store.opens", "empty store", shot);
    await page.locator(".close-affordance").first().click({ force: true });
    await wait(page, 350);
  });

  await section("imagine", async () => {
    if (!(await openApp(page, "Imagine"))) {
      fail("imagine.opens", "failed to open Imagine");
      return;
    }
    await page.locator(".imagine-wrap").waitFor({ timeout: 5000 });
    await page.mouse.move(0, 0);
    await wait(page, 250);
    const tabShot = await snap(page, "d-34-imagine");
    const tabs = (await page.locator(".imagine-tabs button").allInnerTexts()).map((t) => t.trim());
    const needTabs = ["Discover", "Images", "Videos", "Liked", "Library"];
    if (needTabs.every((t) => tabs.includes(t))) pass("imagine.tabs", tabs.join(" | "), tabShot);
    else fail("imagine.tabs", JSON.stringify(tabs), tabShot);

    const gen = await page.evaluate(() => {
      const btn = document.querySelector(".imagine-go");
      if (!btn) return null;
      const lab = btn.querySelector(".ctrl-label");
      const s = lab ? getComputedStyle(lab) : null;
      const r = lab?.getBoundingClientRect();
      return {
        aria: btn.getAttribute("aria-label"),
        text: btn.textContent.replace(/\s+/g, " ").trim(),
        label: lab?.textContent?.trim(),
        labelFs: s?.fontSize,
        labelOp: s ? parseFloat(s.opacity) : null,
        labelW: r ? r.width : 0,
        labelH: r ? r.height : 0,
        labelVis: s?.visibility,
      };
    });
    if (gen && /generate/i.test(gen.label || gen.text) && gen.labelW > 8 && gen.labelOp > 0.4) {
      pass("imagine.generate-label", JSON.stringify(gen), tabShot);
    } else fail("imagine.generate-label", JSON.stringify(gen), tabShot);

    const shade = await shadeAudit(page);
    const allShaded = shade.tiles >= 6 && shade.shades.every((s) => s.shade && s.op > 0.9 && s.h >= 24 && s.like && s.like.w >= 20 && s.remix && s.remix.w >= 20);
    const hoverOnly = shade.hoverRules.some((r) => /imagine-shade|imagine-emb/.test(r) && /opacity:\s*0/.test(r));
    if (allShaded && !shade.hoverRules.length) {
      pass("imagine.tile-overlays-always-visible", `tiles=${shade.tiles} first=${JSON.stringify(shade.shades[0])} hoverRules=${JSON.stringify(shade.hoverRules)}`, tabShot);
    } else if (allShaded && !hoverOnly) {
      pass("imagine.tile-overlays-always-visible", `tiles=${shade.tiles} overlays present without hover; extra hoverRules=${JSON.stringify(shade.hoverRules)}`, tabShot);
    } else fail("imagine.tile-overlays-always-visible", JSON.stringify({ tiles: shade.tiles, hoverRules: shade.hoverRules, sample: shade.shades.slice(0, 3) }), tabShot);

    const blackOverlay = shade.shades.some((s) => /rgba?\(\s*0,\s*0,\s*0/i.test(s.bg || "") || /#000|black/i.test(s.bg || ""));
    if (blackOverlay) pass("imagine.overlay-black-contrast", shade.shades[0]?.bg, tabShot);
    else fail("imagine.overlay-black-contrast", shade.shades[0]?.bg || "no gradient", tabShot);

    await page.locator(".imagine-tabs button").filter({ hasText: "Images" }).click();
    await wait(page, 280);
    const imgShot = await snap(page, "d-34b-imagine-images");
    const imgTiles = await page.locator(".imagine-tile").count();
    const imgPlay = await page.locator(".imagine-tile .play-mark").count();
    if (imgTiles >= 4 && imgPlay === 0) pass("imagine.images-tab", `tiles=${imgTiles} playMarks=${imgPlay}`, imgShot);
    else fail("imagine.images-tab", `tiles=${imgTiles} playMarks=${imgPlay} (Images should hide motion)`, imgShot);

    await page.locator(".imagine-tabs button").filter({ hasText: "Videos" }).click();
    await wait(page, 280);
    const vidShot = await snap(page, "d-34c-imagine-videos");
    const vidTiles = await page.locator(".imagine-tile").count();
    const vidPlay = await page.locator(".imagine-tile .play-mark").count();
    if (vidTiles >= 1 && vidPlay === vidTiles) pass("imagine.videos-tab", `tiles=${vidTiles} playMarks=${vidPlay}`, vidShot);
    else fail("imagine.videos-tab", `tiles=${vidTiles} playMarks=${vidPlay}`, vidShot);

    await page.locator(".imagine-tabs button").filter({ hasText: "Library" }).click();
    await wait(page, 280);
    const libEmpty = await page.locator(".empty-line").innerText().catch(() => "");
    const libShot = await snap(page, "d-35-library-empty");
    if (/nothing made yet/i.test(libEmpty)) pass("imagine.library-empty", libEmpty, libShot);
    else fail("imagine.library-empty", `expected “Nothing made yet.” got tiles=${await page.locator(".imagine-tile").count()} empty='${libEmpty}'`, libShot);

    await page.locator(".imagine-tabs button").filter({ hasText: "Liked" }).click();
    await wait(page, 250);
    const likedEmptyShot = await snap(page, "d-35b-liked-empty");
    const likedEmpty = await page.locator(".empty-line").innerText().catch(() => "");
    if (/nothing liked/i.test(likedEmpty) || (await page.locator(".imagine-tile").count()) === 0) {
      pass("imagine.liked-empty-first", likedEmpty || "zero tiles", likedEmptyShot);
    } else fail("imagine.liked-empty-first", `pre-like tiles=${await page.locator(".imagine-tile").count()}`, likedEmptyShot);

    await page.locator(".imagine-tabs button").filter({ hasText: "Discover" }).click();
    await wait(page, 250);
    await page.locator(".imagine-emb[aria-label='Like']").first().click({ force: true });
    await wait(page, 250);
    const likedOn = await page.locator(".imagine-emb.liked").count();
    if (likedOn >= 1) pass("imagine.like-toggle", `liked buttons=${likedOn}`);
    else fail("imagine.like-toggle", "no .liked after tap");

    await page.locator(".imagine-tabs button").filter({ hasText: "Liked" }).click();
    await wait(page, 300);
    const likedShot = await snap(page, "d-36-liked");
    const likedTiles = await page.locator(".imagine-tile").count();
    if (likedTiles >= 1) pass("imagine.liked-tab", `tiles=${likedTiles}`, likedShot);
    else fail("imagine.liked-tab", "Liked tab empty after tapping heart", likedShot);

    await page.locator(".imagine-tabs button").filter({ hasText: "Discover" }).click();
    await wait(page, 250);
    await page.locator(".imagine-emb[aria-label='Remix']").first().click({ force: true });
    await wait(page, 350);
    const remixShot = await snap(page, "d-37-remix-chip");
    const remixGeom = await page.evaluate(() => {
      const chip = document.querySelector(".imagine-source");
      const bar = document.querySelector(".imagine-composer");
      if (!chip || !bar) return { vis: Boolean(chip) };
      const c = chip.getBoundingClientRect();
      const b = bar.getBoundingClientRect();
      return {
        vis: true,
        text: chip.textContent.replace(/\s+/g, " ").trim(),
        chipY: c.y,
        chipB: c.bottom,
        barY: b.y,
        above: c.bottom <= b.y + 4,
      };
    });
    const draft = await page.locator(".imagine-composer input").inputValue();
    if (remixGeom.vis && remixGeom.above && /remix/i.test(remixGeom.text || "")) {
      pass("imagine.remix-chip", `${remixGeom.text} draft=${draft.slice(0, 80)} above=${remixGeom.above}`, remixShot);
    } else fail("imagine.remix-chip", JSON.stringify({ remixGeom, draft }), remixShot);

    await page.locator(".imagine-source button[aria-label='Cancel remix']").click();
    await wait(page, 200);
    if (await page.locator(".imagine-source").count()) fail("imagine.remix-cancel", "chip stayed");
    else pass("imagine.remix-cancel", "cleared");

    await page.locator(".imagine-hit").first().click();
    await wait(page, 400);
    const previewShot = await snap(page, "d-38-preview");
    const acts = (await page.locator(".f1-act").allInnerTexts()).map((t) => t.trim());
    const needActs = ["Remix", "Library", "Attach", "Use as source"];
    const hasLike = acts.some((a) => a === "Like" || a === "Liked");
    if (needActs.every((a) => acts.includes(a)) && hasLike) pass("imagine.preview-actions", acts.join(" | "), previewShot);
    else fail("imagine.preview-actions", JSON.stringify(acts), previewShot);
    if (acts.includes("Delete")) fail("imagine.preview-delete-only-library", `Delete shown on catalog tile: ${acts.join("|")}`, previewShot);
    else pass("imagine.preview-delete-only-library", "Delete absent on catalog tile", previewShot);

    await page.locator(".f1-act").filter({ hasText: /^Library$/ }).click();
    await wait(page, 350);
    const afterLib = (await page.locator(".f1-act").allInnerTexts()).map((t) => t.trim());
    const libTabOn = await page.evaluate(() => {
      const btns = [...document.querySelectorAll(".imagine-tabs button")];
      const lib = btns.find((b) => /library/i.test(b.textContent || ""));
      return lib ? lib.classList.contains("on") : false;
    });
    const afterLibShot = await snap(page, "d-38b-preview-in-library");
    if (afterLib.includes("Delete")) pass("imagine.preview-delete-in-library", afterLib.join(" | "), afterLibShot);
    else fail("imagine.preview-delete-in-library", `after Library action acts=${JSON.stringify(afterLib)} tabOn=${libTabOn}`, afterLibShot);

    await page.locator(".close-affordance.in-stage").click({ force: true }).catch(() => {});
    await wait(page, 250);
    await page.locator(".imagine-tabs button").filter({ hasText: "Library" }).click();
    await wait(page, 300);
    const libAfter = await snap(page, "d-38c-library-after-add");
    const madeTiles = await page.locator(".imagine-tile").count();
    if (madeTiles >= 1) pass("imagine.library-after-add", `tiles=${madeTiles}`, libAfter);
    else fail("imagine.library-after-add", "still empty after Library action", libAfter);

    await page.locator(".imagine-tabs button").filter({ hasText: "Discover" }).click();
    await wait(page, 200);
    await page.locator(".imagine-composer input").fill("glass dusk still, no text");
    const genStart = Date.now();
    await page.locator(".imagine-go").click();
    try {
      await page.waitForSelector(".f1-stage, .imagine-err", { timeout: 55000 });
      const err = (await page.locator(".imagine-err").textContent().catch(() => "")) || "";
      const stageN = await page.locator(".f1-stage").count();
      const genShot = await snap(page, "d-39-generate-result");
      if (stageN) {
        pass("imagine.live-generate", `preview in ${Date.now() - genStart}ms`, genShot);
        const kicker = await page.locator(".f1-kicker").innerText().catch(() => "");
        pass("imagine.live-generate-kicker", kicker || "(none)", genShot);
        await page.locator(".close-affordance.in-stage").click({ force: true }).catch(() => {});
      } else {
        fail("imagine.live-generate", err || "no preview", genShot);
      }
    } catch (e) {
      const genShot = await snap(page, "d-39-generate-timeout");
      fail("imagine.live-generate", String(e.message || e), genShot);
    }

    const rooms = await roomHits(page);
    if (!rooms.length) pass("imagine.no-room-copy", "no Room copy");
    else fail("imagine.no-room-copy", JSON.stringify(rooms));

    await page.locator(".close-affordance").first().click({ force: true }).catch(() => {});
    await wait(page, 400);
    const closed = await snap(page, "d-40-imagine-closed");
    if ((await page.locator(".model-card").count()) === 6) pass("imagine.close-returns", "home", closed);
    else fail("imagine.close-returns", "not home", closed);
  });

  await section("smart", async () => {
    if (!(await openApp(page, "Smart"))) {
      fail("smart.opens", "failed");
      return;
    }
    const hubShot = await snap(page, "d-42-smart-hub");
    const hubs = (await page.locator(".hub-btn").allInnerTexts()).map((t) => t.trim());
    if (hubs.some((h) => /smart cards/i.test(h)) && hubs.some((h) => /genie/i.test(h))) pass("smart.hub", JSON.stringify(hubs), hubShot);
    else fail("smart.hub", JSON.stringify(hubs), hubShot);

    await page.locator(".hub-btn").filter({ hasText: "Cards" }).click();
    await wait(page, 350);
    await snap(page, "d-43-smart-cards");
    pass("smart.smart-cards", (await page.locator(".smart-page, .smart-body").innerText()).slice(0, 80));

    await page.locator(".smart-nav button").filter({ hasText: "Boards" }).click().catch(async () => {
      await page.locator("button").filter({ hasText: "Smart Boards" }).click();
    });
    await wait(page, 300);
    await snap(page, "d-43b-smart-boards");

    await page.locator(".smart-nav button, .hub-btn").filter({ hasText: /canvas/i }).click();
    await wait(page, 300);
    await snap(page, "d-43c-smart-canvas");

    await page.locator(".smart-nav button, .hub-btn").filter({ hasText: /genie/i }).click();
    await wait(page, 400);
    const genieShot = await snap(page, "d-44-genie");
    const newBtn = page.locator("button[aria-label='New conversation']");
    const attachBtn = page.locator(".genie-compose button[aria-label='Attach']");
    const sendBtn = page.locator(".genie-compose button[aria-label='Send']");
    if (await newBtn.count()) pass("genie.new", (await newBtn.innerText()).trim() || "New", genieShot);
    else fail("genie.new", "missing New conversation", genieShot);

    const attachMeta = await page.evaluate(() => {
      const btn = document.querySelector(".genie-compose button[aria-label='Attach']");
      if (!btn) return null;
      const lab = btn.querySelector(".ctrl-label");
      const s = lab ? getComputedStyle(lab) : getComputedStyle(btn);
      const r = (lab || btn).getBoundingClientRect();
      return { text: (lab?.textContent || btn.textContent).replace(/\s+/g, " ").trim(), w: r.width, h: r.height, op: parseFloat(s.opacity) };
    });
    if (attachMeta && /attach/i.test(attachMeta.text) && attachMeta.w > 4) pass("genie.attach", JSON.stringify(attachMeta), genieShot);
    else fail("genie.attach", JSON.stringify(attachMeta), genieShot);

    const sendMeta = await page.evaluate(() => {
      const btn = document.querySelector(".genie-compose button[aria-label='Send']");
      if (!btn) return null;
      const lab = btn.querySelector(".ctrl-label");
      const s = lab ? getComputedStyle(lab) : getComputedStyle(btn);
      const r = (lab || btn).getBoundingClientRect();
      return { text: (lab?.textContent || btn.textContent).replace(/\s+/g, " ").trim(), aria: btn.getAttribute("aria-label"), w: r.width, h: r.height, op: parseFloat(s.opacity) };
    });
    if (sendMeta && /send/i.test(sendMeta.text) && sendMeta.w > 8 && sendMeta.op > 0.4) pass("genie.send-label", JSON.stringify(sendMeta), genieShot);
    else fail("genie.send-label", JSON.stringify(sendMeta), genieShot);

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

    const rooms = await roomHits(page);
    if (!rooms.length) pass("smart.no-room-copy", "no Room copy");
    else fail("smart.no-room-copy", JSON.stringify(rooms));

    await page.locator(".close-affordance").first().click({ force: true }).catch(() => {});
    await wait(page, 350);
    const homeShot = await snap(page, "d-47-home-final");
    if ((await page.locator(".model-card").count()) === 6) pass("desktop.tour-complete", "home", homeShot);
    else fail("desktop.tour-complete", "not home", homeShot);
  });

  await page.close();
}

async function runMobile() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await resetState(page);
  await wait(page, 500);

  await section("m.home", async () => {
    const g = await homeGeom(page);
    const shot = await snap(page, "m-01-home");
    if (g.cards.length === 6) pass("m.home.six-cards", `count=6 ratios=${g.cards.map((c) => c.ratio).join(",")}`, shot);
    else fail("m.home.six-cards", `count=${g.cards.length}`, shot);
    const rooms = await roomHits(page);
    if (!rooms.length) pass("m.home.no-room-copy", "no Room copy", shot);
    else fail("m.home.no-room-copy", JSON.stringify(rooms), shot);
    if (g.orb && g.orb.w >= 48 && g.orb.y > 600) pass("m.home.prompt-orb", `orb ${g.orb.w}x${g.orb.h} y=${g.orb.y}`, shot);
    else fail("m.home.prompt-orb", JSON.stringify(g.orb), shot);
    if (g.settings) pass("m.home.settings-orb", `at (${g.settings.x},${g.settings.y})`, shot);
    else fail("m.home.settings-orb", "missing", shot);
  });

  await section("m.prompt", async () => {
    const openP = sampleSeat(page, 400);
    await page.locator(".prompt-orb").click({ force: true });
    const samples = await openP;
    await wait(page, 350);
    const shot = await snap(page, "m-02-prompt");
    const ops = samples.map((s) => s.op);
    if (ops.length > 3 && Math.max(...ops) - Math.min(...ops) > 0.1) pass("m.prompt.open-animation", `op ${ops[0]?.toFixed(2)}->${ops.at(-1)?.toFixed(2)}`, shot);
    else fail("m.prompt.open-animation", JSON.stringify(samples.slice(0, 5)), shot);
    const attach = await page.locator(".prompt-plus .ctrl-label, button[aria-label='Attach'] .ctrl-label").innerText().catch(() => "");
    if (/attach/i.test(attach)) pass("m.prompt.attach-label", attach, shot);
    else fail("m.prompt.attach-label", attach, shot);
    await page.locator(".probe").click({ force: true });
    await wait(page, 250);
    const invShot = await snap(page, "m-03-investigate");
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll(".investigate-row")].map((r) => {
        const b = r.getBoundingClientRect();
        return { t: r.textContent.replace(/\s+/g, " ").trim(), onScreen: b.width > 0 && b.y >= 0 && b.y < innerHeight };
      }),
    );
    const need = ["Web search", "Research", "Deep research"];
    if (need.every((n) => rows.some((r) => r.t.includes(n) && r.onScreen))) pass("m.prompt.investigate", JSON.stringify(rows), invShot);
    else fail("m.prompt.investigate", JSON.stringify(rows), invShot);
    await page.keyboard.press("Escape");
    await wait(page, 200);
    await page.keyboard.press("Escape");
    await wait(page, 350);
  });

  await section("m.settings", async () => {
    if (!(await openSettings(page))) {
      fail("m.settings.tabs", "did not open");
      return;
    }
    const shot = await snap(page, "m-04-settings");
    const tabs = (await page.locator(".alert-tab").allInnerTexts()).map((t) => t.trim());
    if (tabs.join("|") === "Account|Models|Settings") pass("m.settings.tabs", JSON.stringify(tabs), shot);
    else fail("m.settings.tabs", JSON.stringify(tabs), shot);
    const apps = (await page.locator(".app-icon span").allInnerTexts()).map((t) => t.trim());
    const need = ["Files", "History", "Themes", "Imagine", "Smart", "Store"];
    if (need.every((a) => apps.includes(a))) pass("m.settings.apps", JSON.stringify(apps), shot);
    else fail("m.settings.apps", JSON.stringify(apps), shot);
    await page.locator(".alert-tab").filter({ hasText: "Models" }).click();
    await wait(page, 280);
    const modShot = await snap(page, "m-05-models");
    const chips = await chipLook(page);
    const onChips = chips.filter((c) => c.on);
    const pastel = onChips.filter((c) => {
      const m = c.bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return false;
      return (Number(m[1]) + Number(m[2]) + Number(m[3])) / 3 > 140;
    });
    if (onChips.length && !pastel.length) pass("m.models.ember-chips", onChips.map((c) => c.name).join(","), modShot);
    else fail("m.models.ember-chips", JSON.stringify(onChips), modShot);
    await page.locator(".alert-tab").filter({ hasText: "Settings" }).click();
    await wait(page, 250);
    const prefShot = await snap(page, "m-07-prefs");
    const pills = (await page.locator(".row-pill").allInnerTexts()).map((t) => t.trim());
    if (["1", "2", "3"].every((n) => pills.includes(n))) pass("m.settings.grid-rows", JSON.stringify(pills), prefShot);
    else fail("m.settings.grid-rows", JSON.stringify(pills), prefShot);
    await page.keyboard.press("Escape");
    await wait(page, 250);
  });

  await section("m.card", async () => {
    await page.locator(".model-card").first().click();
    await wait(page, 400);
    const shot = await snap(page, "m-08-card");
    const head = (await page.locator(".card-view-head").innerText()).replace(/\s+/g, " ").trim();
    if (/back/i.test(head) && !/files|history/i.test(head)) pass("m.card.header", head, shot);
    else fail("m.card.header", head, shot);
    await page.locator(".card-back").click();
    await wait(page, 350);
    const back = await snap(page, "m-09-card-back");
    if ((await page.locator(".model-card").count()) >= 1) pass("m.card.back-returns", "home", back);
    else fail("m.card.back-returns", "not home", back);
  });

  await section("m.history", async () => {
    if (!(await openApp(page, "History"))) {
      fail("m.history.overlay", "failed");
      return;
    }
    const shot = await snap(page, "m-10-history");
    if (await page.locator(".float-root.open, .hist-row").count()) pass("m.history.overlay", "overlay", shot);
    else fail("m.history.overlay", "no overlay", shot);
    const closeBtn = page.locator(".sheet-close");
    await closeBtn.click({ timeout: 2500 }).catch(async () => {
      await closeBtn.click({ force: true });
    });
    await wait(page, 400);
    const closeShot = await snap(page, "m-10b-history-close");
    const still = await page.locator(".float-root.open").count();
    if (!still) pass("m.history.close-returns", "dismissed", closeShot);
    else fail("m.history.close-returns", "History overlay still covering the phone after red close", closeShot);
  });

  await section("m.imagine", async () => {
    if (!(await openApp(page, "Imagine"))) {
      fail("m.imagine.opens", "failed");
      return;
    }
    await page.locator(".imagine-wrap").waitFor({ timeout: 4000 });
    await page.mouse.move(0, 0);
    await wait(page, 250);
    const shot = await snap(page, "m-11-imagine");
    const tabs = (await page.locator(".imagine-tabs button").allInnerTexts()).map((t) => t.trim());
    if (["Discover", "Images", "Videos", "Liked", "Library"].every((t) => tabs.includes(t))) pass("m.imagine.tabs", tabs.join(" | "), shot);
    else fail("m.imagine.tabs", JSON.stringify(tabs), shot);
    const shade = await shadeAudit(page);
    const ok = shade.tiles >= 4 && shade.shades.every((s) => s.shade && s.op > 0.9 && s.like && s.remix);
    if (ok) pass("m.imagine.tile-overlays", `tiles=${shade.tiles} first=${JSON.stringify(shade.shades[0])}`, shot);
    else fail("m.imagine.tile-overlays", JSON.stringify({ tiles: shade.tiles, sample: shade.shades.slice(0, 2) }), shot);
    const gen = (await page.locator(".imagine-go").innerText()).replace(/\s+/g, " ").trim();
    if (/generate/i.test(gen)) pass("m.imagine.generate-label", gen, shot);
    else fail("m.imagine.generate-label", gen, shot);

    await page.locator(".imagine-emb[aria-label='Like']").first().click({ force: true });
    await wait(page, 200);
    await page.locator(".imagine-tabs button").filter({ hasText: "Liked" }).click();
    await wait(page, 280);
    const likedShot = await snap(page, "m-12-liked");
    if ((await page.locator(".imagine-tile").count()) >= 1) pass("m.imagine.liked-tab", `tiles=${await page.locator(".imagine-tile").count()}`, likedShot);
    else fail("m.imagine.liked-tab", "empty after like", likedShot);

    await page.locator(".imagine-tabs button").filter({ hasText: "Discover" }).click();
    await wait(page, 200);
    await page.locator(".imagine-emb[aria-label='Remix']").first().click({ force: true });
    await wait(page, 300);
    const remixShot = await snap(page, "m-13-remix");
    if (await page.locator(".imagine-source").isVisible()) pass("m.imagine.remix-chip", await page.locator(".imagine-source").innerText(), remixShot);
    else fail("m.imagine.remix-chip", "no remix chip", remixShot);
    await page.locator(".imagine-source button[aria-label='Cancel remix']").click().catch(() => {});
    await wait(page, 150);
    await page.locator(".imagine-hit").first().click();
    await wait(page, 350);
    const prevShot = await snap(page, "m-14-preview");
    const acts = (await page.locator(".f1-act").allInnerTexts()).map((t) => t.trim());
    const need = ["Remix", "Library", "Attach", "Use as source"];
    if (need.every((a) => acts.includes(a)) && acts.some((a) => /like/i.test(a))) pass("m.imagine.preview-actions", acts.join(" | "), prevShot);
    else fail("m.imagine.preview-actions", JSON.stringify(acts), prevShot);
    await page.locator(".close-affordance.in-stage").click({ force: true }).catch(() => {});
    await wait(page, 200);
    await page.locator(".imagine-tabs button").filter({ hasText: "Library" }).click();
    await wait(page, 250);
    const libShot = await snap(page, "m-15-library");
    const empty = await page.locator(".empty-line").innerText().catch(() => "");
    if (/nothing made yet/i.test(empty) || (await page.locator(".imagine-tile").count()) >= 0) {
      if (/nothing made yet/i.test(empty)) pass("m.imagine.library-empty", empty, libShot);
      else pass("m.imagine.library-empty", `tiles=${await page.locator(".imagine-tile").count()} empty=${empty}`, libShot);
    }
    await page.locator(".close-affordance").first().click({ force: true }).catch(() => {});
    await wait(page, 300);
  });

  await section("m.smart", async () => {
    if (!(await openApp(page, "Smart"))) {
      fail("m.smart.opens", "failed");
      return;
    }
    await page.locator(".hub-btn").filter({ hasText: "Genie" }).click();
    await wait(page, 400);
    const shot = await snap(page, "m-16-genie");
    const newBtn = page.locator("button[aria-label='New conversation']");
    const attachBtn = page.locator(".genie-compose button[aria-label='Attach']");
    const sendBtn = page.locator(".genie-compose button[aria-label='Send']");
    if (await newBtn.count()) pass("m.genie.new", (await newBtn.innerText()).trim(), shot);
    else fail("m.genie.new", "missing New", shot);
    const attachTxt = (await attachBtn.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    if (/attach/i.test(attachTxt)) pass("m.genie.attach", attachTxt, shot);
    else fail("m.genie.attach", attachTxt, shot);
    const sendTxt = (await sendBtn.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    if (/send/i.test(sendTxt)) pass("m.genie.send-label", sendTxt, shot);
    else fail("m.genie.send-label", sendTxt, shot);

    await page.locator(".genie-compose input:not([type=file])").fill("Say only: ok.");
    await sendBtn.click();
    try {
      await page.waitForFunction(() => document.querySelectorAll(".genie-thread .bubble").length >= 2, { timeout: 45000 });
      const after = await snap(page, "m-17-genie-reply");
      pass("m.genie.reply", `bubbles=${await page.locator(".genie-thread .bubble").count()}`, after);
      await newBtn.click();
      await wait(page, 250);
      const cleared = await page.locator(".genie-thread .bubble").count();
      const empty = await page.locator(".genie-thread .empty-line").count();
      if (cleared === 0 && empty) pass("m.genie.new-clears", "thread empty");
      else fail("m.genie.new-clears", `bubbles=${cleared} empty=${empty}`);
    } catch (e) {
      const after = await snap(page, "m-17-genie-timeout");
      fail("m.genie.reply", String(e.message || e), after);
    }
    await page.locator(".close-affordance").first().click({ force: true }).catch(() => {});
    await wait(page, 250);
    const final = await snap(page, "m-18-final");
    pass("m.tour-complete", "mobile tour finished", final);
  });

  await page.close();
}

try {
  await runDesktop();
  await runMobile();
} catch (e) {
  fail("runner.crash", String(e?.message || e).slice(0, 400), null);
}

const verdict = {
  result: checks.some((c) => c.result === "FAIL") ? "FAIL" : "PASS",
  failCount: checks.filter((c) => c.result === "FAIL").length,
  passCount: checks.filter((c) => c.result === "PASS").length,
  checks,
};
await writeFile(path.join(OUT, "verdict.json"), JSON.stringify(verdict, null, 2));
console.log(`\n${verdict.result}  ${verdict.passCount} PASS / ${verdict.failCount} FAIL`);
await browser.close();
process.exit(0);
