import { extracurriculars } from "./content";
import ParticleCheckpoint from "./ParticleCheckpoint";
import styles from "./Gallery.module.css";

export default function GalleryExtracurriculars() {
  return (
    <section className={styles.extracurriculars} id="extracurriculars" data-particle-surface aria-labelledby="extracurriculars-heading">
      <div className={styles.clubsHeading}>
        <div><p className={styles.kicker}>03 / Campus involvement</p><h2 id="extracurriculars-heading">Extracurriculars<span className={styles.accentDot}>.</span></h2></div>
        <div className={styles.checkpointAside}><p>University of Michigan</p><ParticleCheckpoint id="extracurriculars" /></div>
      </div>
      <div className={styles.clubsList}>
        {extracurriculars.map((club, index) => (
          <article className={styles.clubCard} key={club.id} data-club-card data-animated aria-labelledby={`club-${club.id}`}>
            <div className={styles.clubSurface}>
              <div className={styles.clubIdentity}>
                <p className={styles.clubNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
                <h3 id={`club-${club.id}`}>{club.name}</h3>
                <p className={styles.clubRole}>{club.role}</p>
                <p className={styles.clubDate}>{club.date}</p>
              </div>
              <div className={styles.clubWork}>
                <ul className={styles.clubHighlights}>{club.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
                <ul className={styles.clubTools} aria-label={`${club.name} skills`}>{club.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
