"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { achievementsData } from "@/data/achievements";

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export default function Achievements() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const requestRef = useRef<number>(0);
  const jupiterContainerRef = useRef<HTMLDivElement>(null);
  const jupiterRef = useRef<HTMLDivElement>(null);
  
  const displayItems = [...achievementsData, ...achievementsData, ...achievementsData];
  const totalItems = displayItems.length;
  const originalCount = achievementsData.length;
  const anglePerItem = 360 / totalItems;

  // Fluid layout values — no hard breakpoints
  const w = windowSize.width;
  const h = windowSize.height;
  const isHorizontal = w >= 700;
  const cardW = Math.min(w * 0.82, 1120);
  
  // Base radius matches original design, scaled by item count to keep spacing constant
  const baseRingR = isHorizontal ? Math.max(w * 0.6, 800) : Math.max(h * 0.6, 600);
  const ringR = baseRingR * (totalItems / 15);
  const originX = w / 2 - ringR;
  const cardMarginLeft = -cardW / 2;
  // Card height estimate: horizontal = (cardW/2)*9/16, vertical = cardW*9/16 + text
  const cardH = isHorizontal ? (cardW / 2) * (9 / 16) : cardW * (9 / 16) + 120;
  const cardMarginTop = -cardH / 2;

  // Animation state
  const state = useRef({
    targetAngle: 2 * anglePerItem, // Start at index 2 (Older)
    currentAngle: 2 * anglePerItem,
    isAnimatingIntro: true,
    introStartTime: 0,
    introStartAngle: 2 * anglePerItem,
    lastAngle: 2 * anglePerItem,
    jupiterAngle: 0,
    jupiterVelocity: 0,
    lastTime: 0
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);

    // Intro trigger - Start immediately
    state.current.introStartTime = performance.now();
    state.current.targetAngle = 0; // Newest (index 0)
    state.current.introStartAngle = state.current.currentAngle;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowSize.width === 0) return;

    const renderLoop = (time: number) => {
      const s = state.current;
      
      if (s.isAnimatingIntro && s.introStartTime > 0) {
        const elapsed = time - s.introStartTime;
        const progress = Math.min(elapsed / 2000, 1);
        const ease = easeOutQuint(progress);
        
        s.currentAngle = s.introStartAngle + (s.targetAngle - s.introStartAngle) * ease;
        
        if (progress === 1) {
          s.isAnimatingIntro = false;
        }
      } else if (!s.isAnimatingIntro) {
        s.currentAngle += (s.targetAngle - s.currentAngle) * 0.08;
      }

      // Determine active index
      let normalizedAngle = ((s.currentAngle % 360) + 360) % 360;
      let closestIdx = Math.round(normalizedAngle / anglePerItem) % totalItems;
      setActiveIndex(closestIdx);

      // Apply transforms
      displayItems.forEach((_, idx) => {
        const el = document.getElementById(`ach-card-${idx}`);
        if (el) {
          // Calculate theta. 
          let theta = idx * anglePerItem - s.currentAngle;
          let normTheta = ((theta % 360) + 360) % 360;
          if (normTheta > 180) normTheta -= 360;

          const dist = Math.abs(normTheta);
          const ratio = dist / anglePerItem;

          let opacity = 0;
          let scale = 0.8;
          let pointerEvents = "none";

          // Make adjacent items visible by adjusting opacity and scale mapping
          if (ratio <= 1) {
            opacity = 1 - (ratio * 0.5); // 1 to 0.5
            scale = 1 - (ratio * 0.1);   // 1 to 0.9
          } else if (ratio <= 2) {
            const extra = ratio - 1;
            opacity = 0.5 * (1 - extra); // 0.5 to 0
            scale = 0.9 - (extra * 0.1); // 0.9 to 0.8
          }
          
          if (dist < anglePerItem / 2) {
             pointerEvents = "auto";
          }

          // Use precomputed radius
          el.style.transform = `rotate(${theta}deg) translateX(${ringR}px) rotate(${-theta}deg)`;
          el.style.opacity = opacity.toString();
          el.style.pointerEvents = pointerEvents as any;
          el.style.zIndex = Math.round(100 - dist).toString();
          
          const inner = el.querySelector('.ach-inner') as HTMLElement;
          if (inner) {
             inner.style.transform = `scale(${scale})`;
          }
        }
      });

      // --- Jupiter Physics ---
      const ringSpeed = s.currentAngle - (s.lastAngle || s.currentAngle);
      s.lastAngle = s.currentAngle;

      if (!s.isAnimatingIntro) {
        // リングの回転方向（CSSのrotate）と一致させるためにマイナスを使用
        // 回転速度をもっとはっきり遅くするため、0.0025 -> 0.0005 に極限まで減らす
        s.jupiterVelocity -= ringSpeed * 0.0005;
      }
      
      // 最高速度を制限（最高速度も 0.075 -> 0.02 に劇的に下げる）
      s.jupiterVelocity = Math.max(-0.02, Math.min(0.02, s.jupiterVelocity));
      
      // 摩擦でゆっくり止まる（0.98 -> 0.992 に変更して余韻を長くする）
      s.jupiterVelocity *= 0.992;
      
      // フレームレートに依存せず、正確に「5分(300秒)で1回転」させるための時間差分計算
      if (!s.lastTime) s.lastTime = time;
      const deltaTime = time - s.lastTime;
      s.lastTime = time;

      // 360度 / 1,200,000ms(20分) = 0.0003度/ms (ベース速度も半分に)
      const baseRotation = deltaTime * 0.0003;
      s.jupiterAngle += s.jupiterVelocity + baseRotation;

      if (jupiterContainerRef.current && jupiterRef.current) {
        // コンテナ（影含む）の位置・サイズを更新
        jupiterContainerRef.current.style.width = `${ringR * 2}px`;
        jupiterContainerRef.current.style.height = `${ringR * 2}px`;
        jupiterContainerRef.current.style.left = `${originX}px`;
        
        // 木星本体のみを回転させる（影は固定）
        jupiterRef.current.style.transform = `rotate(${s.jupiterAngle}deg)`;
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [totalItems, anglePerItem, windowSize, ringR, originX]);

  // Event Listeners
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      if (state.current.isAnimatingIntro) {
        state.current.isAnimatingIntro = false;
        state.current.targetAngle = Math.round(state.current.currentAngle / anglePerItem) * anglePerItem;
      }
      
      accumulatedDelta += e.deltaY;
      
      // Mouse wheels usually fire events with deltaY >= 50 (e.g. 100 or 120 per notch).
      // Trackpads fire many small events (e.g. 2, 5, 12).
      const threshold = Math.abs(e.deltaY) >= 50 ? Math.abs(e.deltaY) : 40;

      if (Math.abs(accumulatedDelta) >= threshold) {
        const steps = Math.trunc(accumulatedDelta / threshold);
        accumulatedDelta -= steps * threshold;
        
        // steps is positive if scrolling down -> increase angle to flow bottom to top
        state.current.targetAngle += steps * anglePerItem;
      }

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => { accumulatedDelta = 0; }, 150);
    };

    let touchStartY = 0;
    let touchMoved = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (state.current.isAnimatingIntro) {
        state.current.isAnimatingIntro = false;
        state.current.targetAngle = Math.round(state.current.currentAngle / anglePerItem) * anglePerItem;
      }
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchMoved = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchMoved) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) > 30) {
         // diff > 0 means swipe UP (scrolling down). targetAngle increases to flow bottom to top.
         const direction = diff > 0 ? 1 : -1;
         state.current.targetAngle += direction * anglePerItem;
      }
    };

    // Attach passive: false only to the container that needs it to prevent scroll if needed
    // But since the whole page is overflow-hidden, we can just attach to window
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
  }, [anglePerItem]);

  const jumpToItem = (idx: number) => {
    if (state.current.isAnimatingIntro) return;
    
    let currentNorm = ((state.current.targetAngle % 360) + 360) % 360;
    let targetNorm = idx * anglePerItem;
    
    let diff = targetNorm - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    state.current.targetAngle += diff;
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative text-white select-none">
      <style>{`
        .card-bg {
          background: rgba(18, 18, 18, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .ach-card:hover .card-bg {
          border-color: #CCFF00;
          box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
        }
        .ach-img {
          transition: transform 0.7s ease;
        }
        .link-btn {
          border-bottom: 1px solid rgba(255,255,255,0.3);
          transition: all 0.3s ease;
        }
        .ach-card:hover .link-btn {
          border-bottom-color: #CCFF00;
        }
        .ach-card:hover .link-arrow {
          transform: translateX(4px);
        }
        .ach-inner {
          transition: transform 0.1s linear;
        }
      `}</style>

      {/* Fixed Background Title */}
      <h1 className="absolute top-[120px] right-12 text-7xl md:text-9xl font-heading font-bold text-white opacity-30 tracking-[0.05em] text-right pointer-events-none z-10 italic">
        HISTORY
      </h1>

      {/* Jupiter Background */}
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
        {/* Rotating Jupiter */}
        <div ref={jupiterRef} className="absolute inset-0 will-change-transform opacity-90">
          <Image 
            src="/images/Jupiter.webp" 
            alt="Jupiter" 
            fill 
            className="object-contain mix-blend-screen"
            priority
            unoptimized={true}
            quality={100}
          />
        </div>
        
        {/* Static Planetary Shadow */}
        <div 
          className="absolute inset-0 rounded-full z-10"
          style={{
            // カーブをさらに急にするため、縦の引き伸ばしを 105% から 20% 縮小して 85% に設定
            background: 'radial-gradient(ellipse 100% 85% at 0% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.8) 65%, transparent 78%, transparent 100%)'
          }}
        />
      </div>

      {/* Ring Container Center */}
      <div className="absolute top-1/2 left-0 z-20 w-0 h-0" style={{ 
        transform: `translate(${originX}px, -50%)`
      }}>
        {displayItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            id={`ach-card-${index}`}
            className="ach-card absolute top-0 left-0 origin-center transition-opacity duration-[50ms]"
            style={{ 
              opacity: 0,
              marginTop: `${cardMarginTop}px`,
              marginLeft: `${cardMarginLeft}px`,
            }}
          >
            <div 
              className="ach-inner card-bg rounded-xl overflow-hidden shadow-2xl flex" 
              style={{ 
                width: `${cardW}px`,
                flexDirection: isHorizontal ? 'row' : 'column'
              }}
            >
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex w-full h-full group" style={{ flexDirection: isHorizontal ? 'row' : 'column' }}>
                {/* Image Section */}
                <div className="relative overflow-hidden bg-zinc-900 shrink-0" style={{ 
                  width: isHorizontal ? `${cardW / 2}px` : '100%',
                  aspectRatio: '16/9'
                }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="ach-img object-cover"
                  />
                </div>
                {/* Text Section */}
                <div className="flex flex-col justify-between" style={{ 
                  width: isHorizontal ? `${cardW / 2}px` : '100%',
                  padding: `${Math.max(w * 0.015, 12)}px ${Math.max(w * 0.02, 16)}px`
                }}>
                  <div>
                    <span className="block font-futura-light text-sm tracking-[0.2em] text-gray-500 uppercase mb-2">
                      {item.date}
                    </span>
                    <h3 className="font-futura-bold text-white group-hover:text-neon group-hover:drop-shadow-[0_0_8px_rgba(204,255,0,0.25)] transition-all duration-300 tracking-[0.02em] leading-[1.2]" style={{
                      fontSize: `${Math.max(Math.min(w * 0.022, 36), 18)}px`,
                      marginBottom: `${Math.max(w * 0.008, 8)}px`
                    }}>
                      {item.title}
                    </h3>
                    <p className="font-futura-light text-gray-400 leading-[1.6]" style={{
                      fontSize: `${Math.max(Math.min(w * 0.012, 16), 13)}px`,
                      WebkitLineClamp: isHorizontal ? 4 : 2,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: `${Math.max(w * 0.01, 8)}px`
                    }}>
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start link-btn pb-1 mt-auto group-hover:text-neon">
                    <span className="font-futura-bold tracking-[0.15em] transition-colors duration-300" style={{
                      fontSize: `${Math.max(Math.min(w * 0.01, 14), 11)}px`
                    }}>
                      {item.linkLabel}
                    </span>
                    <ArrowRight size={14} className="link-arrow transition-transform duration-300" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Counter (Bottom Left) */}
      <div className="absolute z-30 flex items-end gap-2 overflow-hidden" style={{
        bottom: `${Math.max(w * 0.02, 16)}px`,
        left: `${Math.max(w * 0.02, 16)}px`
      }}>
        <div className="relative h-[30px] w-[30px]">
          {achievementsData.map((_, idx) => (
            <span
              key={idx}
              className={`absolute bottom-0 left-0 font-futura-bold text-2xl transition-all duration-500 ${
                (activeIndex % originalCount) === idx ? "translate-y-0 opacity-100 text-white" : "translate-y-full opacity-0 text-gray-600"
              }`}
            >
              {(idx + 1).toString().padStart(2, '0')}
            </span>
          ))}
        </div>
        <span className="font-futura-light text-lg text-gray-600 mb-[2px]">/ {originalCount.toString().padStart(2, '0')}</span>
      </div>

      {/* Dot Indicators (Right Edge) */}
      <div className="absolute top-1/2 z-30 flex flex-col" style={{ 
        transform: 'translateY(-50%)',
        right: `${Math.max(w * 0.015, 8)}px`,
        gap: `${Math.max(w * 0.005, 6)}px`
      }}>
        {achievementsData.map((_, idx) => {
          // Determine if this original index is currently active.
          // activeIndex maps from 0 to 14. We want to know if activeIndex % 5 == idx.
          const isDotActive = (activeIndex % originalCount) === idx;
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
  );
}
