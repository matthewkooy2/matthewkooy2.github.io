"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { animate, scroll } from "motion";
import styles from "./ScrollPortfolio.module.css";

const TetrisMini = dynamic(() => import("./TetrisMini"), { ssr: false });

const chapters = [
  { label: "Languages", title: <>From code<br />to products.</>, description: "Applications, pipelines, and statistical models.", technologies: [["Py", "Python"], ["TS", "TypeScript"], ["JS", "JavaScript"], ["C++", "C++"], ["SQL", "SQL"], ["R", "R"]] },
  { label: "Frameworks", title: <>Interfaces<br />to APIs.</>, description: "AirPLAi analytics, the TFG portal, and Lewis.", technologies: [["Re", "React"], ["Nx", "Next.js"], ["FA", "FastAPI"], ["Ex", "Express"], ["Nd", "Node.js"]] },
  { label: "Data & ML", title: <>Millions<br />of events.</>, description: "NBA warehouse, player predictions, and basketball tracking.", technologies: [["PG", "PostgreSQL"], ["Db", "DuckDB"], ["PQ", "Parquet"], ["Cb", "CatBoost"], ["YO", "YOLO"], ["CV", "OpenCV"]] },
  { label: "Tools", title: <>Build.<br />Validate. Ship.</>, description: "Version control, deployments, and business integrations.", technologies: [["git", "Git"], ["Dk", "Docker"], ["CI", "GitHub Actions"], ["GC", "Cloud Run"], ["MS", "Microsoft Graph"], ["SP", "SharePoint"]] },
];

const work = [
  { name: "AirPLAi Sports", date: "July 2026 – Present", role: "Sports Operations Intern", title: <>Basketball,<br />frame by frame.</>, description: "Player analytics, video-enabled shot charts, and a reproducible multi-object-tracking pipeline.", stack: "Next.js · PostgreSQL · YOLO · TrackEval", steps: ["Detect active players", "Link identities", "Validate tracking"], caption: "Tracking pipeline · schematic", href: "/experience#airplai" },
  { name: "Team Financial Group", date: "March 2026 – Present", role: "Software Engineer Intern", title: <>A portal built<br />around accounts.</>, description: "Authenticated customer workflows for agreements, payments, and documents, backed by guarded ETL.", stack: "React · Express · Supabase · Microsoft Graph", steps: ["Authenticate account", "Enforce permissions", "Access documents"], caption: "Account access · schematic", href: "/projects/tfg-customer-portal" },
  { name: "Lewis", date: "2026", role: "Personal project / AI developer tools", title: <>AI edits.<br />You approve.</>, description: "A local AI assistant with durable memory, isolated Git worktrees, and validation before applying changes.", stack: "Python · FastAPI · Git", steps: ["Propose in worktree", "Validate patch", "Approve & apply"], caption: "Software edit workflow · schematic", href: "/projects/lewis" },
];

const datasets = [
  { name: "Shots", count: "6.3M", width: 100 },
  { name: "Possessions", count: "6.1M", width: 6.1 / 6.3 * 100 },
  { name: "Player-matchup rows", count: "2.1M", width: 2.1 / 6.3 * 100 },
];

// Adapted from Kokonut UI Background Paths (@dorianbaffier).
// Source and MIT notice are preserved in THIRD_PARTY_NOTICES.md.
function pathFor(index: number) {
  const points = Array.from({ length: 11 }, (_, i) => {
    const progress = i / 10;
    const eased = 1 - (1 - progress) ** 2;
    const amplitude = 1 - eased * .3;
    const phase = index * .2;
    return {
      x: 2400 - 4800 * eased,
      y: 800 + (-1600 + index * 25) * eased
        + Math.sin(progress * Math.PI * 3 + phase) * 105 * amplitude
        + Math.cos(progress * Math.PI * 4 + phase) * 45 * amplitude
        + Math.sin(progress * Math.PI * 2 + phase) * 30 * amplitude,
    };
  });
  return points.map((point, i) => {
    if (!i) return `M ${point.x} ${point.y}`;
    const previous = points[i - 1];
    const dx = point.x - previous.x;
    return `C ${previous.x + dx * .4} ${previous.y}, ${previous.x + dx * .6} ${point.y}, ${point.x} ${point.y}`;
  }).join(" ");
}

