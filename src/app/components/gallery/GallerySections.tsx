import { experiences } from "./content";
import ParticleCheckpoint from "./ParticleCheckpoint";
import styles from "./Gallery.module.css";

export { default as GalleryStack } from "./GalleryStack";

export function GalleryWork() {
  return <section className={styles.reelScene} id="work" data-reel-scene aria-labelledby="work-heading">
    <div className={styles.reelPin} data-reel-pin data-particle-surface>
      <div className={styles.reelHeading}><div><p className={styles.kicker}>02 / Experience</p><h2 id="work-heading">Work experience.</h2></div><div className={styles.checkpointAside}><ParticleCheckpoint id="work" /></div></div>
      <div className={styles.reelWindow} data-reel-window><div className={styles.reelTrack} data-reel-track data-animated>{experiences.map((experience, i) => <article className={styles.reelCard} data-reel-card key={experience.id} aria-labelledby={`work-${experience.id}`}>
        <div className={styles.reelMeta}><span>{experience.role}<span className={styles.experienceLocation}> · {experience.location}</span></span><span>{experience.date}</span></div>
        <div className={styles.reelBody}>
          <div className={styles.experienceIdentity}><p className={styles.reelNumber} aria-hidden="true">0{i + 1}</p><h3 id={`work-${experience.id}`}>{experience.name}</h3></div>
          <div><p>{experience.description}</p><div className={styles.tags}>{experience.tools.map(tool => <span key={tool}>{tool}</span>)}</div></div>
        </div>
        <div className={styles.experienceHighlights}><p className={styles.kicker}>What I built</p><ul>{experience.highlights.map((highlight, j) => <li key={highlight.title}><span aria-hidden="true">0{j + 1}</span><div><h4>{highlight.title}</h4><p>{highlight.description}</p></div></li>)}</ul></div>
      </article>)}</div></div>
      <div className={styles.reelControls} role="group" aria-label="Jump to work experience">{experiences.map((experience, i) => <button type="button" data-reel-jump={i} key={experience.id} aria-label={`Show ${experience.name} experience`}>0{i + 1}<span> / {experience.name}</span></button>)}<span className={styles.reelProgress} aria-hidden="true"><i data-reel-progress data-animated /></span></div>
    </div>
  </section>;
}
