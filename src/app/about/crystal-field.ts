import * as THREE from "three";
import styles from "./about.module.css";
import { stations } from "./stations";

/** Procedural light only. DOM/native-canvas text is never sampled or recoloured. */
export function crystalField(host: HTMLElement, camera: THREE.PerspectiveCamera) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x050706, 0);
  renderer.domElement.className = styles.crystalLayer;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const guards = [new THREE.Vector4(4, 4, 5, 5), new THREE.Vector4(4, 4, 5, 5)];
  let guardsInitialized = false;
  let lastFrame = 0;
  const resolution = new THREE.Vector2(1, 1);
  const tubes: THREE.Mesh<THREE.TubeGeometry, THREE.ShaderMaterial>[] = [];
  // Four fine, uninterrupted filaments. Soft cylinder falloff, not polygonal halos.
  for (let strand = 0; strand < 4; strand++) {
    const side = strand % 2, spread = Math.floor(strand / 2) * 170;
    const points = [new THREE.Vector3(side ? 890 + spread : -820 - spread, side ? 450 : -420, 550),
      new THREE.Vector3(side ? 350 + spread : -500 - spread, side ? -390 : 380, -600),
      ...stations.flatMap((s, i) => [
        new THREE.Vector3(s.x + (side ? 720 + spread : -740 - spread), s.y + Math.sin(i * 1.8 + strand * .6) * 600, s.z + 730),
        new THREE.Vector3(s.x + (side ? -480 - spread : 510 + spread), s.y + (side ? 520 + spread : -530 - spread), s.z - 500),
      ]), new THREE.Vector3(-350, -4200, -13000)];
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    const material = new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, uniforms: { time: { value: 0 }, strength: { value: strand < 2 ? .82 : .46 }, guards: { value: guards }, resolution: { value: resolution } },
      vertexShader: `varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=-p.xyz;gl_Position=projectionMatrix*p;}`,
      fragmentShader: `varying vec2 vUv;varying vec3 vNormal;varying vec3 vView;uniform float time;uniform float strength;uniform vec4 guards[2];uniform vec2 resolution;void main(){vec2 p=gl_FragCoord.xy/resolution*2.-1.;float visible=1.;for(int i=0;i<2;i++){vec4 r=guards[i];vec2 d=max(r.xy-p,p-r.zw);float outside=max(d.x,d.y);visible*=smoothstep(-.025,.025,outside);}float flow=.75+.25*sin(vUv.x*25.-time*.65);float facing=max(0.,dot(normalize(vNormal),normalize(vView)));float soft=pow(facing,1.6)*smoothstep(0.,max(fwidth(facing)*1.5,.02),facing);gl_FragColor=vec4(.72,1.,.08,flow*strength*visible*soft);}`,
    });
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 520, strand < 2 ? 1.7 : 1.2, 12, false), material);
    tubes.push(tube); scene.add(tube);
    const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 520, strand < 2 ? 16 : 12, 16, false), material.clone());
    glow.material.uniforms.guards.value = guards; glow.material.uniforms.resolution.value = resolution;
    glow.material.uniforms.strength.value = .075; tubes.push(glow); scene.add(glow);
  }
  const geometry = new THREE.PlaneGeometry(1, 1);
  const rims: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  const dustGeometry = new THREE.BufferGeometry();
  const count = 180;
  const positions = new Float32Array(count * 3);
  const home = new Float32Array(count * 3);
  // Gentle drift continues without pointer input.
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.sin(i * 127.1 + 7) * .98;
    positions[i * 3 + 1] = Math.sin(i * 311.7 + 19) * .98;
    positions[i * 3 + 2] = 0;
  }
  home.set(positions);
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `void main(){gl_Position=vec4(position.xy,0.999,1.);gl_PointSize=1.5;}`,
    fragmentShader: `void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.75,.85,.65,(1.-smoothstep(.1,.5,d))*.3);}`,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial); dust.frustumCulled = false; dust.renderOrder = -1; scene.add(dust);
  const pointer = new THREE.Vector2(10, 10);
  let aspect = 1;
  function move(event: PointerEvent) {
    const rect = host.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
  }
  function leave() { pointer.set(10, 10); }
  host.addEventListener("pointermove", move, { passive: true }); host.addEventListener("pointerleave", leave);
  return {
    protect(regions: { position: THREE.Vector3; quaternion: THREE.Quaternion; width: number; height: number }[]) {
      const now = performance.now();
      const blend = guardsInitialized ? 1 - Math.exp(-Math.min(now - lastFrame, 50) / 155) : 1;
      lastFrame = now;
      guards.forEach((guard, index) => {
        const region = regions[index];
        if (!region) { guard.lerp(new THREE.Vector4(4, 4, 5, 5), blend); return; }
        let left = Infinity, bottom = Infinity, right = -Infinity, top = -Infinity;
        for (const x of [-1, 1]) for (const y of [-1, 1]) {
          const point = new THREE.Vector3(x * (region.width / 2 - 16), y * (region.height / 2 - 16), 0).applyQuaternion(region.quaternion).add(region.position).project(camera);
          left = Math.min(left, point.x); right = Math.max(right, point.x); bottom = Math.min(bottom, point.y); top = Math.max(top, point.y);
        }
        guard.lerp(new THREE.Vector4(left, bottom, right, top), blend);
      });
      guardsInitialized = true;
    },
    add() {
      const material = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { size: { value: new THREE.Vector2(1060, 650) }, time: { value: 0 }, fade: { value: 0 } },
        vertexShader: `varying vec2 uvCard;void main(){uvCard=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 uvCard; uniform vec2 size; uniform float time; uniform float fade;
          void main(){
            vec2 p=(uvCard-.5)*size;
            // Exact continuous rounded-box SDF: card radius 32 + plane padding 11.
            // No sinusoidal contour distortion, segmented borders or rainbow bands.
            vec2 q=abs(p)-(size*.5-vec2(43.));
            float d=length(max(q,0.))+min(max(q.x,q.y),0.)-43.;
            float aa=max(fwidth(d),.65);
            float edge=1.-smoothstep(.5-aa,1.5+aa,abs(d+11.));
            float bevel=exp(-abs(d+14.)*.22);
            float aura=exp(-abs(d+11.)*.12)*.025;
            vec2 normal=normalize(p/(size*.5)+vec2(.001));
            float incidence=pow(max(0.,dot(normal,normalize(vec2(-.8,.6)))),3.);
            float band=exp(-pow((p.x*.61+p.y+sin(time*.16)*190.)/70.,2.));
            float reflection=bevel*(.045+incidence*.16)+band*exp(-abs(d+11.)*.18)*.08;
            float narrow=exp(-pow((d+11.)/max(aa,1.),2.))*band;
            vec3 neutral=vec3(.84,.85,.86);
            vec3 prism=vec3(.83,.86,.91);
            vec3 light=mix(neutral,prism,narrow*.14);
            light=mix(light,vec3(.80,1.,.35),incidence*band*.20);
            float clip=1.-smoothstep(-aa,aa,d+1.);
            gl_FragColor=vec4(light,fade*(edge*.20+aura+reflection)*clip);
          }`,
      });
      const mesh = new THREE.Mesh(geometry, material); scene.add(mesh); rims.push(mesh); return mesh;
    },
    resize(w: number, h: number) { aspect = w / h; renderer.setSize(w, h); renderer.getDrawingBufferSize(resolution); },
    render(time: number) {
      let changed = false;
      for (let i = 0; i < count; i++) {
        const j = i * 3;
        const driftX = home[j] + Math.sin(time * .00009 + i * 1.7) * .025;
        const driftY = home[j + 1] + Math.sin(time * .00012 + i * 2.3) * .035;
        const dx = (driftX - pointer.x) * aspect, dy = driftY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - distance / .19);
        const tx = driftX + dx / Math.max(.025, distance) * force * .055 / aspect;
        const ty = driftY + dy / Math.max(.025, distance) * force * .055;
        if (Math.abs(positions[j] - tx) + Math.abs(positions[j + 1] - ty) > .00001) {
          positions[j] += (tx - positions[j]) * .16; positions[j + 1] += (ty - positions[j + 1]) * .16; changed = true;
        }
      }
      if (changed) dustGeometry.attributes.position.needsUpdate = true;
      rims.forEach(mesh => { mesh.material.uniforms.time.value = time / 1000; });
      tubes.forEach(mesh => { mesh.material.uniforms.time.value = time / 1000; });
      renderer.render(scene, camera);
    },
    dispose() {
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave);
      rims.forEach(mesh => mesh.material.dispose()); geometry.dispose(); dustGeometry.dispose(); dustMaterial.dispose();
      tubes.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); });
      renderer.dispose(); renderer.domElement.remove();
    },
  };
}
