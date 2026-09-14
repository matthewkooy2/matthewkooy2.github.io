"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mountParticleJourney } from "./mountParticleJourney";
import styles from "./HeroParticleMark.module.css";

export default function HeroParticleMark() {
  const stageRef = useRef<HTMLButtonElement>(null);
  const pausedRef = useRef(false);
  const startRef = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
    startRef.current();
  }, [paused]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // Own this decorative layer with the renderer, outside clipped/transformed sections.
    const canvas = document.createElement("canvas");
    canvas.className = styles.journeyCanvas;
    canvas.dataset.particleCanvas = "true";
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
    const cleanup = mountParticleJourney({ canvas, stage, paused: pausedRef, start: startRef, onReady: setReady, onReduced: setReduced });
    return () => { cleanup?.(); canvas.remove(); };
  }, []);

  return (
    <figure className={styles.widget} data-ready={ready} data-reduced={reduced}>
      <button
        ref={stageRef}
        className={styles.stage}
        type="button"
        aria-label="Pause particle animation"
        aria-describedby="hero-particle-hint"
        aria-pressed={paused && !reduced}
        disabled={!ready || reduced}
        onClick={() => setPaused(value => !value)}
        onKeyDown={event => {
          if (event.key === "Escape") setPaused(true);
        }}
      >
        <Image className={styles.fallback} src="/block-m.png" width={1161} height={830} alt="" priority />
      </button>
      <figcaption className={styles.caption} id="hero-particle-hint">
        <span>Michigan · C++ · Computer vision</span>
        <span>{reduced ? "Reduced motion" : paused ? "Paused · Click to play" : "On loop · Click to pause"} <span className={styles.captionArrow} aria-hidden="true">↗</span></span>
      </figcaption>
    </figure>
  );
}
