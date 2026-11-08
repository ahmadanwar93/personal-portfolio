/**
 * Engraved botanicals: flower and leaf figures drawn as nested fine lines, the way an
 * intaglio engraver builds tone. Each figure is deterministic from a seed string, so every
 * project gets its own. Coordinates are in a 200×200 box centred on (100, 100).
 */

export const FLOWERS = ['bloom', 'daisy', 'star', 'rose', 'lotus', 'seedhead', 'leaf', 'sprig', 'fern'] as const;
export type Flower = (typeof FLOWERS)[number];

export interface Rosette {
  /** fine lines: hatching, veins, bands */
  outer: string[];
  /** heavier lines: outlines and the main form */
  inner: string[];
  /** dots: flower centres, seeds, buds */
  dots: { x: number; y: number; r: number }[];
}

type Pt = [number, number];
type Rnd = () => number;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number): Rnd {
  let a = seed || 1;
  return () => {
    a ^= a << 13; a ^= a >>> 17; a ^= a << 5;
    return ((a >>> 0) % 100000) / 100000;
  };
}

const C = 100;
const TAU = Math.PI * 2;
const between = (r: Rnd, lo: number, hi: number) => lo + r() * (hi - lo);
const int = (r: Rnd, lo: number, hi: number) => Math.floor(between(r, lo, hi + 1));

function line(pts: Pt[], close = false): string {
  return 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (close ? 'Z' : '');
}

function polar(r: (t: number) => number, turns = 1, steps = 720): string {
  const pts: Pt[] = [];
  const n = Math.round(steps * turns);
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * TAU * turns;
    const rr = r(t);
    pts.push([C + rr * Math.cos(t), C + rr * Math.sin(t)]);
  }
  return line(pts, turns === 1);
}

/** place a local point (x along the petal, y across it) at origin o, rotated by angle a */
function place(p: Pt, o: Pt, a: number): Pt {
  const c = Math.cos(a), s = Math.sin(a);
  return [o[0] + p[0] * c - p[1] * s, o[1] + p[0] * s + p[1] * c];
}

/**
 * A petal or leaf blade from base (0,0) to tip (len,0).
 * fat: where the widest point sits (0..1); point: tip sharpness; curl: sideways bend.
 */
function blade(o: Pt, a: number, len: number, wid: number, fat = 0.45, point = 1, curl = 0, steps = 48): string {
  const up: Pt[] = [];
  const down: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const w = wid * Math.pow(Math.sin(Math.PI * Math.pow(u, Math.log(0.5) / Math.log(fat))), point);
    const bend = curl * len * u * u;
    up.push(place([u * len, w + bend], o, a));
    down.push(place([u * len, -w + bend], o, a));
  }
  return line([...up, ...down.reverse()], true);
}

/** the central rib of a blade, slightly bowed with its curl */
function rib(o: Pt, a: number, len: number, curl = 0, from = 0, to = 1): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const u = from + ((to - from) * i) / 24;
    pts.push(place([u * len, curl * len * u * u], o, a));
  }
  return line(pts);
}

/** nested engraving: the same blade repeated inward, giving the line-built tone of intaglio */
function engravedBlade(f: Rosette, o: Pt, a: number, len: number, wid: number, nest: number, opts: { fat?: number; point?: number; curl?: number } = {}) {
  const { fat = 0.45, point = 1, curl = 0 } = opts;
  f.inner.push(blade(o, a, len, wid, fat, point, curl));
  for (let k = 1; k <= nest; k++) {
    const s = 1 - k / (nest + 1.4);
    f.outer.push(blade(o, a, len * (0.35 + 0.65 * s), wid * s, fat, point, curl));
  }
}

/** half-width of a blade at u, matching blade()'s profile */
function bladeWidth(u: number, wid: number, fat: number, point: number): number {
  return wid * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, Math.max(0, u)), Math.log(0.5) / Math.log(fat))), point);
}

function veins(f: Rosette, o: Pt, a: number, len: number, wid: number, pairs: number, curl = 0, fat = 0.45, point = 1) {
  f.inner.push(rib(o, a, len, curl, 0, 0.94));
  for (let i = 1; i <= pairs; i++) {
    const u = (i / (pairs + 1)) * 0.86;
    const rise = 0.12 * (1 - u); // veins sweep toward the tip, less so near it
    const end = u + rise;
    const reach = bladeWidth(end, wid, fat, point) * 0.82;
    for (const side of [1, -1]) {
      const pts: Pt[] = [];
      for (let j = 0; j <= 10; j++) {
        const v = j / 10;
        const x = (u + v * rise) * len;
        const ux = u + v * rise;
        const y = curl * len * ux * ux + side * reach * Math.sin((v * Math.PI) / 2);
        pts.push(place([x, y], o, a));
      }
      f.outer.push(line(pts));
    }
  }
}

/* ——————————————————— the forms ——————————————————— */

