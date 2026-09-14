"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useSpring, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { stack } from "./content";
import { stackDetails } from "./stackDetails";
import { getStackProximity, type StackPointer } from "./stackMotion";
import styles from "./HoverStack.module.css";

type Props = {
  index: number;
  active: boolean;
  selectedTechnology: number;
  pointer: MotionValue<StackPointer>;
  reduceMotion: boolean;
  onPreview: (index: number, technology: number, hover: boolean) => void;
  cancelPreview: () => void;
  onPointerActivity: (inside: boolean) => void;
  onClose: () => void;
};

export default function HoverStackCard({ index, active, selectedTechnology, pointer, reduceMotion, onPreview, cancelPreview, onPointerActivity, onClose }: Props) {
  const group = stack[index];
  const technology = group.items[selectedTechnology];
  const usage = stackDetails[technology];
  const anchor = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 190, damping: 19 });
  const y = useSpring(0, { stiffness: 190, damping: 19 });
  const rotateX = useSpring(0, { stiffness: 200, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 24 });
  const contentId = "stack-card-content-" + index;
  const workId = "stack-card-work-" + index;

  useMotionValueEvent(pointer, "change", point => {
    if (!anchor.current || reduceMotion) return;
    // Keep the closed card's geometry while its surface grows downwards.
    // Expansion never changes the magnetic target used by the next frame.
    const next = getStackProximity(anchor.current.getBoundingClientRect(), point);
    x.set(next.x); y.set(next.y); rotateX.set(next.rotateX); rotateY.set(next.rotateY);
  });

  useEffect(() => {
    if (reduceMotion) {
      x.jump(0); y.jump(0); rotateX.jump(0); rotateY.jump(0);
    }
  }, [reduceMotion, x, y, rotateX, rotateY]);

  return (
    <div
      className={styles.hoverAnchor}
      data-fan-card data-animated data-category={index} data-expanded={active}
      onPointerEnter={event => {
        if (event.pointerType === "mouse") {
          onPointerActivity(true);
          onPreview(index, active ? selectedTechnology : 0, true);
        }
      }}
      onPointerLeave={event => { if (event.pointerType === "mouse") onPointerActivity(false); }}
    >
      <div ref={anchor} className={styles.magneticAnchor} aria-hidden="true" />
      <motion.article
        className={styles.hoverCard}
        data-expanded={active}
        aria-label={group.name}
        style={{ x, y, rotateX, rotateY, transformPerspective: 900 }}
        initial={false}
        animate={{ height: active ? "auto" : "9.5rem" }}
        transition={{ height: { duration: reduceMotion ? 0 : .5, ease: [.22, 1, .36, 1] } }}
      >
        <button
          type="button" className={styles.cardTrigger} data-card-trigger
          aria-label={"Show " + group.name + " work"} aria-expanded={active}
          aria-controls={contentId} aria-describedby={"stack-card-summary-" + index}
          onFocus={() => onPreview(index, active ? selectedTechnology : 0, false)}
          onClick={() => onPreview(index, active ? selectedTechnology : 0, false)}
        >
          <span className={styles.hoverCardMeta}><span>0{index + 1}</span><span aria-hidden="true">{group.symbol}</span></span>
          <span className={styles.hoverCardTitle}>{group.name}<span aria-hidden="true">↗</span></span>
        </button>
        <span id={"stack-card-summary-" + index} className="sr-only">{group.items.join(", ")}</span>
        <button type="button" className={styles.cardClose} data-card-close aria-label={"Collapse " + group.name} aria-hidden={!active} tabIndex={active ? 0 : -1} onClick={onClose}><span aria-hidden="true">×</span></button>
        <div
          className={styles.cardContent} data-card-content
          id={contentId} inert={!active} aria-hidden={!active}
        >
          <ul className={styles.technologyList} data-expanded={active} aria-label={group.name + " technologies"}>
            {group.items.map((item, i) => (
              <motion.li key={item} layout={reduceMotion ? false : "position"} layoutDependency={active} transition={{ layout: { duration: .45, ease: [.22, 1, .36, 1] } }}>
                <button
                  id={"stack-tech-" + index + "-" + i} type="button" tabIndex={active ? 0 : -1}
                  aria-pressed={active && selectedTechnology === i} aria-controls={workId}
                  onPointerEnter={event => { if (active && event.pointerType === "mouse") onPreview(index, i, true); }}
                  onPointerLeave={cancelPreview}
                  onFocus={() => onPreview(index, i, false)} onClick={() => onPreview(index, i, false)}
                >
                  <span>{item}</span><span className={styles.technologyArrow} aria-hidden="true">↗</span>
                </button>
                <span className={styles.technologyDot} aria-hidden="true">·</span>
              </motion.li>
            ))}
          </ul>
          <motion.div
            className={styles.cardWork} id={workId} role="region"
            aria-labelledby={"stack-tech-" + index + "-" + selectedTechnology}
            initial={false} animate={{ opacity: active ? 1 : 0 }}
            transition={{ opacity: { duration: reduceMotion ? 0 : .2, delay: active && !reduceMotion ? .2 : 0 } }}
          >
            <span className="sr-only" role="status">{active ? technology + ": " + (usage.examples.map(example => example.title).join(", ") || usage.focus) : ""}</span>
            <motion.div key={technology} initial={!active || reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .2 }}>
              <p className={styles.workFocus}>{usage.focus}</p>
              {usage.examples.length > 0 ? (
                <div className={styles.workExamples}>
                  {usage.examples.map(example => <Link key={example.title} href={example.href}><h4>{example.title}<span aria-hidden="true">↗</span></h4><p>{example.description}</p></Link>)}
                </div>
              ) : <p className={styles.workGeneral}>{usage.description}</p>}
            </motion.div>
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}
