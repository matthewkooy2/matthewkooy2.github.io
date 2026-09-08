"use client";

import DesignNav from "./DesignNav";
import Link from "next/link";
import { useRef } from "react";
import { designs, type DesignId } from "./data";
import { EditorialStack, EditorialWork } from "./EditorialSections";
import { SignalHeroVisual, SignalStack, SignalWork } from "./SignalSections";
import { GalleryStack, GalleryWork } from "./GallerySections";
import WarehouseDisplay from "./WarehouseDisplay";
import { useStudyMotion } from "./useStudyMotion";
import styles from "./Designs.module.css";

export default function DesignStudy({ design }: { design: DesignId }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useStudyMotion(rootRef);
  const selected = designs.find(item => item.id === design)!;
  return <div className={`${styles.study} ${styles[design]}`} ref={rootRef} key={design}>
    <DesignNav active={design} />
    <div className={styles.pageProgress} data-page-progress data-animated aria-hidden="true" />
    <a className={styles.studySkip} href="#work">Skip to selected work</a>
    <main>
      <header className={styles.localNav}><a href="#hero">Matthew Kooy.</a><nav aria-label="Portfolio sections"><a href="#stack">Stack</a><a href="#work">Work</a><a href="#data">Data</a><a href="mailto:kooymatthew@gmail.com">Contact ↗</a></nav></header>
      <section className={styles.hero} id="hero">
        <p className={styles.kicker}>University of Michigan / Data Science & Economics / 2027</p>
        {design === "editorial" ? <h1><span data-hero-line data-animated>Matthew</span><em data-hero-line data-animated>Kooy.</em></h1> : design === "signal" ? <h1><span data-hero-line data-animated>Software,</span><em data-hero-line data-animated>end to end.</em></h1> : <h1><span data-hero-line data-animated>Matthew</span><span data-hero-line data-animated>Kooy.</span></h1>}
        {design === "signal" && <SignalHeroVisual />}
        {design === "gallery" && <div className={styles.heroDisc} aria-hidden="true">Software<br />Data<br />AI <span>↘</span></div>}
        <div className={styles.heroBottom}><p>Player analytics at AirPLAi.<br />Financial software at Team Financial Group.<br />AI tools and basketball data systems.</p><a href="#stack">Scroll to explore <span aria-hidden="true">↓</span></a></div>
      </section>
      {design === "editorial" ? <><EditorialStack /><EditorialWork /></> : design === "signal" ? <><SignalStack /><SignalWork /></> : <><GalleryStack /><GalleryWork /></>}
      <WarehouseDisplay design={design} />
      <footer className={styles.studyFooter}><p className={styles.kicker}>Matthew Kooy / Software · Data · AI</p><h2>Let’s build<br /><em>something useful.</em></h2><a className={styles.emailLink} href="mailto:kooymatthew@gmail.com">kooymatthew@gmail.com ↗</a><div className={styles.footerLinks}><a href="https://github.com/matthewkooy2" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/matthew-kooy" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><Link href="/about">About</Link><Link href="/projects">All projects</Link></div></footer>
      <aside className={styles.studyNotes}><p><strong>{selected.number} / {selected.name}</strong> — {selected.sources}</p><Link href="/designs#compare-title">Compare individual sections ↗</Link></aside>
    </main>
  </div>;
}
