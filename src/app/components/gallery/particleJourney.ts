import type { MarkParticle } from "./heroParticles";

export const PARTICLE_CHECKPOINTS = [
  { id: "stack", shape: "code", label: "01" },
  { id: "work", shape: "links", label: "02" },
  { id: "extracurriculars", shape: "network", label: "03" },
  { id: "projects", shape: "grid", label: "04" },
  { id: "data", shape: "bars", label: "05" },
  { id: "contact", shape: "mark", label: "M" },
] as const;
export type CheckpointId = typeof PARTICLE_CHECKPOINTS[number]["id"];
export type CheckpointShape = typeof PARTICLE_CHECKPOINTS[number]["shape"];
export type ParticlePosition = { x: number; y: number };
export type JourneyPhase = { kind: "hero" | "dock" | "depart" | "travel" | "arrive"; from: number; to: number; progress: number };
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
export const ease = (value: number) => value * value * (3 - 2 * value);

/** Section choreography, driven by the renderer's smoothly following scroll position. */
export function getJourneyPhase(scrollY: number, starts: number[]): JourneyPhase {
  if (starts.length < 2 || scrollY <= starts[0]) return { kind: "hero", from: 0, to: 0, progress: 0 };
  let from = 0;
  while (from + 1 < starts.length && scrollY >= starts[from + 1]) from++;
  if (from === starts.length - 1) return { kind: "dock", from, to: from, progress: 0 };
  const span = Math.max(1, starts[from + 1] - starts[from]);
  const local = scrollY - starts[from];
  const hold = from === 0 ? 0 : Math.min(140, span * 0.18);
  const exitEnd = hold + Math.min(240, span * 0.28);
  const enterStart = span - Math.min(280, span * 0.32);
  if (local <= hold) return { kind: "dock", from, to: from, progress: 0 };
  if (local < exitEnd) return { kind: "depart", from, to: from + 1, progress: clamp((local - hold) / (exitEnd - hold)) };
  if (local < enterStart) return { kind: "travel", from, to: from + 1, progress: clamp((local - exitEnd) / (enterStart - exitEnd)) };
  return { kind: "arrive", from, to: from + 1, progress: clamp((local - enterStart) / (span - enterStart)) };
}

const fract = (value: number) => value - Math.floor(value);
const ring = (x: number, y: number, radius: number, t: number) => ({ x: x + Math.cos(t * Math.PI * 2) * radius, y: y + Math.sin(t * Math.PI * 2) * radius });
function line(a: ParticlePosition, b: ParticlePosition, t: number) {
  return { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) };
}

/** Stable destinations for the same sampled particles, not new emitters. */
export function getCheckpointPoint(point: MarkParticle, index: number, count: number, shape: CheckpointShape): ParticlePosition {
  const t = (index + 0.5) / count;
  const jitter = { x: Math.cos(point.phase) * 0.012, y: Math.sin(point.phase) * 0.012 };
  let target: ParticlePosition;
  if (shape === "mark") return { x: point.x, y: point.y };
  if (shape === "code") {
    const segments = [
      [{ x: -0.2, y: -0.32 }, { x: -0.42, y: 0 }], [{ x: -0.42, y: 0 }, { x: -0.2, y: 0.32 }],
      [{ x: 0.2, y: -0.32 }, { x: 0.42, y: 0 }], [{ x: 0.42, y: 0 }, { x: 0.2, y: 0.32 }],
      [{ x: 0.08, y: -0.35 }, { x: -0.08, y: 0.35 }],
    ];
    const segment = Math.min(4, Math.floor(t * 5));
    target = line(segments[segment][0], segments[segment][1], fract(t * 5));
  } else if (shape === "network") {
    const nodes = [{ x: 0, y: -0.27 }, { x: -0.28, y: 0.23 }, { x: 0.28, y: 0.23 }];
    const part = Math.min(5, Math.floor(t * 6));
    const local = fract(t * 6);
    target = part < 3 ? ring(nodes[part].x, nodes[part].y, 0.105, local) : line(nodes[part - 3], nodes[(part - 2) % 3], local);
  } else if (shape === "links") {
    target = ring(t < 0.5 ? -0.17 : 0.17, 0, 0.26, fract(t * 2));
  } else if (shape === "grid") {
    const tile = Math.min(3, Math.floor(t * 4));
    const edge = fract(t * 4) * 4;
    const corners = [{ x: -0.15, y: -0.15 }, { x: 0.15, y: -0.15 }, { x: 0.15, y: 0.15 }, { x: -0.15, y: 0.15 }];
    target = line(corners[Math.floor(edge)], corners[(Math.floor(edge) + 1) % 4], fract(edge));
    target.x += tile % 2 ? 0.23 : -0.23;
    target.y += tile < 2 ? -0.23 : 0.23;
  } else {
    const bar = index % 5;
    target = { x: -0.4 + bar * 0.18 + fract(index * 0.61803398875) * 0.12, y: 0.4 - fract(index * 0.41421356237) * [0.18, 0.32, 0.48, 0.64, 0.8][bar] };
  }
  return { x: target.x + jitter.x, y: target.y + jitter.y };
}

/** Critically damped follower: retain momentum, then settle without springy bouncing. */
export function advanceJourneyScroll(position: number, velocity: number, target: number, dt: number) {
  const frequency = 9;
  const offset = position - target;
  const impulse = velocity + frequency * offset;
  const decay = Math.exp(-frequency * dt);
  const next = target + (offset + impulse * dt) * decay;
  const speed = (velocity - frequency * impulse * dt) * decay;
  if (Math.abs(next - target) < 0.05 && Math.abs(speed) < 0.1) return { position: target, velocity: 0 };
  return { position: next, velocity: speed };
}

/** Slow, overlapping orbital currents spread the cloud across the entire viewport. */
export function getStreamPoint(point: MarkParticle, scrollY: number, width: number, height: number, navHeight: number, time = 0): ParticlePosition {
  const phase = point.phase + scrollY * 0.0013 + time * (0.18 + point.sy * 0.035);
  const availableHeight = Math.max(0, height - navHeight);
  return {
    x: width * (0.5 + Math.sin(phase) * 0.38 + point.sx * 0.065 + Math.sin(phase * 2 + point.sy * 3) * 0.025),
    y: navHeight + availableHeight * (0.5 + Math.cos(phase + point.sy * 2.4) * 0.34 + point.sz * 0.09),
  };
}

/** Each grain arcs out of its formation; both endpoints meet with zero tangent speed. */
export function connectToStream(dock: ParticlePosition, stream: ParticlePosition, amount: number, phase = 0): ParticlePosition {
  if (amount <= 0) return dock;
  if (amount >= 1) return stream;
  const t = ease(clamp(amount));
  const bend = Math.sin(t * Math.PI) * Math.min(110, Math.hypot(stream.x - dock.x, stream.y - dock.y) * 0.22);
  return {
    x: mix(dock.x, stream.x, t) + Math.cos(phase) * bend,
    y: mix(dock.y, stream.y, t) + Math.sin(phase) * bend,
  };
}
