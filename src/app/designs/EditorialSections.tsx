import Link from "next/link";
import { projects, stack } from "./data";
import styles from "./Designs.module.css";

export function EditorialStack() {
  return <>
    <section className={styles.reading} aria-label="Engineering focus" data-reading>
      <p className={styles.kicker}>The work, in a sentence</p>
      <p className={styles.readingText}>{"I build player analytics, financial software, AI engineering tools, and the data systems behind them.".split(" ").map((word, i) => <span key={i} data-word data-animated>{word} </span>)}</p>
    </section>
    <section className={styles.editorialStack} id="stack" aria-labelledby="stack-heading">
      <div className={styles.editorialSticky}><p className={styles.kicker}>01 / The toolkit</p><h2 id="stack-heading">A stack for<br /><em>every layer.</em></h2><p>From the interface to the database.</p><a className={styles.link} href="#work">On to the work ↓</a></div>
      <div>{stack.map((group, i) => <article className={styles.editorialChapter} key={group.name} data-chapter-reveal data-animated>
        <p className={styles.kicker}>0{i + 1}</p><h3>{group.name}</h3><p>{group.summary}</p><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul><span className={styles.chapterUnderline} data-chapter-line data-animated aria-hidden="true" />
      </article>)}</div>
    </section>
  </>;
}

export function EditorialWork() {
  return <section className={styles.editorialWork} id="work" aria-labelledby="work-heading">
    <div className={styles.sectionHeading}><p className={styles.kicker}>02 / Selected work</p><h2 id="work-heading">Engineering,<br /><em>in practice.</em></h2><Link className={styles.link} href="/projects">All projects ↗</Link></div>
    {projects.map((project, i) => <article className={styles.editorialCase} key={project.name} data-case>
      <div className={styles.caseIndex}><span aria-hidden="true">0{i + 1}</span><p>{project.name}</p><p className={styles.kicker}>{project.date}</p></div>
      <div className={styles.caseContent} data-case-content data-animated><p className={styles.kicker}>{project.role}</p><h3>{project.label}.</h3><p>{project.description}</p><p className={styles.proof}>{project.proof}</p><ul className={styles.editorialSteps}>{project.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}<span aria-hidden="true">↘</span></li>)}</ul><p className={styles.diagramNote}>Workflow schematic</p><div className={styles.tags}>{project.tools.map(tool => <span key={tool}>{tool}</span>)}</div><Link className={styles.link} href={project.href}>Read more <span aria-hidden="true">↗</span><span className="sr-only"> about {project.name}</span></Link></div>
    </article>)}
  </section>;
}
