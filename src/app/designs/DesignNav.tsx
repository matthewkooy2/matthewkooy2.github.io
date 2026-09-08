import Link from "next/link";
import { designs, type DesignId } from "./data";
import styles from "./Designs.module.css";

export default function DesignNav({ active }: { active?: DesignId }) {
  return <nav className={styles.studioNav} aria-label="Design comparisons">
    <Link className={styles.studioBrand} href="/designs">Design studies <span>↗</span></Link>
    <div className={styles.switcher}>{designs.map(design => <Link key={design.id} href={`/designs/${design.id}`} aria-current={active === design.id ? "page" : undefined}><span>{design.number} </span>{design.name}</Link>)}</div>
    <Link className={styles.currentLink} href="/">Current version ↗</Link>
  </nav>;
}
