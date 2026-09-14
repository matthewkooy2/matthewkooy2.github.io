"use client";

import Link from "next/link";
import { useState } from "react";
import { volumes } from "./content";
import ParticleCheckpoint from "./ParticleCheckpoint";
import styles from "./Gallery.module.css";

export default function WarehouseChart() {
  const [active, setActive] = useState<number | null>(null);
  return <section className={styles.warehouse} id="data" data-particle-surface data-warehouse aria-labelledby="data-heading">
    <div className={styles.warehouseHeading}><div><p className={styles.kicker}>05 / NBA Analytics Warehouse</p><h2 id="data-heading">Thirty seasons.<br /><em>18.3 million events.</em></h2></div><div className={styles.checkpointAside}><p>Resumable backfills.<br />Reconciled identities.<br />Reproducible analysis.</p><ParticleCheckpoint id="data" /></div></div>
    <div className={styles.ringDashboard}>
      <div className={styles.ringDrawing}><svg viewBox="0 0 340 340" aria-hidden="true">{volumes.map((item, i) => <g key={item.name} data-active={active === i} style={{ opacity: active === null || active === i ? 1 : .2 }}><circle cx="170" cy="170" r={143 - i * 25} className={styles.ringTrack} /><circle cx="170" cy="170" r={143 - i * 25} pathLength="100" strokeDasharray={`${item.value / 6.3 * 100} 100`} transform="rotate(-90 170 170)" className={styles.ringArc} data-ring={item.value / 6.3 * 100} data-animated /></g>)}</svg><div className={styles.ringCenter}><strong>{active === null ? "18.3M" : `${volumes[active].value.toFixed(1)}M`}</strong><span>{active === null ? "play-by-play events" : volumes[active].name}</span></div></div>
      <div className={styles.ringLegend} onMouseLeave={() => setActive(null)}>{volumes.map((item, i) => <button type="button" key={item.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(i)} aria-pressed={active === i}><span>0{i + 1} / {item.name}</span><strong>{item.value.toFixed(1)}M</strong></button>)}</div>
    </div>
    <div className={styles.warehouseFooter}><p>Python · DuckDB · Parquet</p><Link className={styles.link} href="#project-nba-analytics-warehouse">Explore the warehouse ↗</Link></div>
  </section>;
}
