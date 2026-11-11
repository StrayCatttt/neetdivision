import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { stations } from "./stations";
import { nativeCard, supportsNativeCards, type NativeSurface } from "./native-card";
import { crystalField } from "./crystal-field";
import { createHolographicCards } from "./holographic-cards";
import styles from "./about.module.css";

export type ScrollSceneController = {
  setProgress: (progress: number) => void;
  select: (index: number) => void;
  returnToTop: () => void;
  satellite: (open: boolean) => void;
  current: () => number;
  inSatellite: () => boolean;
  resize: (width: number, height: number) => void;
  stationProgress: (index: number) => number;
  isReading: (index: number) => boolean;
  dispose: () => void;
};
type Pose = { position: THREE.Vector3; quaternion: THREE.Quaternion; fov: number };
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const duration = 600;

export async function createScrollScene(host: HTMLElement, surfaces: HTMLElement[], cancelled: () => boolean, satellite?: HTMLElement): Promise<ScrollSceneController | null> {
  if (surfaces.length !== 6) return null;
  // Nested WebGPU surfaces stay DOM-backed during flight as well as reading.
  const native = false;
  // Resolve every used font before moving the original HTML into a new context.
  await Promise.allSettled(surfaces.flatMap(card => Array.from(card.querySelectorAll<HTMLElement>("h1,h2,h3,p"), node => {
    const font = getComputedStyle(node).font;
    return font ? document.fonts.load(font, node.textContent ?? "") : Promise.resolve([]);
  })));
  await document.fonts.ready;
  if (cancelled()) return null;
  const cards = satellite ? [...surfaces, satellite] : surfaces;
  const disposeHolographic = await createHolographicCards(cards.slice(1), cancelled);
  if (cancelled()) { disposeHolographic(); return null; }
  const renderer = new CSS3DRenderer(); renderer.domElement.className = styles.cssLayer;
  renderer.domElement.style.pointerEvents = "none";
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 1, 40000);
  const origins = cards.map(card => { const marker = document.createComment(`about:${card.id || "hero"}`); card.before(marker); return marker; });
  const nativeSurfaces: (NativeSurface | null)[] = [];
  const objects: CSS3DObject[] = [];
  const restRotations: THREE.Quaternion[] = [];
  const pointer = new THREE.Vector2();
  const tilt = new THREE.Vector2();
  let selecting = false;
  function pointerMove(event: PointerEvent) {
    // Fixed viewport reference, never the tilted card's changing bounding rect.
    const rect = host.getBoundingClientRect();
    pointer.set(THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1), THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1));
  }
  const pointerLeave = () => pointer.set(0, 0);
  const pointerDown = () => { selecting = true; };
  const pointerUp = () => { selecting = false; };
  let crystal: ReturnType<typeof crystalField> | null = null;
  const rims: ReturnType<ReturnType<typeof crystalField>["add"]>[] = [];
  let disposed = false, width = 1, height = 1, selected = 0, targetIndex = 0, frame = 0, started = 0, moving = false, initialized = false;
  let from: Pose, destination: Pose;
  let outgoing = -1;
  let outgoingTimer = 0;
  let homeFlight: { curve: THREE.CatmullRomCurve3; poses: Pose[]; duration: number } | null = null;
  try {
    // WebGL failure must not remove working CSS3D/native HTML.
    try { crystal = crystalField(host, camera); } catch (error) { console.warn("About crystal lighting unavailable; real HTML retained", error); }
    host.append(renderer.domElement);
    cards.forEach((card, index) => {
      const surface = native ? nativeCard(card, styles.nativeSurface) : null; nativeSurfaces.push(surface);
      const object = new CSS3DObject(surface?.element ?? card); object.element.style.pointerEvents = "auto";
      if (index > 0 && index < 6) {
        const station = stations[index - 1]; object.position.set(station.x, station.y, station.z); object.rotation.set(station.rx, station.ry, station.rz);
      } else if (index === 6) {
        // A local satellite beside the boss, not a seventh scroll destination.
        const boss = objects[5];
        object.quaternion.copy(boss.quaternion).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.08, -.22, .04)));
        object.position.copy(boss.position).add(new THREE.Vector3(1120, 100, -1450).applyQuaternion(boss.quaternion));
      }
      objects.push(object); scene.add(object);
      restRotations.push(object.quaternion.clone());
      // The graphite shader owns the rim; no former glass rim is overlaid.
    });
  } catch (error) { restore(); throw error; }
  function pose(index: number): Pose {
    const object = objects[index];
    const quaternion = restRotations[index].clone();
    const tangent = Math.tan(THREE.MathUtils.degToRad(42 / 2));
    const distance = index === 0 ? height / (2 * tangent) : Math.max(height, cards[index].offsetHeight / .84, cards[index].offsetWidth / (camera.aspect * (index === 5 ? .73 : .82))) / (2 * tangent);
    const offset = new THREE.Vector3(index === 5 ? 125 : 0, 0, distance).applyQuaternion(quaternion);
    return { position: object.position.clone().add(offset), quaternion, fov: 42 };
  }
  function syncRims() {
    objects.forEach((object, index) => {
      if (!index || !rims[index - 1]) return;
      const mesh = rims[index - 1]; const card = cards[index];
      mesh.position.copy(object.position).add(new THREE.Vector3(0, 0, -3).applyQuaternion(object.quaternion)); mesh.quaternion.copy(object.quaternion);
      mesh.scale.set(card.offsetWidth + 22, card.offsetHeight + 22, 1);
      mesh.material.uniforms.size.value.set(card.offsetWidth + 22, card.offsetHeight + 22);
    });
  }
  function prepare(index: number) {
    cards.forEach((card, i) => {
      const satelliteAvailable = i === 6 && (index === 5 || index === 6);
      card.inert = i !== index && !satelliteAvailable;
      card.dataset.focused = String(i === index);
      card.dataset.settled = "false";
      // Native HTML-in-Canvas during flight; the satellite remains DOM for capture.
      nativeSurfaces[i]?.setInteractive(satelliteAvailable || !moving || (i !== index && i !== outgoing));
      objects[i].element.style.pointerEvents = i === index || satelliteAvailable ? "auto" : "none";
    });
  }
  function settle() {
    clearTimeout(outgoingTimer);
    outgoing = -1;
    cards[targetIndex].dataset.settled = "true";
    nativeSurfaces.forEach(surface => surface?.setInteractive(true));
  }
  function cull(now: number) {
    const arrival = homeFlight ? THREE.MathUtils.smoothstep((now - started) / homeFlight.duration, .55, 1) : 1;
    objects.forEach((object, i) => {
      // Distant surfaces stay faintly present: physical depth, not a hard cut.
      // The boss/archive pair keeps its existing two-card disclosure.
      const background = i > 0 && i < 6 && targetIndex < 5 ? .16 : 0;
      const settledOpacity = i === targetIndex ? 1 : i === 6 && targetIndex === 5 ? .55 : background;
      const opacity = homeFlight ? (i === 0 ? THREE.MathUtils.smoothstep((now - started) / homeFlight.duration, 0, 1) : THREE.MathUtils.lerp(i === 6 ? 0 : .65, settledOpacity, arrival))
        : i === targetIndex ? 1 : i === 6 && targetIndex === 5 ? .55
        : moving && i === outgoing ? Math.max(background, 1 - (now - started) / duration) : background;
      object.visible = opacity > 0;
      object.element.style.opacity = String(opacity);
      object.element.style.visibility = object.visible ? "visible" : "hidden";
      if (i > 0 && rims[i - 1]) { rims[i - 1].visible = object.visible; rims[i - 1].material.uniforms.fade.value = opacity; }
    });
  }
  function retarget(index: number) {
    if (disposed || (targetIndex === index && initialized)) return;
    homeFlight = null;
    outgoing = targetIndex;
    targetIndex = index;
    if (index < 6) selected = index;
    from = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), fov: camera.fov };
    destination = pose(index); started = performance.now(); moving = true;
    host.dataset.station = index === 6 ? "archive" : index === 0 ? "hero" : stations[index - 1].id;
    prepare(index);
    cull(started);
    clearTimeout(outgoingTimer);
    outgoingTimer = window.setTimeout(() => { outgoing = -1; cull(performance.now()); }, duration);
    // In-flight retarget uses the current camera, never the former departure pose.
  }
  function tick(now: number) {
    if (disposed) return;
    if (initialized && moving) {
      const progress = Math.max(0, Math.min(1, (performance.now() - started) / (homeFlight?.duration ?? duration))), t = ease(progress);
      if (homeFlight) {
        camera.position.copy(homeFlight.curve.getPoint(t));
        const part = t * (homeFlight.poses.length - 1), index = Math.min(homeFlight.poses.length - 2, Math.floor(part));
        camera.quaternion.slerpQuaternions(homeFlight.poses[index].quaternion, homeFlight.poses[index + 1].quaternion, part - index);
      } else {
        camera.position.lerpVectors(from.position, destination.position, t); camera.quaternion.slerpQuaternions(from.quaternion, destination.quaternion, t);
      }
      camera.fov = THREE.MathUtils.lerp(from.fov, destination.fov, t); camera.updateProjectionMatrix();
      moving = progress < 1;
      if (!moving) { homeFlight = null; settle(); }
    }
    if (initialized) {
      cull(performance.now());
      const hold = selecting || !!window.getSelection()?.toString();
      // Freeze the whole card throughout mouse selection, including its first frame.
      if (!hold) tilt.lerp(moving ? new THREE.Vector2() : pointer, .09);
      objects.forEach((object, i) => {
        object.quaternion.copy(restRotations[i]);
        if (i === targetIndex && i > 0 && !moving) object.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-tilt.y * .027, tilt.x * .027, 0)));
      });
      syncRims();
      camera.updateMatrixWorld(); renderer.render(scene, camera);
      crystal?.protect((targetIndex === 5 && satellite ? [5, 6] : [targetIndex]).map(i => ({ position: objects[i].position, quaternion: objects[i].quaternion, width: cards[i].offsetWidth, height: cards[i].offsetHeight })));
      crystal?.render(now);
    }
    frame = requestAnimationFrame(tick);
  }
  const observer = new ResizeObserver(() => { if (initialized) { syncRims(); destination = pose(targetIndex); if (!moving) { camera.position.copy(destination.position); camera.quaternion.copy(destination.quaternion); } } });
  cards.forEach(card => observer.observe(card));
  host.addEventListener("pointermove", pointerMove, { passive: true });
  host.addEventListener("pointerleave", pointerLeave);
  host.addEventListener("pointerdown", pointerDown, true);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);
  frame = requestAnimationFrame(tick);
  function restore() {
    disposeHolographic();
    nativeSurfaces.forEach(surface => surface?.dispose()); scene.clear(); crystal?.dispose();
    cards.forEach((card, index) => {
      ["transform", "position", "pointer-events", "opacity", "visibility"].forEach(property => card.style.removeProperty(property));
      card.inert = false;
      delete card.dataset.focused;
      delete card.dataset.settled;
      origins[index]?.replaceWith(card);
    }); renderer.domElement.remove(); delete host.dataset.station;
  }
  return {
    setProgress(value) { if (homeFlight) return; const index = Math.round(Math.max(0, Math.min(1, value)) * 5); if (index !== selected) retarget(index); },
    select(index) { retarget(Math.max(0, Math.min(5, index))); },
    returnToTop() {
      if (!initialized || disposed) return;
      const departure = targetIndex;
      from = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), fov: camera.fov };
      const poses = [from];
      for (let i = Math.min(5, departure - 1); i >= 0; i--) poses.push(pose(i));
      if (poses.length < 2) { retarget(0); return; }
      destination = pose(0); targetIndex = 0; selected = 0; outgoing = -1;
      clearTimeout(outgoingTimer);
      homeFlight = { curve: new THREE.CatmullRomCurve3(poses.map(p => p.position), false, "centripetal"), poses, duration: Math.max(800, (poses.length - 1) * 420) };
      started = performance.now(); moving = true; host.dataset.station = "hero";
      prepare(0); cull(started);
    },
    satellite(open) { if (satellite) retarget(open ? 6 : 5); },
    current: () => selected, inSatellite: () => targetIndex === 6,
    resize(w, h) {
      width = Math.max(1, w); height = Math.max(1, h);
      host.style.setProperty("--hero-width", `${width}px`); host.style.setProperty("--hero-height", `${height}px`);
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); crystal?.resize(width, height); syncRims();
      destination = pose(targetIndex);
      if (!initialized) { camera.position.copy(destination.position); camera.quaternion.copy(destination.quaternion); prepare(0); settle(); initialized = true; host.dataset.station = "hero"; }
      else if (moving) { from = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), fov: camera.fov }; started = performance.now(); }
      else { camera.position.copy(destination.position); camera.quaternion.copy(destination.quaternion); }
      // Populate CSS3D synchronously; never paint an unframed enhancement frame.
      cull(performance.now()); camera.updateMatrixWorld(); renderer.render(scene, camera);
    },
    stationProgress(index) { return (Math.max(0, Math.min(4, index)) + 1) / 5; },
    isReading(index) { return targetIndex === index + 1; },
    dispose() { if (disposed) return; disposed = true; clearTimeout(outgoingTimer); cancelAnimationFrame(frame); observer.disconnect(); host.removeEventListener("pointermove", pointerMove); host.removeEventListener("pointerleave", pointerLeave); host.removeEventListener("pointerdown", pointerDown, true); window.removeEventListener("pointerup", pointerUp); window.removeEventListener("pointercancel", pointerUp); restore(); host.style.removeProperty("--hero-width"); host.style.removeProperty("--hero-height"); },
  };
}
