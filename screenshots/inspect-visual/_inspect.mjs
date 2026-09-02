import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "/workspace/screenshots/inspect-visual";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  headless: true,
});

const notes = {};

function crop(page, selector, path, pad = 8) {
  const loc = typeof selector === "string" ? page.locator(selector).first() : selector;
  return loc.screenshot({ path, animations: "disabled" }).catch(async () => {
    const box = await loc.boundingBox();
    if (!box) return false;
    await page.screenshot({
      path,
      clip: {
        x: Math.max(0, box.x - pad),
        y: Math.max(0, box.y - pad),
        width: box.width + pad * 2,
        height: box.height + pad * 2,
      },
      animations: "disabled",
    });
    return true;
  });
}

async function shot(page, name) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, animations: "disabled" });
  return path;
}

const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(900);

// ── 1. HOME seed ──────────────────────────────────────────────────────────
await shot(page, "01-home-seed");
await crop(page, ".model-card", `${OUT}/01b-home-card-seed.png`);

notes.homeSeed = await page.evaluate(() => {
  const cards = [...document.querySelectorAll(".model-card")].map((card) => {
    const name = card.querySelector(".card-name")?.textContent?.trim();
    const log = card.querySelector(".card-log");
    const minis = [...(log?.querySelectorAll(".card-mini") || [])].map((p) => {
      const s = getComputedStyle(p);
      return {
        cls: p.className,
        text: (p.textContent || "").slice(0, 90),
        color: s.color,
        weight: s.fontWeight,
        size: s.fontSize,
        family: s.fontFamily,
        bg: s.backgroundColor,
        pad: s.padding,
        border: s.border,
        radius: s.borderRadius,
      };
    });
    const empty = card.querySelector(".card-empty");
    const ls = log ? getComputedStyle(log) : null;
    return {
      name,
      accent: getComputedStyle(card).getPropertyValue("--card-accent").trim(),
      miniCount: minis.length,
      empty: empty ? (empty.textContent || "").trim() : null,
      emptyColor: empty ? getComputedStyle(empty).color : null,
      log: log
        ? {
            scrollH: log.scrollHeight,
            clientH: log.clientHeight,
            scrollTop: log.scrollTop,
            overflowY: ls.overflowY,
            canScroll: log.scrollHeight - log.clientHeight > 8,
          }
        : null,
      minis,
    };
  });
  const veil = document.querySelector(".env-veil");
  const vs = veil ? getComputedStyle(veil) : null;
  const canvas = document.querySelector(".main-window, .glass-window");
  const cs = canvas ? getComputedStyle(canvas) : null;
  const plate = document.querySelector(".canvas-plate");
  const photo = document.querySelector(".env-photo");
  const ps = photo ? getComputedStyle(photo) : null;
  const leading = document.querySelector(".leading-ornament, .side-pane, nav.side, .nav-rail");
  const cancel = [...document.querySelectorAll("button")].filter((b) =>
    /cancel/i.test((b.textContent || "") + (b.getAttribute("aria-label") || "")),
  );
  const winClose = document.querySelector(".win-close, .win-x");
  const filesHist = [...document.querySelectorAll(".card-head, .card-view-head")].map((h) =>
    (h.textContent || "").trim(),
  );
  return {
    cards,
    veil: veil
      ? {
          class: veil.className,
          bg: vs.backgroundImage || vs.background,
          opacity: vs.opacity,
          filter: vs.filter,
          backdrop: vs.backdropFilter,
        }
      : null,
    canvas: canvas
      ? {
          class: canvas.className,
          bg: cs.backgroundColor,
          backdrop: cs.backdropFilter,
        }
      : null,
    plate: plate ? getComputedStyle(plate).display : "absent",
    photo: photo ? { opacity: ps.opacity, filter: ps.filter } : null,
    leading: !!leading,
    cancelLabels: cancel.map((b) => (b.textContent || b.getAttribute("aria-label") || "").trim()),
    winClose: !!winClose,
    cardHeads: filesHist,
    bodyOverflow: getComputedStyle(document.body).overflow,
    appRootClass: document.querySelector(".app-root")?.className,
  };
});

