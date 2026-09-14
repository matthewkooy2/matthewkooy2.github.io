const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { motionValue } = require("motion");
const postcss = require("postcss");

const repo = path.resolve(__dirname, "..");
const gallery = path.join(repo, "src/app/components/gallery");
const cache = new Map();

// Run the real TS modules and React server renderer without a browser or adding
// a test-only bundler. Only CSS module names are substituted.
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const localRequire = name => {
    if (name.endsWith(".css")) return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
    if (!name.startsWith(".")) return require(name);
    const base = path.resolve(path.dirname(file), name);
    return load([base, base + ".ts", base + ".tsx"].find(candidate => fs.existsSync(candidate)));
  };
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: file })(localRequire, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}

const { stack } = load(path.join(gallery, "content.ts"));
const { stackDetails } = load(path.join(gallery, "stackDetails.ts"));
const { PROJECTS } = load(path.join(repo, "src/app/projects/data.ts"));

test("the hero replaces the badge with an accessible looping animation with a static fallback", () => {
  const { default: GalleryPortfolio } = load(path.join(gallery, "GalleryPortfolio.tsx"));
  const html = renderToStaticMarkup(React.createElement(GalleryPortfolio));
  const hero = html.match(/<section[^>]*id="hero"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.ok(hero.includes('aria-label="Pause particle animation"'));
  assert.ok(hero.includes('aria-describedby="hero-particle-hint"') && hero.includes('aria-pressed="false"'));
  assert.ok(hero.includes('data-ready="false"') && hero.includes('On loop'));
  assert.ok(/<img[^>]*block-m\.png/.test(hero) && !hero.includes('<canvas'), "SSR keeps a static fallback; the shared viewport canvas mounts after hydration");
  assert.ok(hero.includes('Matthew') && hero.includes('Kooy') && hero.includes('I build software and data systems'));
  assert.ok(!hero.includes('heroDisc') && !hero.includes('Software<br'));
});

test("each page section reserves exactly one non-interactive particle checkpoint", () => {
  const { default: GalleryPortfolio } = load(path.join(gallery, "GalleryPortfolio.tsx"));
  const { PARTICLE_CHECKPOINTS } = load(path.join(gallery, "particleJourney.ts"));
  const html = renderToStaticMarkup(React.createElement(GalleryPortfolio));
  assert.equal((html.match(/data-particle-anchor=/g) || []).length, 6);
  assert.equal((html.match(/data-particle-surface=/g) || []).length, 7, "every painted section has a content-behind travel layer");
  PARTICLE_CHECKPOINTS.forEach(({ id }) => {
    const section = html.match(new RegExp(`<(?:section|footer)[^>]*id="${id}"[^>]*>([\\s\\S]*?)</(?:section|footer)>`))[1];
    assert.ok(section.includes(`data-particle-anchor="${id}" aria-hidden="true"`));
  });
});

test("travel backdrops crop to visible section backgrounds and restore the original foreground at rest", () => {
  const file = path.join(gallery, "particleBackdrops.ts");
  const sourceCode = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const copies = [], layers = [];
  const document = { createElement: () => {
    const canvas = { dataset: {}, style: {}, width: 0, height: 0, removed: false, setAttribute() {}, remove() { this.removed = true; }, getContext: () => ({ clearRect() {}, drawImage(...args) { copies.push(args); } }) };
    layers.push(canvas); return canvas;
  } };
  const surfaces = [
    { left: 0, top: -200, right: 1280, bottom: 300 },
    { left: 0, top: 300, right: 1280, bottom: 1000 },
    { left: 0, top: 1000, right: 1280, bottom: 1700 },
  ].map(rect => ({ clientLeft: 0, clientTop: 0, getBoundingClientRect: () => rect, prepend() {} }));
  const exports = {};
  vm.runInNewContext(`(function(exports){${sourceCode}\n})`, { document })(exports);
  const source = { width: 2560, style: { removeProperty(key) { delete this[key]; } } };
  const backdrop = exports.createParticleBackdrops({ querySelectorAll: () => surfaces }, source);
  backdrop.paint(true, 1280, 800);
  assert.equal(source.style.visibility, "hidden", "travel cannot paint on the body foreground canvas");
  assert.equal(copies.length, 2, "only visible sections receive the cloud");
  assert.deepEqual(copies[0].slice(1), [0, 0, 2560, 600, 0, 0, 2560, 600]);
  assert.deepEqual(copies[1].slice(1), [0, 600, 2560, 1000, 0, 0, 2560, 1000]);
  assert.equal(layers[0].style.top, "200px");
  assert.equal(layers[2].style.display, "none");
  backdrop.paint(false, 1280, 800);
  assert.equal(source.style.visibility, "visible", "hero and settled checkpoint use the unchanged source");
  assert.ok(layers.every(layer => layer.width === 0 && layer.style.display === "none"));
  backdrop.destroy();
  assert.ok(layers.every(layer => layer.removed));
  assert.equal(source.style.visibility, undefined);
});

test("scroll phases dwell at each section and traverse deterministically in both directions", () => {
  const { getJourneyPhase } = load(path.join(gallery, "particleJourney.ts"));
  const starts = [0, 800, 1500, 3000, 5000, 7000, 8000];
  assert.equal(getJourneyPhase(0, starts).kind, "hero");
  assert.equal(getJourneyPhase(150, starts).kind, "depart");
  assert.equal(getJourneyPhase(400, starts).kind, "travel");
  assert.equal(getJourneyPhase(700, starts).kind, "arrive");
  starts.slice(1).forEach((start, index) => {
    assert.deepEqual(getJourneyPhase(start, starts), { kind: "dock", from: index + 1, to: index + 1, progress: 0 });
    assert.equal(getJourneyPhase(start + 20, starts).kind, "dock");
  });
  const positions = Array.from({ length: 100 }, (_, index) => index * 89);
  const forward = positions.map(y => getJourneyPhase(y, starts));
  assert.deepEqual(positions.toReversed().map(y => getJourneyPhase(y, starts)).toReversed(), forward);
  for (const y of [0, 0.1, 0.9, 1, 1.5, 2, 3]) {
    const phase = getJourneyPhase(y, [0, 1, 2]);
    assert.ok(Number.isFinite(phase.progress) && phase.progress >= 0 && phase.progress <= 1);
  }
});

test("all checkpoint shapes reuse every grain with stable, bounded destinations", () => {
  const { createMarkParticles } = load(path.join(gallery, "heroParticles.ts"));
  const { PARTICLE_CHECKPOINTS, getCheckpointPoint, getStreamPoint, connectToStream } = load(path.join(gallery, "particleJourney.ts"));
  const points = createMarkParticles(new Uint8ClampedArray(112 * 80 * 4).fill(255), 112, 80);
  for (const { shape } of PARTICLE_CHECKPOINTS) {
    const destinations = points.map((point, index) => getCheckpointPoint(point, index, points.length, shape));
    assert.equal(destinations.length, points.length);
    assert.ok(destinations.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) < 0.5 && Math.abs(y) < 0.5));
    assert.deepEqual(destinations, points.map((point, index) => getCheckpointPoint(point, index, points.length, shape)));
    if (shape === "mark") assert.deepEqual(destinations, points.map(({ x, y }) => ({ x, y })));
  }
  for (const width of [320, 838, 1920]) {
    for (const point of points.slice(0, 100)) {
      const stream = getStreamPoint(point, 1500, width, 800, 72, 2);
      assert.ok(stream.x > 0 && stream.x < width);
      assert.ok(stream.y > 72 && stream.y < 800);
      assert.deepEqual(stream, getStreamPoint(point, 1500, width, 800, 72, 2));
      const dock = { x: width - 150, y: 200 };
      assert.deepEqual(connectToStream(dock, stream, 0), dock);
      assert.deepEqual(connectToStream(dock, stream, 1), stream);
      assert.notDeepEqual(connectToStream(dock, stream, 0.5, 0), connectToStream(dock, stream, 0.5, Math.PI), "grains take individually curved routes");
    }
  }
});

