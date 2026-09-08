import Link from "next/link";
import { stack, projects } from "./data";
import styles from "./Designs.module.css";

export function SignalHeroVisual() {
  return <>
    <svg className={styles.signalPaths} viewBox="0 0 1400 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none"><g data-hero-paths data-animated>{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${-180 + i * 25} 780 C ${240 + i * 28} 690, ${710 + i * 12} 150, ${1480 + i * 20} ${-120 + i * 27}`} stroke="currentColor" strokeWidth="1" opacity={.2 + i * .025} />)}</g></svg>
    <div className={styles.heroSystem} aria-label="Areas of engineering work">
      {[{ label: "01 / Product", name: "Player analytics", tags: "Next.js · TypeScript" }, { label: "02 / Platform", name: "Customer workflows", tags: "React · PostgreSQL" }, { label: "03 / Intelligence", name: "AI & data systems", tags: "Python · FastAPI" }].map((panel, i) => <div className={styles.systemPanel} data-hero-panel data-animated key={panel.name}><div><span className={styles.kicker}>{panel.label}</span><span className={styles.panelGlyph} aria-hidden="true">{["⌁", "⊞", "λ"][i]}</span></div><p>{panel.name}</p><span>{panel.tags}</span></div>)}
    </div>
  </>;
}

export function SignalStack() {
  return <section className={styles.signalStack} id="stack" aria-labelledby="stack-heading">
    <div className={styles.sectionHeading}><p className={styles.kicker}>01 / Technology map</p><h2 id="stack-heading">Inside<br /><em>the stack.</em></h2><p>Applications. Data. Infrastructure.</p></div>
    <div className={styles.bento}>{stack.map((group, i) => <article className={styles.bentoCard} key={group.name} data-bento data-animated>
      <div className={styles.bentoHead}><span className={styles.kicker}>0{i + 1} / {group.name}</span><span className={styles.bentoSymbol} aria-hidden="true">{group.symbol}</span></div><h3>{group.name}</h3><p>{group.summary}</p><ul>{group.items.map((item, j) => <li data-chip data-animated key={item}><span aria-hidden="true">{String(j + 1).padStart(2, "0")}</span>{item}</li>)}</ul>
    </article>)}</div>
  </section>;
}

export function SignalWork() {
  return <section className={styles.signalWork} id="work" aria-labelledby="work-heading">
    <div className={styles.sectionHeading}><p className={styles.kicker}>02 / Systems in practice</p><h2 id="work-heading">From input<br /><em>to outcome.</em></h2><Link className={styles.link} href="/experience">Full experience ↗</Link></div>
    <div className={styles.signalTimeline}>
      <div className={styles.timelineTrack} aria-hidden="true"><div data-timeline-line data-animated /></div>
      {projects.map((project, i) => <article className={styles.signalCase} key={project.name} data-signal-case>
        <span className={styles.timelineDot} aria-hidden="true">0{i + 1}</span>
        <div className={styles.signalCaseHead}><p className={styles.kicker}>{project.role}</p><p className={styles.kicker}>{project.date}</p></div>
        <h3>{project.name}</h3><p className={styles.signalDescription}>{project.description}</p>
        <div className={styles.signalPipeline}>
          <svg viewBox="0 0 900 100" preserveAspectRatio="none" aria-hidden="true"><path d="M 20 50 L 880 50" pathLength="1" className={styles.pipelineTrack} /><path d="M 20 50 L 880 50" pathLength="1" data-flow-path data-animated className={styles.pipelineFlow} /></svg>
          {project.steps.map((step, j) => <div className={styles.pipelineNode} data-pipeline-node data-animated key={step}><span className={styles.kicker}>0{j + 1}</span><p>{step}</p></div>)}
        </div>
        <p className={styles.diagramNote}>Workflow schematic—not a live system monitor</p><p className={styles.proof}>{project.proof}</p><div className={styles.signalCaseBottom}><div className={styles.tags}>{project.tools.map(tool => <span key={tool}>{tool}</span>)}</div><Link className={styles.link} href={project.href}>Explore ↗<span className="sr-only"> {project.name}</span></Link></div>
      </article>)}
    </div>
  </section>;
}
