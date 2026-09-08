import Link from "next/link";
import { projects, stack } from "./data";
import styles from "./Designs.module.css";

export function GalleryStack() {
  return <section className={styles.fanScene} id="stack" data-fan-scene aria-labelledby="stack-heading">
    <div className={styles.fanPin} data-fan-pin>
      <div className={styles.fanHeading}><div><p className={styles.kicker}>01 / Open the toolkit</p><h2 id="stack-heading">A few of my<br /><em>working tools.</em></h2></div><a className={styles.link} href="#work">Skip to work ↘</a></div>
      <div className={styles.fanGrid} data-fan-grid>{stack.map((group, i) => <article className={styles.fanCard} data-fan-card data-animated key={group.name}><div><span className={styles.kicker}>0{i + 1}</span><span className={styles.fanSymbol} aria-hidden="true">{group.symbol}</span></div><h3>{group.name}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
      <p className={styles.fanHint}>Languages / Frameworks / Data & ML / Tools</p>
    </div>
  </section>;
}

export function GalleryWork() {
  return <section className={styles.reelScene} id="work" data-reel-scene aria-labelledby="work-heading">
    <div className={styles.reelPin} data-reel-pin>
      <div className={styles.reelHeading}><div><p className={styles.kicker}>02 / Selected work</p><h2 id="work-heading">The project reel.</h2></div><Link className={styles.link} href="/projects">All projects ↗</Link></div>
      <div className={styles.reelWindow} data-reel-window><div className={styles.reelTrack} data-reel-track data-animated>{projects.map((project, i) => <article className={styles.reelCard} data-reel-card key={project.name}>
        <div className={styles.reelMeta}><span className={styles.kicker}>{project.role}</span><span className={styles.kicker}>{project.date}</span></div>
        <div className={styles.reelBody}><div><p className={styles.reelNumber} aria-hidden="true">0{i + 1}</p><h3>{project.name}</h3><p>{project.description}</p><div className={styles.tags}>{project.tools.map(tool => <span key={tool}>{tool}</span>)}</div><Link className={styles.link} href={project.href}>Explore the work ↗<span className="sr-only">: {project.name}</span></Link></div>
          <div className={styles.reelDiagram}><span className={styles.kicker}>Workflow / schematic</span><ol>{project.steps.map((step, j) => <li key={step}><span>0{j + 1}</span>{step}<span aria-hidden="true">↓</span></li>)}</ol><p>{project.proof}</p></div></div>
      </article>)}</div></div>
      <div className={styles.reelControls} role="group" aria-label="Jump to a project">{projects.map((project, i) => <button type="button" data-reel-jump={i} key={project.name}>0{i + 1}<span> / {project.name}</span></button>)}<span className={styles.reelProgress} aria-hidden="true"><i data-reel-progress data-animated /></span></div>
    </div>
  </section>;
}