// ── 2. Inject long thread ─────────────────────────────────────────────────
const long = Array.from({ length: 12 }, (_, i) => [
  {
    id: `vis-u-${i}`,
    role: "user",
    text: `Turn ${i + 1} user: keep the wallpaper continuous under the cards and never clip the thread.`,
    createdAt: Date.now() - (12 - i) * 90_000,
  },
  {
    id: `vis-a-${i}`,
    role: "assistant",
    text: `Turn ${i + 1} model: a glass canvas over a live wallpaper. Cards sit in front. The full conversation is the same one you open in detail.`,
    createdAt: Date.now() - (12 - i) * 90_000 + 4000,
  },
]).flat();

const inject = await page.evaluate((msgs) => {
  const rawKey = Object.keys(localStorage).find((k) => /collider|aether|spatial/i.test(k));
  if (!rawKey) return { ok: false, keys: Object.keys(localStorage) };
  const parsed = JSON.parse(localStorage.getItem(rawKey) || "{}");
  const state = parsed.state ?? parsed;
  const first = (state.enabledModelIds && state.enabledModelIds[0]) || Object.keys(state.conversations || {})[0];
  const second = (state.enabledModelIds && state.enabledModelIds[1]) || null;
  if (first && state.conversations[first]) {
    state.conversations[first].messages = msgs;
  }
  if (second && state.conversations[second]) {
    state.conversations[second].messages = msgs.slice(0, 6);
  }
  localStorage.setItem(rawKey, JSON.stringify(parsed));
  return { ok: true, key: rawKey, first, second, count: msgs.length };
}, long);
notes.inject = inject;

await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(900);
await shot(page, "02-home-long-bottom");
await crop(page, ".model-card", `${OUT}/02b-card-long-bottom.png`);

notes.homeLong = await page.evaluate(() => {
  const logs = [...document.querySelectorAll(".card-log")].map((log, i) => {
    const minis = [...log.querySelectorAll(".card-mini")];
    const texts = minis.map((p) => (p.textContent || "").slice(0, 60));
    return {
      i,
      count: minis.length,
      scrollH: log.scrollHeight,
      clientH: log.clientHeight,
      scrollTop: Math.round(log.scrollTop),
      overflowY: getComputedStyle(log).overflowY,
      canScroll: log.scrollHeight - log.clientHeight > 8,
      firstText: texts[0] || null,
      lastText: texts[texts.length - 1] || null,
      visible: minis
        .filter((p) => {
          const r = p.getBoundingClientRect();
          const lr = log.getBoundingClientRect();
          return r.bottom > lr.top + 2 && r.top < lr.bottom - 2;
        })
        .map((p) => (p.textContent || "").slice(0, 50)),
    };
  });
  return logs;
});

// Scroll first card log to top
const log = page.locator(".card-log").first();
await log.evaluate((el) => {
  el.scrollTop = 0;
});
await page.waitForTimeout(250);
await shot(page, "03-home-long-scrolled-top");
await crop(page, ".model-card", `${OUT}/03b-card-scrolled-top.png`);

notes.afterScrollTop = await page.evaluate(() => {
  const log = document.querySelector(".card-log");
  if (!log) return null;
  const minis = [...log.querySelectorAll(".card-mini")];
  const lr = log.getBoundingClientRect();
  return {
    scrollTop: Math.round(log.scrollTop),
    scrollH: log.scrollHeight,
    clientH: log.clientHeight,
    visible: minis
      .filter((p) => {
        const r = p.getBoundingClientRect();
        return r.bottom > lr.top + 2 && r.top < lr.bottom - 2;
      })
      .map((p) => ({
        cls: p.className,
        text: (p.textContent || "").slice(0, 70),
      })),
    allCount: minis.length,
  };
});

// Mid-scroll
await log.evaluate((el) => {
  el.scrollTop = Math.round((el.scrollHeight - el.clientHeight) / 2);
});
await page.waitForTimeout(200);
await crop(page, ".model-card", `${OUT}/03c-card-scrolled-mid.png`);

