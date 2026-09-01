import { chromium } from "playwright";

const OUT = "/workspace/screenshots/qa-vis";
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function recapture(prefix, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const layout = await page.evaluate(() => {
    const stage = document.querySelector(".stage");
    const win = document.querySelector(".main-window");
    const orb = document.querySelector(".prompt-orb");
    const scene = document.querySelector(".scene");
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        box: { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) },
        cw: el.clientWidth,
        ch: el.clientHeight,
        overflow: s.overflow,
        transform: s.transform,
      };
    };
    return {
      inner: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
      scene: r(scene),
      stage: r(stage),
      win: r(win),
      orb: r(orb),
      stageCs: stage ? { w: getComputedStyle(stage).width, h: getComputedStyle(stage).height } : null,
    };
  });
  console.log(prefix, "LAYOUT", JSON.stringify(layout, null, 2));

  // Account tab
  await page.locator(".settings-orb").click({ force: true });
  await page.waitForTimeout(400);
  await page.locator(".alert-tab").filter({ hasText: "Account" }).click({ force: true });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${prefix}-settings-account-tab.png` });
  const account = await page.evaluate(() => document.querySelector(".alert-card")?.innerText);
  console.log(prefix, "ACCOUNT", account);

  await page.locator(".alert-dim").click({ force: true }).catch(() => {});
  await page.waitForTimeout(250);

  // Prompt: disable idle via store if possible, open, keep focused
  await page.evaluate(() => {
    const st = window.__AETHER__ || null;
  });
  // try zustand persist
  await page.evaluate(() => {
    try {
      const raw = localStorage.getItem("aether");
    } catch {}
  });

  await page.locator(".prompt-orb").click({ force: true });
  await page.waitForTimeout(80);
  await page.screenshot({ path: `${OUT}/${prefix}-prompt-t80.png` });
  await page.waitForTimeout(320);
  await page.screenshot({ path: `${OUT}/${prefix}-prompt-open2.png` });

  const openState = await page.evaluate(() => {
    const seat = document.querySelector(".prompt-seat");
    const input = document.querySelector(".prompt-bar input");
    input?.focus();
    input?.dispatchEvent(new Event("input", { bubbles: true }));
    const probe = document.querySelector(".probe");
    const pr = probe?.getBoundingClientRect();
    const hit = pr ? document.elementFromPoint(pr.x + pr.width / 2, pr.y + pr.height / 2) : null;
    const win = document.querySelector(".main-window");
    return {
      seatOpen: seat?.classList.contains("open"),
      seatOp: seat ? getComputedStyle(seat).opacity : null,
      tucked: win?.classList.contains("tucked"),
      probeHit: hit ? { tag: hit.tagName, cls: String(hit.className).slice(0, 60) } : null,
      zSeat: seat ? getComputedStyle(seat).zIndex : null,
      zWin: win ? getComputedStyle(win).zIndex : null,
    };
  });
  console.log(prefix, "OPEN", JSON.stringify(openState));

  // JS click probe to avoid hit-testing
  await page.evaluate(() => document.querySelector(".probe")?.click());
  await page.waitForTimeout(280);
  await page.screenshot({ path: `${OUT}/${prefix}-prompt-invest2.png` });
  const invest = await page.evaluate(() => {
    const tray = document.querySelector(".investigate-tray");
    return {
      open: tray?.classList.contains("open"),
      op: tray ? getComputedStyle(tray).opacity : null,
      tf: tray ? getComputedStyle(tray).transform : null,
      text: tray?.innerText,
    };
  });
  console.log(prefix, "INVEST", JSON.stringify(invest));

  // close and catch mid-close
  await page.evaluate(() => {
    const btn = document.querySelector(".prompt-orb");
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);
  await page.screenshot({ path: `${OUT}/${prefix}-prompt-closing2.png` });
  const closing = await page.evaluate(() => {
    const seat = document.querySelector(".prompt-seat");
    const orb = document.querySelector(".prompt-orb");
    return {
      seatOpen: seat?.classList.contains("open"),
      seatOp: seat ? getComputedStyle(seat).opacity : null,
      seatTf: seat ? getComputedStyle(seat).transform : null,
      orbOp: orb ? getComputedStyle(orb).opacity : null,
      orbTf: orb ? getComputedStyle(orb).transform : null,
    };
  });
  console.log(prefix, "CLOSING", JSON.stringify(closing));
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/${prefix}-prompt-closed2.png` });

  // elite lock check
  await page.locator(".settings-orb").click({ force: true });
  await page.waitForTimeout(300);
  await page.locator(".alert-tab").filter({ hasText: "Models" }).click({ force: true });
  await page.waitForTimeout(300);
  const locks = await page.evaluate(() => {
    const bands = [...document.querySelectorAll(".tier-band")].map((b) => ({
      cls: b.className,
      kicker: b.querySelector(".tier-kicker")?.textContent,
      lock: !!b.querySelector(".tier-lock"),
      chips: [...b.querySelectorAll(".model-chip")].map((c) => c.textContent.trim()),
    }));
    return { tierGuess: document.body.innerText.match(/Pro|Free|Elite/)?.[0], bands };
  });
  console.log(prefix, "LOCKS", JSON.stringify(locks, null, 2));

  await page.close();
}

await recapture("d", { width: 1280, height: 800 });
await recapture("m", { width: 390, height: 844 });
await browser.close();