function journeyFixture(initialScroll = 0) {
  const file = path.join(gallery, "mountParticleJourney.ts");
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const frames = new Map(), listeners = new Map(), properties = new Map();
  let sequence = 0, time = 0, drawn = [], labels = [], ready = false, reduced = false, resizeCallback, disconnected = false;
  const style = { setProperty: (key, value) => properties.set(key, value), removeProperty: key => properties.delete(key) };
  const context = { setTransform() {}, clearRect() { drawn = []; labels = []; }, measureText(text) { return { width: text.length * 7 }; }, fillText(...values) { labels.push(values); }, save() {}, restore() {}, beginPath() {}, rect() {}, clip() {}, fillRect(...values) { drawn.push(values); } };
  const canvas = { dataset: {}, style, width: 0, height: 0, getContext: () => context };
  const window = { scrollY: initialScroll, innerHeight: 800, devicePixelRatio: 1,
    addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name),
    Image: class { naturalWidth = 112; naturalHeight = 80; set src(value) { this.onload(); } },
  };
  const media = { matches: false, addEventListener: (_, fn) => listeners.set("preference", fn), removeEventListener: () => listeners.delete("preference") };
  window.matchMedia = () => media;
  const document = { hidden: false, documentElement: { clientWidth: 1280, scrollHeight: 9400 }, fonts: { ready: { then() {} } },
    addEventListener: window.addEventListener, removeEventListener: window.removeEventListener,
    createElement: () => ({ getContext: () => ({ drawImage() {}, getImageData: () => ({ data: new Uint8ClampedArray(112 * 80 * 4).fill(255) }) }) }),
  };
  const rect = (x, top, width, height) => ({ left: x, top: top - window.scrollY, width, height });
  const elements = { "#hero": {}, "[data-gallery-nav]": { getBoundingClientRect: () => ({ height: 72 }) } };
  const { PARTICLE_CHECKPOINTS } = load(path.join(gallery, "particleJourney.ts"));
  PARTICLE_CHECKPOINTS.forEach(({ id }, index) => {
    elements[`#${id}`] = { getBoundingClientRect: () => rect(0, 900 + index * 1400, 1280, 1400) };
    elements[`[data-particle-anchor="${id}"]`] = { getBoundingClientRect: () => rect(1080, 980 + index * 1400, 128, 128) };
  });
  const root = { dataset: {}, querySelector: selector => elements[selector], querySelectorAll: () => [] };
  const stage = { style, closest: () => root, getBoundingClientRect: () => rect(680, 100, 550, 570) };
  const module = { exports: {} };
  vm.runInNewContext(`(function(require,module,exports){${source}\n})`, {
    window, document, performance: { now: () => time },
    getComputedStyle: () => ({ paddingRight: "64px", scrollPaddingTop: "88px", scrollMarginTop: "72px", color: "#222222", getPropertyValue: () => "#223dea" }),
    requestAnimationFrame: fn => { frames.set(++sequence, fn); return sequence; }, cancelAnimationFrame: id => frames.delete(id),
    ResizeObserver: class { constructor(fn) { resizeCallback = fn; } observe() {} disconnect() { disconnected = true; } },
  })(name => load(path.join(gallery, name + ".ts")), module, module.exports);
  const paused = { current: false }, start = { current() {} };
  const cleanup = module.exports.mountParticleJourney({ canvas, stage, paused, start, onReady: value => { ready = value; }, onReduced: value => { reduced = value; } });
  return { canvas, root, document, window, paused, start, frames, listeners, properties, cleanup,
    flush(ms = 16) { time += ms; const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn(time)); return drawn.map(values => [...values]); },
    settle() { let result; for (let i = 0; i < 100; i++) result = this.flush(40); return result; },
    scroll(y) { window.scrollY = y; listeners.get("scroll")(); return this.flush(); },
    reduce(value) { media.matches = value; listeners.get("preference")(); return this.flush(); },
    resize(width) { document.documentElement.clientWidth = width; resizeCallback(); this.flush(); },
    labels: () => labels,
    status: () => ({ ready, reduced, disconnected }),
  };
}

test("dotted sphere details persist on both hemispheres and fade only for the morph", () => {
  const { getSphereDetails } = load(path.join(gallery, "sphereDetails.ts"));
  const start = getSphereDetails(1, 0, 0.12);
  assert.ok(start.length > 700 && start.length < 1800, "the richer set remains sparse relative to the globe's thousands of grains");
  assert.ok(start.every(p => p.opacity > 0));
  assert.ok(start.some(p => p.depth < -0.5) && start.some(p => p.depth > 0.5));
  for (const rotation of [0, 0.7, 2.4, 4.5, Math.PI * 2]) {
    const details = getSphereDetails(1, rotation, 0.12);
    const next = getSphereDetails(1, rotation + 1e-5, 0.12);
    details.forEach((point, index) => {
      assert.ok(Math.hypot(point.x, point.y) < 0.45);
      const inversePerspective = (1 - point.depth * 0.18) / 0.43;
      assert.ok(Math.abs(Math.hypot(point.x * inversePerspective, point.y * inversePerspective, point.depth) - 1) < 1e-12, "every contour dot remains on the cloud's spherical surface");
      assert.ok(point.opacity >= 0.18 && point.opacity <= 0.62);
      if (point.depth < 0) assert.ok(point.opacity < 0.4, "far-side motifs stay visible with quieter ink");
      if (point.depth > 0) assert.ok(point.opacity > 0.4, "near-side motifs have stronger contrast");
      assert.ok(Math.hypot(point.x - next[index].x, point.y - next[index].y) < 1e-5);
      assert.ok(Math.abs(point.opacity - next[index].opacity) < 1e-4);
    });
  }
  for (let step = 0; step < 48; step++) {
    const rotation = step / 48 * Math.PI * 2;
    const details = getSphereDetails(1, rotation, 0.12);
    assert.ok(details.filter(point => point.opacity > 0.2).length > 70, "the globe stays populated throughout a full turn");
    const wrapped = getSphereDetails(1, rotation + Math.PI * 2, 0.12);
    details.forEach((point, i) => {
      assert.ok(Math.hypot(point.x - wrapped[i].x, point.y - wrapped[i].y) < 1e-12);
      assert.ok(Math.abs(point.opacity - wrapped[i].opacity) < 1e-12, "no seam after a complete revolution");
    });
  }
  for (const blend of [0, 0.3, 0.8]) assert.ok(getSphereDetails(blend, 1).every(point => point.opacity === 0));
  assert.ok(getSphereDetails(0.800001, 1).every(point => point.opacity < 1e-8));
});

