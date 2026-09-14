"use client";

import { useEffect, type RefObject } from "react";
import { scroll } from "motion";
import { bindReelAnchors } from "./reelNavigation";

type ScrollOptions = NonNullable<Parameters<typeof scroll>[1]>;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function useGalleryMotion(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const all = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const large = matchMedia("(min-width: 900px) and (min-height: 740px)");
    const reelDesktop = matchMedia("(min-width: 720px)");
    let stops: (() => void)[] = [];
    let frame = 0;
    let disposed = false;
    let navHeight = 72;

    const bind = (target: HTMLElement, callback: (progress: number) => void, offset: ScrollOptions["offset"] = ["start end", "end start"]) => {
      stops.push(scroll(callback, { target, offset }));
    };
    const reset = () => {
      stops.forEach(stop => stop());
      stops = [];
      all<HTMLElement | SVGElement>("[data-animated]").forEach(element => {
        ["transform", "opacity", "clip-path", "stroke-dashoffset", "stroke-dasharray"].forEach(property => element.style.removeProperty(property));
      });
      all("[data-reel-jump]").forEach(button => button.removeAttribute("aria-pressed"));
    };

    function setup() {
      reset();
      navHeight = root!.querySelector("[data-gallery-nav]")?.getBoundingClientRect().height ?? 72;
      root!.dataset.fullMotion = String(!reduced.matches && large.matches);
      // Measure the complete reel in normal flow before applying a fixed-height
      // pin. Its eligibility is independent of the stack's 740px breakpoint.
      root!.dataset.reelMotion = "false";
      if (reduced.matches) {
        // The native horizontal reel remains navigable without animation.
        const viewport = root!.querySelector<HTMLElement>("[data-reel-window]");
        const cards = all("[data-reel-card]");
        all<HTMLButtonElement>("[data-reel-jump]").forEach((button, i) => {
          const listener = () => viewport?.scrollTo({ left: cards[i].offsetLeft, behavior: "instant" });
          button.addEventListener("click", listener);
          stops.push(() => button.removeEventListener("click", listener));
        });
        stops.push(bindReelAnchors(root!, cards, i => {
          root!.querySelector<HTMLElement>("[data-reel-scene]")?.scrollIntoView({ block: "start", behavior: "instant" });
          viewport?.scrollTo({ left: cards[i].offsetLeft, behavior: "instant" });
        }));
        return;
      }

      const hero = root!.querySelector<HTMLElement>("#hero")!;
      const heroLines = all("[data-hero-line]");
      bind(hero, progress => {
        heroLines.forEach((line, i) => { line.style.transform = `translateX(${progress * (i % 2 ? 55 : -40)}px)`; });
      }, [`start ${navHeight}px`, "end start"]);
      const progressLine = root!.querySelector<HTMLElement>("[data-page-progress]");
      if (progressLine) stops.push(scroll((progress: number) => { progressLine.style.transform = `scaleX(${progress})`; }));

      const fanScene = root!.querySelector<HTMLElement>("[data-fan-scene]");
      if (fanScene && large.matches) {
        const grid = root!.querySelector<HTMLElement>("[data-fan-grid]")!;
        const cards = all("[data-fan-card]");
        // Use the final grid's untransformed layout to fan the cards out from its center.
        const positions = cards.map(card => grid.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2));
        // Spread on entry, then let long expanded cards scroll with the page.
        // Both offsets use the section top, so changing card height cannot
        // rewind the fan animation or move its hover targets while reading.
        bind(fanScene, progress => {
          const opened = clamp(progress);
          cards.forEach((card, i) => { card.style.transform = `translate(${(1 - opened) * positions[i]}px, ${(1 - opened) * Math.abs(i - 1.5) * 16}px) rotate(${(1 - opened) * (i - 1.5) * 12}deg) scale(${.88 + opened * .12})`; });
        }, ["start end", "start 65%"]);
      }

      const reelScene = root!.querySelector<HTMLElement>("[data-reel-scene]");
      if (reelScene) {
        const pin = root!.querySelector<HTMLElement>("[data-reel-pin]")!;
        const viewport = root!.querySelector<HTMLElement>("[data-reel-window]")!;
        const track = root!.querySelector<HTMLElement>("[data-reel-track]")!;
        const cards = all("[data-reel-card]");
        const buttons = all<HTMLButtonElement>("[data-reel-jump]");
        const indicator = root!.querySelector<HTMLElement>("[data-reel-progress]")!;
        const pinned = reelDesktop.matches && pin.offsetHeight <= window.innerHeight - navHeight;
        // The track excludes viewport padding; subtract its own width so the
        // final card aligns with the first card's inset instead of being clipped.
        const distance = Math.max(0, track.scrollWidth - track.clientWidth);
        root!.style.setProperty("--reel-distance", `${Math.max(distance, window.innerHeight)}px`);
        root!.dataset.reelMotion = String(pinned);
        const jump = (index: number, smooth: boolean) => {
          if (!pinned) {
            viewport.scrollTo({ left: cards[index].offsetLeft, behavior: smooth ? "smooth" : "instant" });
            return;
          }
          const fraction = distance > 0 ? clamp(cards[index].offsetLeft / distance) : 0;
          const start = reelScene.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: start + (reelScene.offsetHeight - pin.offsetHeight) * fraction, behavior: smooth ? "smooth" : "instant" });
        };
        buttons.forEach((button, i) => {
          const listener = () => jump(i, true);
          button.addEventListener("click", listener);
          stops.push(() => button.removeEventListener("click", listener));
        });
        stops.push(bindReelAnchors(root!, cards, (i, smooth) => {
          if (!pinned) reelScene.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "instant" });
          jump(i, smooth);
        }));
        if (pinned) {
          viewport.scrollLeft = 0;
          const options: ScrollOptions = { target: reelScene, offset: [`start ${navHeight}px`, "end end"] };
          stops.push(scroll((progress: number) => {
            // One scroll binding owns the track and indicator. A cancelled
            // WAAPI animation must not restore an old transform after resize.
            track.style.transform = `translateX(-${distance * progress}px)`;
            const active = Math.round(progress * (cards.length - 1));
            buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === active)));
            indicator.style.transform = `scaleX(${progress})`;
          }, options));
          // Keep keyboard-focused experience links in the visible frame.
          cards.forEach((card, i) => {
            const focus = () => jump(i, false);
            card.addEventListener("focusin", focus);
            stops.push(() => card.removeEventListener("focusin", focus));
          });
        }
      }

      all("[data-club-card]").forEach(card => {
        bind(card, progress => {
          card.style.transform = `translateY(${(1 - clamp(progress)) * 32}px)`;
        }, ["start end", "start 75%"]);
      });

      all("[data-project-card]").forEach((card, index) => {
        // Cards enter from opposite sides of the gallery, then stay readable.
        // Each range uses its top edge, so long descriptions never delay entry.
        bind(card, progress => {
          const remaining = 1 - clamp(progress);
          card.style.transform = `translate(${remaining * (index % 2 ? 18 : -18)}px, ${remaining * 28}px)`;
        }, ["start end", "start 78%"]);
      });

      all("[data-warehouse]").forEach(section => {
        const rings = Array.from(section.querySelectorAll<SVGElement>("[data-ring]"));
        bind(section, progress => {
          rings.forEach((ring, i) => { ring.style.strokeDasharray = `${Number(ring.dataset.ring) * clamp((progress - i * .1) / .7)} 100`; });
        }, ["start 90%", "end 85%"]);
      });
    }

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(setup);
    };
    setup();
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    large.addEventListener("change", schedule);
    reelDesktop.addEventListener("change", schedule);
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      large.removeEventListener("change", schedule);
      reelDesktop.removeEventListener("change", schedule);
      reset();
      delete root.dataset.fullMotion;
      delete root.dataset.reelMotion;
      root.style.removeProperty("--reel-distance");
    };
  }, [ref]);
}
