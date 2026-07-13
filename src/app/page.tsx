"use client";
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for animation
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const opacityRef = useRef({ current: 0, target: 0 });
  const isHoverSupported = useRef(true);
  const animationFrameRef = useRef<number | null>(null);
  const imagesRef = useRef<{ base?: HTMLImageElement, reveal?: HTMLImageElement }>({});

  useEffect(() => {
    // Check if hover is supported
    isHoverSupported.current = window.matchMedia('(hover: hover)').matches;

    // Load images
    let loadedCount = 0;
    
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setIsImagesLoaded(true);
      }
    };

    const baseImg = new Image();
    baseImg.src = "/images/home-base.webp";
    baseImg.onload = checkLoaded;
    baseImg.onerror = checkLoaded; // Fallback in case of error

    const revealImg = new Image();
    revealImg.src = "/images/home-reveal.webp";
    revealImg.onload = checkLoaded;
    revealImg.onerror = checkLoaded;

    imagesRef.current = { base: baseImg, reveal: revealImg };
  }, []);

  useEffect(() => {
    if (!isImagesLoaded || !isHoverSupported.current || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Initial mouse pos at center to prevent jumping from corner
    mouseRef.current = { 
      x: width / 2, y: height / 2, 
      targetX: width / 2, targetY: height / 2 
    };

    const render = () => {
      const mouse = mouseRef.current;
      const op = opacityRef.current;

      // Interpolate
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;
      op.current += (op.target - op.current) * 0.1;

      if (op.current < 0.001 && op.target === 0) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
        
        ctx.globalCompositeOperation = 'source-over';
        
        // Draw reveal image (cover)
        const img = imagesRef.current.reveal;
        if (img && img.complete && img.naturalWidth > 0) {
          const imgRatio = img.width / img.height;
          const canvasRatio = width / height;
          let renderWidth, renderHeight, dx, dy;

          if (canvasRatio > imgRatio) {
            renderWidth = width;
            renderHeight = width / imgRatio;
            dx = 0;
            dy = (height - renderHeight) / 2;
          } else {
            renderHeight = height;
            renderWidth = height * imgRatio;
            dy = 0;
            dx = (width - renderWidth) / 2;
          }
          ctx.drawImage(img, dx, dy, renderWidth, renderHeight);
        }

        // Apply mask
        ctx.globalCompositeOperation = 'destination-in';
        
        // Radius 230px, 50px feather means ~180px solid, ~230px edge
        const radius = 230;
        const featherStart = 180 / radius;
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, radius);
        
        const alpha = Math.min(Math.max(op.current, 0), 1);
        gradient.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
        gradient.addColorStop(featherStart, `rgba(0, 0, 0, ${alpha})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isImagesLoaded]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current.targetX = e.clientX;
    mouseRef.current.targetY = e.clientY;
  };

  const handleMouseEnter = () => {
    opacityRef.current.target = 1;
  };

  const handleMouseLeave = () => {
    opacityRef.current.target = 0;
  };

  return (
    <>
      {/* Loading Screen */}
      <div className={cn(
        "fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 pointer-events-none",
        isImagesLoaded ? "opacity-0" : "opacity-100"
      )}>
        <div className="text-white font-futura-bold tracking-[0.2em] animate-pulse">
          INITIALIZING...
        </div>
      </div>

      <main 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden bg-black" 
      >
        {/* Base Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/home-base.webp)' }}
        />

        {/* Reveal Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[5] pointer-events-none block"
        />

        {/* Dark Overlay for UI visibility */}
        <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" />

        {/* UI Layer */}
        <div className="z-20 text-center flex flex-col items-center pointer-events-auto">
          <div className="mb-2 relative">
            <h1 className="text-6xl md:text-9xl tracking-tighter text-white">
              <span className="font-futura-bold tracking-[-0.025em]">NEET</span> <span className="font-futura-light">DIVISION</span>
            </h1>
          </div>
          <p className="text-xl tracking-[0.25em] mb-12 text-gray-400 font-futura-bold">WE ARE THE SLUMS</p>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/about" className="w-64 px-10 py-4 border-2 border-white text-white font-bold uppercase hover:bg-neon hover:border-neon hover:text-black transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
              About Us
            </Link>
            <Link href="/recruit" className="w-64 px-10 py-4 border-2 border-white text-white font-bold uppercase hover:bg-neon hover:border-neon hover:text-black transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
              Join Us
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