// Wheel test: wheel over card log must move the thread, not the page
notes.wheel = await page.evaluate(async () => {
  const log = document.querySelector(".card-log");
  if (!log) return { ok: false };
  log.scrollTop = 0;
  const beforeLog = log.scrollTop;
  const beforePage = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
  const beforeCanvas = document.querySelector(".card-canvas")?.scrollTop ?? 0;
  const beforeWindowBody = document.querySelector(".window-body")?.scrollTop ?? 0;
  const rect = log.getBoundingClientRect();
  const ev = new WheelEvent("wheel", {
    deltaY: 180,
    bubbles: true,
    cancelable: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
  });
  log.dispatchEvent(ev);
  // also try native-like scroll in case handler only stopPropagation
  log.scrollTop += 180;
  await new Promise((r) => setTimeout(r, 60));
  return {
    beforeLog,
    afterLog: log.scrollTop,
    logMoved: log.scrollTop > beforeLog + 8,
    beforePage,
    afterPage: window.scrollY || document.documentElement.scrollTop || 0,
    pageMoved: Math.abs((window.scrollY || 0) - beforePage) > 2,
    canvasMoved: Math.abs((document.querySelector(".card-canvas")?.scrollTop ?? 0) - beforeCanvas) > 2,
    windowBodyMoved: Math.abs((document.querySelector(".window-body")?.scrollTop ?? 0) - beforeWindowBody) > 2,
    overscroll: getComputedStyle(log).overscrollBehavior,
  };
});

await page.mouse.move(0, 0);
const firstLogBox = await log.boundingBox();
if (firstLogBox) {
  const cx = firstLogBox.x + firstLogBox.width / 2;
  const cy = firstLogBox.y + firstLogBox.height / 2;
  await log.evaluate((el) => {
    el.scrollTop = 40;
  });
  const before = await page.evaluate(() => ({
    log: document.querySelector(".card-log")?.scrollTop ?? 0,
    page: window.scrollY,
    canvas: document.querySelector(".card-canvas")?.scrollLeft ?? 0,
  }));
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(180);
  const after = await page.evaluate(() => ({
    log: document.querySelector(".card-log")?.scrollTop ?? 0,
    page: window.scrollY,
    canvas: document.querySelector(".card-canvas")?.scrollLeft ?? 0,
    body: document.body.scrollTop,
  }));
  notes.realWheel = { before, after, logDelta: after.log - before.log, pageDelta: after.page - before.page };
  await shot(page, "03d-home-after-wheel");
  await crop(page, ".model-card", `${OUT}/03e-card-after-wheel.png`);
}

// Type closeups — all cards on home
const cardCount = await page.locator(".model-card").count();
for (let i = 0; i < Math.min(cardCount, 6); i++) {
  await crop(page, page.locator(".model-card").nth(i), `${OUT}/04-type-home-card-${i + 1}.png`);
}

notes.typeHome = await page.evaluate(() => {
  return [...document.querySelectorAll(".model-card")].map((card) => {
    const nameEl = card.querySelector(".card-name");
    const you = card.querySelector(".card-mini.you");
    const them = card.querySelector(".card-mini.them");
    const empty = card.querySelector(".card-empty");
    const pick = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        text: (el.textContent || "").slice(0, 80),
        color: s.color,
        weight: s.fontWeight,
        size: s.fontSize,
        family: s.fontFamily,
        bg: s.backgroundColor,
        pad: s.padding,
        border: s.borderWidth,
        display: s.display,
      };
    };
    return {
      name: pick(nameEl),
      accent: getComputedStyle(card).getPropertyValue("--card-accent").trim(),
      you: pick(you),
      them: pick(them),
      empty: pick(empty),
    };
  });
});

