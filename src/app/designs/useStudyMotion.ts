"use client";

import { useEffect, type RefObject } from "react";
import { scroll, animate } from "motion";

type ScrollOptions = NonNullable<Parameters<typeof scroll>[1]>;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function useStudyMotion(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const all = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const large = matchMedia("(min-width: 900px) and (min-height: 740px)");
    let stops: (() => void)[] = [];
    let frame = 0;
    let disposed = false;
    let navHeight = 56;

    const bind = (target: HTMLElement, callback: (progress: number) => void, offset: ScrollOptions["offset"] = ["start end", "end start"]) => {
      stops.push(scroll(callback, { target, offset }));
    };
    const reset = () => {
      stops.forEach(stop => stop());
      stops = [];
      all<HTMLElement | SVGElement>("[data-animated]").forEach(element => {
        ["transform", "opacity", "clip-path", "stroke-dashoffset", "stroke-dasharray"].forEach(property => element.style.removeProperty(property));
      });
      all("[data-count]").forEach(element => { element.textContent = `${Number(element.dataset.count).toFixed(1)}M`; });
      all("[data-reel-jump]").forEach(button => button.removeAttribute("aria-pressed"));
    };

    function setup() {
      reset();
      navHeight = root!.querySelector("nav")?.getBoundingClientRect().height ?? 56;
      root!.dataset.fullMotion = String(!reduced.matches && large.matches);
      root!.dataset.reelMotion = String(!reduced.matches && large.matches);
      if (reduced.matches) {
        // The native horizontal reel remains navigable without animation.
        const viewport = root!.querySelector<HTMLElement>("[data-reel-window]");
        const cards = all("[data-reel-card]");
        all<HTMLButtonElement>("[data-reel-jump]").forEach((button, i) => {
          const listener = () => viewport?.scrollTo({ left: cards[i].offsetLeft, behavior: "instant" });
          button.addEventListener("click", listener);
          stops.push(() => button.removeEventListener("click", listener));
        });
        return;
      }

      const hero = root!.querySelector<HTMLElement>("#hero")!;
      const heroLines = all("[data-hero-line]");
      const panels = all("[data-hero-panel]");
      const paths = root!.querySelector<SVGElement>("[data-hero-paths]");
      bind(hero, progress => {
        heroLines.forEach((line, i) => { line.style.transform = `translateX(${progress * (i % 2 ? 55 : -40)}px)`; });
        panels.forEach((panel, i) => { panel.style.transform = `translateY(${-progress * (45 + i * 45)}px) rotate(${progress * (i - 1) * 4}deg)`; });
        if (paths) paths.style.transform = `translate(${progress * 120}px, ${-progress * 90}px)`;
      }, [`start ${navHeight}px`, "end start"]);
      const progressLine = root!.querySelector<HTMLElement>("[data-page-progress]");
      if (progressLine) stops.push(scroll((progress: number) => { progressLine.style.transform = `scaleX(${progress})`; }));

      all("[data-reading]").forEach(section => {
        const words = Array.from(section.querySelectorAll<HTMLElement>("[data-word]"));
        bind(section, progress => words.forEach((word, i) => { word.style.opacity = String(.16 + .84 * clamp(progress * (words.length + 3) - i)); }), ["start 85%", "end 45%"]);
      });
      all("[data-chapter-reveal]").forEach(chapter => {
        const line = chapter.querySelector<HTMLElement>("[data-chapter-line]");
        bind(chapter, progress => {
          const entered = clamp(progress);
          chapter.style.transform = `translateY(${(1 - entered) * 40}px)`;
          if (line) line.style.transform = `scaleX(${entered})`;
        }, ["start 90%", "start 35%"]);
      });
      all("[data-case]").forEach(section => {
        const content = section.querySelector<HTMLElement>("[data-case-content]")!;
        bind(section, progress => { content.style.transform = `translateY(${(1 - clamp(progress)) * 70}px)`; }, ["start 90%", "start 25%"]);
      });

      all("[data-bento]").forEach((card, i) => {
        const chips = Array.from(card.querySelectorAll<HTMLElement>("[data-chip]"));
        bind(card, progress => {
          const entered = clamp(progress);
          card.style.transform = `translateY(${(1 - entered) * (70 + i * 15)}px) rotateX(${(1 - entered) * 9}deg)`;
          chips.forEach((chip, j) => {
            const amount = clamp((entered - j * .08) / .6);
            chip.style.transform = `translateY(${(1 - amount) * 22}px)`;
            chip.style.opacity = String(.25 + amount * .75);
          });
        }, ["start 95%", "start 30%"]);
      });
      const timeline = root!.querySelector<HTMLElement>("[data-timeline-line]");
      const workSection = root!.querySelector<HTMLElement>("#work");
      if (timeline && workSection) bind(workSection, progress => { timeline.style.transform = `scaleY(${progress})`; }, ["start 60%", "end 60%"]);
      all("[data-signal-case]").forEach(section => {
        const path = section.querySelector<SVGElement>("[data-flow-path]")!;
        const nodes = Array.from(section.querySelectorAll<HTMLElement>("[data-pipeline-node]"));
        bind(section, progress => {
          path.style.strokeDashoffset = String(1 - progress);
          nodes.forEach((node, i) => {
            const entered = clamp((progress - i * .15) / .55);
            node.style.transform = `translateY(${(1 - entered) * 25}px)`;
            node.style.opacity = String(.3 + entered * .7);
          });
        }, ["start 85%", "start 15%"]);
      });

      const fanScene = root!.querySelector<HTMLElement>("[data-fan-scene]");
      if (fanScene && large.matches) {
        const pin = root!.querySelector<HTMLElement>("[data-fan-pin]")!;
        const grid = root!.querySelector<HTMLElement>("[data-fan-grid]")!;
        const cards = all("[data-fan-card]");
        // Use the final grid's untransformed layout to fan the cards out from its center.
        const positions = cards.map(card => grid.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2));
        if (pin.scrollHeight <= window.innerHeight - navHeight + 1) {
          bind(fanScene, progress => {
            const opened = clamp(progress / .8);
            cards.forEach((card, i) => { card.style.transform = `translate(${(1 - opened) * positions[i]}px, ${(1 - opened) * Math.abs(i - 1.5) * 16}px) rotate(${(1 - opened) * (i - 1.5) * 12}deg) scale(${.88 + opened * .12})`; });
          }, [`start ${navHeight}px`, "end end"]);
        } else root!.dataset.fullMotion = "false";
      }

      const reelScene = root!.querySelector<HTMLElement>("[data-reel-scene]");
      if (reelScene) {
        const pin = root!.querySelector<HTMLElement>("[data-reel-pin]")!;
        const viewport = root!.querySelector<HTMLElement>("[data-reel-window]")!;
        const track = root!.querySelector<HTMLElement>("[data-reel-track]")!;
        const cards = all("[data-reel-card]");
        const buttons = all<HTMLButtonElement>("[data-reel-jump]");
        const indicator = root!.querySelector<HTMLElement>("[data-reel-progress]")!;
        const viewportStyle = getComputedStyle(viewport);
        const availableHeight = viewport.clientHeight - parseFloat(viewportStyle.paddingTop) - parseFloat(viewportStyle.paddingBottom);
        const cardsFit = cards.every(card => card.offsetHeight <= availableHeight + 1);
        const pinned = root!.dataset.fullMotion === "true" && pin.scrollHeight <= window.innerHeight - navHeight + 1 && cardsFit;
        root!.dataset.reelMotion = String(pinned);
        // The track excludes viewport padding; subtract its own width so the
        // final card aligns with the first card's inset instead of being clipped.
        const distance = Math.max(0, track.scrollWidth - track.clientWidth);
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
        if (pinned) {
          viewport.scrollLeft = 0;
          const animation = animate(track, { transform: ["translateX(0px)", `translateX(-${distance}px)`] }, { ease: "linear" });
          const options: ScrollOptions = { target: reelScene, offset: [`start ${navHeight}px`, "end end"] };
          stops.push(scroll(animation, options), () => animation.cancel());
          stops.push(scroll((progress: number) => {
            const active = Math.round(progress * (cards.length - 1));
            buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === active)));
            indicator.style.transform = `scaleX(${progress})`;
          }, options));
          // Keep keyboard-focused project links in the visible frame.
          cards.forEach((card, i) => {
            const focus = () => jump(i, false);
            card.addEventListener("focusin", focus);
            stops.push(() => card.removeEventListener("focusin", focus));
          });
        }
      }

      all("[data-warehouse]").forEach(section => {
        const bars = Array.from(section.querySelectorAll<HTMLElement>("[data-chart-bar]"));
        const rings = Array.from(section.querySelectorAll<SVGElement>("[data-ring]"));
        const counts = Array.from(section.querySelectorAll<HTMLElement>("[data-count]"));
        bind(section, progress => {
          bars.forEach((bar, i) => { bar.style.transform = `scaleX(${clamp((progress - i * .1) / .7)})`; });
          rings.forEach((ring, i) => { ring.style.strokeDasharray = `${Number(ring.dataset.ring) * clamp((progress - i * .1) / .7)} 100`; });
          counts.forEach((count, i) => { count.textContent = `${(Number(count.dataset.count) * clamp((progress - i * .08) / .7)).toFixed(1)}M`; });
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
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      large.removeEventListener("change", schedule);
      reset();
      delete root.dataset.fullMotion;
      delete root.dataset.reelMotion;
    };
  }, [ref]);
}
