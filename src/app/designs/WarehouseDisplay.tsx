"use client";

import Link from "next/link";
import { useState } from "react";
import { volumes, type DesignId } from "./data";
import styles from "./Designs.module.css";

export default function WarehouseDisplay({ design }: { design: DesignId }) {
  const [active, setActive] = useState<number | null>(null);
  return <section className={styles.warehouse} id="data" data-warehouse aria-labelledby="data-heading">
    <div className={styles.warehouseHeading}><div><p className={styles.kicker}>03 / NBA Analytics Warehouse</p><h2 id="data-heading">Thirty seasons.<br /><em>18.3 million events.</em></h2></div><p>Resumable backfills.<br />Reconciled identities.<br />Reproducible analysis.</p></div>
    {design === "editorial" ? <dl className={styles.numberGrid}>{volumes.map(item => <div key={item.name}><dt>{item.name}</dt><dd><span data-count={item.value} data-animated aria-hidden="true">{item.value.toFixed(1)}M</span><span className="sr-only">{item.value} million</span></dd><p>{item.description}</p></div>)}</dl> : design === "signal" ? <div className={styles.barDashboard}>
      <div className={styles.chartReadout}><p className={styles.kicker}>Dataset explorer</p><strong>{active === null ? "18.3M" : `${volumes[active].value.toFixed(1)}M`}</strong><p>{active === null ? "Play-by-play events" : volumes[active].name}</p><span>{active === null ? "Choose a dataset to inspect." : volumes[active].description}</span></div>
      <div className={styles.interactiveBars} onMouseLeave={() => setActive(null)}>{volumes.map((item, i) => <button type="button" key={item.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(i)} aria-pressed={active === i}><span>{item.name}<b>{item.value.toFixed(1)}M</b></span><span className={styles.barBed} aria-hidden="true"><i style={{ width: `${item.value / 6.3 * 100}%` }} data-chart-bar data-animated /></span></button>)}<div className={styles.chartAxis} aria-hidden="true"><span>0</span><span>Records, millions</span><span>6.3</span></div></div>
    </div> : <div className={styles.ringDashboard}>
      <div className={styles.ringDrawing}><svg viewBox="0 0 340 340" aria-hidden="true">{volumes.map((item, i) => <g key={item.name} style={{ opacity: active === null || active === i ? 1 : .2 }}><circle cx="170" cy="170" r={143 - i * 25} className={styles.ringTrack} /><circle cx="170" cy="170" r={143 - i * 25} pathLength="100" strokeDasharray={`${item.value / 6.3 * 100} 100`} transform="rotate(-90 170 170)" className={styles.ringArc} data-ring={item.value / 6.3 * 100} data-animated /></g>)}</svg><div className={styles.ringCenter}><strong>{active === null ? "18.3M" : `${volumes[active].value.toFixed(1)}M`}</strong><span>{active === null ? "play-by-play events" : volumes[active].name}</span></div></div>
      <div className={styles.ringLegend} onMouseLeave={() => setActive(null)}>{volumes.map((item, i) => <button type="button" key={item.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(i)} aria-pressed={active === i}><span>0{i + 1} / {item.name}</span><strong>{item.value.toFixed(1)}M</strong></button>)}<p>Ring length compares each dataset with 6.3M records, the largest dataset shown.</p></div>
    </div>}
    <div className={styles.warehouseFooter}><p>Separate datasets; counts are not additive.<br />Python · DuckDB · Parquet</p><Link className={styles.link} href="/projects/nba-analytics-warehouse">Explore the warehouse ↗</Link></div>
  </section>;
}