// Wallpaper / canvas measurements
notes.tint = await page.evaluate(() => {
  const veil = document.querySelector(".env-veil");
  const vs = veil ? getComputedStyle(veil) : null;
  const canvas = document.querySelector(".main-window");
  const cs = canvas ? getComputedStyle(canvas) : null;
  const plate = document.querySelector(".canvas-plate");
  const card = document.querySelector(".model-card");
  const mcs = card ? getComputedStyle(card) : null;
  const photo = document.querySelector(".env-photo");
  const sample = (el, x, y) => {
    // can't sample pixels here; return geometry
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  };
  return {
    veilClass: veil?.className,
    veilBg: vs?.backgroundImage || vs?.backgroundColor,
    veilOpacity: vs?.opacity,
    veilBackdrop: vs?.backdropFilter,
    canvasBg: cs?.backgroundColor,
    canvasBackdrop: cs?.backdropFilter,
    canvasFilter: cs?.filter,
    plateDisplay: plate ? getComputedStyle(plate).display : "absent",
    cardBg: mcs?.backgroundColor,
    cardBackdrop: mcs?.backdropFilter,
    cardBorder: mcs?.border,
    photoBox: photo ? sample(photo) : null,
    canvasBox: canvas ? sample(canvas) : null,
    rootClass: document.querySelector(".app-root")?.className,
  };
});

await crop(page, ".main-window", `${OUT}/05-canvas-frame.png`);

// ── 3. CARD VIEW ──────────────────────────────────────────────────────────
await page.locator(".card-name").first().click();
await page.waitForTimeout(500);
await shot(page, "06-card-view");
await crop(page, ".card-view", `${OUT}/06b-card-view-inner.png`);
await crop(page, ".card-view-head", `${OUT}/06c-card-view-head.png`);

notes.cardView = await page.evaluate(() => {
  const head = document.querySelector(".card-view-head");
  const thread = document.querySelector(".card-view-thread");
  const lines = [...(thread?.querySelectorAll(".line") || [])];
  const you = document.querySelector(".line.you p");
  const them = document.querySelector(".line.them p");
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      text: (el.textContent || "").slice(0, 90),
      color: s.color,
      weight: s.fontWeight,
      size: s.fontSize,
      family: s.fontFamily,
      bg: s.backgroundColor,
      pad: s.padding,
      border: s.borderWidth,
    };
  };
  const lineArt = [...document.querySelectorAll(".line")].slice(0, 4).map((el) => {
    const s = getComputedStyle(el);
    return {
      cls: el.className,
      bg: s.backgroundColor,
      pad: s.padding,
      border: s.border,
      radius: s.borderRadius,
    };
  });
  return {
    headText: (head?.textContent || "").replace(/\s+/g, " ").trim(),
    headHasFiles: /files/i.test(head?.textContent || ""),
    headHasHistory: /history/i.test(head?.textContent || ""),
    lineCount: lines.length,
    threadScroll: thread
      ? {
          scrollH: thread.scrollHeight,
          clientH: thread.clientHeight,
          scrollTop: thread.scrollTop,
          canScroll: thread.scrollHeight - thread.clientHeight > 8,
        }
      : null,
    you: pick(you),
    them: pick(them),
    lineArt,
    veil: document.querySelector(".env-veil")?.className,
    root: document.querySelector(".app-root")?.className,
    filesBtn: !!document.querySelector(".card-view [aria-label*='Files'], .card-view-head button:not(.card-back)"),
    buttonsInHead: [...(head?.querySelectorAll("button, a, span") || [])].map((el) =>
      (el.textContent || el.getAttribute("aria-label") || "").trim(),
    ),
  };
});

await page.locator(".card-view-thread").evaluate((el) => {
  el.scrollTop = 0;
});
await page.waitForTimeout(200);
await shot(page, "06d-card-view-scrolled-top");

const lineYou = page.locator(".line.you").first();
const lineThem = page.locator(".line.them").first();
if (await lineYou.count()) await crop(page, lineYou, `${OUT}/07-type-cardview-you.png`);
if (await lineThem.count()) await crop(page, lineThem, `${OUT}/07-type-cardview-them.png`);
await crop(page, ".card-view-thread", `${OUT}/07b-type-cardview-thread.png`);

