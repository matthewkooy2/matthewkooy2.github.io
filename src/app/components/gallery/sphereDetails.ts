import { projectMarkParticle, type MarkParticle } from "./heroParticles";

type Point = [number, number];

function trace(path: Point[]): Point[] {
  return path.slice(1).flatMap((end, index) => {
    const start = path[index];
    const steps = Math.ceil(Math.hypot(end[0] - start[0], end[1] - start[1]) / 0.075);
    return Array.from({ length: steps }, (_, i): Point => {
      const t = i / steps;
      return [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
    });
  });
}

function ellipse(cx: number, cy: number, rx: number, ry = rx, rotation = 0): Point[] {
  const steps = Math.ceil(Math.PI * 2 * Math.sqrt((rx * rx + ry * ry) / 2) / 0.075);
  return Array.from({ length: steps }, (_, i) => {
    const angle = i / steps * Math.PI * 2;
    const x = Math.cos(angle) * rx, y = Math.sin(angle) * ry;
    return [cx + x * Math.cos(rotation) - y * Math.sin(rotation), cy + x * Math.sin(rotation) + y * Math.cos(rotation)];
  });
}

// Sparse contours rather than typography: sampled once, then wrapped onto the globe.
const code = [
  ...trace([[-0.48, -0.6], [-0.94, 0], [-0.48, 0.6]]),
  ...trace([[0.48, -0.6], [0.94, 0], [0.48, 0.6]]),
  ...trace([[0.18, -0.72], [-0.18, 0.72]]),
];
const cpp: Point[] = [
  ...Array.from({ length: 36 }, (_, i): Point => {
    const angle = 0.65 + i / 35 * (Math.PI * 2 - 1.3);
    return [-0.4 + Math.cos(angle) * 0.57, Math.sin(angle) * 0.64];
  }),
  ...[0.3, 0.8].flatMap(x => [
    ...trace([[x - 0.17, 0], [x + 0.17, 0]]),
    ...trace([[x, -0.2], [x, 0.2]]),
  ]),
];
const snake: Point[] = trace([[-0.7, -0.15], [-0.7, -0.6], [-0.52, -0.78], [0.18, -0.78], [0.37, -0.6], [0.37, -0.06], [0.2, 0.12], [-0.36, 0.12], [-0.36, 0.5]]);
const python: Point[] = [...snake, ...snake.map(([x, y]): Point => [-x, -y]), [-0.4, -0.56], [0.4, 0.56]];

// Original, monochrome contour interpretations: recognizable without labels or badges.
const react = [0, Math.PI / 3, -Math.PI / 3].flatMap(angle => ellipse(0, 0, 0.86, 0.3, angle)).concat(ellipse(0, 0, 0.1));
const git = [
  ...trace([[-0.4, -0.58], [-0.4, 0.58]]),
  ...trace([[-0.4, 0.18], [0.42, -0.28], [0.42, -0.58]]),
  ...[[-0.4, -0.72], [-0.4, 0.72], [0.42, -0.72]].flatMap(([x, y]) => ellipse(x, y, 0.14)),
];
const database = [
  ...[-0.58, 0, 0.58].flatMap(y => ellipse(0, y, 0.66, 0.22)),
  ...[-0.66, 0.66].flatMap(x => trace([[x, -0.58], [x, 0.58]])),
];
const terminal = [
  ...trace([[-0.74, -0.42], [-0.24, 0], [-0.74, 0.42]]),
  ...trace([[0.1, 0.46], [0.78, 0.46]]),
];
const chip = [
  ...trace([[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5], [-0.5, -0.5]]),
  ...trace([[-0.2, -0.2], [0.2, -0.2], [0.2, 0.2], [-0.2, 0.2], [-0.2, -0.2]]),
  ...[-0.3, 0, 0.3].flatMap(p => [-1, 1].flatMap(side => [
    ...trace([[p, side * 0.55], [p, side * 0.8]]),
    ...trace([[side * 0.55, p], [side * 0.8, p]]),
  ])),
];
const container = [
  ...trace([[0, -0.8], [0.7, -0.4], [0.7, 0.4], [0, 0.8], [-0.7, 0.4], [-0.7, -0.4], [0, -0.8]]),
  ...trace([[-0.7, -0.4], [0, 0], [0.7, -0.4]]),
  ...trace([[0, 0], [0, 0.8]]),
];
const network = [
  ...[-0.55, 0.55].flatMap(y => [-0.7, 0.7].flatMap(x => [
    ...trace([[0, 0], [x * 0.82, y * 0.82]]),
    ...ellipse(x, y, 0.14),
  ])),
  ...ellipse(0, 0, 0.16),
];
const brace = trace([[-0.36, -0.8], [-0.6, -0.8], [-0.7, -0.65], [-0.7, -0.2], [-0.9, 0], [-0.7, 0.2], [-0.7, 0.65], [-0.6, 0.8], [-0.36, 0.8]]);
const braces = [...brace, ...brace.map(([x, y]): Point => [-x, y])];
const lightning = trace([[0.18, -0.84], [-0.58, 0.12], [-0.06, 0.12], [-0.18, 0.84], [0.58, -0.12], [0.06, -0.12], [0.18, -0.84]]);
const vision = [
  ...trace([[-0.82, 0], [-0.42, -0.4], [0, -0.54], [0.42, -0.4], [0.82, 0], [0.42, 0.4], [0, 0.54], [-0.42, 0.4], [-0.82, 0]]),
  ...ellipse(0, 0, 0.25),
];
const java = [
  ...trace([[-0.52, -0.05], [-0.46, 0.4], [-0.3, 0.54], [0.3, 0.54], [0.46, 0.4], [0.52, -0.05], [-0.52, -0.05]]),
  ...trace([[0.52, 0], [0.76, 0], [0.76, 0.22], [0.5, 0.32]]),
  ...trace([[-0.72, 0.72], [0.72, 0.72]]),
  ...[-0.2, 0.16].flatMap(x => Array.from({ length: 12 }, (_, i): Point => [x + Math.sin(i / 11 * Math.PI * 2) * 0.09, -0.22 - i / 11 * 0.55])),
];
const rust = [
  ...trace(Array.from({ length: 65 }, (_, i): Point => {
    const angle = i / 64 * Math.PI * 2, radius = i % 4 < 2 ? 0.8 : 0.69;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  })),
  ...trace([[-0.25, 0.4], [-0.25, -0.4], [0.15, -0.4], [0.3, -0.24], [0.3, -0.04], [0.15, 0.08], [-0.25, 0.08]]),
  ...trace([[0.04, 0.08], [0.34, 0.4]]),
];
const motifs = [code, python, react, git, cpp, database, java, terminal, chip, container, rust, braces, network, lightning, vision];

const grains: MarkParticle[] = motifs.flatMap((motif, index) => {
  // Equal-area spacing covers both hemispheres without clustered latitude rows.
  const latitude = Math.asin(1 - 2 * (index + 0.5) / motifs.length);
  const longitude = 0.9 + index * Math.PI * (3 - Math.sqrt(5));
  const cosLat = Math.cos(latitude), sinLat = Math.sin(latitude);
  const cosLon = Math.cos(longitude), sinLon = Math.sin(longitude);
  // Map each contour dot along a great-circle arc from the motif's center.
  // Every dot stays on the same unit sphere as the cloud, including at the poles.
  return motif.map(([u, v], grain) => {
    const arc = Math.hypot(u, v) * 0.16;
    const radial = Math.cos(arc), tangent = arc === 0 ? 0.16 : Math.sin(arc) / arc * 0.16;
    const sx = radial * cosLat * cosLon + tangent * (-u * sinLon - v * sinLat * cosLon);
    const sy = radial * sinLat + tangent * v * cosLat;
    const sz = radial * cosLat * sinLon + tangent * (u * cosLon - v * sinLat * sinLon);
    return { x: 0, y: 0, sx, sy, sz, phase: 0, accent: grain % 7 === 0 };
  });
});

const smooth = (t: number) => {
  const value = Math.max(0, Math.min(1, t));
  return value * value * value * (value * (value * 6 - 15) + 10);
};

export function getSphereDetails(blend: number, rotation: number, tilt = 0) {
  const reveal = smooth((blend - 0.8) / 0.2);
  return grains.map(grain => {
    const point = projectMarkParticle(grain, 1, rotation, tilt);
    return {
      x: point.x, y: point.y, depth: point.depth, accent: grain.accent,
      // The cloud is translucent: retain the far hemisphere with quieter ink.
      // Only contrast changes with depth; surface positions never move or flip.
      opacity: reveal * (0.18 + smooth((point.depth + 1) / 2) * 0.44),
    };
  });
}