export default function ScrollPortfolio() {
  const rootRef = useRef<HTMLElement>(null);
  const [labOpen, setLabOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const find = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
    const all = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
    const gallery = find("[data-gallery]");
    const pin = find("[data-gallery-pin]");
    const rail = find("[data-rail]");
    const chapterElements = all("[data-chapter]");
    const buttons = all<HTMLButtonElement>("[data-jump]");
    const cards = all("[data-card]");
    const tiles = chapterElements.map(chapter => Array.from(chapter.querySelectorAll<HTMLElement>("[data-tile]")));
    const steps = cards.map(card => Array.from(card.querySelectorAll<HTMLElement>("[data-step]")));
    const bars = all("[data-bar]");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const roomForMotion = matchMedia("(min-width: 360px) and (min-height: 640px)");
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    let cleanup: (() => void)[] = [];
    let navHeight = 72;

    function reset() {
      cleanup.forEach(stop => stop());
      cleanup = [];
      all<HTMLElement | SVGElement>("[data-animated]").forEach(element => {
        element.style.removeProperty("transform");
        element.style.removeProperty("opacity");
        element.style.removeProperty("clip-path");
      });
      buttons.forEach(button => button.removeAttribute("aria-pressed"));
    }

    function setup() {
      reset();
      navHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 72;
      // Progressive enhancement: all content stays in normal flow without JS,
      // with reduced motion, or when zoom/viewport height leaves too little room.
      const canPin = !reduced.matches && roomForMotion.matches;
      root!.dataset.galleryMotion = String(canPin);
      root!.dataset.cardsMotion = String(canPin);
      root!.dataset.chartMotion = String(canPin);
      if (reduced.matches) return;
      // A tall work card must not disable the technology gallery's motion.
      // Test each pinned surface independently, including enlarged text.
      const galleryFits = canPin && chapterElements.every(chapter => chapter.scrollHeight <= find("[data-window]").clientHeight + 1);
      const cardsFit = canPin && cards.every(card => card.offsetHeight + navHeight + 70 < window.innerHeight);
      const chartFits = canPin && find("[data-chart-pin]").scrollHeight <= window.innerHeight - navHeight + 1;
      root!.dataset.galleryMotion = String(galleryFits);
      root!.dataset.cardsMotion = String(cardsFit);
      root!.dataset.chartMotion = String(chartFits);
      let activeChapter = -1;
      const options = { target: gallery, offset: [`start ${navHeight}px`, "end end"] as [`start ${number}px`, "end end"] };
      if (galleryFits) {
        const slideAnimation = animate(rail, { transform: ["translateX(0px)", `translateX(-${pin.clientWidth * (chapters.length - 1)}px)`] }, { ease: "linear" });
        cleanup.push(scroll(slideAnimation, options), () => slideAnimation.cancel());
        const indicator = find("[data-indicator]");
        cleanup.push(scroll((progress: number) => {
          const position = progress * (chapters.length - 1);
          const active = Math.round(position);
          if (active !== activeChapter) {
            activeChapter = active;
            buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === active)));
          }
          indicator.style.transform = `translateX(${progress * 300}%)`;
          tiles.forEach((chapterTiles, i) => {
            const away = Math.min(1, Math.abs(position - i));
            const direction = i < position ? -1 : 1;
            chapterTiles.forEach((tile, j) => {
              tile.style.transform = `translateY(${away * (26 + j * 9)}px) rotate(${direction * away * (2 + j * .7)}deg) rotateY(${direction * away * 12}deg)`;
            });
          });
        }, options));
      }
      const total = find("[data-progress]");
      cleanup.push(scroll((progress: number) => { total.style.transform = `scaleX(${progress})`; }));
      const hero = find("[data-hero-copy]");
      const waves = find<SVGGElement>("[data-waves]");
      cleanup.push(scroll((progress: number) => {
        hero.style.transform = `translateY(${-progress * 100}px)`;
        hero.style.opacity = String(1 - progress * .65);
        waves.style.transform = `translate(${progress * 280}px, ${-progress * 220}px) rotate(${progress * 8}deg)`;
      }, { target: find("#top"), offset: [`start ${navHeight}px`, `end ${navHeight}px`] }));
      cards.forEach((card, i) => {
        if (cardsFit && i < cards.length - 1) {
          cleanup.push(scroll((progress: number) => { card.style.transform = `scale(${1 - progress * .055})`; }, { target: cards[i + 1], offset: ["start end", `start ${navHeight + 18 + (i + 1) * 19}px`] }));
        }
        cleanup.push(scroll((progress: number) => {
          steps[i].forEach((step, j) => {
            const entered = clamp((progress - j * .12) / .6);
            step.style.transform = `translateX(${(1 - entered) * 40}px)`;
            step.style.opacity = String(.4 + .6 * entered);
          });
        }, { target: card, offset: ["start end", `start ${navHeight + 100}px`] }));
      });
      cleanup.push(scroll((progress: number) => {
        bars.forEach((bar, i) => { bar.style.clipPath = `inset(0 ${(1 - clamp((progress - i * .1) / .65)) * 100}% 0 0)`; });
      }, { target: find("[data-chart]"), offset: [chartFits ? `start ${navHeight + 40}px` : "start end", "end end"] }));
    }

    const jump = (event: MouseEvent) => {
      const index = Number((event.currentTarget as HTMLButtonElement).dataset.jump);
      if (root.dataset.galleryMotion !== "true") {
        chapterElements[index].scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
      const start = gallery.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: start + (gallery.offsetHeight - pin.offsetHeight) * index / (chapters.length - 1), behavior: "smooth" });
    };
    buttons.forEach(button => button.addEventListener("click", jump));
    setup();
    let resizeFrame = 0;
    const scheduleSetup = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(setup);
    };
    const observer = new ResizeObserver(scheduleSetup);
    // The page's own height changes when enhancement is enabled: observe width-
    // independent content instead to avoid a sticky/static resize feedback loop.
    cards.forEach(card => observer.observe(card));
    chapterElements.forEach(chapter => observer.observe(chapter.firstElementChild!));
    window.addEventListener("resize", scheduleSetup);
    reduced.addEventListener("change", scheduleSetup);
    roomForMotion.addEventListener("change", scheduleSetup);
    return () => {
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleSetup);
      reduced.removeEventListener("change", scheduleSetup);
      roomForMotion.removeEventListener("change", scheduleSetup);
      buttons.forEach(button => button.removeEventListener("click", jump));
      reset();
      delete root.dataset.galleryMotion;
      delete root.dataset.cardsMotion;
      delete root.dataset.chartMotion;
    };
  }, []);

  return (
    <main className={styles.portfolio} id="main-content" ref={rootRef}>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <div className={styles.progress} data-progress data-animated aria-hidden="true" />
      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <svg className={styles.paths} viewBox="-2400 -800 4800 1600" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
          <g data-waves data-animated>{Array.from({ length: 22 }, (_, i) => <path key={i} d={pathFor(i)} stroke="currentColor" strokeWidth={4 + i * .2} opacity={.14 + i * .018} />)}</g>
        </svg>
        <div data-hero-copy data-animated>
          <p className={styles.eyebrow}>University of Michigan / Class of 2027</p>
          <h1 id="hero-title">Software.<br /><em>Data.</em> AI.</h1>
          <p className={styles.eyebrow}>Matthew Kooy — Selected engineering work</p>
        </div>
        <div className={styles.heroBottom}>
          <p>Player analytics at AirPLAi.<br />Financial software at Team Financial Group.<br />AI tools and basketball data systems.</p>
          <a className={styles.explore} href="#stack">Scroll to explore <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <section className={styles.gallery} id="stack" data-gallery aria-labelledby="stack-title">
        <div className={styles.galleryPin} data-gallery-pin>
          <div className={styles.galleryHeader}><h2 id="stack-title">The stack behind the work.</h2><a href="#work" className={styles.textLink}>Skip to work ↘</a></div>
          <div className={styles.window} data-window><div className={styles.rail} data-rail data-animated>
            {chapters.map((chapter, i) => <article className={styles.chapter} key={chapter.label} data-chapter id={`stack-${i}`} aria-labelledby={`stack-title-${i}`}>
              <div><p className={styles.eyebrow}>0{i + 1} / {chapter.label}</p><h3 id={`stack-title-${i}`}>{chapter.title}</h3><p className={styles.chapterDescription}>{chapter.description}</p></div>
              <ul className={styles.tiles}>{chapter.technologies.map(([symbol, name]) => <li className={styles.tile} key={name} data-tile data-animated><span className={styles.symbol} aria-hidden="true">{symbol}</span><span>{name}</span></li>)}</ul>
            </article>)}
          </div></div>
          <div className={styles.chapters} role="group" aria-label="Jump to a technology chapter">
            {chapters.map((chapter, i) => <button key={chapter.label} data-jump={i} type="button" aria-controls={`stack-${i}`}><span aria-hidden="true">0{i + 1} </span>{chapter.label}</button>)}
            <div className={styles.chapterTrack} aria-hidden="true"><span data-indicator data-animated /></div>
          </div>
        </div>
      </section>
      <section id="work" aria-labelledby="work-title">
        <div className={styles.intro}><div><p className={styles.eyebrow}>Selected work / 2026</p><h2 id="work-title">Systems I’ve built.</h2></div><Link className={styles.textLink} href="/projects">All projects ↗</Link></div>
        <div className={styles.deck}>
          {work.map((project, i) => <article key={project.name} className={styles.project} data-card data-animated>
            <div className={styles.projectHeader}><span className={styles.eyebrow}>0{i + 1} / {project.name}</span><span className={styles.eyebrow}>{project.date}</span></div>
            <div className={styles.projectBody}>
              <div><p className={styles.role}>{project.role}</p><h3>{project.title}</h3><p className={styles.projectDescription}>{project.description}</p><p className={styles.used}>{project.stack}</p><Link className={styles.textLink} href={project.href}>Explore the work <span aria-hidden="true">↗</span><span className="sr-only">: {project.name}</span></Link></div>
              <div><ol className={styles.workflow}>{project.steps.map((step, j) => <li className={styles.step} key={step} data-step data-animated>{step}<span aria-hidden="true">0{j + 1}</span></li>)}</ol><p className={styles.caption}>{project.caption}</p></div>
            </div>
          </article>)}
        </div>
      </section>
      <section className={styles.chartSection} id="data" data-chart aria-labelledby="data-title">
        <div className={styles.chartPin} data-chart-pin>
          <div className={styles.chartTitle}><div><p className={styles.eyebrow}>NBA Analytics Warehouse / 30 seasons</p><h2 id="data-title">Basketball data,<br />ready for analysis.</h2></div><p className={styles.chartTotal}>18.3M<span>play-by-play events</span></p></div>
          <dl className={styles.barRows}>{datasets.map(dataset => <div key={dataset.name}>
            <div className={styles.barLabel}><dt>{dataset.name}</dt><dd>{dataset.count}</dd></div>
            <div className={styles.barSurface} aria-hidden="true"><div className={styles.barFill} style={{ width: `${dataset.width}%` }} data-bar data-animated /></div>
          </div>)}</dl>
          <div className={styles.axis} aria-hidden="true"><span>0</span><span>Records, millions</span><span>6.3</span></div>
          <div className={styles.chartBottom}><p className={styles.caption}>Separate datasets; these counts are not additive.<br />Python · DuckDB · Parquet</p><Link className={styles.textLink} href="/projects/nba-analytics-warehouse">Explore the warehouse ↗</Link></div>
        </div>
      </section>
      <section className={styles.outro} aria-labelledby="contact-title">
        <p className={styles.eyebrow}>Matthew Kooy / Software · Data · AI</p><h2 id="contact-title">Let’s build something useful.</h2><a className={styles.contactButton} href="mailto:kooymatthew@gmail.com">Get in touch ↗</a>
        <div className={styles.socials}><a href="https://github.com/matthewkooy2" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/matthew-kooy" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><Link href="/about">About Matthew</Link></div>
      </section>
      <section className={styles.lab} aria-label="Mini Tetris">
        <button className={styles.labToggle} aria-expanded={labOpen} aria-controls="mini-tetris" type="button" onClick={() => setLabOpen(!labOpen)}>A small side quest: Mini Tetris <span aria-hidden="true">{labOpen ? "−" : "+"}</span></button>
        <div id="mini-tetris" hidden={!labOpen}>{labOpen && <div className={styles.game}><TetrisMini /></div>}</div>
      </section>
    </main>
  );
}