test("the renderer draws grain details without text panels and preserves pause and reduced motion", () => {
  const fixture = journeyFixture();
  const sphere = fixture.flush();
  assert.ok(sphere.length > Number(fixture.canvas.dataset.particleCount), "motif grains on both hemispheres join the sphere");
  assert.equal(fixture.labels().length, 0, "no canvas typography is painted");
  fixture.paused.current = true;
  const held = fixture.flush();
  fixture.start.current();
  assert.deepEqual(fixture.flush(), held);
  fixture.reduce(true);
  assert.equal(fixture.flush().length, 0);
  fixture.reduce(false);
  fixture.paused.current = false; fixture.start.current();
  let flat;
  for (let i = 0; i < 175; i++) flat = fixture.flush(40);
  assert.equal(fixture.canvas.dataset.heroBlend, "0.0000");
  assert.equal(flat.length, Number(fixture.canvas.dataset.particleCount), "motifs fully disappear before flat symbols form");
  fixture.scroll(1800); fixture.settle();
  assert.equal(fixture.labels().length, 0);
  fixture.cleanup();
});

test("scroll follows with momentum, then keeps drifting across the viewport", () => {
  const fixture = journeyFixture();
  fixture.flush();
  assert.equal(fixture.status().ready, true);
  assert.equal(fixture.canvas.dataset.particleCount, "8960");
  fixture.scroll(1800);
  assert.equal(fixture.canvas.style.visibility, "hidden");
  assert.ok(Number(fixture.canvas.dataset.motionScroll) > 0 && Number(fixture.canvas.dataset.motionScroll) < 1800, "a wheel jump cannot teleport the cloud");
  const before = Number(fixture.canvas.dataset.motionScroll);
  fixture.flush();
  assert.ok(Number(fixture.canvas.dataset.motionScroll) > before, "momentum continues without another scroll event");
  const settled = fixture.settle();
  assert.equal(fixture.canvas.dataset.phase, "travel");
  assert.equal(fixture.canvas.dataset.motionScroll, "1800.00");
  assert.equal(fixture.frames.size, 1, "ambient drift continues after scroll settles");
  assert.notDeepEqual(fixture.flush(40), settled, "grains remain alive with no input");
  const xs = settled.map(p => p[0]);
  assert.ok(Math.min(...xs) < 1280 * 0.2 && Math.max(...xs) > 1280 * 0.8, "the cloud spans both sides of the viewport");
  fixture.scroll(0); fixture.settle();
  assert.equal(fixture.canvas.dataset.phase, "hero");
  assert.equal(fixture.canvas.style.visibility, "visible");
  assert.equal(fixture.properties.get("--particle-reveal"), "1");
  fixture.cleanup();
});

test("the scroll spring is frame-rate independent, settles without bouncing, and reverses smoothly", () => {
  const { advanceJourneyScroll } = load(path.join(gallery, "particleJourney.ts"));
  const run = hz => {
    let state = { position: 0, velocity: 0 };
    for (let i = 0; i < hz; i++) {
      const next = advanceJourneyScroll(state.position, state.velocity, 1000, 1 / hz);
      assert.ok(next.position >= state.position && next.position <= 1000);
      state = next;
    }
    return state;
  };
  const a = run(30), b = run(144);
  assert.ok(Math.abs(a.position - b.position) < 1e-8);
  let state = advanceJourneyScroll(300, 1000, 0, 1 / 60);
  assert.ok(state.position > 300, "reversing input preserves momentum initially");
  for (let i = 0; i < 180; i++) state = advanceJourneyScroll(state.position, state.velocity, 0, 1 / 60);
  assert.deepEqual(state, { position: 0, velocity: 0 });
});

test("the hero clock pauses, survives hidden tabs, and freezes every departure shape", () => {
  const fixture = journeyFixture();
  fixture.flush();
  for (let shape = 0; shape < 3; shape++) {
    while (fixture.canvas.dataset.heroShape !== String(shape) || fixture.canvas.dataset.heroBlend !== "0.0000") fixture.flush(40);
    fixture.paused.current = true;
    const held = fixture.flush();
    assert.equal(fixture.frames.size, 0);
    fixture.start.current();
    assert.deepEqual(fixture.flush(4000), held, "paused grains stay exactly still");
    fixture.scroll(30);
    const departure = fixture.settle();
    fixture.scroll(90); fixture.settle();
    fixture.scroll(30);
    assert.deepEqual(fixture.settle(), departure, "paused formations settle at the same destinations");
    fixture.scroll(0);
    assert.deepEqual(fixture.settle(), held, "returning restores the frozen pose");
    fixture.paused.current = false;
    fixture.start.current(); fixture.flush();
    fixture.document.hidden = true;
    fixture.listeners.get("visibilitychange")();
    assert.equal(fixture.frames.size, 0);
    fixture.flush(60000);
    fixture.document.hidden = false;
    fixture.listeners.get("visibilitychange")();
    fixture.flush();
    assert.equal(fixture.canvas.dataset.heroShape, String(shape), "hidden time does not skip the sequence");
  }
  fixture.cleanup();
});

test("loop joins are continuous, ease to rest, and return through the sphere", () => {
  const { getHeroLoop, createHeroTargets, HERO_BEAT_SECONDS } = load(path.join(gallery, "heroLoop.ts"));
  const { createMarkParticles, projectMarkParticle } = load(path.join(gallery, "heroParticles.ts"));
  const points = createMarkParticles(new Uint8ClampedArray(112 * 80 * 4).fill(255), 112, 80);
  const targets = createHeroTargets(points);
  assert.deepEqual(targets, createHeroTargets(points));
  targets.forEach(formation => {
    assert.equal(formation.length, points.length);
    assert.ok(formation.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && Math.abs(p.x) < 0.48 && Math.abs(p.y) < 0.48));
  });
  for (let shape = 0; shape < 3; shape++) {
    const offset = shape * HERO_BEAT_SECONDS;
    assert.equal(getHeroLoop(offset + 7).shape, shape);
    assert.equal(getHeroLoop(offset + 7).blend, 0);
    assert.equal(getHeroLoop(offset + 1).blend, 1);
    for (const boundary of [3.2, 6, 8.4, HERO_BEAT_SECONDS]) {
      const before = getHeroLoop(offset + boundary - 0.0001), after = getHeroLoop(offset + boundary + 0.0001);
      assert.ok(Math.abs(after.blend - before.blend) < 1e-9, "morph reaches zero speed at the join");
      for (let i = 0; i < points.length; i += 100) {
        const a = projectMarkParticle(points[i], before.blend, 0.7, 0.12, targets[before.shape][i]);
        const b = projectMarkParticle(points[i], after.blend, 0.7, 0.12, targets[after.shape][i]);
        assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 1e-9, "changing symbols never teleports grains");
      }
    }
  }
  assert.equal(getHeroLoop(HERO_BEAT_SECONDS * 3).shape, 0);
});

