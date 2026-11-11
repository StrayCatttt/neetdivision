"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { ScrollSceneController } from "./scroll-scene";
import styles from "./about.module.css";

/** Server HTML is the default. Enhancement moves, never clones, its real surfaces. */
export default function AboutStage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current!;
    const viewport = host.current!;
    const content = flow.current!;
    const previousScene = document.documentElement.getAttribute("data-about-scene");
    document.documentElement.setAttribute("data-about-scene", "");
    const eligible = window.matchMedia("(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference) and (pointer: fine)");
    let controller: ScrollSceneController | null = null;
    let cancelled = false;
    let generation = 0;
    let frame = 0;
    let active = false;
    let start = 0;
    let distance = 1;
    let idle = 0;
    let lastY = window.scrollY;
    let delta = 0;
    let gestureAt = -Infinity;
    let gestureDirection = 0;
    let deltaDirection = 0;
    let lastWheel = 0;
    let gestureReady = true;
    let pointerActive = false;
    const pointerDown = () => { pointerActive = true; };
    const pointerUp = () => { pointerActive = false; };
    const progress = () => Math.max(0, Math.min(1, (window.scrollY - start) / distance));
    function draw() { frame = 0; controller?.setProgress(progress()); }
    function sceneActive() {
      return active && window.scrollY >= start - 2 && window.scrollY <= start + distance + 2;
    }
    function archiveScroll(target: EventTarget | null) {
      const region = target instanceof Element ? target.closest<HTMLElement>("[data-archive-panel]") : null;
      return !!region && region.scrollHeight > region.clientHeight + 1;
    }
    function scroll() {
      if (!controller) return;
      if (controller.inSatellite() && Math.abs(window.scrollY - lastY) > 2) {
        go(window.scrollY < lastY ? 4 : 5);
        return;
      }
      lastY = window.scrollY;
      if (!frame) frame = requestAnimationFrame(draw);
      clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (sceneActive() && controller && !controller.inSatellite()) {
          window.scrollTo({ top: start + controller.current() / 5 * distance, behavior: "instant" });
        }
      }, 160);
    }
    function go(index: number) {
      if (!controller) return;
      controller.select(index);
      window.scrollTo({ top: start + index / 5 * distance, behavior: "instant" });
      lastY = window.scrollY;
    }
    function wheel(event: WheelEvent) {
      if (!controller || !sceneActive() || archiveScroll(event.target) || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const amount = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1);
      if (!amount) return;
      const direction = Math.sign(amount), now = performance.now(), index = controller.current();
      const gap = now - lastWheel; lastWheel = now;
      if (gap > 180) gestureReady = true;
      // At the outer ends the page remains normally scrollable.
      if (!controller.inSatellite() && ((index === 0 && direction < 0) || (index === 5 && direction > 0))) {
        // Do not let the tail of the arriving gesture throw the user out of About.
        if (direction === gestureDirection && (now - gestureAt < 500 || gap < 180)) event.preventDefault();
        return;
      }
      event.preventDefault();
      const reverse = direction !== gestureDirection;
      if (direction !== deltaDirection || gap > 180) delta = 0;
      deltaDirection = direction;
      delta += amount;
      if (Math.abs(delta) < 36) return;
      if (!reverse && (now - gestureAt < 500 || !gestureReady)) return;
      gestureAt = now; gestureDirection = direction; delta = 0; gestureReady = false;
      if (controller.inSatellite()) go(direction > 0 ? 5 : 4);
      else go(Math.max(0, Math.min(5, index + direction)));
    }
    function key(event: KeyboardEvent) {
      if (!controller || !sceneActive() || event.defaultPrevented || archiveScroll(event.target) || event.altKey || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input,textarea,select,[contenteditable=true]") || (event.key === " " && target.closest("button,a,summary"))) return;
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key) ? (event.shiftKey ? -1 : 1) : ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 0;
      if (!direction && event.key !== "Home" && event.key !== "End") return;
      const index = controller.inSatellite() ? (direction < 0 ? 4 : 5) : Math.max(0, Math.min(5, controller.current() + direction));
      if (direction && !controller.inSatellite() && index === controller.current()) return;
      event.preventDefault();
      if (!event.repeat) go(event.key === "Home" ? 0 : event.key === "End" ? 5 : index);
    }
    function navigate(event: Event) {
      if (!controller) return;
      controller.satellite((event as CustomEvent<string>).detail === "archive");
    }
    function returnToTop(event: Event) {
      if (!controller || !active) return;
      event.preventDefault();
      clearTimeout(idle);
      controller.returnToTop();
      // Camera owns the return flight; browser smooth scrolling must not retarget it.
      window.scrollTo({ top: 0, behavior: "instant" });
      lastY = window.scrollY;
    }
    function measure() {
      if (!active) return;
      start = window.scrollY + element.getBoundingClientRect().top;
      distance = Math.max(1, element.offsetHeight - viewport.offsetHeight);
      controller?.resize(viewport.clientWidth, viewport.clientHeight);
      draw();
    }
    function stop() {
      generation++;
      clearTimeout(idle);
      controller?.dispose(); controller = null;
      active = false;
      delete element.dataset.scene;
      element.style.removeProperty("--journey-height");
    }
    async function enhance() {
      if (!eligible.matches) { stop(); return; }
      if (controller) return;
      const token = ++generation;
      try {
        const { createScrollScene } = await import("./scroll-scene");
        if (cancelled || token !== generation || !eligible.matches) return;
        const scene = await createScrollScene(viewport, Array.from(content.querySelectorAll<HTMLElement>("[data-surface]")), () => cancelled || token !== generation, content.querySelector<HTMLElement>("[data-satellite]") ?? undefined);
        if (!scene) return;
        if (cancelled || token !== generation) { scene.dispose(); return; }
        controller = scene;
        active = true;
        // Six discrete reading positions; no overview or intermediate camera stops.
        element.style.setProperty("--journey-height", "600svh");
        element.dataset.scene = "true";
        measure();
        if (window.location.hash) focusHash();
      } catch (error) {
        stop();
        console.warn("About scene kept in document flow", error);
      }
    }
    function visit(index: number) {
      if (!controller) return;
      go(index + 1);
    }
    function focusHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id === "original-site" && controller) { go(5); controller.satellite(true); return; }
      const surfaces = Array.from(content.querySelectorAll<HTMLElement>("[data-surface]"));
      // Enhanced surfaces live in the stage, not in the original flow container.
      const station = Array.from(viewport.querySelectorAll<HTMLElement>("[data-surface]")).concat(surfaces).find(node => node.id === id);
      const index = ["division", "flex", "scrim", "events", "boss"].indexOf(station?.dataset.surface ?? "");
      if (index >= 0) visit(index);
    }
    function focus(event: FocusEvent) {
      if (!controller || pointerActive) return;
      const surface = (event.target as Element).closest<HTMLElement>("[data-surface]");
      if ((event.target as Element).closest("[data-satellite]")) { controller.satellite(true); return; }
      const index = ["division", "flex", "scrim", "events", "boss"].indexOf(surface?.dataset.surface ?? "");
      if (index >= 0 && !controller.isReading(index)) visit(index);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("hashchange", focusHash);
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    window.addEventListener("about:navigate", navigate);
    window.addEventListener("site:return-to-top", returnToTop);
    element.addEventListener("focusin", focus);
    element.addEventListener("pointerdown", pointerDown, true);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);
    eligible.addEventListener("change", enhance);
    // No blank loading state; ordinary HTML stays visible throughout import/canary.
    void enhance();
    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(idle);
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("hashchange", focusHash);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
      window.removeEventListener("about:navigate", navigate);
      window.removeEventListener("site:return-to-top", returnToTop);
      element.removeEventListener("focusin", focus);
      element.removeEventListener("pointerdown", pointerDown, true);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
      eligible.removeEventListener("change", enhance);
      stop();
      if (previousScene === null) document.documentElement.removeAttribute("data-about-scene");
      else document.documentElement.setAttribute("data-about-scene", previousScene);
    };
  }, []);
  return <main ref={root} className={styles.about}>
    <div ref={host} className={styles.stage} />
    <div ref={flow} className={styles.flow}>{children}</div>
  </main>;
}
