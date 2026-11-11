/** Genuine experimental HTML-in-Canvas is used for motion after a paint canary.
 * Reading/selection uses the SAME real DOM element outside the canvas, never an
 * image or clone. Canvas text selection is not assumed or emulated. */
type DrawableContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => DOMMatrix | undefined;
};
type DrawableCanvas = HTMLCanvasElement & { content?: string; requestPaint?: () => void };
export type NativeSurface = { element: HTMLElement; setInteractive: (interactive: boolean) => void; requestPaint: () => void; dispose: () => void };

export async function supportsNativeCards(cancelled: () => boolean): Promise<boolean> {
  const canvas = document.createElement("canvas") as DrawableCanvas;
  const context = canvas.getContext("2d") as DrawableContext | null;
  if (!context || typeof context.drawElementImage !== "function" || !("content" in canvas) || !("onpaint" in canvas) || typeof canvas.requestPaint !== "function") return false;
  canvas.width = 16; canvas.height = 16;
  canvas.setAttribute("layoutsubtree", ""); canvas.setAttribute("content", "drawable");
  if (canvas.content !== "drawable") return false;
  const child = document.createElement("button");
  child.setAttribute("drawable", ""); child.setAttribute("aria-label", "描画検証"); child.tabIndex = -1;
  child.style.cssText = "display:block;width:16px;height:16px;padding:0;border:0;background:rgb(23,137,79)";
  // Offscreen/hidden canvases can be paint-culled even when the API works.
  canvas.style.cssText = "position:fixed;left:0;top:80px;width:16px;height:16px;opacity:.001;pointer-events:none;z-index:1";
  canvas.setAttribute("aria-hidden", "true"); canvas.append(child); document.body.append(canvas);
  return new Promise(resolve => {
    let done = false;
    const finish = (value: boolean) => {
      if (done) return;
      done = true; clearTimeout(timer); canvas.removeEventListener("paint", paint); canvas.remove(); resolve(value && !cancelled());
    };
    const paint = () => {
      try {
        context.drawElementImage!(child, 0, 0);
        const pixel = context.getImageData(8, 8, 1, 1).data;
        finish(pixel[3] > 240 && pixel[1] > 110 && pixel[0] < 50);
      } catch { finish(false); }
    };
    const timer = window.setTimeout(() => finish(false), 1000);
    canvas.addEventListener("paint", paint);
    try { canvas.requestPaint!(); } catch { finish(false); }
  });
}

export function nativeCard(card: HTMLElement, className: string): NativeSurface {
  const shell = document.createElement("div");
  shell.className = className;
  const canvas = document.createElement("canvas") as DrawableCanvas;
  canvas.setAttribute("layoutsubtree", ""); canvas.setAttribute("content", "drawable");
  canvas.style.display = "block";
  card.setAttribute("drawable", "");
  shell.append(canvas); canvas.append(card);
  // A canvas is a replaced element: pin its fallback subtree's containing width
  // to the exact DOM width before reparenting. Never let the 300px default canvas
  // or the high-DPI bitmap determine text wrapping.
  shell.style.font = "inherit";
  canvas.style.font = "inherit";
  canvas.style.boxSizing = "border-box";
  const context = canvas.getContext("2d") as DrawableContext;
  let failed = false;
  let disposed = false;
  let painted = false;
  let interactive = true;
  let timer = 0;
  let pixelRatio = 1;
  let layoutWidth = 0;
  let layoutHeight = 0;
  const fallback = () => {
    if (failed || disposed) return;
    failed = true; canvas.removeEventListener("paint", paint);
    shell.append(card); canvas.remove(); card.removeAttribute("drawable");
    shell.dataset.render = "dom";
  };
  function paint() {
    if (disposed || failed || interactive) return;
    try {
      context.reset();
      context.scale(pixelRatio, pixelRatio);
      context.drawElementImage!(card, 0, 0);
      // A silent non-draw is just as fatal as an exception. Sample card padding.
      if (!painted && context.getImageData(Math.round(32 * pixelRatio), Math.round(32 * pixelRatio), 1, 1).data[3] === 0) { fallback(); return; }
      painted = true; clearTimeout(timer); shell.dataset.render = "native";
    } catch { fallback(); }
  }
  function size() {
    if (disposed) return;
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    shell.style.width = `${width}px`; shell.style.height = `${height}px`;
    layoutWidth = width; layoutHeight = height;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    if (failed || interactive) return;
    // Keep the CSS layout viewport fixed while requesting a high-DPI backing store.
    // Unsupported/non-drawing implementations still fall back to the real DOM.
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const bitmapWidth = Math.round(width * pixelRatio), bitmapHeight = Math.round(height * pixelRatio);
    if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
      canvas.width = bitmapWidth; canvas.height = bitmapHeight;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    }
    try { canvas.requestPaint?.(); } catch { fallback(); }
  }
  canvas.addEventListener("paint", paint);
  const resize = new ResizeObserver(size); resize.observe(card);
  // The browser paint event owns redraws; these request invalidation, never capture HTML.
  const invalidate = () => { if (!failed && !interactive) { try { canvas.requestPaint?.(); } catch { fallback(); } } };
  const mutation = new MutationObserver(invalidate);
  mutation.observe(card, { subtree: true, attributes: true, childList: true, characterData: true });
  ["pointerover", "pointerout", "focusin", "focusout", "toggle", "load"].forEach(type => card.addEventListener(type, invalidate, true));
  function setInteractive(value: boolean) {
    if (disposed || failed) return;
    if (interactive === value && shell.dataset.render) return;
    if (!value) size();
    interactive = value;
    clearTimeout(timer);
    // One actual card, one set of controls. Never forward transformed canvas hits.
    if (value) {
      shell.append(card); card.removeAttribute("drawable"); canvas.hidden = true;
      canvas.style.display = "none"; shell.dataset.render = "dom";
    } else {
      painted = false;
      canvas.style.width = `${layoutWidth}px`; canvas.style.height = `${layoutHeight}px`;
      card.setAttribute("drawable", ""); canvas.append(card); canvas.hidden = false;
      canvas.style.display = "block"; shell.dataset.render = "native";
      size(); invalidate();
      timer = window.setTimeout(() => { if (!painted) fallback(); }, 1200);
    }
  }
  setInteractive(true);
  size();
  return { element: shell, setInteractive, requestPaint: invalidate, dispose() {
    disposed = true; clearTimeout(timer); resize.disconnect(); mutation.disconnect();
    canvas.removeEventListener("paint", paint);
    ["pointerover", "pointerout", "focusin", "focusout", "toggle", "load"].forEach(type => card.removeEventListener(type, invalidate, true));
    card.removeAttribute("drawable");
  } };
}