test("deep-linked checkpoints initialize, resize, and clean up without orphaned animation", () => {
  const fixture = journeyFixture(2140);
  const docked = fixture.flush();
  assert.equal(fixture.canvas.dataset.checkpoint, "work");
  assert.equal(fixture.canvas.dataset.phase, "dock");
  assert.notDeepEqual(fixture.flush(40), docked, "gathered symbols breathe while the page is still");
  fixture.document.hidden = true;
  fixture.listeners.get("visibilitychange")();
  assert.equal(fixture.frames.size, 0, "offscreen tabs do not run the ambient loop");
  fixture.document.hidden = false;
  fixture.listeners.get("visibilitychange")();
  fixture.resize(390);
  assert.equal(fixture.canvas.width, 390);
  fixture.cleanup();
  assert.equal(fixture.frames.size, 0);
  assert.equal(fixture.listeners.size, 0);
  assert.equal(fixture.status().disconnected, true);
  assert.equal(fixture.root.dataset.particleJourney, undefined);
  assert.equal(fixture.properties.has("--particle-reveal"), false);
});

test("reduced motion clears the journey and restores static fallbacks, including live changes", () => {
  const fixture = journeyFixture(2140);
  fixture.flush();
  assert.equal(fixture.root.dataset.particleJourney, "true");
  assert.equal(fixture.reduce(true).length, 0);
  assert.equal(fixture.status().reduced, true);
  assert.equal(fixture.root.dataset.particleJourney, "false");
  assert.equal(fixture.properties.get("--particle-reveal"), "0");
  assert.equal(fixture.frames.size, 0);
  assert.equal(fixture.scroll(3500).length, 0);
  assert.ok(fixture.reduce(false).length > 0);
  fixture.cleanup();
});

test("particle sampling follows the image alpha mask and is deterministic", () => {
  const { createMarkParticles } = load(path.join(gallery, "heroParticles.ts"));
  const pixels = new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 99]);
  const points = createMarkParticles(pixels, 2, 2);
  assert.equal(points.length, 2);
  assert.deepEqual(points.map(({ x, y }) => [x, y]), [[-0.235, -0.235], [-0.235, 0.235]]);
  assert.deepEqual(points, createMarkParticles(pixels, 2, 2));
  for (const point of points) assert.ok(Math.abs(Math.hypot(point.sx, point.sy, point.sz) - 1) < 1e-12);
  assert.deepEqual(createMarkParticles(pixels, 0, 0), []);
  assert.deepEqual(createMarkParticles(pixels, 3, 3), []);
});

test("particles reform exactly and remain inside the canvas throughout the morph", () => {
  const { createMarkParticles, projectMarkParticle } = load(path.join(gallery, "heroParticles.ts"));
  const points = createMarkParticles(new Uint8ClampedArray(112 * 80 * 4).fill(255), 112, 80);
  for (const point of points) {
    const flat = projectMarkParticle(point, 0, 12, 0.3);
    assert.equal(flat.x, point.x);
    assert.equal(flat.y, point.y);
    assert.equal(flat.opacity, 1);
    for (const progress of [0.2, 0.5, 0.8, 1]) {
      const projected = projectMarkParticle(point, progress, 2.3, 0.15);
      assert.ok(Object.values(projected).every(Number.isFinite));
      assert.ok(Math.abs(projected.x) < 0.5 && Math.abs(projected.y) < 0.5);
      assert.ok(projected.opacity >= 0.2 && projected.opacity <= 1);
    }
  }
});

test("the actual logo produces a substantial but bounded particle cloud", async () => {
  const sharp = require("sharp");
  const { createMarkParticles } = load(path.join(gallery, "heroParticles.ts"));
  const { data, info } = await sharp(path.join(repo, "public/block-m.png")).resize({ width: 112 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const particles = createMarkParticles(new Uint8ClampedArray(data), info.width, info.height);
  assert.ok(particles.length > 4000 && particles.length < 9000);
  const accents = particles.filter(point => point.accent).length / particles.length;
  assert.ok(accents > 0.2 && accents < 0.35);
});

test("the enlarged sphere fills its drawing area without losing edge particles", () => {
  const { createMarkParticles, projectMarkParticle } = load(path.join(gallery, "heroParticles.ts"));
  const points = createMarkParticles(new Uint8ClampedArray(112 * 80 * 4).fill(255), 112, 80);
  const projected = points.map(point => projectMarkParticle(point, 1, 0.7, 0.15));
  const span = Math.max(...projected.map(point => point.x)) - Math.min(...projected.map(point => point.x));
  assert.ok(span > 0.85 && span < 0.94, "the sphere occupies most of the canvas, not the old 65% footprint");
  assert.ok(projected.every(point => Math.abs(point.x) < 0.5 && Math.abs(point.y) < 0.5));
});

test("hero click, touch and keyboard controls pause the automatic loop", () => {
  // Exercise the real event handlers with only React's hook storage substituted.
  // Browser checks separately verify the visible canvas formations.
  const file = path.join(gallery, "HeroParticleMark.tsx");
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const slots = [];
  let cursor = 0;
  const module = { exports: {} };
  const hookReact = {
    ...React,
    useEffect: () => {},
    useRef: value => { const key = cursor++; return slots[key] ||= { current: value }; },
    useState: value => {
      const key = cursor++;
      if (!(key in slots)) slots[key] = value;
      return [slots[key], next => { slots[key] = typeof next === "function" ? next(slots[key]) : next; }];
    },
  };
  const mockedRequire = name => name === "react" ? hookReact : name.endsWith(".css") ? { __esModule: true, default: {} } : name === "./mountParticleJourney" ? load(path.join(gallery, "mountParticleJourney.ts")) : require(name);
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: file })(mockedRequire, module, module.exports);
  const render = () => { cursor = 0; const figure = module.exports.default(); return { figure, button: figure.props.children[0] }; };
  const pressed = () => render().button.props["aria-pressed"];
  let { button } = render();
  assert.equal(button.props.onPointerEnter, undefined, "there is no binary hover activation");
  assert.equal(button.props.onPointerLeave, undefined, "leaving the button is not a reset threshold");
  button.props.onClick();
  assert.equal(pressed(), true, "mouse click pauses");
  render().button.props.onClick();
  assert.equal(pressed(), false, "second activation resumes");
  render().button.props.onClick({ detail: 0 });
  assert.equal(pressed(), true, "keyboard activation pauses");
  render().button.props.onClick();
  render().button.props.onKeyDown({ key: "Escape" });
  assert.equal(pressed(), true, "Escape always pauses");
  assert.equal(render().button.props.onBlur, undefined, "losing focus cannot restart a paused animation");
});

