"use client";

import { useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { stack } from "./content";
import { type StackPointer } from "./stackMotion";
import HoverStackCard from "./HoverStackCard";
import ParticleCheckpoint from "./ParticleCheckpoint";
import styles from "./Gallery.module.css";
import hoverStyles from "./HoverStack.module.css";

export default function GalleryStack() {
  const [selection, setSelection] = useState({ category: 0, technology: 0 });
  const [previewOpen, setPreviewOpen] = useState(false);
  const pendingHover = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingClose = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const pointerInside = useRef(false);
  const keyboardInside = useRef(false);
  const restoringFocus = useRef(false);
  const pointer = useMotionValue<StackPointer>(null);
  const reduceMotion = useReducedMotion() !== false;
  const cancelPreview = useCallback(() => {
    if (pendingHover.current !== null) clearTimeout(pendingHover.current);
    pendingHover.current = null;
  }, []);
  const cancelClose = useCallback(() => {
    if (pendingClose.current !== null) clearTimeout(pendingClose.current);
    pendingClose.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelPreview();
    cancelClose();
    // Brief grace for moving around an expanding card or between cards.
    pendingClose.current = setTimeout(() => {
      pendingClose.current = null;
      if (!pointerInside.current && !keyboardInside.current) setPreviewOpen(false);
    }, 220);
  }, [cancelClose, cancelPreview]);
  const closePreview = useCallback((restoreFocus = false) => {
    cancelPreview();
    cancelClose();
    pointer.set(null);
    const content = canvas.current?.querySelector('[data-expanded="true"] [data-card-content]');
    if (restoreFocus && (content?.contains(document.activeElement) || document.activeElement?.hasAttribute("data-card-close"))) {
      const activeCard = canvas.current?.querySelector<HTMLButtonElement>('[data-card-trigger][aria-expanded="true"]');
      restoringFocus.current = true;
      activeCard?.focus({ preventScroll: true });
      restoringFocus.current = false;
    }
    setPreviewOpen(false);
  }, [cancelClose, cancelPreview, pointer]);

  useEffect(() => {
    const outsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !canvas.current?.contains(event.target)) closePreview();
    };
    document.addEventListener("pointerdown", outsidePress);
    return () => {
      cancelPreview();
      cancelClose();
      document.removeEventListener("pointerdown", outsidePress);
    };
  }, [cancelClose, cancelPreview, closePreview]);

  function select(category: number, item: number, hover: boolean) {
    if (restoringFocus.current) return;
    cancelPreview();
    cancelClose();
    if (hover && !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const apply = () => {
      pendingHover.current = null;
      setSelection(previous => previous.category === category && previous.technology === item ? previous : { category, technology: item });
      setPreviewOpen(true);
    };
    if (hover) pendingHover.current = setTimeout(apply, 85);
    else apply();
  }

  return (
    <section
      className={styles.fanScene}
      id="stack" data-fan-scene aria-labelledby="stack-heading"
      onPointerMove={event => {
        if (!reduceMotion && event.pointerType === "mouse" && matchMedia("(hover: hover) and (pointer: fine)").matches) pointer.set({ x: event.clientX, y: event.clientY });
        else if (pointer.get() !== null) pointer.set(null);
      }}
      onPointerLeave={() => pointer.set(null)}
    >
      <div className={`${styles.fanPin} ${hoverStyles.hoverPin}`} data-fan-pin data-particle-surface>
        <div className={styles.fanHeading} data-fan-heading>
          <div><p className={styles.kicker}>01 / Open the toolkit</p><h2 id="stack-heading">A few of my<br /><em>working tools.</em></h2></div>
          <div className={styles.checkpointAside}><a className={styles.link} href="#work">Continue to experience ↘</a><ParticleCheckpoint id="stack" /></div>
        </div>
        <div
          ref={canvas}
          className={hoverStyles.hoverCanvas}
          onPointerDownCapture={() => { keyboardInside.current = false; }}
          onClickCapture={event => {
            // Keep the focused link's card open during anchor navigation so
            // collapsing content above the destination cannot shift the landing.
            if ((event.target as Element).closest("a[href^='#']")) {
              keyboardInside.current = true;
              cancelClose();
            }
          }}
          onFocusCapture={event => { keyboardInside.current = event.target.matches(":focus-visible"); cancelClose(); }}
          onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) { keyboardInside.current = false; scheduleClose(); }
          }}
          onKeyDown={event => {
            if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closePreview(true); }
          }}
          onPointerLeave={event => { if (event.pointerType === "mouse") { pointerInside.current = false; pointer.set(null); scheduleClose(); } }}
          onPointerCancel={() => { pointerInside.current = false; pointer.set(null); scheduleClose(); }}
        >
          <div className={hoverStyles.hoverGrid} data-fan-grid>
            {stack.map((item, i) => (
              <HoverStackCard
                key={item.name} index={i} active={previewOpen && selection.category === i}
                selectedTechnology={selection.category === i ? selection.technology : 0}
                pointer={pointer} reduceMotion={reduceMotion}
                onPreview={select} cancelPreview={cancelPreview}
                onPointerActivity={inside => {
                  pointerInside.current = inside;
                  if (inside) cancelClose();
                  else scheduleClose();
                }}
                onClose={() => closePreview(true)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
