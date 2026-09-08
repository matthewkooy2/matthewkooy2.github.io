"use client";

import { useEffect, type RefObject } from "react";
import { scroll, animate } from "motion";

type ScrollOptions = NonNullable<Parameters<typeof scroll>[1]>;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function useGalleryMotion(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const all = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const large = matchMedia("(min-width: 900px) and (min-height: 740px)");
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
      bind(hero, progress => {
        heroLines.forEach((line, i) => { line.style.transform = `translateX(${progress * (i % 2 ? 55 : -40)}px)`; });
      }, [`start ${navHeight}px`, "end start"]);
      const progressLine = root!.querySelector<HTMLElement>("[data-page-progress]");
      if (progressLine) stops.push(scroll((progress: number) => { progressLine.style.transform = `scaleX(${progress})`; }));

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