test("the shared catalog retains every existing project and unique detail destinations", () => {
  assert.deepEqual(PROJECTS.map(project => project.id), [
    "nba-analytics-warehouse", "lewis", "tfg-customer-portal", "fantasy-baseball-daily-briefing",
    "nba-stats-predictor", "stock-simulator", "sql-emulator", "ml-classifier", "puzzle-solver",
  ]);
  assert.equal(new Set(PROJECTS.map(project => project.id)).size, PROJECTS.length);
});

test("the homepage project gallery renders the complete catalog with working detail and code links", () => {
  const { default: GalleryProjects } = load(path.join(gallery, "GalleryProjects.tsx"));
  const html = renderToStaticMarkup(React.createElement(GalleryProjects));
  assert.equal((html.match(/data-project-card="true"/g) || []).length, PROJECTS.length);
  const cards = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(match => match[1]);
  PROJECTS.forEach((project, index) => {
    const card = cards[index];
    assert.ok(card.includes('href="#project-' + project.id + '"'));
    assert.ok(card.includes(renderToStaticMarkup(React.createElement("p", { className: "projectDescription" }, project.description))));
    for (const tag of project.tags) assert.ok(card.includes(renderToStaticMarkup(React.createElement("li", null, tag))));
    if (project.code) assert.ok(card.includes('href="' + project.code + '" target="_blank" rel="noopener noreferrer"'));
  });
  assert.ok(!/<article\b[^>]*(?:aria-hidden="true"|inert|hidden=)|display:none|opacity:0|Add your detailed description/.test(html), "all project summaries are readable without animation or JavaScript");
});

