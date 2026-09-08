import Link from "next/link";
import DesignNav from "./DesignNav";
import { designs, references } from "./data";
import styles from "./Designs.module.css";

export default function DesignStudies() {
  return <div className={styles.hub}>
    <DesignNav />
    <main className={styles.hubMain}>
      <p className={styles.kicker}>Matthew Kooy / Portfolio explorations</p>
      <h1>Three directions.<br /><em>Your favorite parts.</em></h1>
      <p className={styles.hubIntro}>Open a design and scroll. Compare the hero, stack, work, and data sections—then we can combine the pieces you like.</p>
      <div className={styles.options}>
        {designs.map(design => <article key={design.id} className={styles.option}>
          <Link className={`${styles.mini} ${styles[design.id]}`} href={`/designs/${design.id}`} aria-label={`Open ${design.name} design`}>
            <span className={styles.miniNumber}>MK / {design.number}</span>
            {design.id === "editorial" ? <><strong>Matthew<br /><i>Kooy.</i></strong><span className={styles.miniRule} /><small>Software. Data. AI.</small></> : design.id === "signal" ? <><strong>Software,<br /><i>end to end.</i></strong><div className={styles.miniPipeline}><span>BUILD</span><b>→</b><span>VALIDATE</span><b>→</b><span>SHIP</span></div></> : <><strong>Matthew<br />Kooy.</strong><div className={styles.miniFan}><i>Py</i><i>SQL</i><i>TS</i></div></>}
            <span className={styles.miniArrow}>↗</span>
          </Link>
          <div className={styles.optionCopy}><p className={styles.kicker}>{design.number} / {design.character}</p><h2>{design.name}</h2><p>{design.description}</p><ul>{design.features.map(feature => <li key={feature}>{feature}</li>)}</ul><Link className={styles.link} href={`/designs/${design.id}`}>Explore {design.name} <span>↗</span></Link></div>
        </article>)}
      </div>
      <section className={styles.compare} aria-labelledby="compare-title">
        <p className={styles.kicker}>Mix & match</p><h2 id="compare-title">Jump straight to a section.</h2>
        <div className={styles.tableScroll}><table><thead><tr><th scope="col">Section</th>{designs.map(design => <th scope="col" key={design.id}>{design.name}</th>)}</tr></thead><tbody>{["hero", "stack", "work", "data"].map(section => <tr key={section}><th scope="row">{section}</th>{designs.map(design => <td key={design.id}><Link href={`/designs/${design.id}#${section}`} aria-label={`${design.name}: ${section}`}>View {section} ↗</Link></td>)}</tr>)}</tbody></table></div>
      </section>
      <section className={styles.references}><h2>References used</h2><p>Motion is the animation engine. Kokonut, Bklit, and Manus inform the interaction and visual designs; these are custom implementations, not copies of their full sites.</p><div>{references.map(reference => <a key={reference.href} href={reference.href} target="_blank" rel="noopener noreferrer">{reference.name} ↗</a>)}</div></section>
    </main>
  </div>;
}
