"use client";

import { useRef } from "react";
import { GalleryStack, GalleryWork } from "./GallerySections";
import WarehouseChart from "./WarehouseChart";
import GalleryProjects from "./GalleryProjects";
import GalleryExtracurriculars from "./GalleryExtracurriculars";
import HeroParticleMark from "./HeroParticleMark";
import ParticleCheckpoint from "./ParticleCheckpoint";
import { useGalleryMotion } from "./useGalleryMotion";
import styles from "./Gallery.module.css";

export default function GalleryPortfolio() {
  const rootRef = useRef<HTMLDivElement>(null);
  useGalleryMotion(rootRef);

  return (
    <div className={`${styles.study} ${styles.gallery}`} ref={rootRef} data-particle-root>
      <a className={styles.studySkip} href="#work">Skip to work experience</a>
      <header className={styles.localNav} data-gallery-nav>
        <a href="#hero">Matthew Kooy<span className={styles.accentDot}>.</span></a>
        <nav aria-label="Portfolio sections">
          <a href="#stack">Stack</a>
          <a href="#work">Experience</a>
          <a href="#extracurriculars">Clubs</a>
          <a href="#projects">Projects</a>
          <a href="#data">Data</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <div className={styles.pageProgress} data-page-progress data-animated aria-hidden="true" />
      <main>
        <section className={styles.hero} id="hero" data-particle-surface>
          <p className={styles.kicker}>University of Michigan / Data Science &amp; Economics / 2027</p>
          <div className={styles.heroMain}>
            <div className={styles.heroIdentity}>
              <h1><span data-hero-line data-animated>Matthew</span><span data-hero-line data-animated>Kooy<span className={styles.accentDot}>.</span></span></h1>
              <p className={styles.heroIntroduction}>I build software and data systems, from financial workflows at Team Financial Group to basketball analytics at AirPLAi.</p>
              <div className={styles.heroLinks}>
                <a href="https://github.com/matthewkooy2" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                <a href="https://www.linkedin.com/in/matthew-kooy" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <HeroParticleMark />
          </div>
          <div className={styles.heroBottom}>
            <a href="#stack">Scroll to explore <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <GalleryStack />
        <GalleryWork />
        <GalleryExtracurriculars />
        <GalleryProjects />
        <WarehouseChart />
        <footer className={styles.studyFooter} id="contact" data-particle-surface>
          <ParticleCheckpoint id="contact" />
          <p className={styles.kicker}>Matthew Kooy / Software · Data · AI</p>
          <h2>Let’s build<br /><em>something useful.</em></h2>
          <a className={styles.emailLink} href="mailto:kooymatthew@gmail.com">kooymatthew@gmail.com ↗</a>
          <div className={styles.footerLinks}>
            <a href="https://github.com/matthewkooy2" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/matthew-kooy" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href="#hero">About</a>
            <a href="#work">Experience</a>
            <a href="#projects">All projects</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
