export type MarkParticle = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  sz: number;
  phase: number;
  accent: boolean;
};

const noise = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Sample the image silhouette, keeping destinations stable across redraws. */
export function createMarkParticles(pixels: Uint8ClampedArray, width: number, height: number): MarkParticle[] {
  if (width <= 0 || height <= 0 || pixels.length !== width * height * 4) return [];
  const particles: MarkParticle[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] < 100) continue;
      const index = particles.length;
      const sy = noise(index + 1) * 2 - 1;
      const theta = index * 2.399963229728653;
      const radial = Math.sqrt(1 - sy * sy);
      particles.push({
        x: ((x + 0.5) / width - 0.5) * 0.94,
        y: ((y + 0.5) / height - 0.5) * 0.94 * height / width,
        sx: Math.cos(theta) * radial,
        sy,
        sz: Math.sin(theta) * radial,
        phase: noise(index + 11) * Math.PI * 2,
        accent: noise(index + 31) > 0.72,
      });
    }
  }
  return particles;
}

export function projectMarkParticle(point: MarkParticle, progress: number, rotation: number, tilt = 0, target: { x: number; y: number } = point) {
  const blend = Math.max(0, Math.min(1, progress));
  const sx = point.sx * Math.cos(rotation) + point.sz * Math.sin(rotation);
  const z = point.sz * Math.cos(rotation) - point.sx * Math.sin(rotation);
  const sy = point.sy * Math.cos(tilt) - z * Math.sin(tilt);
  const depth = point.sy * Math.sin(tilt) + z * Math.cos(tilt);
  const perspective = 1 / (1 - depth * 0.18);
  const scatter = Math.sin(blend * Math.PI) * 0.04;
  return {
    x: target.x * (1 - blend) + sx * 0.43 * perspective * blend + Math.cos(point.phase) * scatter,
    y: target.y * (1 - blend) + sy * 0.43 * perspective * blend + Math.sin(point.phase) * scatter,
    depth,
    opacity: 1 - blend * (0.5 - depth * 0.3),
  };
}
