import type { MarkParticle } from "./heroParticles";

export const HERO_SHAPES = ["Michigan / Block M", "Code / C++", "Computer vision"] as const;
export const HERO_BEAT_SECONDS = 11.2;

// Zero velocity and acceleration at either end of every morph.
const soften = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export function getHeroLoop(elapsed: number) {
  const cycle = Math.max(0, elapsed) % (HERO_BEAT_SECONDS * HERO_SHAPES.length);
  const beat = cycle / HERO_BEAT_SECONDS;
  const local = (beat % 1) * HERO_BEAT_SECONDS;
  const blend = local < 3.2 ? 1
    : local < 6 ? 1 - soften((local - 3.2) / 2.8)
    : local < 8.4 ? 0
    : soften((local - 8.4) / 2.8);
  return { shape: Math.floor(beat) % HERO_SHAPES.length, blend };
}

type Position = { x: number; y: number };
const segmentDistance = (x: number, y: number, ax: number, ay: number, bx: number, by: number) => {
  const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
  return Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay));
};

/** Original vector silhouettes, sampled once; no fonts, downloads, or new emitters. */
export function createHeroTargets(points: MarkParticle[]): Position[][] {
  const cpp: Position[] = [], vision: Position[] = [];
  const hex = Array.from({ length: 6 }, (_, i) => ({ x: Math.sin(i * Math.PI / 3) * 0.44, y: Math.cos(i * Math.PI / 3) * 0.44 }));
  for (let row = 0; row < 224; row++) {
    for (let col = 0; col < 224; col++) {
      const x = (col + 0.5) / 224 - 0.5, y = (row + 0.5) / 224 - 0.5;
      const border = hex.some((a, i) => segmentDistance(x, y, a.x, a.y, hex[(i + 1) % 6].x, hex[(i + 1) % 6].y) < 0.018);
      const radius = Math.hypot(x + 0.065, y);
      const c = radius > 0.125 && radius < 0.215 && (x < -0.025 || Math.abs(y) > Math.abs(x + 0.065) * 0.8);
      const plus = [0.15, 0.285].some(cx => (Math.abs(x - cx) < 0.018 && Math.abs(y) < 0.064) || (Math.abs(x - cx) < 0.052 && Math.abs(y) < 0.018));
      if (border || c || plus) cpp.push({ x, y });

      // Almond eye, iris and pupil, framed by four machine-vision tracking corners.
      const eye = Math.abs(x) < 0.35 && Math.abs(Math.abs(y) - 0.2 * (1 - (x / 0.35) ** 2)) < 0.014;
      const irisRadius = Math.hypot(x, y);
      const iris = Math.abs(irisRadius - 0.105) < 0.014 || irisRadius < 0.041;
      const corners = (Math.abs(Math.abs(x) - 0.42) < 0.014 && Math.abs(y) > 0.18 && Math.abs(y) < 0.32)
        || (Math.abs(Math.abs(y) - 0.31) < 0.014 && Math.abs(x) > 0.29 && Math.abs(x) < 0.43);
      if (eye || iris || corners) vision.push({ x, y });
    }
  }
  // Row-ordered stratified sampling keeps coherent flows and a fixed particle count.
  const match = (samples: Position[]) => points.map((_, i) => samples[Math.floor((i + 0.5) * samples.length / points.length)]);
  return [points.map(({ x, y }) => ({ x, y })), match(cpp), match(vision)];
}