function bloom(f: Rosette, r: Rnd, fine: number) {
  const petals = 6 + int(r, 0, 6) * 2;
  const lobes = int(r, 3, 7);
  const phase = r() * Math.PI;
  for (let k = 0; k < fine + 3; k++) {
    const p = phase + k * 0.11;
    const base = 66 + k * 1.6;
    f.outer.push(polar((t) => base + 16 * Math.sin(petals * t + p) + 5 * Math.cos(lobes * t - p)));
  }
  const chain = petals * 2 + 2 * int(r, 0, 3);
  for (let k = 0; k < Math.ceil(fine / 2); k++) f.outer.push(polar((t) => 43 + 3.2 * Math.sin(chain * t + phase + (k * Math.PI) / chain)));
  const ip = petals / 2 + 1;
  for (let k = 0; k < fine; k++) f.inner.push(polar((t) => 22 + k * 2.4 + 9 * Math.sin(ip * t + phase + k * 0.3)));
  f.dots.push({ x: C, y: C, r: 3.2 });
}

function daisy(f: Rosette, r: Rnd, fine: number) {
  const n = int(r, 9, 16);
  const len = between(r, 62, 78);
  const wid = between(r, 6, 10);
  const twist = between(r, -0.25, 0.25);
  const a0 = r() * TAU;
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * TAU;
    engravedBlade(f, place([16, 0], [C, C], a), a, len, wid, Math.max(1, fine - 3), { fat: 0.55, point: 0.8, curl: twist * 0.3 });
  }
  // second, shorter ring between the long petals
  if (r() > 0.4) {
    for (let i = 0; i < n; i++) {
      const a = a0 + ((i + 0.5) / n) * TAU;
      f.outer.push(blade(place([16, 0], [C, C], a), a, len * 0.6, wid * 0.7, 0.5, 0.8));
    }
  }
  for (let k = 0; k < 3; k++) f.inner.push(polar((t) => 15 - k * 3.6 + 0.8 * Math.sin(n * 2 * t)));
  // a phyllotaxis of seeds in the disc
  const seeds = 34;
  for (let i = 0; i < seeds; i++) {
    const rr = 11 * Math.sqrt(i / seeds);
    const t = i * 2.39996;
    f.dots.push({ x: C + rr * Math.cos(t), y: C + rr * Math.sin(t), r: 0.9 });
  }
}

function star(f: Rosette, r: Rnd, fine: number) {
  const n = int(r, 5, 7);
  const a0 = -Math.PI / 2 + r() * 0.3;
  const len = between(r, 78, 88);
  const wid = between(r, 22, 30);
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * TAU;
    engravedBlade(f, [C, C], a, len, wid, fine, { fat: between(r, 0.42, 0.55), point: 1.4 });
    f.outer.push(rib([C, C], a, len, 0, 0.1, 0.9));
  }
  // an inner layer, offset by half a petal
  for (let i = 0; i < n; i++) {
    const a = a0 + ((i + 0.5) / n) * TAU;
    engravedBlade(f, [C, C], a, len * 0.48, wid * 0.55, Math.ceil(fine / 2), { fat: 0.5, point: 1.4 });
  }
  for (let i = 0; i < n * 2; i++) {
    const a = a0 + (i / (n * 2)) * TAU;
    const s = place([16, 0], [C, C], a);
    f.outer.push(line([[C, C], s]));
    f.dots.push({ x: s[0], y: s[1], r: 1.6 });
  }
}

function rose(f: Rosette, r: Rnd, fine: number) {
  // rhodonea curves r = cos(kθ), k = p/q; the loops make the petals
  const options: [number, number][] = [[3, 1], [5, 1], [4, 1], [7, 3], [5, 3], [7, 2], [8, 3], [6, 5]];
  const [p, q] = options[int(r, 0, options.length - 1)];
  const k = p / q;
  const turns = (p * q) % 2 === 0 ? 2 * q : q;
  const R = 84;
  const rot = r() * TAU;
  for (let j = 0; j < fine + 1; j++) {
    const s = 1 - j * 0.075;
    f.outer.push(polar((t) => R * s * Math.cos(k * (t + rot)), turns, 900));
  }
  f.inner.push(polar((t) => R * Math.cos(k * (t + rot)), turns, 900));
  for (let j = 0; j < 3; j++) f.inner.push(polar((t) => 10 - j * 3 + 1.4 * Math.sin(p * 2 * t)));
  f.dots.push({ x: C, y: C, r: 2.2 });
}

function lotus(f: Rosette, r: Rnd, fine: number) {
  const base: Pt = [C, 150];
  const n = int(r, 2, 3); // petals each side of the centre
  const spread = between(r, 0.42, 0.6);
  const len = between(r, 92, 108);
  // back row then front row
  for (let row = 0; row < 2; row++) {
    const L = len * (row ? 0.82 : 1);
    for (let i = -n; i <= n; i++) {
      if (row === 1 && i === 0) continue;
      const a = -Math.PI / 2 + i * spread * (row ? 1.15 : 0.82);
      engravedBlade(f, base, a, L * (1 - Math.abs(i) * 0.12), 17 - Math.abs(i) * 1.6, row ? fine : Math.ceil(fine / 2), { fat: 0.5, point: 1.15, curl: i * 0.04 });
    }
  }
  // the water line and a few ripples beneath
  for (let j = 0; j < 4; j++) {
    const y = 156 + j * 7;
    const w = 70 - j * 12;
    f.outer.push(line([[C - w, y], [C - w * 0.3, y - 1.5], [C + w * 0.3, y - 1.5], [C + w, y]]));
  }
  f.dots.push({ x: base[0], y: base[1] - 4, r: 2 });
}

