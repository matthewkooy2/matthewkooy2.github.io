export type StackPointer = { x: number; y: number } | null;
type Bounds = { left: number; top: number; width: number; height: number };
const limit = (n: number) => Math.max(-1, Math.min(1, n));

// Measure the unmoving hit area, not the magnetic surface, to avoid a feedback
// loop where following the cursor moves the target used by the next frame.
export function getStackProximity(bounds: Bounds, pointer: StackPointer) {
  const rest = { x: 0, y: 0, rotateX: 0, rotateY: 0, influence: 0 };
  if (!pointer || bounds.width <= 0 || bounds.height <= 0 || !Number.isFinite(bounds.left + bounds.top + bounds.width + bounds.height + pointer.x + pointer.y)) return rest;
  const dx = pointer.x - (bounds.left + bounds.width / 2);
  const dy = pointer.y - (bounds.top + bounds.height / 2);
  const edgeDistance = Math.hypot(Math.max(0, Math.abs(dx) - bounds.width / 2), Math.max(0, Math.abs(dy) - bounds.height / 2));
  const influence = Math.max(0, 1 - edgeDistance / 200) ** 2;
  const horizontal = limit(dx / (bounds.width / 2));
  const vertical = limit(dy / (bounds.height / 2));
  return { x: horizontal * 24 * influence, y: vertical * 18 * influence, rotateX: -vertical * 3 * influence, rotateY: horizontal * 5 * influence, influence };
}
