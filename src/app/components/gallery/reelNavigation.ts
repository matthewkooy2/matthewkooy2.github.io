/** Resolve employer anchors through the reel's own vertical/native scroll model. */
export function bindReelAnchors(root: HTMLElement, cards: HTMLElement[], jump: (index: number, smooth: boolean) => void) {
  let frame = 0;
  const indexFor = (hash: string) => cards.findIndex(card => `#${card.getAttribute("aria-labelledby")}` === hash);
  const navigate = (index: number, smooth: boolean) => {
    cancelAnimationFrame(frame);
    // Let a toolkit dialog close and release its scroll lock before navigating.
    frame = requestAnimationFrame(() => jump(index, smooth));
  };
  const onHash = () => {
    const index = indexFor(window.location.hash);
    if (index >= 0) navigate(index, false);
  };
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    const hash = link.getAttribute("href") || "";
    const index = indexFor(hash);
    if (index < 0) return;
    event.preventDefault();
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    navigate(index, !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  root.addEventListener("click", onClick);
  window.addEventListener("hashchange", onHash);
  onHash();
  return () => {
    cancelAnimationFrame(frame);
    root.removeEventListener("click", onClick);
    window.removeEventListener("hashchange", onHash);
  };
}
