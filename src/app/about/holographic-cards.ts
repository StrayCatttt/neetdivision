/**
 * Raw WebGPU adaptation of the supplied Holographic Card renderer.ts/WGSL.
 * Source: https://vgpu.sh/examples/holographic-card/source.md
 * See holographic-shader.ts for material attribution and the retained functions.
 *
 * Integration: await createHolographicCards(realDOMCards, cancelled) => dispose.
 * Keep these cards in DOM-backed CSS3DObjects, NOT native-card.ts's Canvas
 * fallback subtree: drawElementImage need not composite a nested WebGPU canvas.
 * This module detects that case and leaves a CSS fallback without reparenting.
 * No DOM text is cloned, rasterized, intercepted, or made unselectable.
 */
import { holographicShader } from "./holographic-shader";

// Local boundary for experimental WebGPU APIs; no ambient declarations or deps.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GPUHandle = any;
type GPUAccess = {
  requestAdapter: (options?: { powerPreference: string }) => Promise<GPUHandle | null>;
  getPreferredCanvasFormat: () => string;
};
type SavedStyle = { value: string; priority: string; applied: string };
type CardState = {
  card: HTMLElement;
  canvas: HTMLCanvasElement | null;
  context: GPUHandle;
  buffer: GPUHandle;
  bindGroup: GPUHandle;
  values: Float32Array;
  styles: Map<string, SavedStyle>;
  previousStatus: string | undefined;
  removers: (() => void)[];
  intersecting: boolean;
  dirty: boolean;
  blocked: boolean;
  width: number;
  height: number;
  dpr: number;
  pointerX: number;
  pointerY: number;
  targetHover: number;
  pointerInside: boolean;
  focusInside: boolean;
  tiltX: number;
  tiltY: number;
  hover: number;
  lightX: number;
  lightY: number;
};

const fallbackBackground = "radial-gradient(ellipse at 22% 12%, #25282e 0%, transparent 60%), linear-gradient(145deg, #14171b, #0e1014 58%, #1a1d22)";
const clamp = (n: number) => Math.max(-1, Math.min(1, n));