test("experience precedes clubs, projects, and the preserved warehouse feature", () => {
  const { default: GalleryPortfolio } = load(path.join(gallery, "GalleryPortfolio.tsx"));
  const html = renderToStaticMarkup(React.createElement(GalleryPortfolio));
  const order = ["stack", "work", "extracurriculars", "projects", "data"].map(id => html.indexOf(`id="${id}"`));
  assert.ok(order.every(position => position >= 0));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  const { PARTICLE_CHECKPOINTS } = load(path.join(gallery, "particleJourney.ts"));
  assert.deepEqual(PARTICLE_CHECKPOINTS.map(point => point.id), ["stack", "work", "extracurriculars", "projects", "data", "contact"]);
  const nav = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.ok(nav.indexOf('href="#work"') < nav.indexOf('href="#extracurriculars"'));
  assert.ok(html.includes('href="#work">Continue to experience'));
  assert.ok(html.includes('href="#extracurriculars">Clubs</a>'));
  assert.ok(html.includes('href="#projects">Projects</a>'));
  for (const label of ["03 / Campus involvement", "02 / Experience", "04 / Projects", "05 / NBA Analytics Warehouse"]) assert.ok(html.includes(label));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test("every internal homepage link resolves to a unique anchor on the same page", () => {
  const { default: GalleryPortfolio } = load(path.join(gallery, "GalleryPortfolio.tsx"));
  const html = renderToStaticMarkup(React.createElement(GalleryPortfolio));
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const [, href] of html.matchAll(/\bhref="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    assert.ok(href.startsWith("#") && ids.has(href.slice(1)), href);
  }
  assert.ok(html.includes('<summary aria-label="Explore NBA Analytics Warehouse"'));
  assert.ok(html.includes('content-addressed source artifacts'));
  assert.ok(!html.includes('Add your detailed description here.'));
});

test("old routes preserve known employer, club, and project destinations", () => {
  const { getLegacyDestination } = load(path.join(gallery, "legacyDestination.ts"));
  assert.equal(getLegacyDestination("/about"), "/#hero");
  assert.equal(getLegacyDestination("/contact/"), "/#contact");
  assert.equal(getLegacyDestination("/experience"), "/#work");
  assert.equal(getLegacyDestination("/experience", "#airplai"), "/#work-airplai");
  assert.equal(getLegacyDestination("/experience", "#michigan-blockchain"), "/#club-michigan-blockchain");
  for (const project of PROJECTS) assert.equal(getLegacyDestination(`/projects/${project.id}`), `/#project-${project.id}`);
  assert.equal(getLegacyDestination("/projects/unknown"), "/#projects");
  assert.equal(getLegacyDestination("/experience", "#unknown"), "/#work");
});

test("employer links handle initial hashes, repeat clicks, history, and modified clicks", () => {
  const source = ts.transpileModule(fs.readFileSync(path.join(gallery, "reelNavigation.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const events = new Map(), rootEvents = new Map(), frames = new Map(), jumps = [];
  const root = { addEventListener: (key, fn) => rootEvents.set(key, fn), removeEventListener: key => rootEvents.delete(key) };
  const win = {
    location: { hash: "#work-airplai" },
    history: { pushState(_, __, hash) { win.location.hash = hash; } },
    matchMedia: () => ({ matches: false }),
    addEventListener: (key, fn) => events.set(key, fn), removeEventListener: key => events.delete(key),
  };
  const exports = {};
  vm.runInNewContext(source, { exports, window: win, requestAnimationFrame: fn => { frames.set(1, fn); return 1; }, cancelAnimationFrame: id => frames.delete(id) });
  const cards = ["work-team-financial-group", "work-airplai"].map(id => ({ getAttribute: () => id }));
  const cleanup = exports.bindReelAnchors(root, cards, (...args) => jumps.push(args));
  const flush = () => { const fn = frames.get(1); frames.clear(); fn?.(); };
  flush(); assert.deepEqual(jumps.pop(), [1, false]);
  const click = (href, modifiers = {}) => {
    const event = { button: 0, target: { closest: () => ({ getAttribute: () => href, hasAttribute: () => false }) }, preventDefault() { this.defaultPrevented = true; }, ...modifiers };
    rootEvents.get("click")(event); flush(); return event;
  };
  assert.equal(click("#work-airplai").defaultPrevented, true);
  assert.deepEqual(jumps.pop(), [1, true]);
  click("#work-team-financial-group");
  assert.equal(win.location.hash, "#work-team-financial-group");
  assert.deepEqual(jumps.pop(), [0, true]);
  click("#work-airplai", { metaKey: true }); assert.equal(jumps.length, 0);
  click("#projects"); assert.equal(jumps.length, 0);
  win.location.hash = "#work-airplai"; events.get("hashchange")(); flush();
  assert.deepEqual(jumps.pop(), [1, false]);
  cleanup(); assert.equal(rootEvents.size + events.size + frames.size, 0);
});

test("section 02 contains the two requested internships in the requested order", () => {
  const { experiences } = load(path.join(gallery, "content.ts"));
  assert.deepEqual(experiences.map(experience => [experience.name, experience.role, experience.date]), [
    ["Team Financial Group", "Software Engineer Intern", "March 2026 – Present"],
    ["AirPLAi Sports", "Sports Operations Intern", "July 2026 – Present"],
  ]);
  for (const experience of experiences) {
    assert.equal(experience.href, "#work-" + experience.id);
    assert.equal(experience.highlights.length, 3);
    assert.ok(experience.tools.length > 0 && experience.location);
  }
});

test("the experience reel renders two matching cards and navigation controls, without personal projects", () => {
  const { GalleryWork } = load(path.join(gallery, "GallerySections.tsx"));
  const html = renderToStaticMarkup(React.createElement(GalleryWork));
  const cards = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(match => match[1]);
  assert.equal(cards.length, 2);
  assert.ok(cards[0].includes("Team Financial Group") && cards[0].includes("Software Engineer Intern"));
  assert.ok(cards[1].includes("AirPLAi Sports") && cards[1].includes("Sports Operations Intern"));
  assert.deepEqual([...html.matchAll(/data-reel-jump="(\d)"/g)].map(match => match[1]), ["0", "1"]);
  assert.ok(html.includes("Work experience.") && html.includes("02 / Experience"));
  assert.ok(html.includes('aria-label="Jump to work experience"'));
  assert.ok(html.includes('aria-label="Show Team Financial Group experience"'));
  assert.ok(html.includes('aria-label="Show AirPLAi Sports experience"'));
  assert.ok(!/Lewis|Personal project|The project reel|Workflow \/ schematic/.test(html));
  assert.ok(load(path.join(repo, "src/app/projects/data.ts")).PROJECTS.some(project => project.id === "lewis"), "personal projects remain in the shared catalog");
});

test("the extracurricular section contains exactly the three documented college clubs", () => {
  const { extracurriculars } = load(path.join(gallery, "content.ts"));
  assert.deepEqual(extracurriculars.map(club => [club.name, club.role]), [
    ["Michigan Blockchain Club", "Software Engineer, Development Team"],
    ["Wolverine Sports Analytics", "Project Team Lead"],
    ["IPO Investing Club", "Junior Analyst"],
  ]);
  for (const club of extracurriculars) {
    assert.equal(club.href, "#club-" + club.id);
    assert.equal(club.highlights.length, 2);
  }
});

test("club cards render complete readable summaries, skills, and role links", () => {
  const { extracurriculars } = load(path.join(gallery, "content.ts"));
  const { default: GalleryExtracurriculars } = load(path.join(gallery, "GalleryExtracurriculars.tsx"));
  const html = renderToStaticMarkup(React.createElement(GalleryExtracurriculars));
  const cards = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(match => match[1]);
  assert.equal(cards.length, 3);
  extracurriculars.forEach((club, index) => {
    assert.ok(cards[index].includes('id="' + club.href.slice(1) + '"'));
    for (const text of [...club.highlights, ...club.tools]) assert.ok(cards[index].includes(renderToStaticMarkup(React.createElement("li", null, text))));
  });
  assert.ok(!/<article\b[^>]*(?:aria-hidden="true"|inert|hidden=)|display:none|opacity:0/.test(html));
  const css = postcss.parse(fs.readFileSync(path.join(gallery, "Gallery.module.css"), "utf8"));
  css.walkRules(rule => {
    if (/\.(extracurriculars|clubsList|clubCard|clubSurface|clubWork)\b/.test(rule.selector)) rule.walkDecls(decl => {
      assert.ok(!["height", "max-height", "overflow", "overflow-y"].includes(decl.prop), "club content stays in natural page flow");
    });
  });
});

test("club scroll reveals settle, clean up, and respect reduced motion", () => {
  for (const reduced of [false, true]) {
    const fixture = mountReel({ width: 838, height: 814, contentHeight: 714, clubCount: 3, reduced });
    const bindings = fixture.bindings.filter(binding => fixture.clubCards.includes(binding.options.target));
    assert.equal(bindings.length, reduced ? 0 : 3);
    bindings.forEach((binding, index) => {
      binding.target(0);
      assert.equal(fixture.clubCards[index].style.transform, "translateY(32px)");
      binding.target(1);
      assert.equal(fixture.clubCards[index].style.transform, "translateY(0px)");
    });
    fixture.cleanup();
    for (const card of fixture.clubCards) assert.equal(card.style.transform, undefined);
  }
});

// Execute the actual scroll hook with measured-layout fixtures. Browser QA
// verifies real CSS geometry; these fixtures prevent breakpoint/binding regressions.
function mountReel({ width, height, contentHeight, reduced = false, projectCount = 0, clubCount = 0 }) {
  const bindings = [], events = new Map(), frames = new Map();
  let cleanup;
  const element = () => ({
    dataset: {}, attributes: {}, listeners: new Map(),
    style: { setProperty(key, value) { this[key] = value; }, removeProperty(key) { delete this[key]; } },
    addEventListener(name, fn) { this.listeners.set(name, fn); },
    removeEventListener(name) { this.listeners.delete(name); },
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; },
  });
  const root = element(), pin = element(), track = element(), viewport = element(), scene = element(), indicator = element();
  const cards = [element(), element()], buttons = [element(), element()];
  const projectCards = Array.from({ length: projectCount }, element);
  const clubCards = Array.from({ length: clubCount }, element);
  const win = {
    innerHeight: height, scrollY: 0,
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: name => events.delete(name),
    scrollTo(options) { this.scrollY = options.top; },
  };
  viewport.scrollTo = options => { viewport.scrollLeft = options.left; };
  Object.defineProperty(pin, "offsetHeight", { get: () => root.dataset.reelMotion === "true" ? win.innerHeight - 72 : contentHeight });
  Object.defineProperty(track, "clientWidth", { get: () => width * .9 });
  Object.defineProperty(track, "scrollWidth", { get: () => track.clientWidth * 2 + 32 });
  Object.defineProperty(scene, "offsetHeight", { get: () => pin.offsetHeight + parseFloat(root.style["--reel-distance"] || "0") });
  scene.getBoundingClientRect = () => ({ top: 1000 - win.scrollY });
  cards[0].offsetLeft = 0;
  Object.defineProperty(cards[1], "offsetLeft", { get: () => track.clientWidth + 32 });
  const single = {
    "[data-gallery-nav]": { getBoundingClientRect: () => ({ height: 72 }) },
    "#hero": element(), "[data-reel-scene]": scene, "[data-reel-pin]": pin,
    "[data-reel-window]": viewport, "[data-reel-track]": track, "[data-reel-progress]": indicator,
  };
  root.querySelector = selector => single[selector] || null;
  root.querySelectorAll = selector => ({
    "[data-reel-card]": cards, "[data-reel-jump]": buttons, "[data-animated]": [track, indicator, ...projectCards, ...clubCards],
    "[data-project-card]": projectCards,
    "[data-club-card]": clubCards,
  }[selector] || []);
  const source = ts.transpileModule(fs.readFileSync(path.join(gallery, "useGalleryMotion.ts"), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    exports: module.exports, window: win,
    document: { fonts: { ready: { then() {} } } },
    requestAnimationFrame: fn => { frames.set(1, fn); return 1; },
    cancelAnimationFrame: id => frames.delete(id),
    matchMedia: query => ({
      get matches() { return query.includes("prefers-reduced-motion") ? reduced : width >= Number(query.match(/min-width: (\d+)/)[1]) && (!query.includes("min-height") || win.innerHeight >= 740); },
      addEventListener() {}, removeEventListener() {},
    }),
    require: name => name === "react" ? { useEffect: fn => { cleanup = fn(); } } : name === "./reelNavigation" ? { bindReelAnchors: () => () => {} } : {
      scroll(target, options) { const binding = { target, options, stopped: false }; bindings.push(binding); return () => { binding.stopped = true; }; },
    },
  });
  module.exports.useGalleryMotion({ current: root });
  return {
    root, pin, track, scene, viewport, cards, buttons, bindings, win, projectCards, clubCards,
    cleanup: () => cleanup(),
    resize(nextWidth, nextHeight, nextContentHeight) {
      width = nextWidth; win.innerHeight = nextHeight; contentHeight = nextContentHeight;
      events.get("resize")(); frames.get(1)(); frames.clear();
    },
  };
}

test("project entry motion settles, cleans up, and honors reduced-motion preferences", () => {
  for (const reduced of [false, true]) {
    const fixture = mountReel({ width: 838, height: 814, contentHeight: 714, projectCount: 9, reduced });
    const bindings = fixture.bindings.filter(binding => fixture.projectCards.includes(binding.options.target));
    assert.equal(bindings.length, reduced ? 0 : 9);
    bindings.forEach((binding, index) => {
      binding.target(0);
      assert.equal(fixture.projectCards[index].style.transform, `translate(${index % 2 ? 18 : -18}px, 28px)`);
      binding.target(1);
      assert.equal(fixture.projectCards[index].style.transform, "translate(0px, 0px)");
    });
    fixture.cleanup();
    for (const card of fixture.projectCards) assert.equal(card.style.transform, undefined);
  }
});

test("experience scrubbing activates in the split preview and below the old height cutoff", () => {
  for (const size of [
    { width: 838, height: 814, contentHeight: 714 },
    { width: 1280, height: 700, contentHeight: 575 },
    { width: 1440, height: 900, contentHeight: 560 },
  ]) {
    const reel = mountReel(size);
    assert.equal(reel.root.dataset.reelMotion, "true");
    const binding = reel.bindings.find(binding => binding.options.target === reel.scene);
    assert.ok(binding);
    for (const progress of [0, .5, 1]) {
      binding.target(progress);
      assert.equal(reel.track.style.transform, `translateX(-${reel.cards[1].offsetLeft * progress}px)`);
      assert.equal(reel.buttons[Math.round(progress)].attributes["aria-pressed"], "true");
    }
    reel.cleanup();
    assert.equal(reel.track.style.transform, undefined);
    assert.ok(reel.bindings.every(binding => binding.stopped));
  }
});

test("experience navigation maps both companies to the matching vertical scroll endpoints", () => {
  const reel = mountReel({ width: 838, height: 814, contentHeight: 714 });
  reel.buttons[1].listeners.get("click")();
  assert.equal(reel.win.scrollY, 1000 - 72 + 814);
  reel.buttons[0].listeners.get("click")();
  assert.equal(reel.win.scrollY, 1000 - 72);
  reel.cleanup();
});

test("mobile, oversized text/content, and reduced motion retain accessible native navigation", () => {
  for (const size of [
    { width: 390, height: 844, contentHeight: 1100 },
    { width: 838, height: 600, contentHeight: 690 },
    { width: 1440, height: 900, contentHeight: 560, reduced: true },
  ]) {
    const reel = mountReel(size);
    assert.equal(reel.root.dataset.reelMotion, "false");
    assert.ok(!reel.bindings.some(binding => binding.options.target === reel.scene));
    reel.buttons[1].listeners.get("click")();
    assert.equal(reel.viewport.scrollLeft, reel.cards[1].offsetLeft);
    reel.cleanup();
  }
});

test("resizing remeasures the unpinned content and restores scrubbing when it fits again", () => {
  const reel = mountReel({ width: 1440, height: 900, contentHeight: 560 });
  const original = reel.bindings.find(binding => binding.options.target === reel.scene);
  original.target(.5);
  reel.resize(838, 600, 690);
  assert.equal(reel.root.dataset.reelMotion, "false");
  assert.ok(original.stopped);
  assert.equal(reel.track.style.transform, undefined, "native fallback cannot retain an offscreen transform");
  reel.resize(838, 814, 714);
  assert.equal(reel.root.dataset.reelMotion, "true");
  assert.equal(reel.bindings.filter(binding => binding.options.target === reel.scene).length, 2);
  reel.cleanup();
});

test("all four categories retain their technologies and have complete detail records", () => {
  assert.deepEqual(stack.map(group => group.name), ["Languages", "Frameworks", "Data & ML", "Tools"]);
  const names = stack.flatMap(group => group.items);
  assert.equal(names.length, 23);
  assert.equal(new Set(names).size, names.length);
  assert.deepEqual(Object.keys(stackDetails).sort(), [...names].sort());
  for (const technology of names) {
    const usage = stackDetails[technology];
    assert.ok(usage.focus.length > 3, technology);
    assert.ok(usage.description.length > 20, technology);
    for (const example of usage.examples) {
      assert.ok(example.title && example.description && example.href, technology);
    }
  }
});

test("usage examples link to existing portfolio pages", () => {
  const projectSource = fs.readFileSync(path.join(repo, "src/app/projects/data.ts"), "utf8");
  const destinations = new Set([...projectSource.matchAll(/id: "([\w-]+)"/g)].map(match => "#project-" + match[1]));
  destinations.add("#work-airplai");
  destinations.add("#hero");
  for (const usage of Object.values(stackDetails)) {
    for (const example of usage.examples) assert.ok(destinations.has(example.href), example.href);
  }
});

test("unconfirmed uses do not acquire invented project examples", () => {
  const general = Object.entries(stackDetails).filter(([, usage]) => usage.examples.length === 0).map(([name]) => name).sort();
  assert.deepEqual(general, ["GitHub Actions", "R"]);
});

test("the initial view shows the cards but keeps work hidden and out of the tab order", () => {
  const { default: GalleryStack } = load(path.join(gallery, "GalleryStack.tsx"));
  const html = renderToStaticMarkup(React.createElement(GalleryStack));
  assert.equal((html.match(/aria-controls="stack-card-content-\d"/g) || []).length, 4);
  assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 4, "each card retains an optional deep dive");
  assert.equal((html.match(/data-fan-card="true"/g) || []).length, 4);
  assert.equal((html.match(/aria-expanded="false"/g) || []).length, 4);
  assert.equal((html.match(/id="stack-card-content-\d"[^>]*inert=""[^>]*aria-hidden="true"/g) || []).length, 4, "closed card content starts inert");
  assert.equal((html.match(/height:9.5rem/g) || []).length, 4, "all four surfaces start compact");
  assert.ok(!html.includes("stack-hover-preview"), "no separate preview underneath the shelf");
  assert.ok(!html.includes("<dialog"), "details are closed initially");
  for (const name of stack.flatMap(group => group.items)) assert.ok(html.includes(name), name);
  for (const label of ["Team Financial Group", "NBA Analytics Warehouse"]) assert.ok(html.includes(label), label);
  for (const label of ["Section 01 motion designs", "Magnetic Shelf", "Elastic Rail", "Kinetic Tiles"]) assert.ok(!html.includes(label), "no comparison controls: " + label);
  assert.ok(html.includes("Hover to unfold"));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "each card owns unique accessible targets");
  for (const button of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) assert.ok(!/<(?:button|a)\b/.test(button[1]), "no nested interactive controls");
});

test("every expanded card puts its vertical technology controls and work inside the same surface", () => {
  const { default: HoverStackCard } = load(path.join(gallery, "HoverStackCard.tsx"));
  const noop = () => {};
  for (let index = 0; index < stack.length; index++) {
    for (let selectedTechnology = 0; selectedTechnology < stack[index].items.length; selectedTechnology++) {
      const technology = stack[index].items[selectedTechnology];
      const html = renderToStaticMarkup(React.createElement(HoverStackCard, {
        index, selectedTechnology, active: true, reduceMotion: true, pointer: motionValue(null),
        onPreview: noop, cancelPreview: noop, onPointerActivity: noop, onClose: noop, onDetail: noop,
      }));
      const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
      assert.ok(article, technology);
      assert.ok(/<article\b[^>]*style="[^"]*height:auto/.test(html), "expanded height follows the complete content, not a fixed cap");
      assert.ok(article.includes('class="technologyList" data-expanded="true"'), "same list switches to its vertical layout");
      assert.ok(article.includes('id="stack-card-content-' + index + '" aria-hidden="false"'), "expanded content is accessible");
      assert.equal((article.match(/aria-pressed="true"/g) || []).length, 1);
      assert.ok(article.includes('aria-labelledby="stack-tech-' + index + '-' + selectedTechnology + '"'));
      assert.equal((article.match(/aria-controls="stack-card-work-\d"/g) || []).length, stack[index].items.length);
      for (const example of stackDetails[technology].examples) {
        assert.ok(article.includes('href="' + example.href + '"'), technology + ": " + example.title);
        const fullDescription = renderToStaticMarkup(React.createElement("p", null, example.description));
        assert.ok(article.includes(fullDescription), "the full description is included: " + technology);
      }
    }
  }
});

test("the card's ancestors cannot reintroduce a fixed-height crop or inner scrolling", () => {
  const css = postcss.parse(fs.readFileSync(path.join(gallery, "HoverStack.module.css"), "utf8"));
  let expandedWorkIsNatural = false;
  css.walkRules(rule => {
    if (/^\.(hoverCanvas|hoverGrid|hoverAnchor|cardContent|cardWork)(?:\[|$)/.test(rule.selector)) {
      rule.walkDecls(decl => {
        if (["height", "max-height", "max-block-size"].includes(decl.prop)) assert.ok(["auto", "none"].includes(decl.value), rule.selector + ": " + decl.toString());
        if (decl.prop.startsWith("overflow")) assert.equal(decl.value, "visible", rule.selector + ": " + decl.toString());
      });
    }
    if (rule.selector === '.hoverCard[data-expanded="true"] .cardWork') {
      expandedWorkIsNatural = rule.nodes.some(node => node.prop === "display" && node.value === "block");
    }
  });
  assert.ok(expandedWorkIsNatural, "the entire work block participates in the open card's natural height");
  const galleryCss = postcss.parse(fs.readFileSync(path.join(gallery, "Gallery.module.css"), "utf8"));
  galleryCss.walkRules(rule => {
    if (/\.(fanPin|fanScene)\b/.test(rule.selector)) rule.walkDecls(decl => {
      if (["height", "max-height"].includes(decl.prop)) assert.ok(["auto", "none"].includes(decl.value));
      if (decl.prop === "position") assert.notEqual(decl.value, "sticky", "long card content must scroll with the page");
      if (decl.prop.startsWith("overflow")) assert.equal(decl.value, "visible");
    });
  });
});

test("every Gallery CSS module reference resolves", () => {
  for (const file of fs.readdirSync(gallery).filter(name => name.endsWith(".tsx"))) {
    const source = fs.readFileSync(path.join(gallery, file), "utf8");
    for (const imported of source.matchAll(/import (\w+) from "(\.\/[^"\n]+\.module\.css)"/g)) {
      const css = postcss.parse(fs.readFileSync(path.resolve(gallery, imported[2]), "utf8"));
      const classes = new Set();
      css.walkRules(rule => { for (const match of rule.selector.matchAll(/\.([A-Za-z_][\w-]*)/g)) classes.add(match[1]); });
      for (const match of source.matchAll(new RegExp(`\\b${imported[1]}\\.([A-Za-z_][\\w]*)`, "g"))) assert.ok(classes.has(match[1]), `${file}: ${match[1]}`);
    }
  }
});

const { getStackProximity } = load(path.join(gallery, "stackMotion.ts"));
const bounds = { left: 100, top: 100, width: 200, height: 150 };

test("proximity returns to rest outside the attraction zone and on pointer leave", () => {
  for (const point of [null, { x: -1000, y: 1000 }]) {
    const result = getStackProximity(bounds, point);
    for (const value of Object.values(result)) assert.equal(Math.abs(value), 0);
  }
});

test("magnetic attraction begins outside the card and grows smoothly toward it", () => {
  const far = getStackProximity(bounds, { x: 400, y: 175 });
  const near = getStackProximity(bounds, { x: 330, y: 175 });
  const edge = getStackProximity(bounds, { x: 300, y: 175 });
  assert.ok(far.x > 0 && far.x < near.x && near.x < edge.x);
  assert.equal(edge.x, 24);
  assert.equal(edge.y, 0);
});

test("the approved magnetic pull retains its reach, strength, and tilt", () => {
  assert.ok(getStackProximity(bounds, { x: 460, y: 175 }).x > 0);
  assert.equal(getStackProximity(bounds, { x: 500, y: 175 }).influence, 0);
  const corner = getStackProximity(bounds, { x: 300, y: 250 });
  assert.equal(corner.x, 24);
  assert.equal(corner.y, 18);
  assert.equal(corner.rotateX, -3);
  assert.equal(corner.rotateY, 5);
});

test("magnetic motion stays within bounded translation and rotation limits", () => {
  for (let x = -100; x <= 500; x += 25) for (let y = -100; y <= 450; y += 25) {
    const result = getStackProximity(bounds, { x, y });
    assert.ok(Math.abs(result.x) <= 24 && Math.abs(result.y) <= 18);
    assert.ok(Math.abs(result.rotateX) <= 3 && Math.abs(result.rotateY) <= 5);
    assert.ok(result.influence >= 0 && result.influence <= 1);
  }
});

test("invalid geometry cannot produce invalid CSS motion values", () => {
  for (const invalid of [{ ...bounds, width: 0 }, { ...bounds, height: -1 }, { ...bounds, left: Infinity }]) {
    assert.equal(getStackProximity(invalid, { x: 200, y: 175 }).influence, 0);
  }
  assert.equal(getStackProximity(bounds, { x: NaN, y: 175 }).influence, 0);
});
