import Link from "next/link";
import { PROJECTS } from "../../projects/data";
import ParticleCheckpoint from "./ParticleCheckpoint";
import styles from "./Gallery.module.css";

export default function GalleryProjects() {
  return (
    <section className={styles.projects} id="projects" data-particle-surface aria-labelledby="projects-heading">
      <div className={styles.projectsHeading}>
        <div><p className={styles.kicker}>04 / Projects</p><h2 id="projects-heading">Projects<span className={styles.accentDot}>.</span></h2></div>
        <div className={styles.checkpointAside}><p className={styles.projectsCount}><span>{String(PROJECTS.length).padStart(2, "0")}</span> projects</p><ParticleCheckpoint id="projects" /></div>
      </div>
      <div className={styles.projectsGrid}>
        {PROJECTS.map((project, index) => (
          <article className={styles.projectCard} id={`project-${project.id}`} key={project.id} data-project-card data-animated aria-labelledby={`project-${project.id}-title`}>
            <div className={styles.projectSurface}>
              <div className={styles.projectMeta}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{project.category}</span></div>
              <h3 id={`project-${project.id}-title`}><Link href={`#project-${project.id}`}>{project.title}</Link></h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <ul className={styles.projectTags} aria-label={`${project.title} technologies`}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              {project.code && <div className={styles.projectLinks}>
                <a href={project.code} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source code`}>Code <span aria-hidden="true">↗</span></a>
              </div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
