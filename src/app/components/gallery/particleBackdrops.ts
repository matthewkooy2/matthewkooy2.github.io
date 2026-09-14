/** Copy the traveling cloud beneath each visible section's content, above its paint. */
export function createParticleBackdrops(root: HTMLElement, source: HTMLCanvasElement) {
  const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-particle-surface]")).map(surface => {
    const canvas = document.createElement("canvas");
    canvas.dataset.particleBackdrop = "true";
    canvas.setAttribute("aria-hidden", "true");
    surface.prepend(canvas);
    return { surface, canvas, context: canvas.getContext("2d") };
  });
  return {
    paint(traveling: boolean, width: number, height: number) {
      source.style.visibility = traveling ? "hidden" : "visible";
      const scale = source.width / width;
      for (const { surface, canvas, context } of layers) {
        const rect = surface.getBoundingClientRect();
        const left = Math.max(0, rect.left), top = Math.max(0, rect.top);
        const right = Math.min(width, rect.right), bottom = Math.min(height, rect.bottom);
        if (!traveling || !context || right <= left || bottom <= top) {
          canvas.style.display = "none";
          // Release offscreen buffers; only the visible sections need a bitmap.
          if (canvas.width) canvas.width = canvas.height = 0;
          continue;
        }
        const w = right - left, h = bottom - top;
        const pixelWidth = Math.ceil(w * scale), pixelHeight = Math.ceil(h * scale);
        if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
        if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
        canvas.style.display = "block";
        canvas.style.left = `${left - rect.left - surface.clientLeft}px`;
        canvas.style.top = `${top - rect.top - surface.clientTop}px`;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(source, left * scale, top * scale, w * scale, h * scale, 0, 0, canvas.width, canvas.height);
      }
    },
    destroy() {
      layers.forEach(({ canvas }) => canvas.remove());
      source.style.removeProperty("visibility");
    },
  };
}