function seedhead(f: Rosette, r: Rnd, fine: number) {
  const n = int(r, 26, 44);
  const R = between(r, 70, 84);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + r() * 0.06;
    const rr = R * between(r, 0.86, 1);
    const tip = place([rr, 0], [C, C], a);
    f.outer.push(line([[C, C], tip]));
    // a tiny umbrella of fine hairs at each tip
    for (let h = -2; h <= 2; h++) {
      const b = a + h * 0.12;
      f.outer.push(line([tip, place([rr + 9, 0], [C, C], b)]));
    }
    f.dots.push({ x: tip[0], y: tip[1], r: 0.9 });
  }
  for (let k = 0; k < fine; k++) f.inner.push(polar((t) => 7 + k * 1.3 + 0.8 * Math.sin(14 * t)));
  f.dots.push({ x: C, y: C, r: 2.6 });
}

function leaf(f: Rosette, r: Rnd, fine: number) {
  const a = -Math.PI / 4 + between(r, -0.2, 0.2);
  const len = between(r, 150, 168);
  const wid = between(r, 32, 46);
  const curl = between(r, -0.08, 0.08);
  const o = place([-len / 2, 0], [C, C], a);
  const fat = between(r, 0.35, 0.5);
  engravedBlade(f, o, a, len, wid, Math.ceil(fine / 2), { fat, point: 0.9, curl });
  veins(f, o, a, len, wid, int(r, 6, 9), curl, fat, 0.9);
  // the stalk
  f.inner.push(line([o, place([-16, 3], o, a)]));
}

function sprig(f: Rosette, r: Rnd, fine: number) {
  const pts: Pt[] = [];
  const bow = between(r, -26, 26);
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    pts.push([30 + u * 140, 172 - u * 144 + Math.sin(u * Math.PI) * bow]);
  }
  f.inner.push(line(pts));
  const n = int(r, 5, 7);
  const lw = between(r, 9, 13);
  for (let i = 0; i < n; i++) {
    const u = 0.14 + (i / n) * 0.78;
    const idx = Math.round(u * 40);
    const p = pts[idx];
    const q = pts[Math.min(40, idx + 1)];
    const dir = Math.atan2(q[1] - p[1], q[0] - p[0]);
    const side = i % 2 ? 1 : -1;
    const a = dir + side * between(r, 0.7, 1.05);
    const L = between(r, 34, 46) * (1 - u * 0.35);
    engravedBlade(f, p, a, L, lw * (1 - u * 0.3), Math.max(1, Math.ceil(fine / 3)), { fat: 0.4, point: 0.9, curl: side * 0.06 });
    f.outer.push(rib(p, a, L, side * 0.06, 0, 0.85));
  }
  const tip = pts[40];
  f.dots.push({ x: tip[0], y: tip[1], r: 3.4 });
}

function fern(f: Rosette, r: Rnd, fine: number) {
  const pts: Pt[] = [];
  const bow = between(r, 18, 34) * (r() > 0.5 ? 1 : -1);
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    pts.push([40 + u * 120 + Math.sin(u * Math.PI) * bow * 0.3, 178 - u * 160 + Math.sin(u * Math.PI) * bow * 0.2]);
  }
  f.inner.push(line(pts));
  const pairs = int(r, 11, 15);
  for (let i = 0; i < pairs; i++) {
    const u = 0.08 + (i / pairs) * 0.86;
    const idx = Math.round(u * 60);
    const p = pts[idx];
    const q = pts[Math.min(60, idx + 1)];
    const dir = Math.atan2(q[1] - p[1], q[0] - p[0]);
    const L = 44 * Math.sin(Math.PI * (0.15 + u * 0.85)) * (1.1 - u * 0.5) + 6;
    for (const side of [1, -1]) {
      const a = dir + side * 1.05;
      f.outer.push(blade(p, a, L, 3.2 + L * 0.06, 0.35, 0.9, side * 0.08));
      if (fine > 4) f.outer.push(rib(p, a, L, side * 0.08, 0, 0.8));
    }
  }
}

const draw: Record<Flower, (f: Rosette, r: Rnd, fine: number) => void> = { bloom, daisy, star, rose, lotus, seedhead, leaf, sprig, fern };

export function rosette(seedText: string, detail: 'full' | 'small' = 'full', form?: Flower): Rosette {
  const h = hash(seedText);
  const r = rng(h);
  const kind = form ?? FLOWERS[h % FLOWERS.length];
  const f: Rosette = { outer: [], inner: [], dots: [] };
  draw[kind](f, r, detail === 'full' ? 6 : 3);
  return f;
}
