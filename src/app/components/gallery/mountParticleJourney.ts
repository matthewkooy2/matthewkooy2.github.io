import { getSphereDetails } from "./sphereDetails";
import { createParticleBackdrops } from "./particleBackdrops";
import { createHeroTargets, getHeroLoop } from "./heroLoop";
import { createMarkParticles, projectMarkParticle, type MarkParticle } from "./heroParticles";
import { PARTICLE_CHECKPOINTS, advanceJourneyScroll, connectToStream, ease, getCheckpointPoint, getJourneyPhase, getStreamPoint, mix, type ParticlePosition } from "./particleJourney";

type Ref<T> = { current: T };
type Options = {
  canvas: HTMLCanvasElement;
  stage: HTMLButtonElement;
  paused: Ref<boolean>;
  start: Ref<() => void>;
  onReady: (ready: boolean) => void;
  onReduced: (reduced: boolean) => void;
};

/** One persistent cloud follows scroll with momentum and gently drifts between formations. */
export function mountParticleJourney({ canvas, stage, paused, start: startRef, onReady, onReduced }: Options) {
  const context = canvas.getContext("2d");
  const root = stage.closest<HTMLElement>("[data-particle-root]");
  if (!context || !root) return;
  const nav = root.querySelector<HTMLElement>("[data-gallery-nav]");
  const reelWindow = root.querySelector<HTMLElement>("[data-reel-window]");
  const docks = PARTICLE_CHECKPOINTS.map(checkpoint => ({
    ...checkpoint,
    section: root.querySelector<HTMLElement>(`#${checkpoint.id}`)!,
    anchor: root.querySelector<HTMLElement>(`[data-particle-anchor="${checkpoint.id}"]`)!,
  }));
  if (docks.some(dock => !dock.section || !dock.anchor)) return;
  const backdrops = createParticleBackdrops(root, canvas);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let points: MarkParticle[] = [];
  let targets: ParticlePosition[][] = [];
  let heroTargets: ParticlePosition[][] = [];
  let starts = [0];
  let width = 0, height = 0, navHeight = 0;
  let frame = 0, lastTime = 0, elapsed = 0, rotation = 0, driftTime = 0;
  let scroll = { position: Math.max(0, window.scrollY), velocity: 0 };
  let frozen = { blend: 1, rotation: 0, tilt: 0.12, shape: 0 };
  let wasHero = true, disposed = false, geometryDirty = true;
  const blue = getComputedStyle(stage).getPropertyValue("--gallery-blue").trim() || "#223dea";

  const measure = () => {
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    navHeight = nav?.getBoundingClientRect().height || 0;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * scale), pixelHeight = Math.round(height * scale);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    starts = [0];
    for (const dock of docks) {
      const scrollMargin = parseFloat(getComputedStyle(dock.section).scrollMarginTop) || 0;
      const offset = Math.max(navHeight + 32, scrollPadding + scrollMargin);
      const position = dock.section.getBoundingClientRect().top + window.scrollY - offset;
      starts.push(Math.max(starts[starts.length - 1] + 1, Math.min(position, maxScroll)));
    }
    geometryDirty = false;
  };
  const pause = () => { cancelAnimationFrame(frame); frame = 0; };
  const start = () => {
    if (!frame && !disposed && !document.hidden) {
      lastTime = performance.now();
      frame = requestAnimationFrame(draw);
    }
  };
  const draw = (time: number) => {
    frame = 0;
    if (disposed || document.hidden) return;
    if (geometryDirty) measure();
    context.clearRect(0, 0, width, height);
    if (media.matches || !points.length) {
      backdrops.paint(false, width, height);
      stage.style.setProperty("--particle-reveal", "0");
      root.dataset.particleJourney = "false";
      return;
    }
    root.dataset.particleJourney = "true";
    const scrollY = Math.max(0, window.scrollY);
    const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.04);
    lastTime = time;
    scroll = advanceJourneyScroll(scroll.position, scroll.velocity, scrollY, dt);
    const phase = getJourneyPhase(Math.max(0, scroll.position), starts);
    const inHero = phase.kind === "hero";
    const traveling = !inHero && (phase.kind !== "dock" || Math.abs(scrollY - scroll.position) > 0.5);
    canvas.dataset.phase = phase.kind;
    canvas.dataset.checkpoint = phase.kind === "arrive" ? docks[phase.to - 1].id : phase.from === 0 ? "hero" : docks[phase.from - 1].id;
    canvas.dataset.progress = phase.progress.toFixed(4);
    canvas.dataset.motionScroll = scroll.position.toFixed(2);
    if (!inHero && !paused.current) driftTime += dt;
    if (inHero) {
      // Advance only at the top. Returning from scroll resumes the exact frozen pose.
      if (!paused.current && wasHero) elapsed += dt;
      const loop = getHeroLoop(elapsed);
      if (!paused.current && wasHero) rotation += dt * 0.42 * loop.blend;
      frozen = { ...loop, rotation, tilt: 0.12 };
    }
    canvas.dataset.heroShape = String(frozen.shape);
    canvas.dataset.heroBlend = frozen.blend.toFixed(4);
    wasHero = inHero;
    // Measure in document space, then project using the same following scroll value.
    // Otherwise DOM anchors would jump with the wheel while the cloud eased behind it.
    const scrollOffset = scrollY - scroll.position;
    const measuredStage = stage.getBoundingClientRect();
    const stageRect = { left: measuredStage.left, top: measuredStage.top + scrollOffset, width: measuredStage.width, height: measuredStage.height };
    const heroSize = Math.min(stageRect.width, stageRect.height);
    const rects = docks.map(dock => {
      const rect = dock.anchor.getBoundingClientRect();
      return { left: rect.left, top: rect.top + scrollOffset, width: rect.width, height: rect.height };
    });
    const dockPoint = (dock: number, index: number): ParticlePosition => {
      if (dock === 0) {
        const projected = projectMarkParticle(points[index], frozen.blend, frozen.rotation, frozen.tilt, heroTargets[frozen.shape][index]);
        return { x: stageRect.left + stageRect.width / 2 + projected.x * heroSize, y: stageRect.top + stageRect.height / 2 + projected.y * heroSize };
      }
      const rect = rects[dock - 1], point = targets[dock - 1][index];
      const size = Math.min(rect.width, rect.height) * 0.94;
      const breath = 1 + Math.sin(driftTime * 0.8) * 0.018;
      return {
        x: rect.left + rect.width / 2 + point.x * size * breath + Math.sin(driftTime * 0.65 + points[index].phase) * 0.8,
        y: rect.top + rect.height / 2 + point.y * size * breath + Math.cos(driftTime * 0.55 + points[index].phase) * 0.8,
      };
    };
    const reveal = 1;
    stage.style.setProperty("--particle-reveal", String(reveal));
    context.save();
    // Navigation stays clear on both the foreground and background copies.
    context.beginPath();
    context.rect(0, navHeight, width, Math.max(0, height - navHeight));
    context.clip();
    // Foreground formations avoid the reel. Traveling grains already sit behind
    // its opaque cards, so leave their gaps and rounded corners visible.
    if (reelWindow && !traveling) {
      const rect = reelWindow.getBoundingClientRect();
      context.beginPath();
      context.rect(0, 0, width, height);
      context.rect(rect.left, rect.top, rect.width, rect.height);
      context.clip("evenodd");
    }
    if (inHero) {
      context.beginPath();
      context.rect(stageRect.left, stageRect.top, stageRect.width, stageRect.height);
      context.clip();
    }
    const destination = phase.kind === "arrive" ? phase.to : phase.from;
    const ink = destination > 0 ? getComputedStyle(docks[destination - 1].anchor).color : "#262626";
    const accent = destination > 0 ? getComputedStyle(docks[destination - 1].anchor).getPropertyValue("--study-accent").trim() || blue : blue;
    const smallDot = width < 600 ? 0.65 : 0.85;
    const travelDot = width < 600 ? 1.1 : 1.5;
    const heroDot = heroSize * (0.94 / 112) * (1.08 - frozen.blend * 0.52);
    const dockDot = (dock: number) => dock === 0 ? heroDot : smallDot;
    const dot = inHero ? heroDot
      : phase.kind === "depart" ? mix(dockDot(phase.from), travelDot, ease(phase.progress))
      : phase.kind === "arrive" ? mix(travelDot, smallDot, ease(phase.progress))
      : phase.kind === "travel" ? travelDot : smallDot;
    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      let position: ParticlePosition;
      if (inHero || phase.kind === "dock") position = dockPoint(phase.from, index);
      else {
        const stream = getStreamPoint(point, scroll.position, width, height, navHeight, driftTime);
        position = phase.kind === "depart" ? connectToStream(dockPoint(phase.from, index), stream, phase.progress, point.phase)
          : phase.kind === "arrive" ? connectToStream(dockPoint(phase.to, index), stream, 1 - phase.progress, point.phase) : stream;
      }
      if (position.y < navHeight - dot || position.y > height + dot) continue;
      const heroOpacity = phase.from === 0 ? projectMarkParticle(point, frozen.blend, frozen.rotation, frozen.tilt).opacity : 0.72;
      const opacity = inHero ? heroOpacity : phase.kind === "depart" ? mix(heroOpacity, 0.38, ease(phase.progress))
        : phase.kind === "arrive" ? mix(0.38, 0.72, ease(phase.progress)) : phase.kind === "travel" ? 0.38 : 0.72;
      context.globalAlpha = opacity * reveal;
      context.fillStyle = point.accent ? accent : phase.kind === "travel" ? "#888888" : ink;
      context.fillRect(position.x - dot / 2, position.y - dot / 2, dot, dot);
    }
    // Small dotted motifs use the same projection and grain material as the cloud.
    const detailDeparture = inHero ? 1 : phase.from === 0 && phase.kind === "depart" ? 1 - ease(phase.progress) : 0;
    if (detailDeparture > 0 && frozen.blend > 0.8) {
      const detailDot = heroDot;
      for (const detail of getSphereDetails(frozen.blend, frozen.rotation, frozen.tilt)) {
        if (detail.opacity <= 0) continue;
        const x = stageRect.left + stageRect.width / 2 + detail.x * heroSize;
        const y = stageRect.top + stageRect.height / 2 + detail.y * heroSize;
        context.globalAlpha = detail.opacity * detailDeparture;
        context.fillStyle = detail.accent ? blue : "#343434";
        context.fillRect(x - detailDot / 2, y - detailDot / 2, detailDot, detailDot);
      }
    }
    context.restore();
    backdrops.paint(traveling, width, height);
    // Keep ambient motion alive after scroll input stops; pause and reduced motion
    // still disable it. A paused cloud may finish following the user's last scroll.
    if (!paused.current || scroll.position !== scrollY || scroll.velocity !== 0) frame = requestAnimationFrame(draw);
  };
  startRef.current = start;
  const invalidate = () => { geometryDirty = true; start(); };
  const onScroll = () => start();
  const onVisibility = () => document.hidden ? pause() : invalidate();
  const onPreference = () => {
    onReduced(media.matches);
    scroll = { position: Math.max(0, window.scrollY), velocity: 0 };
    start();
  };
  const observer = new ResizeObserver(invalidate);
  observer.observe(root);
  observer.observe(stage);
  docks.forEach(dock => observer.observe(dock.section));
  window.addEventListener("resize", invalidate);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  media.addEventListener("change", onPreference);
  document.fonts.ready.then(() => { if (!disposed) invalidate(); });
  onPreference();
  const source = new window.Image();
  source.onload = () => {
    if (disposed) return;
    try {
      const sample = document.createElement("canvas");
      sample.width = 112;
      sample.height = Math.round(112 * source.naturalHeight / source.naturalWidth);
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;
      sampleContext.drawImage(source, 0, 0, sample.width, sample.height);
      points = createMarkParticles(sampleContext.getImageData(0, 0, sample.width, sample.height).data, sample.width, sample.height);
      if (!points.length) return;
      heroTargets = createHeroTargets(points);
      targets = docks.map(dock => points.map((point, index) => getCheckpointPoint(point, index, points.length, dock.shape)));
      canvas.dataset.particleCount = String(points.length);
      onReady(true);
      start();
    } catch {
      // Keep the original image and static checkpoint markers on canvas/image failure.
    }
  };
  source.src = "/block-m.png";
  return () => {
    disposed = true;
    pause();
    observer.disconnect();
    backdrops.destroy();
    window.removeEventListener("resize", invalidate);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    media.removeEventListener("change", onPreference);
    source.onload = null;
    startRef.current = () => {};
    delete root.dataset.particleJourney;
    stage.style.removeProperty("--particle-reveal");
    context.clearRect(0, 0, width, height);
  };
}
