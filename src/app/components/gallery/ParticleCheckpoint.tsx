import { PARTICLE_CHECKPOINTS, type CheckpointId } from "./particleJourney";
import styles from "./Gallery.module.css";

export default function ParticleCheckpoint({ id }: { id: CheckpointId }) {
  const checkpoint = PARTICLE_CHECKPOINTS.find(item => item.id === id)!;
  return <span className={styles.particleAnchor} data-particle-anchor={id} aria-hidden="true"><span className={styles.particleFallback}>{checkpoint.label}</span></span>;
}
