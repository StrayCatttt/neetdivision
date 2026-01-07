"use client";
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if video is already ready (for cache)
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <div className={cn(
        "fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 pointer-events-none",
        isVideoLoaded ? "opacity-0" : "opacity-100"
      )}>
        <div className="text-white font-futura-bold tracking-[0.2em] animate-pulse">
          INITIALIZING...
        </div>
      </div>

      <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden bg-black transition-opacity duration-1000" style={{ opacity: isVideoLoaded ? 1 : 0 }}>
        <div className="z-10 text-center flex flex-col items-center">
          <div className="mb-2 relative">
            <h1 className="text-6xl md:text-9xl tracking-tighter text-white">
              <span className="font-futura-bold tracking-[-0.025em]">NEET</span> <span className="font-futura-light">DIVISION</span>
            </h1>
          </div>
          <p className="text-xl tracking-[0.25em] mb-12 text-gray-400 font-futura-bold">WE ARE THE SLUMS</p>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/about" className="w-64 px-10 py-4 bg-white text-black font-bold uppercase hover:bg-neon transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center" style={{ backgroundColor: '#fff', color: '#000' }}>
              About Us
            </Link>
            <Link href="/recruit" className="w-64 px-10 py-4 border-2 border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center" style={{ borderColor: '#fff', color: '#fff' }}>
              Join Us
            </Link>
          </div>
        </div>

        {/* Video Background with Black Fallback */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-black">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onCanPlayThrough={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover"
          >
            <source src="/videos/background.mp4" type="video/mp4" />
            {/* Fallback to black if video fails to load or codec issue */}
          </video>
        </div>
      </main>
    </>
  );
}