export async function createHolographicCards(
  cards: HTMLElement[],
  cancelled: () => boolean,
): Promise<() => void> {
  if (typeof window === "undefined" || cancelled()) return () => {};
  let disposed = false;
  let failed = false;
  let device: GPUHandle = null;
  let frame = 0;
  let previousTime = 0;
  let resize: ResizeObserver | undefined;
  let intersection: IntersectionObserver | undefined;
  let mutation: MutationObserver | undefined;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cleanups: (() => void)[] = [];
  const states: CardState[] = Array.from(new Set(cards)).map((card, index) => ({
    card, canvas: null, context: null, buffer: null, bindGroup: null,
    values: Float32Array.from({ length: 16 }, (_, i) => i === 10 ? index : 0), styles: new Map(),
    previousStatus: card.dataset.holographic, removers: [],
    intersecting: false, dirty: true, blocked: false,
    width: 0, height: 0, dpr: 0, pointerX: 0, pointerY: 0,
    targetHover: 0, pointerInside: false, focusInside: card.contains(document.activeElement),
    tiltX: 0, tiltY: 0, hover: 0, lightX: 0.2, lightY: -0.25,
  }));

  function style(state: CardState, property: string, value: string) {
    if (!state.styles.has(property)) state.styles.set(property, {
      value: state.card.style.getPropertyValue(property),
      priority: state.card.style.getPropertyPriority(property), applied: "",
    });
    state.card.style.setProperty(property, value);
    state.styles.get(property)!.applied = state.card.style.getPropertyValue(property);
  }
  function release(state: CardState) {
    state.removers.splice(0).forEach(remove => remove());
    try { state.context?.unconfigure(); } catch { /* Already lost. */ }
    try { state.buffer?.destroy(); } catch { /* Already lost. */ }
    state.canvas?.remove();
    state.canvas = null; state.buffer = null; state.context = null; state.bindGroup = null;
  }
  function stopWatching() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    resize?.disconnect(); intersection?.disconnect(); mutation?.disconnect();
    cleanups.splice(0).forEach(remove => remove());
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    stopWatching();
    states.forEach(state => {
      release(state);
      state.styles.forEach((saved, property) => {
        // Do not undo a caller's subsequent inline style change.
        if (state.card.style.getPropertyValue(property) !== saved.applied) return;
        if (saved.value) state.card.style.setProperty(property, saved.value, saved.priority);
        else state.card.style.removeProperty(property);
      });
      if (["webgpu", "fallback", "loading"].includes(state.card.dataset.holographic ?? "")) {
        if (state.previousStatus === undefined) delete state.card.dataset.holographic;
        else state.card.dataset.holographic = state.previousStatus;
      }
    });
    device?.destroy(); device = null;
  }
  function fallback(state: CardState) {
    release(state);
    style(state, "background", fallbackBackground);
    state.card.dataset.holographic = "fallback";
  }
  function fail(cause: unknown) {
    if (disposed || failed) return;
    if (cancelled()) { dispose(); return; }
    failed = true;
    console.warn("About holographic WebGPU unavailable; DOM/CSS retained", cause);
    stopWatching(); states.forEach(fallback);
    device?.destroy(); device = null;
  }
  function wake() {
    if (disposed || failed) return;
    if (cancelled()) { dispose(); return; }
    if (!document.hidden && !frame) frame = requestAnimationFrame(draw);
  }
  function listen(target: EventTarget, type: string, listener: EventListener, into = cleanups) {
    target.addEventListener(type, listener, { passive: true });
    into.push(() => target.removeEventListener(type, listener));
  }
  function canDraw(state: CardState) {
    const { card } = state;
    if (!state.canvas || !card.isConnected || card.closest("canvas") || card.closest("[hidden],[aria-hidden=true]")) return false;
    // Keyboard/scene focus is a wake-up hint, never permission to paint hidden DOM.
    const focused = state.focusInside || card.dataset.focused === "true";
    // Distant, inert cards use the same graphite base. Reserve expensive foil
    // shading for the readable foreground card rather than six full surfaces.
    if (card.closest("main[data-scene=true]") && !focused) return false;
    if (!state.intersecting && !focused) return false;
    const box = card.getBoundingClientRect();
    if (!box.width || !box.height || box.right <= 0 || box.bottom <= 0 || box.left >= innerWidth || box.top >= innerHeight) return false;
    for (let node: HTMLElement | null = card; node; node = node.parentElement) {
      const computed = getComputedStyle(node);
      if (computed.display === "none" || computed.visibility === "hidden" || computed.visibility === "collapse" || Number(computed.opacity) === 0) return false;
    }
    return true;
  }
  function size(state: CardState) {
    const computed = getComputedStyle(state.card);
    // Canvas fills the padding box, not the CSS3D projected screen bounding box.
    const w = state.card.clientWidth, h = state.card.clientHeight;
    // Six moving surfaces share a device with the scene lighting. Cap backing
    // storage rather than allocating six 2x full-size GPU render targets.
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.25);
    if (!w || !h) return false;
    if (w !== state.width || h !== state.height || dpr !== state.dpr) {
      state.width = w; state.height = h; state.dpr = dpr;
      const limit = device.limits.maxTextureDimension2D;
      const scale = Math.min(dpr, limit / w, limit / h);
      state.canvas!.width = Math.max(1, Math.round(w * scale));
      state.canvas!.height = Math.max(1, Math.round(h * scale));
      state.dirty = true;
    }
    state.values[0] = state.canvas!.width; state.values[1] = state.canvas!.height;
    state.values[8] = w; state.values[9] = h;
    [computed.borderTopLeftRadius, computed.borderTopRightRadius, computed.borderBottomRightRadius, computed.borderBottomLeftRadius].forEach((radius, i) => {
      const n = parseFloat(radius) || 0;
      state.values[12 + i] = radius.includes("%") ? Math.min(w, h) * n / 100 : n;
    });
    return true;
  }
  function draw(now: number) {
    frame = 0;
    if (disposed || failed) return;
    if (cancelled()) { dispose(); return; }
    if (document.hidden) { previousTime = 0; return; }
    const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.1) : 1 / 60;
    previousTime = now;
    const blend = motion.matches ? 1 : 1 - Math.exp(-10 * dt);
    let again = false;
    try {
      const encoder = device.createCommandEncoder({ label: "About foil frame" });
      let passes = 0;
      for (const state of states) {
        if (state.card.closest("canvas")) {
          // Native HTML-in-Canvas cannot be assumed to draw GPU descendants.
          if (!state.blocked) { state.blocked = true; fallback(state); }
          continue;
        }
        if (!canDraw(state) || !size(state)) continue;
        state.targetHover = state.pointerInside || state.focusInside ? 1 : 0;
        const tx = motion.matches ? 0 : clamp(state.pointerX) * 0.16 * state.targetHover;
        const ty = motion.matches ? 0 : -clamp(state.pointerY) * 0.12 * state.targetHover;
        state.tiltX += (tx - state.tiltX) * blend;
        state.tiltY += (ty - state.tiltY) * blend;
        state.hover += (state.targetHover - state.hover) * blend;
        if (state.targetHover > 0) {
          state.lightX += (state.pointerX - state.lightX) * blend;
          state.lightY += (state.pointerY - state.lightY) * blend;
        }
        const unsettled = Math.max(Math.abs(tx - state.tiltX), Math.abs(ty - state.tiltY), Math.abs(state.targetHover - state.hover),
          state.targetHover ? Math.abs(state.pointerX - state.lightX) : 0,
          state.targetHover ? Math.abs(state.pointerY - state.lightY) : 0) > 0.0001;
        if (state.dirty || unsettled) {
          state.values[2] = state.tiltX; state.values[3] = state.tiltY;
          state.values[4] = state.lightX; state.values[5] = state.lightY; state.values[6] = state.hover;
          device.queue.writeBuffer(state.buffer, 0, state.values);
          const pass = encoder.beginRenderPass({
            colorAttachments: [{ view: state.context.getCurrentTexture().createView(), loadOp: "clear", storeOp: "store", clearValue: { r: 0.062, g: 0.068, b: 0.078, a: 1 } }],
          });
          pass.setPipeline(pipeline); pass.setBindGroup(0, state.bindGroup);
          pass.draw(3); pass.end(); passes++;
          state.dirty = false;
          state.canvas!.style.visibility = "visible";
          state.card.dataset.holographic = "webgpu";
        }
        again ||= unsettled;
      }
      if (passes) device.queue.submit([encoder.finish()]);
    } catch (error) { fail(error); return; }
    if (again) wake(); else previousTime = 0;
  }

  let pipeline: GPUHandle;
  try {
    if (!states.length) return dispose;
    states.forEach(state => { style(state, "background", fallbackBackground); state.card.dataset.holographic = "loading"; });
    const gpu = (navigator as Navigator & { gpu?: GPUAccess }).gpu;
    if (!gpu) throw new Error("navigator.gpu is unavailable (secure context and WebGPU required)");
    const adapter = await gpu.requestAdapter({ powerPreference: "low-power" });
    if (cancelled()) { dispose(); return dispose; }
    if (!adapter) throw new Error("No WebGPU adapter");
    device = await adapter.requestDevice({ label: "About holographic cards" });
    if (cancelled()) { dispose(); return dispose; }
    void device.lost.then((info: { reason: string; message: string }) => {
      if (!disposed && !failed) fail(new Error(`WebGPU device lost (${info.reason}): ${info.message}`));
    }).catch(fail);
    listen(device, "uncapturederror", ((event: Event & { error?: unknown }) => fail(event.error ?? event)) as EventListener);
    const format = gpu.getPreferredCanvasFormat();
    device.pushErrorScope("validation");
    const module = device.createShaderModule({ code: holographicShader, label: "About graphite/etched foil WGSL" });
    try {
      const info = await module.getCompilationInfo();
      const errors = info.messages.filter((message: { type: string }) => message.type === "error");
      if (errors.length) throw new Error(errors.map((message: { lineNum: number; message: string }) => `${message.lineNum}: ${message.message}`).join("\n"));
      pipeline = await device.createRenderPipelineAsync({
        label: "About holographic material", layout: "auto",
        vertex: { module, entryPoint: "vs_main" },
        fragment: { module, entryPoint: "fs_main", targets: [{ format }] },
        primitive: { topology: "triangle-list" },
      });
    } finally {
      const error = await device.popErrorScope();
      if (error) throw new Error(error.message);
    }
    if (disposed || failed) return dispose;
    if (cancelled()) { dispose(); return dispose; }

    for (const state of states) {
      const { card } = state;
      if (card.closest("canvas")) { state.blocked = true; fallback(state); continue; }
      const computed = getComputedStyle(card);
      if (computed.position === "static") style(state, "position", "relative");
      style(state, "isolation", "isolate");
      const canvas = document.createElement("canvas");
      state.canvas = canvas;
      canvas.setAttribute("aria-hidden", "true");
      canvas.dataset.holographicCanvas = "";
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;z-index:-1;pointer-events:none;border-radius:inherit;visibility:hidden";
      const context = (canvas as HTMLCanvasElement & { getContext(id: "webgpu"): GPUHandle }).getContext("webgpu");
      if (!context) { fallback(state); continue; }
      state.context = context;
      context.configure({ device, format, alphaMode: "opaque" });
      // GPUBufferUsage.UNIFORM | COPY_DST; numeric bits avoid global GPU types.
      state.buffer = device.createBuffer({ label: "About card params (64 bytes)", size: 64, usage: 0x40 | 0x08 });
      state.bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: state.buffer } }] });
      card.prepend(canvas);
      const move = (event: PointerEvent) => {
        if (!event.isPrimary) return;
        const rect = card.getBoundingClientRect();
        // DOM rectangle UV -> the same +/-1 light coordinates as the source.
        state.pointerX = clamp((event.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1);
        state.pointerY = clamp((event.clientY - rect.top) / Math.max(1, rect.height) * 2 - 1);
        state.pointerInside = true; state.dirty = true; wake();
      };
      const leave = () => { state.pointerInside = false; state.dirty = true; wake(); };
      const up = (event: PointerEvent) => { if (event.pointerType !== "mouse") leave(); };
      const focus = () => { state.focusInside = card.contains(document.activeElement); state.dirty = true; wake(); };
      ["pointerenter", "pointermove", "pointerdown"].forEach(type => listen(card, type, move as EventListener, state.removers));
      ["pointerleave", "pointercancel"].forEach(type => listen(card, type, leave, state.removers));
      listen(card, "pointerup", up as EventListener, state.removers);
      listen(card, "focusin", focus, state.removers); listen(card, "focusout", focus, state.removers);
      // CSS3D scene may initially be outside the document while it is prepared.
      const rect = card.getBoundingClientRect();
      state.intersecting = rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
    }
    resize = new ResizeObserver(entries => {
      entries.forEach(entry => { const state = states.find(s => s.card === entry.target); if (state) state.dirty = true; }); wake();
    });
    intersection = new IntersectionObserver(entries => {
      entries.forEach(entry => { const state = states.find(s => s.card === entry.target); if (state) { state.intersecting = entry.isIntersecting; state.dirty = true; } }); wake();
    });
    // Scene writes data-focused / visibility during flight. Observe card and
    // ancestors only (not our canvas writes); coalesce all invalidation in RAF.
    mutation = new MutationObserver(records => {
      records.forEach(record => {
        const state = states.find(s => s.card === record.target);
        // CSS3D writes matrix/opacity each frame; these do not change material.
        if (state && record.attributeName === "data-focused") state.dirty = true;
      });
      wake();
    });
    const ancestors = new Set<HTMLElement>();
    states.forEach(state => {
      if (!state.canvas) return;
      resize!.observe(state.card); intersection!.observe(state.card);
      for (let node: HTMLElement | null = state.card; node; node = node.parentElement) ancestors.add(node);
    });
    ancestors.forEach(node => mutation!.observe(node, { attributes: true, attributeFilter: ["data-focused", "class", "style", "hidden", "aria-hidden", "inert"], childList: true }));
    const invalidate = () => { states.forEach(s => { s.dirty = true; }); wake(); };
    listen(window, "resize", invalidate); listen(window, "scroll", invalidate);
    listen(document, "scroll", invalidate); listen(motion, "change", invalidate);
    listen(document, "visibilitychange", () => {
      if (document.hidden) { if (frame) cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
      else invalidate();
    });
    wake();
  } catch (error) { fail(error); }
  return dispose;
}
