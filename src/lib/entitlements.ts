import type { CreditPool, DailyUse, Identity, ModelKind, Tier } from "./types";

export const FREE_DAILY_MESSAGES = 20;

export const MEDIA_COST: Record<Extract<ModelKind, "image" | "audio" | "video">, number> = {
  image: 8,
  audio: 12,
  video: 40,
};

export const CREDIT_LIMITS: Record<Exclude<Tier, "free">, { daily: number; weekly: number; monthly: number }> = {
  pro: { daily: 200, weekly: 800, monthly: 3000 },
  elite: { daily: 400, weekly: 1600, monthly: 7500 },
};

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function emptyDaily(): DailyUse {
  return { date: dayKey(), messages: 0 };
}

export function emptyCredits(tier: Tier): CreditPool {
  const caps = tier === "free" ? { daily: 0, weekly: 0, monthly: 0 } : CREDIT_LIMITS[tier];
  return {
    daily: caps.daily,
    weekly: caps.weekly,
    monthly: caps.monthly,
    usedDaily: 0,
    usedWeekly: 0,
    usedMonthly: 0,
    weekKey: weekKey(),
    monthKey: monthKey(),
  };
}

export function rollDaily(use: DailyUse | undefined): DailyUse {
  const today = dayKey();
  if (!use || use.date !== today) return { date: today, messages: 0 };
  return use;
}

export function rollCredits(pool: CreditPool | undefined, tier: Tier): CreditPool {
  const next = pool ? { ...pool } : emptyCredits(tier);
  const caps = tier === "free" ? { daily: 0, weekly: 0, monthly: 0 } : CREDIT_LIMITS[tier];
  next.daily = caps.daily;
  next.weekly = caps.weekly;
  next.monthly = caps.monthly;
  const w = weekKey();
  const m = monthKey();
  if (!pool || pool.weekKey !== w) {
    next.usedWeekly = 0;
    next.weekKey = w;
  }
  if (!pool || pool.monthKey !== m) {
    next.usedMonthly = 0;
    next.monthKey = m;
  }
  return next;
}

export function remainingMessages(tier: Tier, use: DailyUse) {
  if (tier !== "free") return Number.POSITIVE_INFINITY;
  return Math.max(0, FREE_DAILY_MESSAGES - rollDaily(use).messages);
}

export function remainingCredits(tier: Tier, pool: CreditPool) {
  if (tier === "free") return 0;
  const p = rollCredits(pool, tier);
  return Math.max(0, Math.min(p.daily - p.usedDaily, p.weekly - p.usedWeekly, p.monthly - p.usedMonthly));
}

export function identityLabel(kind: Identity, email?: string) {
  if (kind === "google") return email || "Google";
  if (kind === "apple") return email || "Apple";
  if (kind === "email") return email || "Email";
  return "Guest";
}
