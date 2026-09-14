"use client";

import Link from "next/link";
import { animate } from "motion";
import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { stack } from "./content";
import { stackDetails } from "./stackDetails";
import styles from "./Gallery.module.css";

type Props = { index: number; initialTechnology?: number; trigger: HTMLButtonElement; onDismiss: () => void };

export default function StackDetailDialog({ index, initialTechnology = 0, trigger, onDismiss }: Props) {
  const group = stack[index];
  const [selected, setSelected] = useState(initialTechnology);
  const technology = group.items[selected];
  const usage = stackDetails[technology];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const closingRef = useRef(false);
  const backdropPress = useRef(false);
  const reduced = useReducedMotion();
  const noMotion = reduced !== false;

  // A top-layer native dialog avoids the fan's transformed/sticky ancestors,
  // while preserving focus containment and background inertness in the browser.
  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const panel = panelRef.current!;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const source = trigger.getBoundingClientRect();
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${parseFloat(getComputedStyle(root).paddingRight) + scrollbarWidth}px`;
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    const destination = dialog.getBoundingClientRect();

    if (!preference.matches) {
      animationRef.current = animate(panel, {
        x: [source.left - destination.left, 0],
        y: [source.top - destination.top, 0],
        scaleX: [source.width / destination.width, 1],
        scaleY: [source.height / destination.height, 1],
        opacity: [.5, 1],
      }, { type: "spring", duration: .55, bounce: .08 });
    }

    const settle = () => {
      animationRef.current?.stop();
      if (closingRef.current) onDismiss();
      else animationRef.current = animate(panel, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }, { duration: 0 });
    };
    const preferenceChanged = () => { if (preference.matches) settle(); };
    window.addEventListener("resize", settle);
    preference.addEventListener("change", preferenceChanged);
    return () => {
      animationRef.current?.stop();
      window.removeEventListener("resize", settle);
      preference.removeEventListener("change", preferenceChanged);
      dialog.close();
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger, onDismiss]);

  function dismiss() {
    if (closingRef.current) return;
    closingRef.current = true;
    animationRef.current?.stop();
    const dialog = dialogRef.current!;
    const panel = panelRef.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDismiss();
      return;
    }
    const source = trigger.getBoundingClientRect();
    const destination = dialog.getBoundingClientRect();
    animationRef.current = animate(panel, {
      x: source.left - destination.left,
      y: source.top - destination.top,
      scaleX: source.width / destination.width,
      scaleY: source.height / destination.height,
      opacity: 0,
    }, { duration: .28, ease: [.32, 0, .67, 0], onComplete: onDismiss });
  }

  function isBackdrop(event: PointerEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return false;
    const rect = panelRef.current!.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.stackDialog}
      data-category={index}
      aria-labelledby="stack-detail-title"
      onCancel={event => { event.preventDefault(); dismiss(); }}
      onPointerDown={event => { backdropPress.current = isBackdrop(event); }}
      onPointerUp={event => { if (backdropPress.current && isBackdrop(event)) dismiss(); backdropPress.current = false; }}
      onPointerCancel={() => { backdropPress.current = false; }}
    >
      <div ref={panelRef} className={styles.stackDetail}>
        <header className={styles.stackDetailHeader}>
          <span>01 / Toolkit <span aria-hidden="true">—</span> 0{index + 1}</span>
          <button ref={closeRef} type="button" onClick={dismiss} className={styles.stackClose}>Back to cards <span aria-hidden="true">×</span></button>
        </header>
        <div className={styles.stackDetailBody}>
          <aside className={styles.stackSidebar}>
            <div className={styles.stackCategory}><span aria-hidden="true">{group.symbol}</span><h2 id="stack-detail-title">{group.name}</h2><p>{group.summary}</p></div>
            <div className={styles.stackTechnologyList} role="group" aria-label={`${group.name} technologies`}>
              {group.items.map((item, i) => (
                <button type="button" key={item} aria-pressed={selected === i} aria-controls="stack-technology-detail" onClick={() => { setSelected(i); if (contentRef.current) contentRef.current.scrollTop = 0; }}>
                  <span>{item}</span><span aria-hidden="true">{selected === i ? "↗" : "+"}</span>
                </button>
              ))}
            </div>
          </aside>
          <div ref={contentRef} className={styles.stackContent} id="stack-technology-detail" role="region" aria-labelledby="stack-technology-title" aria-live="polite">
            <motion.div key={technology} initial={noMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: noMotion ? 0 : .24, ease: "easeOut" }}>
              <p className={styles.stackEyebrow}>{usage.focus}</p>
              <h3 id="stack-technology-title">{technology}<span>.</span></h3>
              <p className={styles.stackDescription}>{usage.description}</p>
              {usage.examples.length > 0 && <div className={styles.stackExamples}>
                <p className={styles.stackEyebrow}>Where I’ve used it</p>
                {usage.examples.map((example, i) => (
                  <motion.div key={example.title} initial={noMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: noMotion ? 0 : .25, delay: noMotion ? 0 : .08 + i * .07 }}>
                    <Link href={example.href} onClick={onDismiss} className={styles.stackExample}>
                      <span className={styles.stackExampleIndex}>0{i + 1}</span>
                      <div><h4>{example.title}<span aria-hidden="true">↗</span></h4><p>{example.description}</p></div>
                    </Link>
                  </motion.div>
                ))}
              </div>}
            </motion.div>
          </div>
        </div>
        <footer className={styles.stackDetailFooter}><span>{group.items.length} technologies</span><span>Select a technology to explore <span aria-hidden="true">↗</span></span></footer>
      </div>
    </dialog>
  );
}