// ── 4. NEGATIVES ──────────────────────────────────────────────────────────
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
await shot(page, "08-home-after-card");

// Side pane / leading ornament
notes.negativesHome = await page.evaluate(() => {
  const qs = (s) => document.querySelector(s);
  const allText = document.body.innerText;
  return {
    leading: !!qs(".leading-ornament"),
    sidePane: !!qs(".side-pane, .sidepane, .nav-rail, aside.nav"),
    winCloseVisible: (() => {
      const el = qs(".win-close, .win-x");
      if (!el) return false;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
    })(),
    cancelButtons: [...document.querySelectorAll("button")].filter((b) =>
      /cancel/i.test((b.textContent || "") + (b.getAttribute("aria-label") || "")),
    ).length,
    youLabels: /(?:^|\s)YOU(?:\s|$)/.test(allText),
    liteLabels: /\bLITE\b/.test(allText),
    filesOnHomeCards: [...document.querySelectorAll(".card-head")].some((h) => /files|history/i.test(h.textContent || "")),
  };
});

// Settings pane
await page.locator(".settings-orb, [aria-label*='Settings'], .set-orb").first().click({ timeout: 3000 }).catch(async () => {
  const orbs = await page.evaluate(() =>
    [...document.querySelectorAll("button")].map((b) => ({
      aria: b.getAttribute("aria-label"),
      cls: b.className,
    })),
  );
  notes.orbHunt = orbs.slice(0, 40);
});
await page.waitForTimeout(400);
if (!(await page.locator(".alert-card").count())) {
  // try clicking bottom-left-ish
  const orb = await page.evaluate(() => {
    const el = document.querySelector(".settings-orb") || document.querySelector("[class*='settings']");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, cls: el.className };
  });
  if (orb) await page.mouse.click(orb.x, orb.y);
  await page.waitForTimeout(400);
}
await shot(page, "09-settings-apps");
if (await page.locator(".alert-card").count()) {
  await crop(page, ".alert-card", `${OUT}/09b-settings-pane.png`);
}

notes.settings = await page.evaluate(() => {
  const pane = document.querySelector(".alert-card");
  const ps = pane ? getComputedStyle(pane) : null;
  const cancel = [...document.querySelectorAll("button")].filter((b) =>
    /cancel/i.test((b.textContent || "") + (b.getAttribute("aria-label") || "")),
  );
  const close = pane
    ? [...pane.querySelectorAll("button")].map((b) => ({
        text: (b.textContent || "").trim(),
        aria: b.getAttribute("aria-label"),
        cls: b.className,
        w: b.getBoundingClientRect().width,
        h: b.getBoundingClientRect().height,
      }))
    : [];
  return {
    present: !!pane,
    paneText: (pane?.innerText || "").slice(0, 400),
    bg: ps?.backgroundColor,
    backdrop: ps?.backdropFilter,
    cancel: cancel.map((b) => (b.textContent || b.getAttribute("aria-label") || "").trim()),
    buttons: close,
    hasCancelText: /cancel/i.test(pane?.innerText || ""),
  };
});

// Models tab + chips
if (await page.locator(".alert-tab").count()) {
  await page.locator(".alert-tab").filter({ hasText: /models/i }).click();
  await page.waitForTimeout(350);
  await shot(page, "10-settings-models");
  await crop(page, ".alert-card", `${OUT}/10b-models-pane.png`);
  if (await page.locator(".model-chip").count()) {
    await crop(page, ".model-chip", `${OUT}/10c-model-chip.png`);
  }
  notes.chips = await page.evaluate(() => {
    return [...document.querySelectorAll(".model-chip")].slice(0, 8).map((el) => {
      const s = getComputedStyle(el);
      return {
        text: (el.textContent || "").trim().slice(0, 40),
        bg: s.backgroundColor,
        color: s.color,
        border: s.border,
        cls: el.className,
        accent: s.getPropertyValue("--chip-accent") || el.style.getPropertyValue("--chip-accent"),
      };
    });
  });
}

