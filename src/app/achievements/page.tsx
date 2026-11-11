"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { achievementsData } from "@/data/achievements";

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function Achievements() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isJupiterLoaded, setIsJupiterLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxOrigin, setLightboxOrigin] = useState({ x: 0, y: 0 });
  const [lightboxExpanded, setLightboxExpanded] = useState(false);
  const requestRef = useRef<number>(0);
  const jupiterContainerRef = useRef<HTMLDivElement>(null);
  const jupiterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lightboxOpenRef = useRef(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const items = achievementsData;
  const n = items.length;

  // Fluid layout values — no hard breakpoints
  const w = windowSize.width;
  const h = windowSize.height;
  const isHorizontal = w >= 700;

  // Card geometry: 16:9 image-only card, centered column with breathing room
  const cardW = isHorizontal ? clamp(w * 0.34, 280, 540) : w * 0.74;
  const cardH = cardW * (9 / 16);
  const spacing = cardH * 1.26;

  // Jupiter geometry — same visual scale as the original ring design
  const baseRingR = isHorizontal ? Math.max(w * 0.6, 800) : Math.max(h * 0.6, 600);
  const ringR = baseRingR * ((n * 3) / 15);
  const originX = w / 2 - ringR;

  const titleSize = clamp(w * 0.028, 22, 40);

  // Card column centre — shifted right on wide screens, lower on mobile (text sits on top)
  const stripX = isHorizontal ? w * 0.6 : w / 2;
  const stripTop = isHorizontal ? "50%" : "58%";

  // Animation state — position `p` is unbounded so the strip loops forever
  const state = useRef({
    target: 0,
    current: 2,
    isAnimatingIntro: true,
    introStartTime: 0,
    introStart: 2,
    lastP: 2,
    jupiterAngle: 0,
    jupiterVelocity: 0,
    lastTime: 0,
    active: 0,
    lastInteraction: 0,
    lastAutoAdvance: 0
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isJupiterLoaded && windowSize.width > 0 && state.current.introStartTime === 0) {
      state.current.introStartTime = performance.now();
      state.current.target = 0;
      state.current.introStart = state.current.current;
    }
  }, [isJupiterLoaded, windowSize.width]);

  // --- Main render loop: looping card strip + Jupiter physics ---
  useEffect(() => {
    if (windowSize.width === 0) return;

    const renderLoop = (time: number) => {
      const s = state.current;

      if (s.isAnimatingIntro && s.introStartTime > 0) {
        const elapsed = time - s.introStartTime;
        const progress = Math.min(elapsed / 2000, 1);
        const ease = easeOutQuint(progress);
        s.current = s.introStart + (s.target - s.introStart) * ease;
        if (progress === 1) {
          s.isAnimatingIntro = false;
          s.lastInteraction = time; // auto-advance timer starts after the intro
        }
      } else if (!s.isAnimatingIntro) {
        s.current += (s.target - s.current) * 0.085;
      }

      const p = s.current;
      const nearest = ((Math.round(p) % n) + n) % n;
      if (nearest !== s.active) {
        s.active = nearest;
        setActiveIndex(nearest);
      }

      // --- Card strip transforms (infinite loop) ---
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        let offset = (i - p) % n;
        if (offset < -n / 2) offset += n;
        else if (offset > n / 2) offset -= n;
        const dist = Math.abs(offset);

        if (dist > 2.6) {
          el.style.opacity = "0";
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";

        const y = offset * spacing;
        const rot = Math.tanh(offset) * 8;
        const scale = 1 - clamp(dist, 0, 1) * 0.08;

        el.style.transform = `translate(-50%, -50%) translate3d(0, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = "1";
        el.style.zIndex = Math.round(100 - dist * 10).toString();
        el.style.pointerEvents = "auto";
        el.style.cursor = dist < 0.5 ? "pointer" : "pointer";
      }

      // --- Jupiter Physics (unchanged behaviour) ---
      const dp = p - s.lastP;
      s.lastP = p;

      if (!s.isAnimatingIntro) {
        s.jupiterVelocity -= dp * 0.12;
      }
      s.jupiterVelocity = clamp(s.jupiterVelocity, -0.15, 0.15);
      s.jupiterVelocity *= 0.992;

      if (!s.lastTime) s.lastTime = time;
      const deltaTime = time - s.lastTime;
      s.lastTime = time;

      const baseRotation = deltaTime * 0.0003;
      s.jupiterAngle += s.jupiterVelocity + baseRotation;

      if (jupiterContainerRef.current && jupiterRef.current) {
        jupiterContainerRef.current.style.width = `${ringR * 2}px`;
        jupiterContainerRef.current.style.height = `${ringR * 2}px`;
        jupiterContainerRef.current.style.left = `${originX}px`;
        jupiterRef.current.style.transform = `rotate(${s.jupiterAngle}deg)`;
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [windowSize, n, spacing, ringR, originX]);

  // --- Scroll / touch: 1 step = 1 card, loops forever ---
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      if (lightboxOpenRef.current) return;
      if (state.current.isAnimatingIntro) {
        state.current.isAnimatingIntro = false;
        state.current.target = Math.round(state.current.current);
      }

      accumulatedDelta += e.deltaY;
      state.current.lastInteraction = performance.now();
      const threshold = Math.abs(e.deltaY) >= 50 ? Math.abs(e.deltaY) : 40;

      if (Math.abs(accumulatedDelta) >= threshold) {
        const steps = Math.trunc(accumulatedDelta / threshold);
        accumulatedDelta -= steps * threshold;
        state.current.target += steps;
      }

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => { accumulatedDelta = 0; }, 150);
    };

    let touchStartY = 0;
    let touchMoved = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (lightboxOpenRef.current) return;
      if (state.current.isAnimatingIntro) {
        state.current.isAnimatingIntro = false;
        state.current.target = Math.round(state.current.current);
      }
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
      state.current.lastInteraction = performance.now();
    };

    const handleTouchMove = () => { touchMoved = true; };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchMoved || lightboxOpenRef.current) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 30) {
        state.current.target += diff > 0 ? 1 : -1;
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(wheelTimeout);
    };
  }, [n]);

  // --- Lightbox: circular reveal from the card centre, reverse on close ---
  useEffect(() => {
    lightboxOpenRef.current = lightboxIndex !== null;
    if (lightboxIndex === null) return;

    // expand right after mount
    const raf = requestAnimationFrame(() => setLightboxExpanded(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex]);

  const maxClipRadius = Math.hypot(
    Math.max(lightboxOrigin.x, w - lightboxOrigin.x),
    Math.max(lightboxOrigin.y, h - lightboxOrigin.y)
  ) + 40;

  const openLightbox = (idx: number) => {
    if (state.current.isAnimatingIntro) return;
    const el = cardRefs.current[idx];
    if (el && w > 0 && h > 0) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = Math.max(0, Math.min(h, r.top + r.height / 2));
      setLightboxOrigin({ x: cx, y: cy });
    } else {
      setLightboxOrigin({ x: w / 2, y: h / 2 });
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setLightboxExpanded(false);
    setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxExpanded(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setLightboxIndex(null);
      closeTimerRef.current = null;
    }, 780);
  };

  // Shortest-path jump to a card index (wraps around)
  const jumpToItem = (idx: number) => {
    if (state.current.isAnimatingIntro) return;
    state.current.lastInteraction = performance.now();
    const base = Math.round(state.current.target);
    let delta = ((idx - base) % n + n) % n;
    if (delta > n / 2) delta -= n;
    state.current.target += delta;
  };

  const handleCardClick = (idx: number) => {
    if (state.current.isAnimatingIntro) return;
    if (idx === state.current.active) {
      openLightbox(idx);
    } else {
      jumpToItem(idx);
    }
  };

  // --- Auto-advance: when idle, move to the next card every 6s (loops forever).
  //     Any user action (scroll / swipe / card click / dot nav) resets the
  //     6s countdown, so an auto-advance never lands right on top of a click.
  //     Paused during the intro and while the lightbox is open. ---
  useEffect(() => {
    const iv = setInterval(() => {
      const s = state.current;
      if (s.isAnimatingIntro || lightboxOpenRef.current) return;
      const last = Math.max(s.lastInteraction, s.lastAutoAdvance);
      if (!last || performance.now() - last < 6000) return;
      s.lastAutoAdvance = performance.now();
      s.target += 1;
    }, 500);
    return () => clearInterval(iv);
  }, []);

  // --- Lightweight canvas dust particles (dynamic ambience, near-zero cost) ---
  useEffect(() => {
    if (windowSize.width === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = windowSize.width * dpr;
    canvas.height = windowSize.height * dpr;

    const count = 70;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (Math.random() * 1.4 + 0.4) * dpr,
      vy: (Math.random() * 0.25 + 0.05) * dpr,
      vx: (Math.random() - 0.5) * 0.08 * dpr,
      a: Math.random() * 0.35 + 0.08,
      tw: Math.random() * Math.PI * 2,
      neon: Math.random() < 0.12
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const pt of particles) {
        pt.y -= pt.vy;
        pt.x += pt.vx;
        pt.tw += 0.02;
        if (pt.y < -10) { pt.y = canvas.height + 10; pt.x = Math.random() * canvas.width; }
        const alpha = pt.a * (0.6 + 0.4 * Math.sin(pt.tw));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = pt.neon ? `rgba(204,255,0,${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [windowSize]);

  const active = items[activeIndex];
  const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  // Preload every achievement image so the lightbox transition has zero delay
  useEffect(() => {
    items.forEach((it) => {
      const img = new window.Image();
      img.src = it.image;
    });
  }, [items]);

  return (
    <>
      {/* Loading Screen */}
      <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${isJupiterLoaded ? "opacity-0" : "opacity-100"}`}>
        <div className="text-white font-futura-bold tracking-[0.2em] animate-pulse">
          INITIALIZING...
        </div>
      </div>

      {/* Fullscreen lightbox — circular reveal from the clicked card's centre */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[60] bg-black"
          style={{
            clipPath: `circle(${lightboxExpanded ? maxClipRadius : 0}px at ${lightboxOrigin.x}px ${lightboxOrigin.y}px)`,
            transition: "clip-path 0.75s cubic-bezier(0.65, 0, 0.35, 1)",
            willChange: "clip-path"
          }}
          onClick={closeLightbox}
        >
          {/* Full image, fills the screen edge-to-edge (no margins) */}
          <Image
            src={lightboxItem.image}
            alt={lightboxItem.title}
            fill
            className="object-cover"
            unoptimized={true}
            priority
            onClick={(e) => e.stopPropagation()}
          />
          {/* Cinematic grade overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(15deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.25) 100%)"
          }} />

          {/* Info — bottom left (title + description + date) */}
          <div
            key={`lb-${lightboxIndex}`}
            className="absolute z-10 panel-anim-lb"
            style={{
              left: `${Math.max(w * 0.05, 20)}px`,
              bottom: `${Math.max(h * 0.12, 60)}px`,
              maxWidth: "560px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-title-jp text-white leading-[1.05]" style={{ fontSize: `${clamp(w * 0.055, 32, 72)}px` }}>
              {lightboxItem.title}
            </h2>
            <p className="font-body-jp text-gray-300 leading-[1.7] mt-4" style={{ fontSize: `${clamp(w * 0.013, 13, 16)}px` }}>
              {lightboxItem.description}
            </p>
            <span className="block font-body-jp text-gray-400 tracking-[0.25em] mt-4" style={{ fontSize: `${clamp(w * 0.011, 11, 14)}px` }}>
              {lightboxItem.date}
            </span>
          </div>

          {/* Close button — top right (neon green, black X, spin on hover) */}
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="lb-close absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur flex items-center justify-center transition-all duration-300"
          >
            <X size={22} />
          </button>

          {/* Link button — bottom right (uiverse.io OliverZeros style, site colours) */}
          <a
            href={lightboxItem.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="lb-button absolute z-20"
            style={{
              position: "absolute",
              right: `${Math.max(w * 0.04, 20)}px`,
              bottom: `${Math.max(h * 0.08, 40)}px`,
              height: `${clamp(w * 0.045, 52, 56)}px`,
              paddingLeft: `${clamp(w * 0.014, 24, 32)}px`,
              paddingRight: `${clamp(w * 0.014, 24, 32)}px`,
              fontSize: `${clamp(w * 0.011, 13, 19)}px`
            }}
          >
            <span className="lb-button-bg">
              <span className="lb-button-bg-layers">
                <span className="lb-button-bg-layer lb-button-bg-layer-1" />
                <span className="lb-button-bg-layer lb-button-bg-layer-2" />
                <span className="lb-button-bg-layer lb-button-bg-layer-3" />
              </span>
            </span>
            <span className="lb-button-inner">
              <span className="lb-button-inner-static">{lightboxItem.linkLabel}</span>
              <span className="lb-button-inner-hover">{lightboxItem.linkLabel}</span>
            </span>
          </a>
        </div>
      )}

      <div className="h-screen w-full bg-black overflow-hidden relative text-white select-none">
        <style>{`
          .panel-anim { animation: panelIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
          @keyframes panelIn {
            from { opacity: 0; transform: translateY(26px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .panel-anim-lb {
            opacity: 0;
            animation: panelInLb 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s forwards;
          }
          @keyframes panelInLb {
            from { opacity: 0; transform: translateY(26px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .ach-card { will-change: transform, opacity; }
          .ach-card .card-bg {
            background: transparent;
            border: none;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6);
            border-radius: 1rem;
            overflow: hidden;
          }

          /* Image zoom lives on the <img>, sway on the wrapper — so both can run together */
          .ach-card .ach-img {
            transform: scale(1.08);
            transition: transform 0.8s cubic-bezier(0.22,1,0.36,1);
          }
          /* Hover zoom: ONLY the front (active) card reacts */
          .ach-card.is-active:hover .ach-img { transform: scale(1.13); }

          /* Slow random drift — all directions, long and irregular.
             Active card only; keeps running while hovered/zoomed. */
          .ach-card.is-active .ach-sway {
            animation: achSway 16s ease-in-out infinite;
          }
          @keyframes achSway {
            0%   { transform: translate(0.8%, -0.6%); }
            14%  { transform: translate(-0.5%, 0.9%); }
            31%  { transform: translate(0.9%, 0.4%); }
            47%  { transform: translate(-0.9%, -0.8%); }
            63%  { transform: translate(0.3%, 1.0%); }
            81%  { transform: translate(-0.7%, -0.4%); }
            100% { transform: translate(0.8%, -0.6%); }
          }

          /* ===== Buttons (site palette: neon green × black only) ===== */
          .font-title-jp {
            font-family: var(--font-futura-bold), "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
            font-weight: 900;
          }
          .font-body-jp {
            font-family: var(--font-futura-light), "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
          }

          /* ===== Link button — default: solid neon green + black text.
             Hover: green→black→green→black layers ripple in (alternating),
             text flips to neon on black, whole button grows slightly. ===== */
          .lb-button {
            display: inline-flex;
            align-items: center;
            border-radius: 9999px;
            font-family: inherit;
            font-weight: 700;
            color: #000;
            letter-spacing: 0.12em;
            cursor: pointer;
            background-color: #CCFF00;
            animation: fadeOnly 0.5s ease 0.3s both;
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
          }
          .lb-button:hover {
            transform: scale(1.07);
            box-shadow: 0 0 28px rgba(204,255,0,0.4);
          }
          @keyframes fadeOnly {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .lb-button-inner,
          .lb-button-inner-hover,
          .lb-button-inner-static {
            pointer-events: none;
            display: block;
          }
          .lb-button-inner {
            position: relative;
            z-index: 2;
          }
          .lb-button-inner-hover {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            transform: translateY(70%);
            color: #000;
          }
          .lb-button-bg {
            overflow: hidden;
            border-radius: 9999px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: scale(1);
            transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
          }
          .lb-button-bg-layers {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -60%;
            aspect-ratio: 1 / 1;
            width: max(200%, 10rem);
          }
          .lb-button-bg-layer {
            border-radius: 9999px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform: scale(0);
          }
          .lb-button-bg-layer-1 { background-color: #CCFF00; }
          .lb-button-bg-layer-2 { background-color: #000000; }
          .lb-button-bg-layer-3 { background-color: #CCFF00; }

          .lb-button:hover .lb-button-inner-static {
            opacity: 0;
            transform: translateY(-70%);
            transition:
              transform 1.4s cubic-bezier(0.19, 1, 0.22, 1),
              opacity 0.3s linear;
          }
          .lb-button:hover .lb-button-inner-hover {
            opacity: 1;
            transform: translateY(0);
            transition:
              transform 1.4s cubic-bezier(0.19, 1, 0.22, 1),
              opacity 1.4s cubic-bezier(0.19, 1, 0.22, 1);
          }
          .lb-button:hover .lb-button-bg-layer {
            transition:
              transform 1.1s cubic-bezier(0.19, 1, 0.22, 1),
              opacity 0.3s linear;
          }
          .lb-button:hover .lb-button-bg-layer-1 { transform: scale(1); }
          .lb-button:hover .lb-button-bg-layer-2 {
            transition-delay: 0.12s;
            transform: scale(1);
          }
          .lb-button:hover .lb-button-bg-layer-3 {
            transition-delay: 0.24s;
            transform: scale(1);
          }

          /* ===== Close button — neon green fill, black X.
             Hover: grows slightly + the X does one decelerating spin. ===== */
          .lb-close {
            background-color: #CCFF00;
            border: none;
            color: #000;
          }
          .lb-close svg {
            transition: none;
          }
          .lb-close:hover {
            transform: scale(1.12);
            background-color: #CCFF00;
            border-color: #CCFF00;
            color: #000;
          }
          .lb-close:hover svg {
            animation: xSpin 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes xSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>

        {/* Canvas dust layer */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Fixed Background Title */}
        <h1 className="absolute top-[110px] right-12 text-6xl md:text-8xl font-futura-bold text-white opacity-20 tracking-[0.05em] text-right pointer-events-none z-10 italic">
          HISTORY
        </h1>

        {/* Jupiter Background (unchanged) */}
        <div
          ref={jupiterContainerRef}
          className="absolute top-1/2 z-0 pointer-events-none"
          style={{
            left: `${originX}px`,
            transform: `translate(-50%, -50%)`,
            width: `${ringR * 2}px`,
            height: `${ringR * 2}px`,
          }}
        >
          <div ref={jupiterRef} className="absolute inset-0 will-change-transform opacity-90">
            <Image
              src="/images/Jupiter.webp"
              alt="Jupiter"
              fill
              className="object-contain mix-blend-screen"
              priority
              unoptimized={true}
              quality={100}
              onLoad={() => setIsJupiterLoaded(true)}
            />
          </div>
          <div
            className="absolute inset-0 rounded-full z-10"
            style={{
              background: 'radial-gradient(ellipse 100% 85% at 0% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.8) 65%, transparent 78%, transparent 100%)'
            }}
          />
        </div>

        {/* Readability scrims (behind cards, over Jupiter) */}
        {isHorizontal ? (
          <div className="absolute top-0 bottom-0 left-0 z-[6] pointer-events-none" style={{
            width: "46%",
            background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)"
          }} />
        ) : (
          <div className="absolute top-0 left-0 right-0 z-[6] pointer-events-none" style={{
            height: "40%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)"
          }} />
        )}

        {/* Card strip */}
        <div className="absolute inset-0 z-20">
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className={`ach-card absolute ${index === activeIndex ? "is-active" : ""}`}
              style={{
                left: `${stripX}px`,
                top: stripTop,
                width: `${cardW}px`,
                height: `${cardH}px`,
                opacity: 0,
                transform: "translate(-50%, -50%)"
              }}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-bg w-full h-full relative">
                <div className="ach-sway absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="ach-img object-cover"
                    sizes={`${cardW}px`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left panel: title (vertically centered) → description → date */}
        <div
          key={`panel-${activeIndex}`}
          className="absolute z-30"
          style={
            isHorizontal
              ? {
                  left: `${Math.max(w * 0.05, 24)}px`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: `${clamp(w * 0.26, 280, 460)}px`
                }
              : {
                  left: `${Math.max(w * 0.05, 16)}px`,
                  top: "104px",
                  width: `${w * 0.78}px`,
                  textShadow: "0 1px 12px rgba(0,0,0,0.8)"
                }
          }
        >
          {/* spacer that puts the title line at the vertical centre */}
          {isHorizontal && <div style={{ height: `${titleSize * 0.55}px` }} />}
          <h2 className="font-title-jp text-white leading-[1.1]" style={{ fontSize: `${titleSize}px` }}>
            {active.title}
          </h2>
          <p
            className="font-body-jp text-gray-300 leading-[1.65] mt-3"
            style={{
              fontSize: `${clamp(w * 0.012, 13, 15)}px`,
              display: "-webkit-box",
              WebkitLineClamp: isHorizontal ? 4 : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {active.description}
          </p>
          <span className="block font-body-jp text-gray-500 tracking-[0.25em] mt-4" style={{ fontSize: `${clamp(w * 0.0095, 10, 13)}px` }}>
            {active.date}
          </span>
        </div>

        {/* Counter (Bottom Left — unchanged) */}
        <div className="absolute z-30 flex items-end gap-2 overflow-hidden" style={{
          bottom: `${Math.max(w * 0.02, 16)}px`,
          left: `${Math.max(w * 0.02, 16)}px`
        }}>
          <div className="relative h-[30px] w-[30px]">
            {items.map((_, idx) => (
              <span
                key={idx}
                className={`absolute bottom-0 left-0 font-futura-bold text-2xl transition-all duration-500 ${
                  activeIndex === idx ? "translate-y-0 opacity-100 text-white" : "translate-y-full opacity-0 text-gray-600"
                }`}
              >
                {(idx + 1).toString().padStart(2, "0")}
              </span>
            ))}
          </div>
          <span className="font-futura-light text-lg text-gray-600 mb-[2px]">/ {n.toString().padStart(2, "0")}</span>
        </div>

        {/* Dot Indicators (Right Edge — vertically centered) */}
        <div className="absolute top-1/2 z-30 flex flex-col" style={{
          transform: 'translateY(-50%)',
          right: `${Math.max(w * 0.015, 8)}px`,
          gap: `${Math.max(w * 0.005, 6)}px`
        }}>
          {items.map((_, idx) => {
            const isDotActive = activeIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => jumpToItem(idx)}
                className="group py-2 px-4 flex justify-end"
                aria-label={`Go to item ${idx + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isDotActive
                      ? "w-2 h-2 bg-white"
                      : "w-1.5 h-1.5 bg-gray-500 opacity-30 group-hover:opacity-100 group-hover:scale-125"
                  }`}
                />
              </button>
            );
          })}
        </div>

      </div>
    </>
  );
}