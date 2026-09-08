"use client";

import Link from "next/link";
import { useRef } from "react";
import { GalleryStack, GalleryWork } from "./GallerySections";
import WarehouseChart from "./WarehouseChart";
import { useGalleryMotion } from "./useGalleryMotion";
import styles from "./Gallery.module.css";

export default function GalleryPortfolio() {
  const rootRef = useRef<HTMLDivElement>(null);
  useGalleryMotion(rootRef);

  return (
    <div className={`${styles.study} ${styles.gallery}`} ref={rootRef}>
      <a className={styles.studySkip} href="#work">Skip to selected work</a>
      <header className={styles.localNav} data-gallery-nav>
        <a href="#hero">Matthew Kooy.</a>
        <nav aria-label="Portfolio sections">
          <a href="#stack">Stack</a>
          <a href="#work">Work</a>
          <a href="#data">Data</a>
          <a href="mailto:kooymatthew@gmail.com">Contact ↗</a>
        </nav>
      </header>
      <div className={styles.pageProgress} data-page-progress data-animated aria-hidden="true" />
      <main>
        <section className={styles.hero} id="hero">
          <p className={styles.kicker}>University of Michigan / Data Science &amp; Economics / 2027</p>
          <h1><span data-hero-line data-animated>Matthew</span><span data-hero-line data-animated>Kooy.</span></h1>
          <div className={styles.heroDisc} aria-hidden="true">Software<br />Data<br />AI <span>↘</span></div>
          <div className={styles.heroBottom}>
            <p>Player analytics at AirPLAi.<br />Financial software at Team Financial Group.<br />AI tools and basketball data systems.</p>
            <a href="#stack">Scroll to explore <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <GalleryStack />
        <GalleryWork />
        <WarehouseChart />
        <footer className={styles.studyFooter}>
          <p className={styles.kicker}>Matthew Kooy / Software · Data · AI</p>
          <h2>Let’s build<br /><em>something useful.</em></h2>
          <a className={styles.emailLink} href="mailto:kooymatthew@gmail.com">kooymatthew@gmail.com ↗</a>
          <div className={styles.footerLinks}>
            <a href="https://github.com/matthewkooy2" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/matthew-kooy" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <Link href="/about">About</Link>
            <Link href="/experience">Experience</Link>
            <Link href="/projects">All projects</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