// Close settings, open history
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
if (await page.locator(".alert-card").count()) {
  await page.locator(".alert-dim").click({ force: true }).catch(() => {});
  await page.waitForTimeout(200);
}

// Reopen settings → History app
const settingsBtn = page.locator(".settings-orb").first();
if (await settingsBtn.count()) {
  await settingsBtn.click({ force: true });
} else {
  await page.evaluate(() => {
    const el = document.querySelector("button.settings-orb, .set-orb, [aria-label='Settings']");
    el?.click();
  });
}
await page.waitForTimeout(350);
const histApp = page.locator(".app-icon").filter({ hasText: /history/i });
if (await histApp.count()) {
  await histApp.click();
  await page.waitForTimeout(500);
  await shot(page, "11-history-overlay");
  if (await page.locator(".float-window").count()) {
    await crop(page, ".float-window", `${OUT}/11b-history-sheet.png`);
  }
  notes.history = await page.evaluate(() => {
    const sheet = document.querySelector(".float-window, .overlay-sheet, .hist-sheet");
    const ss = sheet ? getComputedStyle(sheet) : null;
    const scrim = document.querySelector(".sheet-scrim");
    const cardsBehind = [...document.querySelectorAll(".model-card .card-mini, .card-name")].map((el) => {
      const r = el.getBoundingClientRect();
      return { text: (el.textContent || "").slice(0, 40), x: r.x, y: r.y, vis: r.width > 0 };
    });
    return {
      sheetBg: ss?.backgroundColor,
      sheetBackdrop: ss?.backdropFilter,
      sheetOpacity: ss?.opacity,
      scrim: scrim ? getComputedStyle(scrim).backgroundColor : null,
      title: document.querySelector(".float-title")?.textContent,
      close: (() => {
        const el = document.querySelector(".sheet-close, .win-close, .win-x");
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { cls: el.className, w: r.width, h: r.height, text: (el.textContent || "").trim() };
      })(),
      sampleBehind: cardsBehind.slice(0, 4),
    };
  });
}

// Files surface
await page.keyboard.press("Escape");
await page.waitForTimeout(250);
if (await page.locator(".settings-orb").count()) {
  await page.locator(".settings-orb").click({ force: true });
  await page.waitForTimeout(300);
  const filesApp = page.locator(".app-icon").filter({ hasText: /^Files$/i });
  if (await filesApp.count()) {
    await filesApp.click();
    await page.waitForTimeout(500);
    await shot(page, "12-files");
  }
}

await page.keyboard.press("Escape");
await page.waitForTimeout(300);

// Back to home if on files
if (await page.locator(".close-affordance").count()) {
  await page.locator(".close-affordance").click({ force: true }).catch(() => {});
  await page.waitForTimeout(400);
}
await shot(page, "13-home-final");

// Extra: empty-card type vs real
notes.placeholder = await page.evaluate(() => {
  return [...document.querySelectorAll(".model-card")].map((c) => {
    const empty = c.querySelector(".card-empty");
    const minis = [...c.querySelectorAll(".card-mini")];
    return {
      name: c.querySelector(".card-name")?.textContent,
      empty: empty
        ? { text: empty.textContent, color: getComputedStyle(empty).color, weight: getComputedStyle(empty).fontWeight }
        : null,
      miniColors: minis.map((m) => getComputedStyle(m).color),
    };
  });
});

await writeFile(`${OUT}/notes.json`, JSON.stringify(notes, null, 2));
console.log("WROTE notes.json");
console.log(JSON.stringify({
  inject: notes.inject,
  wheel: notes.wheel,
  realWheel: notes.realWheel,
  homeLong0: notes.homeLong?.[0],
  afterScrollTop: notes.afterScrollTop,
  typeHome: notes.typeHome,
  tint: notes.tint,
  cardView: notes.cardView,
  negativesHome: notes.negativesHome,
  settings: notes.settings,
  chips: notes.chips,
  history: notes.history,
}, null, 2));

await browser.close();
