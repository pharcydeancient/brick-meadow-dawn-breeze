import type { CardPos } from "./types";

export type CardRows = 1 | 2 | 3;

export const GAP = 8;
export const RATIO_MIN = 1.55;
export const RATIO_MAX = 2.05;

export function pageColumns(rows: CardRows) {
  return rows === 3 ? 3 : 2;
}

export function metrics(viewW: number, viewH: number, rows: CardRows, count: number) {
  const pageCols = pageColumns(rows);
  const colCount = Math.max(1, Math.ceil(Math.max(count, 1) / rows));
  const visCols = Math.min(colCount, pageCols);
  const maxW = Math.max(1, (viewW - GAP * (visCols - 1)) / visCols);
  const maxH = Math.max(1, (viewH - GAP * (rows - 1)) / rows);
  const ideal = maxH / maxW;
  const ratio = Math.min(RATIO_MAX, Math.max(RATIO_MIN, ideal));
  let cardW = maxW;
  let cardH = cardW * ratio;
  if (cardH > maxH) {
    cardH = maxH;
    cardW = cardH / ratio;
  }
  const clusterW = visCols * cardW + (visCols - 1) * GAP;
  const clusterH = rows * cardH + (rows - 1) * GAP;
  const scrolling = colCount > visCols;
  const padX = scrolling ? 4 : Math.max(0, (viewW - clusterW) / 2);
  const padY = Math.max(0, (viewH - clusterH) / 2);
  const contentW = colCount * cardW + Math.max(0, colCount - 1) * GAP + padX * 2;
  return { cardW, cardH, colCount, visCols, pageCols, rows, padX, padY, contentW, scrolling, gap: GAP };
}

export function cellForIndex(i: number, rows: CardRows, m: ReturnType<typeof metrics>) {
  const col = Math.floor(i / rows);
  const row = i % rows;
  return {
    col,
    row,
    x: m.padX + col * (m.cardW + m.gap),
    y: m.padY + row * (m.cardH + m.gap),
  };
}

export function snapLayout(layout: CardPos[], rows: CardRows, m?: ReturnType<typeof metrics>): CardPos[] {
  const sorted = [...layout].sort((a, b) => a.x - b.x || a.y - b.y);
  if (!m) {
    const cols = pageColumns(rows);
    return sorted.map((c, i) => ({
      id: c.id,
      x: Math.floor(i / rows) * (100 / cols),
      y: (i % rows) * (100 / rows),
    }));
  }
  return sorted.map((c, i) => {
    const cell = cellForIndex(i, rows, m);
    return { id: c.id, x: cell.x, y: cell.y };
  });
}

export function nearestCell(x: number, y: number, rows: CardRows, count: number, m: ReturnType<typeof metrics>) {
  const col = Math.round((x - m.padX) / (m.cardW + m.gap));
  const row = Math.round((y - m.padY) / (m.cardH + m.gap));
  const c = Math.max(0, Math.min(Math.max(m.colCount - 1, 0), col));
  const r = Math.max(0, Math.min(rows - 1, row));
  return { x: m.padX + c * (m.cardW + m.gap), y: m.padY + r * (m.cardH + m.gap), col: c, row: r };
}
